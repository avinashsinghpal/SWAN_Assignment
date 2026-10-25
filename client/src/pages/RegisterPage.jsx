import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, User, KeyRound } from 'lucide-react';
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
import { cn } from '../lib/cn.js';

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
    setValue,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'SALES',
      adminSecretKey: '',
    },
  });

  const passwordValue = watch('password');
  const selectedRole = watch('role') || 'SALES';

  const registerMutation = useMutation({
    mutationFn: (data) =>
      authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        role: data.role,
        adminSecretKey: data.role === 'ADMIN' ? data.adminSecretKey : undefined,
      }),
    onSuccess: (res) => {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('swan:logged_out');
      }
      const user = res.data?.data?.user || res.data?.data;
      queryClient.setQueryData(['auth', 'me'], user);
      toast.success(
        user?.role === 'ADMIN'
          ? 'Administrator account created successfully'
          : 'Account created successfully'
      );
      navigate('/dashboard', { replace: true });
    },
    onError: (err) => {
      if (err.status === 409) {
        setError('email', {
          type: 'manual',
          message: 'An account with this email address already exists.',
        });
      } else if (err.status === 403 || err.code === 'INVALID_ADMIN_SECRET') {
        setError('adminSecretKey', {
          type: 'manual',
          message: err.message || 'Invalid administrator secret key.',
        });
        setGeneralError(err.message || 'Invalid administrator secret key.');
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
            Register a new operator or administrator profile for Swan LMS.
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

          {/* Role Choice */}
          <div className="space-y-1.5 text-left font-mono">
            <label className="block text-[10px] uppercase tracking-widest text-[#717171]">
              Account Role
            </label>
            <input type="hidden" {...register('role')} />
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setValue('role', 'SALES', { shouldValidate: true });
                  clearErrors('adminSecretKey');
                }}
                className={cn(
                  'p-3 border text-left transition-all relative flex flex-col justify-between cursor-pointer focus:outline-none',
                  selectedRole === 'SALES'
                    ? 'border-[#FE6A00] bg-[#FE6A00]/10 text-[#EEEEEE]'
                    : 'border-[#222222] bg-[#060606] text-[#717171] hover:border-[#717171]/50 hover:text-[#EEEEEE]'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <User size={16} className={selectedRole === 'SALES' ? 'text-[#FE6A00]' : 'text-[#717171]'} />
                  {selectedRole === 'SALES' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FE6A00]" />
                  )}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider font-bold">Sales Operator</p>
                  <p className="text-[10px] text-[#717171] mt-0.5 leading-tight">Standard pipeline access</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setValue('role', 'ADMIN', { shouldValidate: true });
                }}
                className={cn(
                  'p-3 border text-left transition-all relative flex flex-col justify-between cursor-pointer focus:outline-none',
                  selectedRole === 'ADMIN'
                    ? 'border-[#FE6A00] bg-[#FE6A00]/10 text-[#EEEEEE]'
                    : 'border-[#222222] bg-[#060606] text-[#717171] hover:border-[#717171]/50 hover:text-[#EEEEEE]'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <Shield size={16} className={selectedRole === 'ADMIN' ? 'text-[#FE6A00]' : 'text-[#717171]'} />
                  <span className="text-[9px] uppercase tracking-wider text-[#FE6A00] bg-[#FE6A00]/15 px-1.5 py-0.5 border border-[#FE6A00]/30 font-bold">
                    Key Req
                  </span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider font-bold">Administrator</p>
                  <p className="text-[10px] text-[#717171] mt-0.5 leading-tight">Full administrative authority</p>
                </div>
              </button>
            </div>
          </div>

          {/* Conditional Admin Secret Key Input */}
          {selectedRole === 'ADMIN' && (
            <div className="p-3.5 border border-[#FE6A00]/40 bg-[#FE6A00]/5 space-y-2 transition-all font-mono">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <KeyRound size={13} className="text-[#FE6A00]" />
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#FE6A00]">
                    Administrator Authorization
                  </span>
                </div>
                <span className="text-[9px] uppercase tracking-widest text-[#FE6A00] border border-[#FE6A00]/30 px-1 py-0.5 bg-[#020202]">
                  Secret Key Required
                </span>
              </div>

              <PasswordField
                label="Admin Secret Key"
                placeholder="Enter admin authorization key"
                error={errors.adminSecretKey?.message}
                {...register('adminSecretKey')}
              />
              <p className="text-[10px] text-[#8A8A8A] leading-relaxed">
                Platform permits multiple administrators. Provide your organization's secret key to unlock admin privileges.
              </p>
            </div>
          )}

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
            {selectedRole === 'ADMIN' ? 'Create Admin Account' : 'Create Account'}
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
