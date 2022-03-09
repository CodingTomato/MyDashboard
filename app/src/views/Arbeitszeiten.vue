<template>
  <div class="zeiten">
    <div class="row">
      <div class="col-12 col-md-4">
        <q-card flat class="my-card margin-right">
          <q-card-section>
            <div class="text-h6">Zeiten schreiben</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="row">
              <div class="col-10">
                <q-select
                  filled
                  v-model="model"
                  :options="packageOptions"
                  label="Kategorie wählen"
                />
              </div>
              <div class="col-2 self-center">
                <!-- <q-toggle
                  v-model="workingToggle"
                  :label="time"
                  @change="toggleWorkingMode"
                  :disable="model === null"
                />-->
                <q-btn
                  round
                  color="primary"
                  icon="add"
                  style="margin-left: 1em"
                  :disable="model === null"
                  @click="addWorkpackage"
                />
              </div>
            </div>
          </q-card-section>

          <q-separator inset />

          <q-card-section>
            <q-list padding>
              <q-item tag="label" v-for="pack in unfinishedWorkingPackages" :key="pack.id">
                <q-item-section>
                  <q-item-label
                    >{{ categoriesMap.get(pack.category) }} &bull;
                    {{
                      ((new Date(Date.now()) - new Date(pack.time_start)) / 1000 / 60 / 60).toFixed(
                        1,
                      )
                    }}
                    Std.</q-item-label
                  >
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    round
                    color="primary"
                    icon="event_available"
                    @click="finishWorkpackage(pack.id)"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>

        <q-card flat style="margin-top: .5em; margin-right: .5em">
          <q-card-section>
            <div class="text-h6">Analyse: Neuro-Net</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label>Monat</q-item-label>
                  <q-item-label caption lines="2"
                    >{{ (workDurationMonth / 1000 / 60 / 60).toFixed(1) }} Stunden / ca. 40
                    Stunden</q-item-label
                  >
                </q-item-section>
              </q-item>

              <q-separator inset />

              <q-item>
                <q-item-section>
                  <q-item-label>Woche</q-item-label>
                  <q-item-label caption
                    >{{ (workDurationWeek / 1000 / 60 / 60).toFixed(1) }} Stunden / ca. 10
                    Stunden</q-item-label
                  >
                </q-item-section>
              </q-item>

              <q-separator inset />

              <q-item>
                <q-item-section>
                  <q-item-label>Geld</q-item-label>
                  <q-item-label caption
                    >{{
                      ((workDurationMonth / 1000 / 60 / 60) * 11.125).toFixed(2)
                    }}
                    €</q-item-label
                  >
                </q-item-section>
              </q-item>
            </q-list>
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
import { ref, onMounted } from 'vue';
import { store } from '../store';
import { supabase } from '../supabase';

const rows = ref([]);
const categoriesMap = ref(new Map());
const categoriesIdMap = ref(new Map());

const model = ref(null);
const packageOptions = ref([]);

const unfinishedWorkingPackages = ref([]);

const workDurationMonth = ref(0);
const workDurationWeek = ref(0);

async function getFinishedWorkpackages() {
  try {
    store.user = supabase.auth.user();

    const { data, error, status } = await supabase
      .from('workpackage')
      .select('user_id, time_start, time_end, category');
    // .neq('time_end', 'NULL')

    if (error && status !== 406) throw error;

    if (data) {
      workDurationWeek.value = 0;
      workDurationMonth.value = 0;

      const now = new Date(Date.now());
      const currentMonth = now.getMonth();

      const currentdate = new Date();
      const oneJan = new Date(currentdate.getFullYear(), 0, 1);
      const numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
      const currentWeek = Math.ceil((currentdate.getDay() + 1 + numberOfDays) / 7);

      rows.value = data
        .map((pack) => {
          const packDate = new Date(pack.time_start);
          const oneJan = new Date(packDate.getFullYear(), 0, 1);
          const numberOfDays = Math.floor((packDate - oneJan) / (24 * 60 * 60 * 1000));
          const packWeek = Math.ceil((packDate.getDay() + 1 + numberOfDays) / 7);

          const packDuration = pack.time_end
            ? new Date(pack.time_end) - new Date(pack.time_start)
            : new Date(Date.now()) - new Date(pack.time_start);

          if (packDate.getMonth() === currentMonth && pack.category == 1) workDurationMonth.value += packDuration;
          if (packWeek === currentWeek && pack.category == 1) workDurationWeek.value += packDuration;

          return {
            name: categoriesMap.value.get(pack.category),
            date: new Date(pack.time_start),
            time_start: new Date(pack.time_start),
            time_end: pack.time_end ? new Date(pack.time_end) : new Date(Date.now()),
            duration: pack.time_end
              ? new Date(pack.time_end) - new Date(pack.time_start)
              : new Date(Date.now()) - new Date(pack.time_start),
          };
        })
        .sort((a, b) => {
          const startDateA = new Date(a.time_start);
          const startDateB = new Date(b.time_start);

          if (startDateA === startDateB) return 0;
          if (startDateB < startDateA) return -1;
          if (startDateB > startDateA) return 1;
        });
    }
  } catch (error) {
    alert(error.message);
  }
}

