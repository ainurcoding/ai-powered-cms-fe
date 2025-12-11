import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/auth.service';
import type { LoginCredentials, RegisterData, User } from '../types';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    setUser,
    logout: storeLogout,
  } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Get current user
  const { isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const data = await authService.getCurrentUser();
      setUser(data);
      return data;
    },
    enabled: !!localStorage.getItem('access_token') && !user,
    retry: false,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: async (data) => {
      // Extract token and user from response
      const token = data.result.token;
      const userFromResponse = data.result.user;

      // Store token
      localStorage.setItem('access_token', token);
      // If refresh_token is available, store it too
      // localStorage.setItem('refresh_token', data.result.refresh_token);

      // Map user data from response to User type
      // Backend returns role field (ADMIN, EDITOR, USER)
      const userData: User = {
        id: userFromResponse.id,
        username: userFromResponse.username,
        email: userFromResponse.email,
        full_name: userFromResponse.full_name ?? null,
        profile_image: userFromResponse.profile_image ?? null,
        is_active: userFromResponse.is_active ?? true,
        role: userFromResponse.role as 'ADMIN' | 'EDITOR' | 'USER' | undefined,
        created_at: userFromResponse.created_at ?? new Date().toISOString(),
        updated_at: userFromResponse.updated_at ?? new Date().toISOString(),
      };

      // Set user data directly from response (no need to call getCurrentUser)
      setUser(userData);

      toast.success('Login berhasil!');
      navigate('/dashboard');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { detail?: string } } };
      toast.error(err.response?.data?.detail || 'Login gagal');
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      toast.success('Registrasi berhasil! Silakan login.');
      navigate('/login');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { detail?: string } } };
      toast.error(err.response?.data?.detail || 'Registrasi gagal');
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      storeLogout();
      queryClient.clear();
      toast.success('Logout berhasil');
      navigate('/login');
    },
    onError: () => {
      // Even if API fails, logout locally
      storeLogout();
      queryClient.clear();
      navigate('/login');
    },
  });

  const login = (credentials: LoginCredentials) => {
    loginMutation.mutate(credentials);
  };

  const register = (data: RegisterData) => {
    registerMutation.mutate(data);
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
  };
};
