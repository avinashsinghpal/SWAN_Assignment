import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Drawer } from '../ui/Drawer.jsx';
import { Input } from '../ui/Input.jsx';
import { Textarea } from '../ui/Textarea.jsx';
import { Select } from '../ui/Select.jsx';
import { DateInput } from '../ui/DateInput.jsx';
import { Button } from '../ui/Button.jsx';
import { ErrorBanner } from '../ui/FieldWrapper.jsx';
import { toast } from '../ui/Toaster.jsx';
import { leadsApi } from '../../api/leads.api.js';
import { usersApi } from '../../api/dashboard.api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { leadSchema } from '../../lib/schemas.js';
import { LEAD_SERVICES, LEAD_STATUSES } from '../../lib/constants.js';

export function LeadFormDrawer({
  open,
  onOpenChange,
  initialData = null,
  onSuccess,
}) {
  const isEditing = Boolean(initialData?._id);
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [duplicateWarning, setDuplicateWarning] = useState('');
  const [submitError, setSubmitError] = useState('');

  // Fetch users list for Admin assignment
  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await usersApi.list();
      return res.data?.data || [];
    },
    enabled: open && isAdmin,
    staleTime: 60 * 1000,
  });

  const usersList = usersData || [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      serviceInterested: 'Web Development',
      status: 'New',
      followUpDate: '',
      notes: '',
      assignedTo: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      let formattedFollowUp = '';
      if (initialData.followUpDate) {
        try {
          formattedFollowUp = new Date(initialData.followUpDate).toISOString().split('T')[0];
        } catch {
          formattedFollowUp = '';
        }
      }

      reset({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        company: initialData.company || '',
        serviceInterested: initialData.serviceInterested || 'Web Development',
        status: initialData.status || 'New',
        followUpDate: formattedFollowUp,
        notes: initialData.notes || '',
        assignedTo: initialData.assignedTo?._id || initialData.assignedTo || '',
      });
    } else {
      reset({
        name: '',
        email: '',
        phone: '',
        company: '',
        serviceInterested: 'Web Development',
        status: 'New',
        followUpDate: '',
        notes: '',
        assignedTo: '',
      });
    }
  }, [initialData, reset, open]);

  // Lead save mutation
  const leadMutation = useMutation({
    mutationFn: (payload) => {
      if (isEditing) {
        return leadsApi.update(initialData._id, payload);
      }
      return leadsApi.create(payload);
    },
    onSuccess: (res) => {
      const warning = res.data?.warning;
      if (warning) {
        setDuplicateWarning(warning);
        toast.info(warning);
      } else {
        toast.success(isEditing ? 'Lead updated successfully' : 'Lead created successfully');
      }

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      if (isEditing) {
        queryClient.invalidateQueries({ queryKey: ['lead', initialData._id] });
        queryClient.invalidateQueries({ queryKey: ['leadActivities', initialData._id] });
      }

      if (onSuccess) onSuccess(res.data?.data);
      onOpenChange(false);
    },
    onError: (err) => {
      setSubmitError(err.message || 'Failed to save lead. Please check the form.');
      toast.error(err.message || 'Failed to save lead.');
    },
  });

  const onSubmit = (data) => {
    setSubmitError('');
    setDuplicateWarning('');

    const payload = {
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone?.trim() || undefined,
      company: data.company?.trim() || undefined,
      serviceInterested: data.serviceInterested,
      status: data.status,
      followUpDate: data.followUpDate ? new Date(data.followUpDate).toISOString() : null,
      notes: data.notes?.trim() || undefined,
      assignedTo: data.assignedTo || null,
    };

    leadMutation.mutate(payload);
  };

  const onError = (formErrors) => {
    const firstField = Object.keys(formErrors)[0];
    if (firstField) {
      setFocus(firstField);
    }
  };

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      eyebrow={isEditing ? 'Lead / Edit' : 'Lead / Create'}
      title={isEditing ? 'EDIT LEAD' : 'NEW LEAD'}
      description={
        isEditing
          ? 'Modify pipeline attributes and save updates.'
          : 'Enter prospect details to log a new inquiry.'
      }
      footer={
        <div className="flex items-center justify-end gap-3 font-mono">
          <Button
            variant="ghost"
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={leadMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="lead-drawer-form"
            variant="solid"
            pending={leadMutation.isPending}
            pendingLabel="SAVING"
          >
            Save Lead
          </Button>
        </div>
      }
    >
      <form
        id="lead-drawer-form"
        onSubmit={handleSubmit(onSubmit, onError)}
        className="space-y-4"
      >
        {submitError && <ErrorBanner message={submitError} />}

        {duplicateWarning && (
          <div className="bg-[#161616] border border-[#FE6A00]/40 p-3 text-xs text-[#FE6A00] font-mono border-l-2 border-l-[#FE6A00]">
            Notice: {duplicateWarning}
          </div>
        )}

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Name *"
            placeholder="Arjun Mehta"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Email *"
            type="email"
            placeholder="arjun@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Phone"
            type="tel"
            placeholder="+91 98765 43210"
            error={errors.phone?.message}
            {...register('phone')}
          />

          <Input
            label="Company"
            placeholder="Acme Corp"
            error={errors.company?.message}
            {...register('company')}
          />

          <Controller
            control={control}
            name="serviceInterested"
            render={({ field }) => (
              <Select
                label="Service Interested *"
                value={field.value}
                onValueChange={field.onChange}
                options={LEAD_SERVICES.map((s) => ({ value: s, label: s }))}
                error={errors.serviceInterested?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select
                label="Status *"
                value={field.value}
                onValueChange={field.onChange}
                options={LEAD_STATUSES.map((s) => ({ value: s, label: s }))}
                error={errors.status?.message}
              />
            )}
          />

          <DateInput
            label="Follow-up Date"
            error={errors.followUpDate?.message}
            {...register('followUpDate')}
          />

          {isAdmin && (
            <Controller
              control={control}
              name="assignedTo"
              render={({ field }) => (
                <Select
                  label="Assigned To"
                  value={field.value || ''}
                  onValueChange={field.onChange}
                  options={[
                    { value: '', label: 'Unassigned' },
                    ...usersList.map((u) => ({
                      value: u._id,
                      label: `${u.name} (${u.role})`,
                    })),
                  ]}
                  error={errors.assignedTo?.message}
                />
              )}
            />
          )}
        </div>

        {/* Notes (full width) */}
        <Textarea
          label="Notes"
          rows={4}
          placeholder="Detailed client requirements, scope notes, or conversation log..."
          error={errors.notes?.message}
          {...register('notes')}
        />
      </form>
    </Drawer>
  );
}