async function getUnfinishedWorkpackage() {
  try {
    store.user = supabase.auth.user();

    const { data, error, status } = await supabase
      .from('workpackage')
      .select('id, user_id, time_start, time_end, category')
      .is('time_end', null);

    if (error && status !== 406) throw error;

    if (data) {
      unfinishedWorkingPackages.value = data.map((pack) => pack);
    }
  } catch (error) {
    alert(error.message);
  }
}

async function getWorkpackagesCategories() {
  try {
    store.user = supabase.auth.user();

    const { data, error, status } = await supabase
      .from('workpackage_categories')
      .select('id, name');

    if (error && status !== 406) throw error;

    if (data) {
      data.forEach((category) => {
        categoriesMap.value.set(category.id, category.name);
        categoriesIdMap.value.set(category.name, category.id);
      });
    }
  } catch (error) {
    alert(error.message);
  }
}

async function addWorkpackage() {
  try {
    store.user = supabase.auth.user();

    const updates = {
      user_id: store.user.id,
      time_start: new Date(Date.now()).toISOString(),
      category: categoriesIdMap.value.get(model.value),
    };

    const { error } = await supabase.from('workpackage').upsert(updates, {
      returning: 'minimal', // Don't return the value after inserting
    });

    getUnfinishedWorkpackage();
    getFinishedWorkpackages();

    if (error) throw error;
  } catch (error) {
    workingToggle.value = false;
    alert(error.message);
  }
}

async function finishWorkpackage(id) {
  try {
    store.user = supabase.auth.user();

    const updates = {
      time_end: new Date(Date.now()).toISOString(),
    };

    const { error } = await supabase
      .from('workpackage')
      .update(updates, {
        returning: 'minimal', // Don't return the value after inserting
      })
      .eq('id', id);

    getFinishedWorkpackages();
    getUnfinishedWorkpackage();

    if (error) throw error;
  } catch (error) {
    workingToggle.value = false;
    alert(error.message);
  }
}

const columns = [
  {
    name: 'category',
    label: 'Kategorie',
    align: 'left',
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: false,
  },
  {
    name: 'date',
    align: 'center',
    label: 'Datum',
    field: 'date',
    format: (val) => `${val.toLocaleDateString('de')}`,
    sortable: false,
  },
  {
    name: 'time_start',
    label: 'Startzeit',
    field: 'time_start',
    format: (val) => `${val.toLocaleTimeString('de')}`,
    sortable: false,
  },
  {
    name: 'time_end',
    label: 'Endzeit',
    field: 'time_end',
    format: (val) => `${val.toLocaleTimeString('de')}`,
    sortable: false,
  },
  {
    name: 'duration',
    label: 'Dauer',
    field: 'duration',
    format: (val) => `${(val / 1000 / 60 / 60).toFixed(1)} Std.`,
    sortable: false,
  },
];

onMounted(async () => {
  await getWorkpackagesCategories();
  getFinishedWorkpackages();
  getUnfinishedWorkpackage();
  packageOptions.value = Array.from(categoriesMap.value.values());
});

setInterval(() => {
  getFinishedWorkpackages();
  getUnfinishedWorkpackage();
}, 5000);
</script>

<style>
.margin-right {
  margin-right: 0.5em;
}
</style>
