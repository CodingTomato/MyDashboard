<template>
  <form class="row flex flex-center" @submit.prevent="">
    <div class="col-6 form-widget">
      <h1 class="header">Supabase + Vue 3</h1>
      <div>
        <input class="inputField" type="email" placeholder="Your email" v-model="email" />
        <input class="inputField" type="password" placeholder="Password" v-model="password" />
      </div>
      <div>
        <input
          type="submit"
          class="button block"
          :value="loading ? 'Loading' : 'Login'"
          :disabled="loading"
          @click="handleLogin"
        />
        <input
          type="submit"
          class="button block"
          :value="loading ? 'Loading' : 'Register'"
          :disabled="loading"
          @click="handleSignUp"
        />
      </div>
    </div>
  </form>
</template>

<script>
import { ref } from "vue"
import { supabase } from "../supabase"

export default {
  setup() {
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

    const handleSignUp = async () => {
      try {
        loading.value = true;
        const { error } = await supabase.auth.signUp({ email: email.value, password: password.value });
        if (error) throw error;
      } catch (error) {
        alert(error.error_description || error.message);
      } finally {
        loading.value = false;
      }
    }

    return {
      loading,
      email,
      password,
      handleLogin,
      handleSignUp,
    }
  },
}
</script>