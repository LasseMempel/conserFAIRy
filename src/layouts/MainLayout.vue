<!-- src/layouts/MainLayout.vue -->
<template>
  <DialogueComponent />
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary">
      <AppHeader
        :logo-src="'icons/02_Blau_Claim_kurz.svg'"
        :logo-width-sm="80"
        :logo-height-sm="60"
        :logo-width-lg="100"
        :logo-height-lg="75"
        :main-title="'conserFAIRy'"
        :subtitle="'A FAIRification App for conservation science'"
        :department="'LEIZA Department of Scientific IT'"
      />
    </q-header>

    <q-page-container class="bg-grey-2">
      <router-view />
    </q-page-container>

    <q-footer bordered class="bg-secondary text-white">
      <AppFooter
        :copyright-year="2025"
        :authors="['Lasse Mempel-Länger', 'Kristina Fischer', 'Nathaly Witt']"
        :imprint-url="'https://www.leiza.de/impressum'"
        :privacy-url="'https://www.leiza.de/datenschutz'"
      />
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import DialogueComponent from 'src/layouts/DialogueComponent.vue';
// Import the new components
import AppHeader from 'src/layouts/AppHeader.vue';
import AppFooter from 'src/layouts/AppFooter.vue';
</script>

<style scoped>
/* MainLayout styles can be minimal or moved to components */
</style>