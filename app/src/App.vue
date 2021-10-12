<template>
  <q-layout view="lHh Lpr lFf" v-if="store.state.user !== {}">
    <Header />
    <q-page-container>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
  <Auth v-else />
</template>

<script setup>
import Header from './components/Header.vue';
import Auth from "./components/Auth.vue"
import { useStore } from 'vuex';
import { supabase } from "./supabase"

const store = useStore();

console.log(store.state.user);

store.user = supabase.auth.user()
supabase.auth.onAuthStateChange((_, session) => {
  store.user = session.user
})
</script>
