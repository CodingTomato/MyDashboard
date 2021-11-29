<template>
  <q-header elevated class="q-pa-md">
    <q-toolbar class="bg-primary text-white">
      <q-btn
        flat
        round
        dense
        icon="menu"
        class="q-mr-sm"
        @click="leftDrawerOpen = !leftDrawerOpen"
      />

      <q-toolbar-title>
        <q-breadcrumbs active-color="white">
          <q-breadcrumbs-el :label="route.name" />
        </q-breadcrumbs>
      </q-toolbar-title>

      <q-btn flat round dense icon="logout" @click="logOut" />
    </q-toolbar>
  </q-header>

  <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
    <q-list>
      <q-item-label header>Navigation</q-item-label>
      <q-item clickable tag="router-link" to="/">
        <q-item-section avatar>
          <q-icon name="mdi-view-dashboard-variant" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Überblick</q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable tag="router-link" to="/arbeitszeiten">
        <q-item-section avatar>
          <q-icon name="mdi-clock-outline" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Arbeitszeiten</q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable tag="router-link" to="/rechnungen">
        <q-item-section avatar>
          <q-icon name="mdi-receipt" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Aufträge</q-item-label>
        </q-item-section>
      </q-item>
      <q-item disabled>
        <q-item-section avatar>
          <q-icon name="mdi-discord" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Discord Bot</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '../supabase';
import { store } from '../store';

const leftDrawerOpen = ref(false);
const route = useRoute();

const logOut = async () => {
  try {
    store.user = null;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    store.user = null;
    console.log(error);
  }
};
</script>
