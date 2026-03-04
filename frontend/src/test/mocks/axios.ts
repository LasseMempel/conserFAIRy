// This file is aliased to 'boot/axios' in vitest.config.ts
// It provides a mock `api` object so services can be imported without
// a real axios instance or backend connection.
import { vi } from 'vitest';

export const api = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
};