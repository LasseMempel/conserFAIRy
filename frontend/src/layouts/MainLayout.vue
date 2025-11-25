<!-- MainLayout.vue -->

<template>
  <q-layout view="hHh lpR fFf">
  <q-header elevated class="bg-primary">
  <q-toolbar class="q-gutter-md">

  <!-- Mobile Header Content -->
  <div class="mobile-header lt-sm full-width">
    <div class="row items-center justify-between q-mb-sm">
      <img src="icons/02_Blau_Claim_kurz.svg" width="80" height="60" class="q-ml-md"/>
      <div class="text-right">
        <div class="text-caption text-secondary">LEIZA Department of</div>
        <div class="text-caption text-secondary">Scientific IT</div>
      </div>
    </div>
    <div class="text-center">
      <div class="text-h6 text-bold text-secondary">conserFAIRy</div>
    </div>
  </div>

  <!-- Desktop Header Content -->
  <div class="desktop-header gt-xs row items-center no-wrap full-width" style="justify-content: space-between;">
    <div class="row items-center no-wrap">
      <img src="icons/02_Blau_Claim_kurz.svg" width="100" height="75" class="q-ml-md"/>
    </div>
    <q-toolbar-title class="text-center">
      <div class="column items-center">
        <div class="text-h5 text-bold header-title text-secondary">conserFAIRy</div>
      </div>
    </q-toolbar-title>
    <div class="row items-center no-wrap">
      <span class="text-subtitle2 text-secondary">LEIZA Department of Scientific IT</span>
    </div>
  </div>
</q-toolbar>
</q-header>
<q-page-container class="bg-grey-2">
<router-view />
</q-page-container>
<q-footer bordered class="bg-secondary text-white">
<q-toolbar class="column q-py-md">

  <!-- Mobile Footer Content -->
<div class="mobile-footer lt-sm">
    <div class="text-center q-mb-sm">
      <div class="text-caption">Leibniz-Zentrum für Archäologie (LEIZA) 2025</div>
      <div class="text-caption">Lasse Mempel-Länger</div>
    </div>

    <div class="row justify-center items-stretch q-gutter-x-md">
      <div class="column justify-between">
        <a href="https://www.leiza.de/impressum" target="_blank" class="text-white text-decoration-none">
          <span class="text-caption">Impressum</span>
        </a>
        <a href="https://www.leiza.de/datenschutz" target="_blank" class="text-white text-decoration-none">
          <span class="text-caption">Datenschutz</span>
        </a>
      </div>
      <ContactComponent></ContactComponent>
    </div>
  </div>

  <!-- Desktop Footer Content (your original) -->
  <div class="desktop-footer gt-xs">
    <div class="row justify-center">
      <q-breadcrumbs separator="|" separator-color="white" active-color="">
        <q-breadcrumbs-el label="Leibniz-Zentrum für Archäologie (LEIZA) 2025" />
        <q-breadcrumbs-el label="Lasse Mempel-Länger" />
      </q-breadcrumbs>
    </div>
    <div class="row justify-center">
      <q-breadcrumbs separator="" separator-color="secondary" active-color="">
        <a href="https://www.leiza.de/impressum" target="_blank" style="">
          <q-breadcrumbs-el label="Impressum" class="text-white"/>
        </a>
        <ContactComponent></ContactComponent>
        <a href="https://www.leiza.de/datenschutz" target="_blank" style="">
          <q-breadcrumbs-el label="Datenschutz" class="text-white"/>
        </a>
      </q-breadcrumbs>
    </div>
  </div>
</q-toolbar>
</q-footer>
</q-layout>
</template>

<script setup lang="ts">
import ContactComponent from 'src/components/contactComponent.vue';
</script>

<style scoped>
.header-title {
font-size: 2rem;
letter-spacing: 0.05em;
}
.header-subtitle {
font-size: 1.1rem;
opacity: 0.8;
}
.mobile-header {
  padding: 8px 0;
}

.mobile-footer {
  text-align: center;
}

@media (max-width: 599px) {
  .q-toolbar {
    min-height: auto;
    padding: 8px 16px;
  }
}
</style>