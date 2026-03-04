<template>
  <q-select
    v-model="locale"
    :options="localeOptions"
    dense
    borderless
    emit-value
    map-options
    options-dense
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { watch, computed } from 'vue'

const { locale, t } = useI18n({ useScope: 'global' })

// initial load
const savedLocale = localStorage.getItem('locale')
if (savedLocale) {
  locale.value = savedLocale
}

// persist changes
watch(locale, (newLocale) => {
  localStorage.setItem('locale', newLocale)
})

const localeOptions = computed(() => [
  { value: 'de', label: t('auth.german') },
  { value: 'en-US', label: t('auth.english') }
])
</script>