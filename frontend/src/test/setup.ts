import { config } from '@vue/test-utils';
import { Quasar } from 'quasar';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, vi } from 'vitest';

// Mount Quasar globally so components can use Q-components and plugins
config.global.plugins = [Quasar];

// Fresh pinia before every test so stores don't bleed state between tests
beforeEach(() => {
  setActivePinia(createPinia());
});

// Stub localStorage (happy-dom has it but let's make it explicit and resettable)
beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});