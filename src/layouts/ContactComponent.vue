<!-- src/layouts/contactComponent.vue -->
<template>
  <div class="contact-container">
    <q-btn
      v-if="!showEmails"
      label="Kontakt"
      @click="showEmails = true"
      color="white"
      text-color="secondary"
      icon="email"
      unelevated
      size="sm"
      class="contact-btn"
    />
    <div v-if="showEmails" class="emails-container">

      <div class="row items-center flex-center q-gutter-sm">

        <div v-if="$q.screen.lt.sm" class="column items-center">
          <div
            v-for="email in decodedEmails"
            :key="email"
            class="email-item"
          >
            <a
              :href="'mailto:' + email"
              class="text-white email-link text-caption"
            >
              {{ email }}
            </a>
          </div>
        </div>

        <div v-else class="row items-center">
          <a
            v-for="(email, index) in decodedEmails"
            :key="email"
            :href="'mailto:' + email"
            class="text-white email-link text-caption"
          >
            {{ email }}<span v-if="index < decodedEmails.length - 1">,</span>
          </a>
        </div>

        <q-btn
          icon="close"
          size="xs"
          flat
          round
          color="white"
          @click="showEmails = false"
          class="q-ml-sm"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const showEmails = ref(false);

const obfuscatedEmails = ref([
  "7l4a9s2s1e6x3m5e8m0p4e2l7l9a1e6n3g8e5r2x9l7e4i1z6a8x2d5e9",
  "7k4r9i2s1t6i3n5a8x0f4i2s7c9h1e6r3x8l5e2i9z7a4x1d6e8",
  "7n4a9t2h1a6l3y5x8w0i4t2t7x9l1e6i3z8a5x2d9e7"
]);

const decodedEmails = computed(() => {
  return obfuscatedEmails.value.map(email => {
    const decoded = email.replace(/\d/g, '');
    const parts = decoded.split('x').filter(part => part.length > 0);
    if (parts.length >= 4) {
      const firstName = parts[0];
      const lastName = parts[1];
      const domain = parts[2];
      const tld = parts[3];
      return `${firstName}.${lastName}@${domain}.${tld}`;
    }
    return email;
  });
});
</script>

<style scoped>
.contact-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.contact-btn {
  font-size: 14px; 
}

.emails-container {
  position: relative;
}

.email-link {
  text-decoration: none;
  color: white !important;
  word-break: break-all; 
}

.email-link:hover {
  text-decoration: underline;
}

@media (max-width: 599px) {
  .contact-btn {
    font-size: 12px;
    padding: 4px 8px;
  }

  .text-caption {
    font-size: 11px; 
  }
}

@media (min-width: 600px) {
  .text-caption {
    font-size: 12px; 
  }
}
</style>