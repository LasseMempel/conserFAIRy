import { AxiosError } from 'axios';

/**
 * Known fastapi-users error codes and their human-readable messages.
 * See: https://fastapi-users.github.io/fastapi-users/usage/flow/
 */
const FASTAPI_USERS_ERRORS: Record<string, string> = {
  LOGIN_BAD_CREDENTIALS: 'Invalid email or password',
  LOGIN_USER_NOT_VERIFIED: 'Please verify your email address before logging in',
  REGISTER_USER_ALREADY_EXISTS: 'Registration failed. Email may already be in use.',
  REGISTER_INVALID_PASSWORD: 'Password does not meet requirements',
};

/**
 * Parses an unknown error from an API call into a human-readable message.
 * Extracted from loginComponent.vue so it can be reused and unit tested.
 *
 * @param error   - The caught error
 * @param context - 'login' or 'register' to tailor generic 400 messages
 */
export function parseApiError(error: unknown, context: 'login' | 'register' = 'login'): string {
  if (error instanceof AxiosError) {
    if (error.response?.data?.detail) {
      const detail = error.response.data.detail;

      // Known fastapi-users error code — map to friendly message
      if (typeof detail === 'string' && FASTAPI_USERS_ERRORS[detail]) {
        return FASTAPI_USERS_ERRORS[detail];
      }

      // Other string detail — return as-is
      if (typeof detail === 'string') {
        return detail;
      }

      // Non-string detail (e.g. validation error array)
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