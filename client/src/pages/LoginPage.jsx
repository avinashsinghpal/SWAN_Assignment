import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth.api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { loginSchema } from '../lib/schemas.js';
import { DEMO_CREDENTIALS } from '../lib/constants.js';
import { AuthShell } from '../components/auth/AuthShell.jsx';
import { HighlightText } from '../components/landing/HighlightText.jsx';
import { Input } from '../components/ui/Input.jsx';
import { PasswordField } from '../components/auth/PasswordField.jsx';
import { Button } from '../components/ui/Button.jsx';
import { ErrorBanner } from '../components/ui/FieldWrapper.jsx';
import { toast } from '../components/ui/Toaster.jsx';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const [apiError, setApiError] = useState('');

  const expiredNotice = searchParams.get('expired') === '1'
    ? 'Your session expired. Please sign in to continue.'
    : '';

  const from = location.state?.from?.pathname || searchParams.get('from') || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: (data) => authApi.login(data),
    onSuccess: (res) => {
      const user = res.data?.data?.user || res.data?.data;
      queryClient.setQueryData(['auth', 'me'], user);
      toast.success('Signed in successfully');
      navigate(from, { replace: true });
    },
    onError: (err) => {
      if (err.status === 429) {
        setApiError('Too many login attempts. Please wait 15 minutes before trying again.');
      } else {
        setApiError(err.message || 'Invalid email or password.');
      }
    },
  });

  const onSubmit = (data) => {
    setApiError('');
    loginMutation.mutate(data);
  };

  const fillDemo = (email, pass) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', pass, { shouldValidate: true });
    setApiError('');
  };

  const showDemoBox = import.meta.env.VITE_SHOW_DEMO !== 'false';

  return (
    <AuthShell splitWord="WELCOME">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#FE6A00] mb-2">
            Access / 01
          </p>
          <h1 className="font-display text-5xl md:text-6xl uppercase tracking-tight text-[#EEEEEE] leading-none m-0">
            WELCOME{' '}
            <HighlightText animateOnMount={true}>
              BACK
            </HighlightText>
          </h1>
          <p className="text-xs text-[#717171] mt-3">
            Authenticate with your organizational credentials.
          </p>
        </div>

        {expiredNotice && (
          <div className="bg-[#161616] border border-[#FE6A00]/40 p-3 text-xs text-[#FE6A00] font-mono border-l-2 border-l-[#FE6A00]">
            {expiredNotice}
          </div>
        )}

        {apiError && <ErrorBanner message={apiError} />}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Work Email"
            type="email"
            placeholder="operator@swandigital.io"
            error={errors.email?.message}
            {...register('email')}
          />

          <PasswordField
            label="Password"
            placeholder="••••••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          <Button
            type="submit"
            variant="solid"
            size="lg"
            className="w-full mt-4"
            pending={loginMutation.isPending}
            pendingLabel="AUTHENTICATING"
          >
            Log In
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center pt-2">
          <p className="text-xs text-[#717171]">
            No account?{' '}
            <Link
              to="/register"
              className="text-[#FE6A00] hover:underline uppercase tracking-wider font-semibold ml-1"
            >
              Register
            </Link>
          </p>
        </div>

        {/* Demo access */}
        {showDemoBox && (
          <div className="border border-[#222222] p-4 bg-[#060606] space-y-3 mt-8">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-[#717171]">
              <span>Demo access</span>
              <span>Presets</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemo(DEMO_CREDENTIALS.admin.email, DEMO_CREDENTIALS.admin.password)}
                className="p-2 border border-[#222222] bg-[#121212] hover:border-[#FE6A00] hover:text-[#FE6A00] text-left transition-colors"
              >
                <p className="text-[10px] uppercase tracking-wider text-[#FE6A00]">ADMIN</p>
                <p className="text-[11px] text-[#8A8A8A] truncate">{DEMO_CREDENTIALS.admin.email}</p>
              </button>

              <button
                type="button"
                onClick={() => fillDemo(DEMO_CREDENTIALS.sales.email, DEMO_CREDENTIALS.sales.password)}
                className="p-2 border border-[#222222] bg-[#121212] hover:border-[#FE6A00] hover:text-[#FE6A00] text-left transition-colors"
              >
                <p className="text-[10px] uppercase tracking-wider text-[#D4D4D4]">SALES</p>
                <p className="text-[11px] text-[#8A8A8A] truncate">{DEMO_CREDENTIALS.sales.email}</p>
              </button>
            </div>
          </div>
        )}
      </div>
    </AuthShell>
  );
}

export default LoginPage;
