<!-- src/layouts/MainLayout.vue -->

<template>
  <!--  
  <DialogueComponent />
  -->
  <q-layout view="hHh Lpr fFf">
    <q-header elevated class="bg-primary">
      <AppHeader v-bind="headerConfig" />
    </q-header>

    <q-page-container class="bg-grey-2">
      <router-view />
    </q-page-container>

    <q-footer bordered class="bg-secondary text-white">
      <AppFooter v-bind="footerConfig" />
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
//import DialogueComponent from 'src/layouts/DialogueComponent.vue';
import AppHeader from 'src/layouts/AppHeader.vue';
import AppFooter from 'src/layouts/AppFooter.vue';
import type { HeaderConfig, FooterConfig } from 'src/types/layoutTypes';

const headerConfig: HeaderConfig = {
  logoSrc: 'icons/02_Blau_Claim_kurz.svg',
  logoWidthSm: 80,
  logoHeightSm: 60,
  logoWidthLg: 100,
  logoHeightLg: 75,
  mainTitle: 'conserFAIRy',
  subtitle: 'Eine FAIRifizierungs Anwendung für Forschungsdaten im Bereich der Konservierungs und Restaurierung',
  department: 'Arbeitsbereich Wissenschaftliche IT am LEIZA',
};

const footerConfig: FooterConfig = {
  copyrightYear: 2025,
  authors: ['Lasse Mempel-Länger', 'Kristina Fischer', 'Nathaly Witt'],
  imprintUrl: 'https://www.leiza.de/impressum', 
  privacyUrl: 'https://www.leiza.de/datenschutz', 
};
</script>

<style scoped>

</style>