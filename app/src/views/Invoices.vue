<template>
  <div class="invoices">
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab icon="keyboard_arrow_up" direction="up" color="accent">
        <q-fab-action color="primary" icon="add" />
        <q-fab-action color="secondary" icon="mail" />
      </q-fab>
    </q-page-sticky>
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="name"
      selection="multiple"
      v-model:selected="selected"
    >
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <div class="q-pa-md q-gutter-sm">
            <q-btn round color="secondary" icon="mdi-pencil" @click="editInvoice(props.row.id)" />
            <q-btn
              round
              color="deep-orange"
              icon="mdi-delete"
              @click="deleteInvoice(props.row.id)"
            />
          </div>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="watchInvoiceModal">
      <div class="row" style="width: 80vw; height: 80vh; max-width: 80vw;">
        <q-card class="col">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">Auftrag #{{ activeInvoiceId }}</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section class="q-pa-sm">
            <q-table
              flat
              bordered
              :rows="activeInvoiceProducts"
              :columns="invoiceProductsColumns"
              row-key="name"
              selection="multiple"
              v-model:selected="selectedProducts"
              hide-bottom
            >
              <template v-slot:bottom-row>
                <q-tr>
                  <q-td colspan="100%" align="right">
                    <q-btn flat round color="green" icon="edit" />
                    <q-btn
                      flat
                      round
                      color="deep-orange"
                      icon="delete"
                      @click="removePositionFromInvoice"
                    />
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-card-section>

          <q-card-section class="q-pa-sm">
            <span class="text-h6">Gesamt: {{ activeTotalCost }}€</span>
          </q-card-section>

          <q-card-section class="q-pa-sm row q-gutter-sm">
            <q-input outlined v-model="newPosName" label="Name" class="col" />
            <q-input
              outlined
              v-model="newPosAmount"
              label="Menge"
              class="col"
              type="number"
              min="0"
            />
            <q-input outlined v-model="newPosUnit" label="Einheit" class="col" />
            <q-input
              outlined
              v-model="newPosCostPerUnit"
              label="Kosten pro Einheit"
              class="col"
              type="number"
              min="0"
            />
            <q-btn label="Hinzufügen" icon="add" color="primary" @click="insertNewPos" />
          </q-card-section>

          <q-card-actions align="left">
            <q-btn icon="mdi-file-download-outline" flat label="Angebot" />
            <q-btn icon="mdi-file-download-outline" flat label="Rechnung" @click="saveInvoice" />
          </q-card-actions>
        </q-card>

        <q-card class="col">
          <iframe :src="invoiceBlob" type="application/pdf" width="100%" height="100%"></iframe>
        </q-card>
      </div>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { store } from '../store';

const selected = ref([]);
const rows = ref([]);

const invoiceBlob = ref(null);
const invoice = ref(null);
const activeInvoiceId = ref(null);
const selectedProducts = ref([]);
const activeInvoiceProducts = ref([]);
const activeTotalCost = ref(0);
const watchInvoiceModal = ref(false);

const newPosName = ref('');
const newPosAmount = ref(0);
const newPosUnit = ref('');
const newPosCostPerUnit = ref(0);

const invoiceProductsColumns = [
  {
    name: 'name',
    required: true,
    label: 'Name',
    align: 'left',
    field: (row) => row.name,
    format: (val) => `${val}`,
  },
  {
    name: 'amount',
    required: true,
    label: 'Menge',
    field: (row) => row,
    format: (val) => `${val.amount} ${val.unit}`,
  },
  {
    name: 'costPerUnit',
    required: true,
    label: 'Kosten pro Einheit',
    field: (row) => row,
    format: (val) => `${val.costPerUnit.toFixed(2)} €`,
  },
  {
    name: 'cost',
    required: true,
    label: 'Geamtkosten',
    field: (row) => row,
    format: (val) => `${(val.amount * val.costPerUnit).toFixed(2)} €`,
  },
];

