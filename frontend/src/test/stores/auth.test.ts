import { describe, it, expect, vi } from 'vitest';
import { useAuthStore } from 'src/stores/auth';

// Mock the entire auth service so the store never makes real HTTP calls
vi.mock('src/services/auth', () => ({
  default: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn(),
  },
}));

// Import the mock AFTER vi.mock so we can control return values per test
import authService from 'src/services/auth';

const mockUser = {
  id: '123',
  email: 'test@example.com',
  first_name: 'Test',
  last_name: 'User',
  is_active: true,
  is_superuser: false,
  is_verified: true,
};

describe('useAuthStore', () => {

  // ---------------------------------------------------------------------------
  // Initial state
  // ---------------------------------------------------------------------------

  describe('initial state', () => {
    it('has no user by default', () => {
      const store = useAuthStore();
      expect(store.user).toBeNull();
    });

    it('is not authenticated when there is no token and no user', () => {
      const store = useAuthStore();
      expect(store.isAuthenticated).toBe(false);
    });

    it('is not loading by default', () => {
      const store = useAuthStore();
      expect(store.isLoading).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // Login
  // ---------------------------------------------------------------------------

  describe('login', () => {
    it('stores the token and fetches the user on successful login', async () => {
      const { login, getCurrentUser } = authService;
      vi.mocked(login).mockResolvedValue({ access_token: 'fake-token', token_type: 'bearer' });
      vi.mocked(getCurrentUser).mockResolvedValue(mockUser);

      const store = useAuthStore();
      await store.login('test@example.com', 'password123');

      expect(store.token).toBe('fake-token');
      expect(store.user?.email).toBe('test@example.com');
      expect(store.isAuthenticated).toBe(true);
    });

    it('saves the token to localStorage on login', async () => {
      const { login, getCurrentUser } = authService;
      vi.mocked(login).mockResolvedValue({ access_token: 'fake-token', token_type: 'bearer' });
      vi.mocked(getCurrentUser).mockResolvedValue(mockUser);

      const store = useAuthStore();
      await store.login('test@example.com', 'password123');

      expect(localStorage.getItem('token')).toBe('fake-token');
    });

    it('is not loading after login completes', async () => {
      const { login, getCurrentUser } = authService;
      vi.mocked(login).mockResolvedValue({ access_token: 'fake-token', token_type: 'bearer' });
      vi.mocked(getCurrentUser).mockResolvedValue(mockUser);

      const store = useAuthStore();
      await store.login('test@example.com', 'password123');

      expect(store.isLoading).toBe(false);
    });

    it('is not loading after login fails', async () => {
      const { login } = authService;
      vi.mocked(login).mockRejectedValue(new Error('bad credentials'));

      const store = useAuthStore();
      await expect(store.login('test@example.com', 'wrong')).rejects.toThrow();
      expect(store.isLoading).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // Logout
  // ---------------------------------------------------------------------------

  describe('logout', () => {
    it('clears user, token and localStorage on logout', async () => {
      const { login, getCurrentUser } = authService;
      vi.mocked(login).mockResolvedValue({ access_token: 'fake-token', token_type: 'bearer' });
      vi.mocked(getCurrentUser).mockResolvedValue(mockUser);

      const store = useAuthStore();
      await store.login('test@example.com', 'password123');
      store.logout();

      expect(store.user).toBeNull();
      expect(store.token).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
      expect(store.isAuthenticated).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // Register
  // ---------------------------------------------------------------------------

  describe('register', () => {
    it('calls the auth service with correct data', async () => {
      const { register } = authService;
      vi.mocked(register).mockResolvedValue({
        id: '456', email: 'new@example.com', first_name: 'New',
        last_name: 'User', is_active: true, is_superuser: false, is_verified: false,
      });

      const store = useAuthStore();
      await store.register('new@example.com', 'password123', 'New', 'User');

      expect(register).toHaveBeenCalledWith({
        email: 'new@example.com', password: 'password123',
        first_name: 'New', last_name: 'User',
      });
    });

    it('is not loading after register completes', async () => {
      const { register } = authService;
      vi.mocked(register).mockResolvedValue({
        id: '456', email: 'new@example.com', first_name: 'New',
        last_name: 'User', is_active: true, is_superuser: false, is_verified: false,
      });

      const store = useAuthStore();
      await store.register('new@example.com', 'password123', 'New', 'User');

      expect(store.isLoading).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // fetchUser
  // ---------------------------------------------------------------------------

  describe('fetchUser', () => {
    it('does nothing if there is no token', async () => {
      const { getCurrentUser } = authService;
      const store = useAuthStore();
      await store.fetchUser();
      expect(getCurrentUser).not.toHaveBeenCalled();
    });

    it('logs out if fetching the user fails (invalid token)', async () => {
      localStorage.setItem('token', 'stale-token');
      const { getCurrentUser } = authService;
      vi.mocked(getCurrentUser).mockRejectedValue(new Error('401'));

      const store = useAuthStore();
      store.token = 'stale-token';

      await expect(store.fetchUser()).rejects.toThrow();
      expect(store.user).toBeNull();
      expect(store.token).toBeNull();
    });
  });
});