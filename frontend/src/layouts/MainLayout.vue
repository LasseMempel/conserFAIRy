<!-- MainLayout.vue -->

<template>
  <q-layout view="hHh lpR fFf">

    <Header></Header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <Footer></Footer>

  </q-layout>
</template>

<script setup lang="ts">

import Header from 'src/layouts/HeaderLayout.vue';
import Footer from 'src/layouts/FooterLayout.vue';

</script>

<style scoped>

</style>

