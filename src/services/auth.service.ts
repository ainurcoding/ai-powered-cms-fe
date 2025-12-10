import { api, publicApi } from './api';
import { API_ENDPOINTS } from '../constants/api';
import type {
  User,
  LoginCredentials,
  RegisterData,
  ApiResponse,
  GoogleAuthUrlResponse,
  GoogleOAuthCallbackResponse,
  BackendResponse,
} from '../types';

export const authService = {
  /**
   * Login with username and password.
   * Uses publicApi because this endpoint returns Access-Control-Allow-Origin: *
   * and doesn't require credentials (withCredentials: false)
   * Response includes: { result: { token, user, ... } }
   */
  async login(credentials: LoginCredentials): Promise<
    BackendResponse<{
      token: string;
      user: User;
    }>
  > {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await publicApi.post<
      BackendResponse<{
        token: string;
        user: User;
      }>
    >(API_ENDPOINTS.AUTH.LOGIN, formData, {
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

  /**
   * Check token and get current user.
   * Uses /auth/check-token endpoint which validates token and returns user data.
   * Uses publicApi because this endpoint returns Access-Control-Allow-Origin: *
   * Token is automatically added via publicApi interceptor from localStorage
   */
  async getCurrentUser(): Promise<User> {
    const response = await publicApi.get<BackendResponse<User>>(
      API_ENDPOINTS.AUTH.CHECK_TOKEN
    );
    return response.data.result;
  },

  /**
   * Get Google OAuth authorization URL.
   * Use this URL to redirect users to Google login page.
   * Uses publicApi because this endpoint doesn't require credentials
   * and backend returns Access-Control-Allow-Origin: *
   */
  async getGoogleAuthUrl(): Promise<GoogleAuthUrlResponse> {
    const response = await publicApi.get(API_ENDPOINTS.AUTH.GOOGLE_URL);
    return response.data;
  },

  /**
   * Handle Google OAuth callback.
   * This endpoint is called by frontend to exchange code with token.
   * Backend detects API call via Accept: application/json header.
   * Uses publicApi because this is a public endpoint that exchanges code for token
   * @param code - Authorization code from Google
   * @param state - State parameter from Google (optional)
   */
  async handleGoogleCallback(
    code: string,
    state?: string
  ): Promise<GoogleOAuthCallbackResponse> {
    const params = new URLSearchParams({ code });
    if (state) {
      params.append('state', state);
    }

    const response = await publicApi.get<
      BackendResponse<GoogleOAuthCallbackResponse['result']>
    >(`${API_ENDPOINTS.AUTH.GOOGLE_CALLBACK}?${params.toString()}`, {
      headers: {
        Accept: 'application/json',
      },
    });
    // Backend returns { message, result: { token, user, isNewUser, message } }
    // Extract result and return in expected format
    return {
      message: response.data.message,
      result: response.data.result,
    };
  },

  /**
   * Test Google OAuth configuration.
   * Check if Client ID, Client Secret, and Callback URL are properly configured.
   * Uses publicApi because this endpoint doesn't require credentials
   */
  async testGoogleConfig(): Promise<ApiResponse<Record<string, unknown>>> {
    const response = await publicApi.get(API_ENDPOINTS.AUTH.GOOGLE_TEST_CONFIG);
    return response.data;
  },
};
