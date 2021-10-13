<template>
  <q-layout view="lHh Lpr lFf" v-if="store.state.user">
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
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

store.state.user = supabase.auth.user();
supabase.auth.onAuthStateChange((_, session) => {
  store.dispatch('setUser', { user: session.user });
  setTimeout(() => { router.push({name: "Arbeitszeiten"}) }, 2500);
});
</script>
