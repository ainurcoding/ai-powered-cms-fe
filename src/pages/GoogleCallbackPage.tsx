import { useEffect, useRef } from 'react';
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
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    // Prevent multiple calls
    if (hasProcessedRef.current || isHandlingCallback) {
      return;
    }

    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      // Handle OAuth error
      hasProcessedRef.current = true;
      console.error('Google OAuth error:', error);
      toast.error('Google OAuth authentication failed. Please try again.');
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }

    if (code) {
      // Mark as processed immediately to prevent duplicate calls
      hasProcessedRef.current = true;

      // Remove code and state from URL first to prevent re-triggering
      setSearchParams({}, { replace: true });

      // Handle Google OAuth callback
      handleCallback(code, state || undefined);
    } else if (!code) {
      // No code found, redirect to login
      hasProcessedRef.current = true;
      navigate('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // Only depend on searchParams, use ref to prevent multiple calls

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
