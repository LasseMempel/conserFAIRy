<!-- src/components/AppHeader.vue -->
<template>
  <q-toolbar class="q-gutter-md">
    <!-- Unified Header Content using responsive classes and CSS -->
    <div class="full-width row items-center no-wrap">
      <!-- Logo Section -->
      <div class="row items-center no-wrap">
        <img
          :src="logoSrc"
          :width="$q.screen.lt.sm ? logoWidthSm : logoWidthLg"
          :height="$q.screen.lt.sm ? logoHeightSm : logoHeightLg"
          class="q-ml-md"
          :alt="'LEIZA Logo'"
        />
      </div>

      <!-- Title Section (Centered) -->
      <q-toolbar-title class="text-center">
        <div class="column items-center">
          <!-- Main Title -->
          <div
            class="text-bold text-secondary"
            :class="{ 'text-h6': $q.screen.lt.sm, 'text-h5': !$q.screen.lt.sm }"
          >
            {{ mainTitle }}
          </div>
          <!-- Subtitle -->
          <div
            class="text-secondary"
            :class="{ 'text-caption': $q.screen.lt.sm, 'text-subtitle1': !$q.screen.lt.sm }"
          >
            {{ subtitle }}
          </div>
        </div>
      </q-toolbar-title>

      <!-- Department Info Section (Right-aligned, hidden on mobile) -->
      <div
        v-if="!$q.screen.lt.sm"
        class="row items-center no-wrap"
      >
        <span class="text-subtitle2 text-secondary">{{ department }}</span>
      </div>

      <!-- Mobile Department Info (Below Logo/Title) -->
      <div v-if="$q.screen.lt.sm" class="absolute-top-right q-mt-xs q-mr-md text-right">
        <div class="text-caption text-secondary">{{ department }}</div>
      </div>
    </div>
  </q-toolbar>
</template>

<script setup lang="ts">
// Define props for content
defineProps({
  logoSrc: {
    type: String,
    required: true
  },
  logoWidthSm: {
    type: Number,
    default: 80
  },
  logoHeightSm: {
    type: Number,
    default: 60
  },
  logoWidthLg: {
    type: Number,
    default: 100
  },
  logoHeightLg: {
    type: Number,
    default: 75
  },
  mainTitle: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
/* Use CSS for responsive adjustments where needed */
.text-bold {
  font-weight: bold;
}
/* Optional: Adjust padding on smaller screens if needed */
@media (max-width: 599px) {
  .q-toolbar {
    min-height: auto;
    padding: 8px 16px;
  }
}
</style>