import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { changePasswordSchema } from '../lib/schemas.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Input } from '../components/ui/Input.jsx';
import { PasswordField } from '../components/auth/PasswordField.jsx';
import { PasswordStrength } from '../components/auth/PasswordStrength.jsx';
import { Button } from '../components/ui/Button.jsx';
import { ErrorBanner } from '../components/ui/FieldWrapper.jsx';
import { toast } from '../components/ui/Toaster.jsx';

export function SettingsPage() {
  const { user } = useAuth();
  const [securityError, setSecurityError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const newPasswordValue = watch('newPassword');

  const passwordMutation = useMutation({
    mutationFn: (data) =>
      authApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    onSuccess: () => {
      toast.success('Password changed successfully');
      setSecurityError('');
      reset();
    },
    onError: (err) => {
      setSecurityError(err.message || 'Failed to update password. Verify your current password.');
      toast.error('Password change failed');
    },
  });

  const onPasswordSubmit = (data) => {
    setSecurityError('');
    passwordMutation.mutate(data);
  };

  return (
    <div className="max-w-4xl space-y-8 font-mono">
      {/* ── Page Header ────────────────────────────────────────── */}
      <SectionHeader
        eyebrow="04 / Settings"
        title="SETTINGS"
        subtitle="Manage your operator profile and cryptographic credentials."
      />

      <div className="space-y-8">
        {/* ── Block 01: Profile ─────────────────────────────────── */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#222222]/40">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#FE6A00]">
                Identity
              </p>
              <h3 className="font-display text-2xl uppercase tracking-wide text-[#EEEEEE]">
                01 / Profile
              </h3>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-[#717171]">
              Read-Only Attributes
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Square Initial Tile */}
            <div className="w-16 h-16 border border-[#FE6A00]/50 bg-[#060606] flex items-center justify-center font-display text-3xl text-[#FE6A00] shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>

            <div className="space-y-1">
              <h4 className="font-display text-2xl uppercase tracking-wide text-[#EEEEEE]">
                {user?.name}
              </h4>
              <p className="text-xs text-[#717171]">{user?.email}</p>
              <div className="pt-1">
                <span className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold border border-[#FE6A00] text-[#FE6A00] bg-[#020202]">
                  {user?.role === 'ADMIN' ? 'Full Administrator' : 'Sales Representative'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#222222]/40 text-xs">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#717171]">Registered Email</p>
              <p className="text-[#8A8A8A] mt-1">{user?.email}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#717171]">Access Scope</p>
              <p className="text-[#8A8A8A] mt-1">{user?.role === 'ADMIN' ? 'Organization-wide' : 'Assigned leads only'}</p>
            </div>
          </div>
        </Card>

        {/* ── Block 02: Security ────────────────────────────────── */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#222222]/40">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#FE6A00]">
                Credentials
              </p>
              <h3 className="font-display text-2xl uppercase tracking-wide text-[#EEEEEE]">
                02 / Security
              </h3>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-[#717171]">
              Password Rotation
            </span>
          </div>

          {securityError && <ErrorBanner message={securityError} />}

          <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-5 max-w-lg">
            <PasswordField
              label="Current Password *"
              placeholder="••••••••••••"
              error={errors.currentPassword?.message}
              {...register('currentPassword')}
            />

            <div className="space-y-2">
              <PasswordField
                label="New Password *"
                placeholder="••••••••••••"
                error={errors.newPassword?.message}
                {...register('newPassword')}
              />
              <PasswordStrength password={newPasswordValue} />
            </div>

            <PasswordField
              label="Confirm New Password *"
              placeholder="••••••••••••"
              error={errors.confirmNewPassword?.message}
              {...register('confirmNewPassword')}
            />

            <div className="pt-3">
              <Button
                type="submit"
                variant="solid"
                pending={passwordMutation.isPending}
                pendingLabel="UPDATING PASSWORD"
              >
                Update Password
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default SettingsPage;
