<!-- MainLayout.vue -->

<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-secondary" >
      <q-toolbar> 
        <q-toolbar-title class="text-h5 text-bold text-center">
          <q-avatar size="50px">
            <img src="/icons/app_logo.png"/>
          </q-avatar>
          conserFAIRy
        </q-toolbar-title>
      </q-toolbar>
      <q-tabs class="text-secondary float-left">
        <q-route-tab to="/conserDUCTION" label="conserTABLE" no-caps/>
        <q-route-tab to="/conserTABLE" label="conserTABLE" no-caps/>
        <q-route-tab to="/conserGRAPH" label="conserGRAPH" no-caps/>
      </q-tabs>
      <q-avatar class="float-right">
        <q-btn color="accent" @click="loggingIn = !loggingIn" :label="loginButtonLabel" text-color="secondary" no-caps flat />
      </q-avatar>

    </q-header>

    <q-page-container>
      <q-dialog v-if="loggingIn">
          <q-form>
            <q-input v-model="email"> </q-input>
            <q-input v-model="password"> </q-input>
          </q-form>
          <q-btn color="accent" @click="loggingIn = !loggingIn">Login</q-btn>
      </q-dialog>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-secondary text-white">
      <q-toolbar class="column">
        <div class="row" >
          Leibniz-Zentrum für Archäologie (LEIZA) 2025
          <q-separator color="white" vertical />
          Lasse Mempel-Länger
        </div>
        <div class="row no-wrap" >
          <q-img src="/icons/02_Weiss_Claim_kurz.svg" style="max-width: 100px;" />
          <a href="https://www.leiza.de/impressum" target="_blank" class="text-white">
            Impressum
          </a>
          <ContactComponent></ContactComponent>
          <a href="https://www.leiza.de/datenschutz" target="_blank" class="text-white">
            Datenschutz
          </a>
          LEIZA Department of Scientific IT
        </div>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script setup lang="ts">

import ContactComponent from 'src/components/contactComponent.vue';
import { ref, computed } from 'vue';

const toLogIn = ref(true);
const loggingIn = ref(false);
const email = ref('');
const password = ref('');
const loginButtonLabel = computed(() => (toLogIn.value ? 'Login' : 'Logout'));

</script>

<style scoped>

</style>

