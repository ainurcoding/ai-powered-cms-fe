import { api } from './api';
import { API_ENDPOINTS } from '../constants/api';
import type {
  User,
  LoginCredentials,
  RegisterData,
  ApiResponse,
} from '../types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<{
    access_token: string;
    refresh_token: string;
    token_type: string;
  }> {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  async register(data: RegisterData): Promise<ApiResponse<User>> {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },

  async getGoogleAuthUrl(): Promise<{ auth_url: string }> {
    const response = await api.get(API_ENDPOINTS.AUTH.GOOGLE_URL);
    return response.data;
  },

  async handleGoogleCallback(code: string): Promise<{
    access_token: string;
    refresh_token: string;
    token_type: string;
  }> {
    const response = await api.get(
      `${API_ENDPOINTS.AUTH.GOOGLE_CALLBACK}?code=${code}`
    );
    return response.data;
  },
};

