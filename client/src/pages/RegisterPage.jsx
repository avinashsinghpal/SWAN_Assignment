/**
 * RegisterPage component.
 * Allows new users to create an account in Swan LMS.
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Lock, Mail, User, Shield, ArrowRight } from 'lucide-react';
import { authApi } from '../api/auth.api.js';
import { Input } from '../components/ui/Input.jsx';
import { Select } from '../components/ui/Select.jsx';
import { Button } from '../components/ui/Button.jsx';
import { useToast } from '../context/ToastContext.jsx';

const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().trim().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    role: z.enum(['SALES', 'ADMIN']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export function RegisterPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [authError, setAuthError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'SALES',
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data) =>
      authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      }),
    onSuccess: (res) => {
      const user = res.data?.data?.user || res.data?.data;
      queryClient.setQueryData(['auth', 'me'], user);
      toast({
        title: 'Registration successful!',
        message: user?.name ? `Welcome ${user.name}! Your account has been created.` : 'Your account has been created.',
        variant: 'success',
      });
      navigate('/dashboard', { replace: true });
    },
    onError: (err) => {
      setAuthError(err.message || 'Registration failed. Please try again.');
    },
  });

  const onSubmit = (data) => {
    setAuthError('');
    registerMutation.mutate(data);
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
            Create an Account
          </h1>
          <p className="text-xs text-[var(--color-ink-subtle)] dark:text-[var(--color-dark-ink-subtle)]">
            Join Swan Digital Solutions Lead Management System
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
              label="Full Name *"
              placeholder="e.g. Alex Morgan"
              leftIcon={<User size={16} />}
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Work Email *"
              type="email"
              placeholder="name@swandigital.com"
              leftIcon={<Mail size={16} />}
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password *"
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock size={16} />}
                error={errors.password?.message}
                {...register('password')}
              />
              <Input
                label="Confirm Password *"
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock size={16} />}
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
            </div>

            <Select
              label="Organization Role *"
              options={[
                { value: 'SALES', label: 'Sales Specialist' },
                { value: 'ADMIN', label: 'System Administrator' },
              ]}
              error={errors.role?.message}
              {...register('role')}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={registerMutation.isPending}
            >
              Register Account <ArrowRight size={15} />
            </Button>
          </form>
        </div>

        {/* Footer Navigation */}
        <p className="text-center text-xs text-[var(--color-ink-subtle)] dark:text-[var(--color-dark-ink-subtle)]">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-teal-700 dark:text-teal-400 font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
