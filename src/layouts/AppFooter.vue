<!-- src/components/AppFooter.vue -->
<template>
  <q-toolbar class="column q-py-md">
    <!-- Unified Footer Content -->
    <div class="full-width">

      <!-- Copyright and Authors (Centered) -->
      <div class="text-center q-mb-sm">
        <div class="text-caption">
          Leibniz-Zentrum für Archäologie (LEIZA) {{ copyrightYear }}
        </div>
        <div class="text-caption">
          {{ authors.join(' & ') }}
        </div>
      </div>

      <!-- Links and Contact (Centered, responsive layout) -->
      <div class="row justify-center items-center q-gutter-x-md wrap">
        <!-- Impressum Link -->
        <a :href="imprintUrl" target="_blank" class="text-white text-decoration-none text-caption">
          Impressum
        </a>

        <!-- Contact Component -->
        <ContactComponent />

        <!-- Datenschutz Link -->
        <a :href="privacyUrl" target="_blank" class="text-white text-decoration-none text-caption">
          Datenschutz
        </a>
      </div>

    </div>
  </q-toolbar>
</template>

<script setup lang="ts">
import ContactComponent from 'src/layouts/ContactComponent.vue';

defineProps<{
  copyrightYear: number;
  authors: string[];
  imprintUrl: string;
  privacyUrl: string;
}>();
</script>

<style scoped>
/* Optional: Add styles if needed for footer elements */
.text-caption {
    /* Ensure consistent caption size */
    font-size: 12px; /* Or use Quasar's text-caption class */
}
.wrap {
    flex-wrap: wrap; /* Allow items to wrap on very small screens */
    gap: 8px; /* Add some space between items */
}
</style>