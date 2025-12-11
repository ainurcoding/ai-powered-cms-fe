import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/auth.service';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import type { User } from '../types';

// Google OAuth user response type (may differ from our User type)
interface GoogleOAuthUser {
  id: string;
  username: string;
  email: string;
  name?: string;
  full_name?: string | null;
  avatar?: string;
  profile_image?: string | null;
  role?: string;
  isActive?: boolean;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const useGoogleAuth = () => {
  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Get Google Auth URL mutation
  const getGoogleAuthUrlMutation = useMutation({
    mutationFn: authService.getGoogleAuthUrl,
    onSuccess: (data) => {
      // Redirect to Google OAuth page
      if (data.result?.authUrl) {
        window.location.href = data.result.authUrl;
      } else {
        toast.error('Failed to get Google Auth URL');
      }
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { detail?: string } } };
      toast.error(
        err.response?.data?.detail || 'Failed to get Google Auth URL'
      );
    },
  });

  // Handle Google OAuth callback mutation
  const handleGoogleCallbackMutation = useMutation({
    mutationFn: ({ code, state }: { code: string; state?: string }) =>
      authService.handleGoogleCallback(code, state),
    onSuccess: async (data) => {
      if (data.result?.token) {
        // Store token to localStorage for Bearer token authentication
        // This token will be automatically added to all authenticated API requests
        // via the api interceptor in src/services/api.ts
        localStorage.setItem('access_token', data.result.token);
        // If refresh token is available, store it too
        // localStorage.setItem('refresh_token', data.result.refreshToken);

        // Map Google OAuth user response to User type
        if (data.result.user) {
          const googleUser = data.result.user as GoogleOAuthUser;
          const mappedUser: User = {
            id: googleUser.id,
            username: googleUser.username,
            email: googleUser.email,
            full_name: googleUser.name || googleUser.full_name || null,
            profile_image:
              googleUser.avatar || googleUser.profile_image || null,
            is_active: googleUser.isActive ?? googleUser.is_active ?? true,
            role: googleUser.role as 'ADMIN' | 'EDITOR' | 'USER' | undefined,
            created_at: googleUser.created_at || new Date().toISOString(),
            updated_at: googleUser.updated_at || new Date().toISOString(),
          };
          setUser(mappedUser);
        } else {
          // If user not in response, fetch it
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }

        queryClient.invalidateQueries({ queryKey: ['currentUser'] });

        const isNewUser = data.result.isNewUser;
        toast.success(
          isNewUser
            ? 'Account created successfully! Welcome!'
            : 'Login berhasil!'
        );
        navigate('/dashboard');
      }
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { detail?: string } } };
      toast.error(
        err.response?.data?.detail || 'Google OAuth authentication failed'
      );
      navigate('/login');
    },
  });

  // Test Google OAuth config (optional - for debugging)
  const testConfigQuery = useQuery({
    queryKey: ['googleOAuthConfig'],
    queryFn: authService.testGoogleConfig,
    enabled: false, // Only run when explicitly called
    retry: false,
  });

  // Initiate Google login
  const loginWithGoogle = () => {
    getGoogleAuthUrlMutation.mutate();
  };

  // Handle callback with code and state from URL
  const handleCallback = (code: string, state?: string) => {
    handleGoogleCallbackMutation.mutate({ code, state });
  };

  // Test config function
  const testConfig = () => {
    testConfigQuery.refetch();
  };

  return {
    loginWithGoogle,
    handleCallback,
    testConfig,
    isGettingUrl: getGoogleAuthUrlMutation.isPending,
    isHandlingCallback: handleGoogleCallbackMutation.isPending,
    isTestingConfig: testConfigQuery.isFetching,
    configTestResult: testConfigQuery.data,
    configTestError: testConfigQuery.error,
  };
};
