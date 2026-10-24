/**
 * LoginPage component.
 * Features Swan Digital Solutions branding, form validation, error handling,
 * and quick-login buttons for demo/testing convenience.
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { authApi } from '../api/auth.api.js';
import { Input } from '../components/ui/Input.jsx';
import { Button } from '../components/ui/Button.jsx';
import { useToast } from '../context/ToastContext.jsx';

const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [authError, setAuthError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

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
      toast({
        title: 'Welcome back!',
        message: user?.name ? `Signed in as ${user.name}` : 'Signed in successfully',
        variant: 'success',
      });
      navigate(from, { replace: true });
    },
    onError: (err) => {
      setAuthError(err.message || 'Invalid email or password.');
    },
  });

  const onSubmit = (data) => {
    setAuthError('');
    loginMutation.mutate(data);
  };

  const fillDemoCredentials = (email, pass) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', pass, { shouldValidate: true });
    setAuthError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-canvas)] dark:bg-[var(--color-dark-canvas)]">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal-700 text-white shadow-sm mb-1">
            <svg width="24" height="24" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 10 C2 6, 5 2, 7 2 C9 2, 12 6, 12 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              <path d="M7 2 L7 10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-ink)] dark:text-[var(--color-dark-ink)]">
            Swan Digital Solutions
          </h1>
          <p className="text-xs text-[var(--color-ink-subtle)] dark:text-[var(--color-dark-ink-subtle)]">
            Sign in to access your Lead Management System
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-[var(--color-dark-card)] p-8 rounded-2xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] shadow-xs">
          {authError && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-xs text-red-700 dark:text-red-300">
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Work Email"
              type="email"
              placeholder="name@swandigital.com"
              leftIcon={<Mail size={16} />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock size={16} />}
              error={errors.password?.message}
              {...register('password')}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={loginMutation.isPending}
            >
              Sign In <ArrowRight size={15} />
            </Button>
          </form>

          {/* Quick Fill Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
            <p className="text-[11px] font-semibold text-[var(--color-ink-subtle)] uppercase tracking-wider mb-2.5 text-center">
              Quick Test Credentials
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin@swandigital.io', 'Admin@1234')}
                className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/60 hover:bg-teal-50 dark:hover:bg-teal-950/30 border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-200 transition-colors"
              >
                <ShieldCheck size={13} className="text-teal-600" /> Admin Demo
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('priya.sales@swandigital.io', 'Sales@1234')}
                className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/60 hover:bg-teal-50 dark:hover:bg-teal-950/30 border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-200 transition-colors"
              >
                <UserCheck size={13} className="text-teal-600" /> Sales Demo
              </button>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <p className="text-center text-xs text-[var(--color-ink-subtle)] dark:text-[var(--color-dark-ink-subtle)]">
          Need an account?{' '}
          <Link
            to="/register"
            className="text-teal-700 dark:text-teal-400 font-semibold hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
