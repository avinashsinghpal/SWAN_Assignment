import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth.api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { registerSchema } from '../lib/schemas.js';
import { AuthShell } from '../components/auth/AuthShell.jsx';
import { HighlightText } from '../components/landing/HighlightText.jsx';
import { Input } from '../components/ui/Input.jsx';
import { PasswordField } from '../components/auth/PasswordField.jsx';
import { PasswordStrength } from '../components/auth/PasswordStrength.jsx';
import { Button } from '../components/ui/Button.jsx';
import { ErrorBanner } from '../components/ui/FieldWrapper.jsx';
import { toast } from '../components/ui/Toaster.jsx';

export function RegisterPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const [generalError, setGeneralError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const passwordValue = watch('password');

  const registerMutation = useMutation({
    mutationFn: (data) =>
      authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      }),
    onSuccess: (res) => {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('swan:logged_out');
      }
      const user = res.data?.data?.user || res.data?.data;
      queryClient.setQueryData(['auth', 'me'], user);
      toast.success('Account created successfully');
      navigate('/dashboard', { replace: true });
    },
    onError: (err) => {
      if (err.status === 409) {
        setError('email', {
          type: 'manual',
          message: 'An account with this email address already exists.',
        });
      } else if (err.status === 422 && Array.isArray(err.details) && err.details.length > 0) {
        err.details.forEach((d) => {
          if (d.field) {
            setError(d.field, { type: 'manual', message: d.message });
          }
        });
        const firstMessage = err.details[0]?.message;
        setGeneralError(firstMessage || 'Validation failed. Please check the fields below.');
      } else {
        setGeneralError(err.message || 'Registration failed. Please verify your details.');
      }
    },
  });

  const onSubmit = (data) => {
    setGeneralError('');
    registerMutation.mutate(data);
  };

  return (
    <AuthShell splitWord="REGISTER">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#FE6A00] mb-2">
            Access / 02
          </p>
          <h1 className="font-display text-5xl md:text-6xl uppercase tracking-tight text-[#EEEEEE] leading-none m-0">
            CREATE{' '}
            <HighlightText animateOnMount={true}>
              ACCOUNT
            </HighlightText>
          </h1>
          <p className="text-xs text-[#717171] mt-3">
            Register a new operator profile for Swan LMS.
          </p>
        </div>

        {generalError && <ErrorBanner message={generalError} />}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="Arjun Mehta"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Work Email"
            type="email"
            placeholder="operator@swandigital.io"
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="space-y-2">
            <PasswordField
              label="Password"
              placeholder="••••••••••••"
              error={errors.password?.message}
              {...register('password')}
            />
            <PasswordStrength password={passwordValue} />
          </div>

          <PasswordField
            label="Confirm Password"
            placeholder="••••••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button
            type="submit"
            variant="solid"
            size="lg"
            className="w-full mt-4"
            pending={registerMutation.isPending}
            pendingLabel="CREATING ACCOUNT"
          >
            Create Account
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center pt-2">
          <p className="text-xs text-[#717171]">
            Already registered?{' '}
            <Link
              to="/login"
              className="text-[#FE6A00] hover:underline uppercase tracking-wider font-semibold ml-1"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </AuthShell>
  );
}

export default RegisterPage;
