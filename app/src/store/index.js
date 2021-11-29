import { reactive } from 'vue';
import { supabase } from '../supabase';

export const store = reactive({
  user: {},
  invoices: [],
  requestInvoices: async () => {
    try {
      store.user = supabase.auth.user();
      const { data, error, status } = await supabase.from('invoices').select('*');
      if (error && status !== 406) throw error;
      if (data) store.invoices = data;
    } catch (error) {
      alert(error.message);
    }
  },
});

export const crypto = reactive({
  btc: { holding: 0.06744, coinGeckId: 'bitcoin', valueInEuro: 0 },
  eth: { holding: 0.19081, coinGeckId: 'ethereum', valueInEuro: 0 },
  ada: { holding: 64.113319, coinGeckId: 'cardano', valueInEuro: 0 },
  getCoinValues: async () => {
    const values = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum%2Ccardano&vs_currencies=eur',
    );
    if (values.ok) {
      const euros = await values.json();
      crypto.btc.valueInEuro = Number((euros.bitcoin.eur * crypto.btc.holding).toFixed(2));
      crypto.ada.valueInEuro = Number((euros.cardano.eur * crypto.ada.holding).toFixed(2));
      crypto.eth.valueInEuro = Number((euros.ethereum.eur * crypto.eth.holding).toFixed(2));
    }
  },
});
