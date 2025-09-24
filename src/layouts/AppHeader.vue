<!-- src/layouts/AppHeader.vue -->
<template>
  <q-toolbar class="q-gutter-md">
   
    <div class="full-width row items-center no-wrap">

      <div class="row items-center no-wrap">
        <img
          :src="logoSrc"
          :width="$q.screen.lt.sm ? logoWidthSm : logoWidthLg"
          :height="$q.screen.lt.sm ? logoHeightSm : logoHeightLg"
          class="q-ml-md"
          :alt="'LEIZA Logo'"
        />
      </div>


      <q-toolbar-title class="text-center">
        <div class="column items-center">

          <div
            class="text-bold text-secondary"
            :class="{ 'text-h6': $q.screen.lt.sm, 'text-h5': !$q.screen.lt.sm }"
          >
            {{ mainTitle }}
          </div>

          <div
            class="text-secondary"
            :class="{ 'text-caption': $q.screen.lt.sm, 'text-subtitle1': !$q.screen.lt.sm }"
          >
            {{ subtitle }}
          </div>
        </div>
      </q-toolbar-title>

      <div
        v-if="!$q.screen.lt.sm"
        class="row items-center no-wrap"
      >
        <span class="text-subtitle2 text-secondary">{{ department }}</span>
      </div>

      <div v-if="$q.screen.lt.sm" class="absolute-top-right q-mt-xs q-mr-md text-right">
        <div class="text-caption text-secondary">{{ department }}</div>
      </div>
    </div>
  </q-toolbar>
</template>

<script setup lang="ts">

import type { HeaderConfig } from 'src/types/layoutTypes';

defineProps<HeaderConfig>();

</script>

<style scoped>

.text-bold {
  font-weight: bold;
}

@media (max-width: 599px) {
  .q-toolbar {
    min-height: auto;
    padding: 8px 16px;
  }
}
</style>