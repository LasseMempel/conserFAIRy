<!-- ContactComponent.vue -->

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
      <!-- Mobile: Stack emails vertically -->
      <div class="mobile-emails lt-sm">
        <div 
          v-for="email in decodedEmails"
          :key="email"
          class="email-item"
        >
          <a
            :href="'mailto:' + email"
            class="text-white email-link"
          >
            {{ email }}
          </a>
        </div>
        <q-btn
          icon="close"
          size="xs"
          flat
          round
          color="white"
          @click="showEmails = false"
          class="close-btn"
        />
      </div>

      <!-- Desktop: Keep horizontal layout -->
      <div class="desktop-emails gt-xs row items-center flex-center">
        <a
          v-for="(email, index) in decodedEmails"
          :key="email"
          :href="'mailto:' + email"
          class="q-ml-sm text-white email-link"
        >
          {{ email }}<span v-if="index < decodedEmails.length - 1">,</span>
        </a>
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

<script setup>
import { ref, computed } from 'vue';

const showEmails = ref(false);
const obfuscatedEmails = ref([
  "7l4a9s2s1e6x3m5e8m0p4e2l7l9a1e6n3g8e5r2x9l7e4i1z6a8x2d5e9",
  //"7k4r9i2s1t6i3n5a8x0f4i2s7c9h1e6r3x8l5e2i9z7a4x1d6e8",
  //"7n4a9t2h1a6l3y5x8w0i4t2t7x9l1e6i3z8a5x2d9e7"
]);

const decodedEmails = computed(() => {
  return obfuscatedEmails.value.map(email => {
    let decoded = email.replace(/\d/g, '');
    let parts = decoded.split('x').filter(part => part.length > 0);
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

.mobile-emails {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  min-width: 200px;
}

.email-item {
  margin: 2px 0;
  text-align: center;
}

.email-link {
  text-decoration: none;
  font-size: 12px;
  color: white !important;
  word-break: break-all;
}

.email-link:hover {
  text-decoration: underline;
}

.close-btn {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: rgba(255, 255, 255, 0.2);
}

.desktop-emails .email-link {
  font-size: 14px;
  word-break: normal;
}

@media (max-width: 599px) {
  .contact-btn {
    font-size: 12px;
    padding: 4px 8px;
  }
  
  .email-link {
    font-size: 11px;
  }
}
</style>