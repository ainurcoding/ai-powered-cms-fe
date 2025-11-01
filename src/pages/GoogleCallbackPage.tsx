import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/Card';
import toast from 'react-hot-toast';

export const GoogleCallbackPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleCallback, isHandlingCallback } = useGoogleAuth();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      // Handle OAuth error
      console.error('Google OAuth error:', error);
      toast.error('Google OAuth authentication failed. Please try again.');
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }

    if (code && !isHandlingCallback) {
      // Handle Google OAuth callback
      handleCallback(code, state || undefined);
      // Remove code and state from URL to prevent re-triggering
      setSearchParams({}, { replace: true });
    } else if (!code && !isHandlingCallback) {
      // No code found, redirect to login
      navigate('/login');
    }
  }, [
    searchParams,
    handleCallback,
    setSearchParams,
    isHandlingCallback,
    navigate,
  ]);

  return (
    <div className="bg-background min-h-screen">
      {/* Header with theme toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Processing Login...</CardTitle>
              <CardDescription>
                Please wait while we complete your Google sign-in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8">
                <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
              </div>
              <p className="text-muted-foreground text-center text-sm">
                {isHandlingCallback
                  ? 'Verifying your credentials...'
                  : 'Redirecting to dashboard...'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
