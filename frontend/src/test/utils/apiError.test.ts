import { describe, it, expect } from 'vitest';
import { AxiosError } from 'axios';
import { parseApiError } from 'src/utils/apiError';

// Helper to build an AxiosError with a given status and response body
function makeAxiosError(status: number, data: unknown = {}): AxiosError {
  const error = new AxiosError('Request failed');
  error.response = { status, data, headers: {}, config: {} as never, statusText: '' };
  return error;
}

describe('parseApiError', () => {
  it('returns string detail from response when available', () => {
    const error = makeAxiosError(400, { detail: 'Email already registered' });
    expect(parseApiError(error)).toBe('Email already registered');
  });

  it('returns "Invalid credentials" when detail is not a string', () => {
    const error = makeAxiosError(400, { detail: [{ msg: 'complex error' }] });
    expect(parseApiError(error)).toBe('Invalid credentials');
  });

  it('returns login-specific message for 400 without detail in login context', () => {
    const error = makeAxiosError(400);
    expect(parseApiError(error, 'login')).toBe('Invalid email or password');
  });

  it('returns register-specific message for 400 without detail in register context', () => {
    const error = makeAxiosError(400);
    expect(parseApiError(error, 'register')).toBe('Registration failed. Email may already be in use.');
  });

  it('returns "Invalid input data" for 422', () => {
    const error = makeAxiosError(422);
    expect(parseApiError(error)).toBe('Invalid input data');
  });

  it('returns generic message for unknown AxiosError status', () => {
    const error = makeAxiosError(500);
    expect(parseApiError(error)).toBe('An error occurred');
  });

  it('returns generic message for non-Axios errors', () => {
    expect(parseApiError(new Error('network failure'))).toBe('An error occurred');
  });

  it('returns generic message for thrown strings', () => {
    expect(parseApiError('something went wrong')).toBe('An error occurred');
  });
});

describe('parseApiError - fastapi-users error codes', () => {
  it('maps LOGIN_BAD_CREDENTIALS to a friendly message', () => {
    const error = makeAxiosError(400, { detail: 'LOGIN_BAD_CREDENTIALS' });
    expect(parseApiError(error, 'login')).toBe('Invalid email or password');
  });

  it('maps REGISTER_USER_ALREADY_EXISTS to a friendly message', () => {
    const error = makeAxiosError(400, { detail: 'REGISTER_USER_ALREADY_EXISTS' });
    expect(parseApiError(error, 'register')).toBe('Registration failed. Email may already be in use.');
  });

  it('returns unknown error codes as-is', () => {
    const error = makeAxiosError(400, { detail: 'SOME_UNKNOWN_CODE' });
    expect(parseApiError(error)).toBe('SOME_UNKNOWN_CODE');
  });
});