const generateInvoicePDF = () => {
  const doc = new jsPDF();

  doc.setFont('Helvetica');

  doc.setFontSize(8);
  doc.text('Taubert IT-Services | Otto-Hahn-Straße 30d | 93053 Regensburg', 14, 20);

  doc.setFontSize(11);
  doc.text('Vorname Nachname', 14, 35);
  doc.text('Musterstraße 20', 14, 41);
  doc.text('12345 Musterstadt', 14, 47);

  doc.text('Taubert IT-Services', 140, 20);
  doc.text('Otto-Hahn-Straße 30d', 140, 26);
  doc.text('93053 Regensburg', 140, 32);
  doc.text('+49 (0) 176 57609533', 140, 40);
  doc.text('it@marcotaubert.de', 140, 46);
  doc.text('https://marcotaubert.de', 140, 52);

  doc.setFontSize(18);
  doc.setFont('Helvetica', 'bold');
  doc.text('Rechnung', 14, 90);

  doc.setFontSize(11);
  doc.setFont('Helvetica', '');
  doc.text('Rechnungs-Nr.:', 14, 100);
  doc.text(`M${activeInvoiceId.value}`, 44, 100);
  doc.text('Auftrags-Nr.:', 14, 106);
  doc.text(`O${activeInvoiceId.value}`, 44, 106);
  doc.text('Kunden-Nr.:', 14, 112);
  doc.text(`${activeInvoiceId.value}`, 44, 112);

  doc.text('Rechnungsdatum:', 130, 100);
  doc.text(`${new Date(Date.now()).toLocaleDateString()}`, 170, 100);

  let count = 0;
  const tableBody = activeInvoiceProducts.value.map((p) => {
    count += 1;
    return [
      count,
      p.id,
      p.name,
      p.amount,
      p.unit,
      p.costPerUnit.toFixed(2),
      (p.costPerUnit * p.amount).toFixed(2),
    ];
  });
  doc.autoTable({
    head: [['Pos.', 'Art-Nr.', 'Bezeichnung', 'Menge', 'Einheit', 'Preis/Einh. (€)', 'Gesamt (€)']],
    body: tableBody,
    startY: 120,
  });

  const pageHeightAfterTable = doc.lastAutoTable.finalY;
  doc.text('Summe Netto:', 130, pageHeightAfterTable + 10);
  doc.text(`€ ${activeTotalCost.value.toFixed(2)}`, 170, pageHeightAfterTable + 10);
  doc.line(105, pageHeightAfterTable + 13, 195, pageHeightAfterTable + 13);
  doc.text(`0,00% USt. auf ${activeTotalCost.value.toFixed(2)}€:`, 112, pageHeightAfterTable + 20);
  doc.text(`€ ${activeTotalCost.value.toFixed(2)}`, 170, pageHeightAfterTable + 20);
  doc.line(105, pageHeightAfterTable + 23, 195, pageHeightAfterTable + 23);
  doc.line(105, pageHeightAfterTable + 24, 195, pageHeightAfterTable + 24);
  doc.setFont('Helvetica', 'bold');
  doc.text('Endsumme:', 130, pageHeightAfterTable + 30);
  doc.setFont('Helvetica', '');
  doc.text(`€ ${activeTotalCost.value.toFixed(2)}`, 170, pageHeightAfterTable + 30);
  doc.line(105, pageHeightAfterTable + 34, 195, pageHeightAfterTable + 34);

  doc.setFontSize(6);
  doc.text(
    'Taubert IT-Services • Raifeisenbank Regensburg-Wenzenbach • Konto 010 0268 739 • BLZ 7506 0150 • IBAN DE45 7506 0150 0100 2687 39 • BIC GENODEF1R02',
    27,
    doc.internal.pageSize.height - 10,
  );

  invoiceBlob.value = doc.output('bloburi');
  invoice.value = doc;
};
const removePositionFromInvoice = () => {
  selectedProducts.value.forEach((e) => {
    activeInvoiceProducts.value = activeInvoiceProducts.value.filter((p) => p !== e);
  });
  selectedProducts.value = [];

  calcTotalCostActiveInvoice();
  generateInvoicePDF();
};
const insertNewPos = () => {
  activeInvoiceProducts.value.push({
    id: (Math.random() * 9999).toFixed(0),
    name: newPosName.value,
    description: '',
    unit: newPosUnit.value,
    amount: parseFloat(newPosAmount.value),
    costPerUnit: parseFloat(newPosCostPerUnit.value),
  });

  calcTotalCostActiveInvoice();
  generateInvoicePDF();
};

const saveInvoice = () => {
  invoice.value.save(`rechnung-${activeInvoiceId.value}-${Date.now()}.pdf`);
};
const calcTotalCostActiveInvoice = () => {
  activeTotalCost.value = 0;
  activeInvoiceProducts.value.forEach((e) => {
    activeTotalCost.value += e.amount * e.costPerUnit;
  });
};
const editInvoice = (id) => {
  console.log('edit');

  activeInvoiceId.value = id;
  activeInvoiceProducts.value = store.invoices[id - 1].products || [];

  calcTotalCostActiveInvoice();
  generateInvoicePDF();

  watchInvoiceModal.value = true;
};
const deleteInvoice = (id) => {
  console.log('delete', id);
};
const generateOfferPDF = (id) => {};

const parseInvoices = async () => {
  if (store.invoices.length == 0) return;

  rows.value = store.invoices.map((inv) => ({
    id: inv.id,
    created_at: inv.created_at,
    sent_to_client: inv.sent_to_client,
    total_cost: inv.total_cost,
    offer_created: inv.offer_created,
    invoice_created: inv.invoice_created,
    action: '',
  }));
};

const columns = [
  {
    name: 'id',
    required: true,
    label: 'Nummer',
    align: 'left',
    field: (row) => row.id,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'created_at',
    align: 'center',
    label: 'Erstellt',
    field: (row) => row.created_at,
    format: (val) => `${new Date(val).toLocaleString()}`,
    sortable: true,
  },
  {
    name: 'total_cost',
    label: 'Rechnungshöhe',
    field: (row) => row.total_cost,
    format: (val) => `${val} €`,
    sortable: true,
  },
  {
    name: 'sent_to_client',
    label: 'Zum Kunden gesendet',
    field: (row) => row.sent_to_client,
    format: (val) => `${val ? new Date(val).toLocaleString() : '❌'}`,
    sortable: true,
  },
  {
    name: 'offer_created',
    label: 'Angebot erstellt',
    field: (row) => row.offer_created,
    format: (val) => `${!val ? '❌' : '✅'}`,
    sortable: true,
  },
  {
    name: 'invoice_created',
    label: 'Rechnung erstellt',
    field: (row) => row.invoice_created,
    format: (val) => `${!val ? '❌' : new Date(val).toLocaleString()}`,
    sortable: true,
  },
  {
    name: 'action',
  },
];

watch(
  () => store.invoices,
  () => {
    parseInvoices();
  },
);

onMounted(() => {
  store.requestInvoices();
});
</script>
