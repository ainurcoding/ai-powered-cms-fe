import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/Card';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { GoogleLoginButton } from '../components/auth/GoogleLoginButton';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const { login, isLoginLoading } = useAuth();
  const { handleCallback, isHandlingCallback } = useGoogleAuth();

  // Handle Google OAuth callback
  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      // Handle OAuth error
      console.error('Google OAuth error:', error);
      // Remove error params from URL
      setSearchParams({}, { replace: true });
      return;
    }

    if (code && !isHandlingCallback) {
      // Handle Google OAuth callback
      handleCallback(code, state || undefined);
      // Remove code and state from URL to prevent re-triggering
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, handleCallback, setSearchParams, isHandlingCallback]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ username, password });
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header with theme toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">AI CMS</h1>
            <p className="text-muted-foreground mt-2">
              Kelola konten Anda dengan kekuatan AI
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Masukkan kredensial Anda untuk mengakses dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium">
                    Username
                  </label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    placeholder="Masukkan username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full font-semibold"
                  disabled={isLoginLoading || isHandlingCallback}
                >
                  {isLoginLoading ? 'Loading...' : 'Login'}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background text-muted-foreground px-2">
                    Atau lanjutkan dengan
                  </span>
                </div>
              </div>

              {/* Google Login Button */}
              <GoogleLoginButton
                disabled={isLoginLoading || isHandlingCallback}
              />

              <div className="mt-4 text-center text-sm">
                <span className="text-muted-foreground">
                  Belum punya akun?{' '}
                </span>
                <Link
                  to="/register"
                  className="text-primary hover:text-primary/90 font-medium"
                >
                  Daftar sekarang
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
