import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import authService from 'src/services/auth';

export interface User {
  id: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const loading = ref<boolean>(false);

  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const isLoading = computed(() => loading.value);

  async function login(email: string, password: string): Promise<void> {
    loading.value = true;
    try {
      const response = await authService.login(email, password);
      token.value = response.access_token;
      localStorage.setItem('token', response.access_token);
      
      // Fetch user data after login
      await fetchUser();
    } finally {
      loading.value = false;
    }
  }

  async function register(email: string, password: string): Promise<void> {
    loading.value = true;
    try {
      await authService.register({ email, password });
    } finally {
      loading.value = false;
    }
  }

  async function fetchUser(): Promise<void> {
    if (!token.value) return;
    
    loading.value = true;
    try {
      user.value = await authService.getCurrentUser();
    } catch (error) {
      // If fetching user fails, token might be invalid
      logout();
      throw error;
    } finally {
      loading.value = false;
    }
  }

  function logout(): void {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
    authService.logout();
  }

  // Initialize user on app load if token exists
  async function initialize(): Promise<void> {
    if (token.value) {
      try {
        await fetchUser();
      } catch (error) {
        console.error('Failed to initialize user:', error);
        logout();
      }
    }
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    fetchUser,
    initialize,
  };
});