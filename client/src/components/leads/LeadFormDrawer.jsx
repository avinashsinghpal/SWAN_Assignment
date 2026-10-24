/**
 * LeadFormDrawer component.
 * Drawer form for creating or editing a lead with Zod validation.
 */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';
import { Drawer, DrawerFooter } from '../ui/Drawer.jsx';
import { Input, Textarea } from '../ui/Input.jsx';
import { Select } from '../ui/Select.jsx';
import { Button } from '../ui/Button.jsx';
import { usersApi } from '../../api/dashboard.api.js';
import { useAuth } from '../../context/AuthContext.jsx';

const LEAD_SERVICES = [
  'Web Development',
  'Mobile App Development',
  'SEO',
  'Social Media Marketing',
  'Performance Marketing',
  'UI/UX Design',
  'Custom Software',
  'Other',
];

const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];

const leadSchema = z.object({
  name: z.string().trim().min(1, 'Lead name is required').max(150, 'Max 150 characters'),
  email: z.string().trim().email('Invalid email address').min(1, 'Email is required'),
  phone: z.string().trim().max(30, 'Phone must be under 30 characters').optional().or(z.literal('')),
  company: z.string().trim().max(150, 'Company must be under 150 characters').optional().or(z.literal('')),
  serviceInterested: z.string().min(1, 'Please select a service'),
  status: z.enum(LEAD_STATUSES),
  followUpDate: z.string().optional().or(z.literal('')),
  notes: z.string().max(5000, 'Notes must be under 5000 characters').optional().or(z.literal('')),
  assignedTo: z.string().optional().or(z.literal('')),
});

export function LeadFormDrawer({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading = false,
}) {
  const isEditing = Boolean(initialData?._id);
  const { isAdmin } = useAuth();

  // If admin, fetch users to populate assignedTo dropdown
  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await usersApi.list();
      return res.data.data;
    },
    enabled: isOpen && isAdmin,
    staleTime: 60 * 1000,
  });

  const usersList = usersData || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
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
  }, [initialData, reset, isOpen]);

  const handleFormSubmit = (data) => {
    const payload = {
      ...data,
      followUpDate: data.followUpDate ? new Date(data.followUpDate).toISOString() : null,
      assignedTo: data.assignedTo ? data.assignedTo : null,
    };
    onSubmit(payload);
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Lead' : 'Create New Lead'}
      description={
        isEditing
          ? 'Update the lead details and save changes.'
          : 'Fill in the information below to add a new lead to Swan LMS.'
      }
      size="md"
    >
      <form id="lead-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Full Name */}
        <Input
          label="Lead Name *"
          placeholder="e.g. Sarah Jenkins"
          error={errors.name?.message}
          {...register('name')}
        />

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email Address *"
            type="email"
            placeholder="e.g. sarah@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+1 (555) 000-0000"
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>

        {/* Company */}
        <Input
          label="Company Name"
          placeholder="e.g. Acme Tech Solutions"
          error={errors.company?.message}
          {...register('company')}
        />

        {/* Service Interested & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Service Interested *"
            options={LEAD_SERVICES.map((s) => ({ value: s, label: s }))}
            error={errors.serviceInterested?.message}
            {...register('serviceInterested')}
          />

          <Select
            label="Status *"
            options={LEAD_STATUSES.map((s) => ({ value: s, label: s }))}
            error={errors.status?.message}
            {...register('status')}
          />
        </div>

        {/* Follow-up Date */}
        <Input
          label="Follow-Up Date"
          type="date"
          error={errors.followUpDate?.message}
          {...register('followUpDate')}
        />

        {/* Assigned To (if Admin) */}
        {isAdmin && (
          <Select
            label="Assigned Specialist"
            options={[
              { value: '', label: 'Unassigned' },
              ...usersList.map((u) => ({
                value: u._id,
                label: `${u.name} (${u.role})`,
              })),
            ]}
            error={errors.assignedTo?.message}
            {...register('assignedTo')}
          />
        )}

        {/* Notes */}
        <Textarea
          label="Notes / Brief"
          placeholder="Enter any initial requirements, client notes, or background context..."
          rows={4}
          error={errors.notes?.message}
          {...register('notes')}
        />
      </form>

      <DrawerFooter>
        <Button variant="ghost" type="button" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          type="submit"
          form="lead-form"
          variant="primary"
          isLoading={isLoading}
        >
          {isEditing ? 'Save Changes' : 'Create Lead'}
        </Button>
      </DrawerFooter>
    </Drawer>
  );
}
