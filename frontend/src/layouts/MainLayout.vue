<!-- MainLayout.vue -->

<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-secondary" >
      <q-toolbar> 
        <q-toolbar-title class="text-h5 text-bold text-center q-pt-sm">
          conserFAIRy
          <q-avatar size="50px">
            <img src="/icons/app_logo.png"/>
          </q-avatar>
        </q-toolbar-title>
      </q-toolbar>
      <q-tabs class="text-secondary float-left">
        <q-route-tab to="/" label="conserDUCTION" no-caps/>
        <q-route-tab to="/conserTABLE" label="conserTABLE" no-caps/>
        <q-route-tab to="/conserGRAPH" label="conserGRAPH" no-caps/>
      </q-tabs>
      <q-avatar class="float-right">
        <q-btn color="accent" @click="loginDialog = true" label="login" text-color="secondary" no-caps flat />
      </q-avatar>

    </q-header>

    <q-page-container>
      <router-view />
      <q-dialog v-show="loginDialog">
          <q-form>
            <q-input v-model="email"> </q-input>
            <q-input v-model="password"> </q-input>
          </q-form>
      </q-dialog>
    </q-page-container>

    <q-footer elevated class="bg-secondary text-white">
      <q-toolbar class="column">
        <div class="q-pt-sm row fit justify-evenly">
          <div> 
            Leibniz-Zentrum für Archäologie (LEIZA) 2025 
          </div>
          <q-separator color="white" vertical/>
          <div>
          Lasse Mempel-Länger
          </div>
        </div>
      
        <div class="row justify-around items-center full-width" >
          <q-avatar size="70px">
            <img src="/icons/02_Weiss_Claim_kurz.svg"/>
          </q-avatar>
          <div class="row">
            <a href="https://www.leiza.de/impressum" target="_blank" class="text-white q-pa-sm">
              Impressum
            </a>
            <ContactComponent></ContactComponent> <!-- -->
            <a href="https://www.leiza.de/datenschutz" target="_blank" class="text-white q-pa-sm">
              Datenschutz
            </a>
          </div>
          <div>
            LEIZA Department of Scientific IT
          </div>
        </div>
      </q-toolbar>
      
    </q-footer>

  </q-layout>
</template>

<script setup lang="ts">

import ContactComponent from 'src/components/contactComponent.vue';
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const loginDialog = ref(false);


</script>

<style scoped>

</style>

