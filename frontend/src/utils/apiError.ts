import { AxiosError } from 'axios';

/**
 * Parses an unknown error from an API call into a human-readable message.
 * Extracted from loginComponent.vue so it can be reused and unit tested.
 *
 * @param error   - The caught error
 * @param context - 'login' or 'register' to tailor the 400 message
 */
export function parseApiError(error: unknown, context: 'login' | 'register' = 'login'): string {
  if (error instanceof AxiosError) {
    if (error.response?.data?.detail) {
      if (typeof error.response.data.detail === 'string') {
        return error.response.data.detail;
      }
      return 'Invalid credentials';
    }

    if (error.response?.status === 400) {
      return context === 'login'
        ? 'Invalid email or password'
        : 'Registration failed. Email may already be in use.';
    }

    if (error.response?.status === 422) {
      return 'Invalid input data';
    }
  }

  return 'An error occurred';
}