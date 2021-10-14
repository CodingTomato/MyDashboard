<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <div class="q-pa-md">
        <div class="row" style="height: 100vh">
          <div class="col"></div>
          <div class="col-8 col-lg-4 self-center">
            <q-card class="my-card bg-secondary text-white">
              <q-card-section>
                <div class="text-h6">MyDashboard</div>
                <div class="text-subtitle2">{{ loading ? 'Einloggen...' : 'Bitte einloggen' }}</div>
              </q-card-section>

              <q-card-section>
                <q-input filled v-model="email" label="E-Mail" style="margin-bottom: .5em"/>
                <q-input filled v-model="password" type="password" label="Password" />
              </q-card-section>

              <q-separator dark />

              <q-card-actions>
                <q-btn
                  flat
                  :value="loading ? 'Lade...' : 'Einloggen'"
                  :disabled="loading"
                  @click="handleLogin"
                >Einloggen</q-btn>
              </q-card-actions>
            </q-card>
          </div>
          <div class="col"></div>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue"
import { supabase } from "../supabase"

const loading = ref(false)
const email = ref("")
const password = ref("")

const handleLogin = async () => {
  try {
    loading.value = true;
    const { error } = await supabase.auth.signIn({ email: email.value, password: password.value });
    if (error) throw error;
  } catch (error) {
    alert(error.error_description || error.message);
  } finally {
    loading.value = false;
  }
}

// const handleSignUp = async () => {
//   try {
//     loading.value = true;
//     const { error } = await supabase.auth.signUp({ email: email.value, password: password.value });
//     if (error) throw error;
//   } catch (error) {
//     alert(error.error_description || error.message);
//   } finally {
//     loading.value = false;
//   }
// }
</script>