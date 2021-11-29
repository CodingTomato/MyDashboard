<template>
  <div class="home">
    <div class="row items-center q-pa-xs q-gutter-xs">
      <q-card class="col-12 col-md">
        <q-card-section class="q-pt-xs">
          <div class="text-overline">Gesamt</div>
          <div class="text-h5 q-mt-sm q-mb-xs">
            {{
              (crypto.btc.valueInEuro + crypto.eth.valueInEuro + crypto.ada.valueInEuro).toFixed(2)
            }}€
          </div>
        </q-card-section>
      </q-card>
      <q-card class="col-12 col-md">
        <q-card-section class="q-pt-xs">
          <div class="text-overline">Bitcoin ({{ crypto.btc.holding }})</div>
          <div class="text-h5 q-mt-sm q-mb-xs">{{ crypto.btc.valueInEuro }}€</div>
        </q-card-section>
      </q-card>
      <q-card class="col-12 col-md">
        <q-card-section class="q-pt-xs">
          <div class="text-overline">Ethereum ({{ crypto.eth.holding }})</div>
          <div class="text-h5 q-mt-sm q-mb-xs">{{ crypto.eth.valueInEuro }}€</div>
        </q-card-section>
      </q-card>
      <q-card class="col-12 col-md">
        <q-card-section class="q-pt-xs">
          <div class="text-overline">Cardano ({{ crypto.ada.holding }})</div>
          <div class="text-h5 q-mt-sm q-mb-xs">{{ crypto.ada.valueInEuro }}€</div>
        </q-card-section>
      </q-card>
    </div>
    <br />
    {{ store.user }}
  </div>
</template>

<script setup>
import { store, crypto } from '../store';

crypto.getCoinValues();
</script>
