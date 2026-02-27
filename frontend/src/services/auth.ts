import { api } from 'boot/axios';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  is_active?: boolean;
  is_superuser?: boolean;
  is_verified?: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface UserResponse {
  id: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
}

class AuthService {
  async login(email: string, password: string): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await api.post<AuthResponse>(
      '/auth/jwt/login',
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    
    return response.data;
  }

  async register(data: RegisterData): Promise<UserResponse> {
    const response = await api.post<UserResponse>(
      '/auth/register',
      {
        email: data.email,
        password: data.password,
        is_active: true,
        is_superuser: false,
        is_verified: false
      }
    );
    return response.data;
  }

  logout(): void {
    // Any cleanup needed
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  async getCurrentUser(): Promise<UserResponse> {
    const response = await api.get<UserResponse>('/users/me');
    return response.data;
  }
}

export default new AuthService();
