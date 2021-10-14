<template>
  <div class="zeiten">
    <div class="row">
      <div class="col-12 col-md-4">
        <q-card flat bordered class="my-card margin-right">
          <q-card-section>
            <div class="text-h6">Zeiten schreiben</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="row">
              <div class="col-9">
                <q-select filled v-model="model" :options="options" label="Kategorie wählen" />
              </div>
              <div class="col-3 self-center">
                <q-toggle v-model="countTimeStart" :label="time" />
              </div>
            </div>
          </q-card-section>

          <q-separator inset />

          <q-card-section>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua.
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-8">
        <q-table
          title="Arbeitszeiten"
          :rows="rows"
          :columns="columns"
          row-key="name"
          dark
          color="amber"
          no-data-label="Keine Zeiten gefunden"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const countTimeStart = ref(false);
const time = ref((new Date(Date.now())).toLocaleTimeString('de'));

const model = ref(null);
const options = [
  'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
];

const columns = [
  {
    name: 'category',
    label: 'Kategorie',
    align: 'left',
    field: row => row.name,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'date', align: 'center', label: 'Datum', field: 'date', format: val => `${val.toLocaleDateString('de')}`, sortable: true },
  { name: 'time_start', label: 'Startzeit', field: 'time_start', format: val => `${val.toLocaleTimeString('de')}`, sortable: false },
  { name: 'time_end', label: 'Endzeit', field: 'time_end', format: val => `${val.toLocaleTimeString('de')}`, sortable: false },
  { name: 'duration', label: 'Dauer', field: 'duration', sortable: false },
]

const rows = [
  {
    name: 'Neuro-Net',
    date: new Date(Date.now()),
    time_start: new Date(Date.now() - 10000),
    time_end: new Date(Date.now()),
    duration: '123 H'
  },
  {
    name: 'Neuro-Net',
    date: new Date(Date.now()),
    time_start: new Date(Date.now() - 10000),
    time_end: new Date(Date.now()),
    duration: '123 H'
  }, {
    name: 'Neuro-Net',
    date: new Date(Date.now()),
    time_start: new Date(Date.now() - 10000),
    time_end: new Date(Date.now()),
    duration: '123 H'
  },
]

setInterval(() => { time.value = (new Date(Date.now())).toLocaleTimeString('de') }, 1000)
</script>

<style>
.margin-right {
  margin-right: 0.5em;
}
</style>