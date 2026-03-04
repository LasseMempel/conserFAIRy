import { describe, it, expect } from 'vitest';
import { getUserInitials } from 'src/utils/userInitials';

describe('getUserInitials', () => {
  it('returns both initials uppercased when first and last name are provided', () => {
    expect(getUserInitials('John', 'Doe')).toBe('JD');
  });

  it('returns only first initial when last name is missing', () => {
    expect(getUserInitials('John', null)).toBe('J');
  });

  it('returns only last initial when first name is missing', () => {
    expect(getUserInitials(null, 'Doe')).toBe('D');
  });

  it('returns XX when both names are missing', () => {
    expect(getUserInitials(null, null)).toBe('XX');
  });

  it('returns XX when both names are undefined', () => {
    expect(getUserInitials(undefined, undefined)).toBe('XX');
  });

  it('uppercases lowercase initials', () => {
    expect(getUserInitials('alice', 'smith')).toBe('AS');
  });

  it('handles single character names', () => {
    expect(getUserInitials('A', 'B')).toBe('AB');
  });
});