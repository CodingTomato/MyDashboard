<template>
  <div class="home">
    {{ store.state.user }}
  </div>
</template>

<script setup>
import { useStore } from 'vuex';

const store = useStore();
</script>
