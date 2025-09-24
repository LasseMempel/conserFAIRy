<!-- src/layouts/AppFooter.vue -->
<template>
  <q-toolbar class="column q-py-md">
    <div class="full-width">
      <div class="text-center q-mb-sm">
        <div class="text-caption">
          Leibniz-Zentrum für Archäologie (LEIZA) {{ copyrightYear }}
        </div>
        <div class="text-caption">
          {{ authors.join(' & ') }}
        </div>
      </div>

      <div class="row justify-center items-center q-gutter-x-md wrap">
        <a :href="imprintUrl" target="_blank" class="text-white text-decoration-none text-caption">
          Impressum
        </a>

        <ContactComponent />

        <a :href="privacyUrl" target="_blank" class="text-white text-decoration-none text-caption">
          Datenschutz
        </a>
      </div>

    </div>
  </q-toolbar>
</template>

<script setup lang="ts">
import ContactComponent from 'src/layouts/ContactComponent.vue';
import type { FooterConfig } from 'src/types/layoutTypes';

defineProps<FooterConfig>();
</script>

<style scoped>
.text-caption {
    font-size: 12px; 
}
.wrap {
    flex-wrap: wrap; 
    gap: 8px; 
}
</style>