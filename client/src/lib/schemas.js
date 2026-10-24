import * as z from 'zod';
import { LEAD_STATUSES, LEAD_SERVICES } from './constants.js';

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const passwordRules = [
  { id: 'length', label: '8 or more characters', test: (p) => p.length >= 8 },
  { id: 'upper', label: 'Uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { id: 'lower', label: 'Lowercase letter', test: (p) => /[a-z]/.test(p) },
  { id: 'number', label: 'Number', test: (p) => /[0-9]/.test(p) },
];

export function calculatePasswordStrength(pass) {
  if (!pass) return { score: 0, label: 'Weak', rules: passwordRules.map((r) => ({ ...r, met: false })) };
  const evaluated = passwordRules.map((r) => ({
    ...r,
    met: r.test(pass),
  }));
  const score = evaluated.filter((r) => r.met).length;
  let label = 'Weak';
  if (score === 2) label = 'Fair';
  else if (score === 3) label = 'Good';
  else if (score === 4) label = 'Strong';

  return { score, label, rules: evaluated };
}

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters'),
    email: z.string().trim().min(1, 'Email is required').email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain an uppercase letter')
      .regex(/[a-z]/, 'Password must contain a lowercase letter')
      .regex(/[0-9]/, 'Password must contain a number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const leadSchema = z.object({
  name: z.string().trim().min(2, 'Lead name must be at least 2 characters'),
  email: z.string().trim().min(1, 'Email is required').email('Please enter a valid email address'),
  phone: z.string().trim().optional().or(z.literal('')),
  company: z.string().trim().optional().or(z.literal('')),
  serviceInterested: z.enum(LEAD_SERVICES, {
    errorMap: () => ({ message: 'Please select a valid service' }),
  }),
  status: z.enum(LEAD_STATUSES, {
    errorMap: () => ({ message: 'Please select a valid status' }),
  }),
  followUpDate: z.string().optional().or(z.literal('')),
  notes: z.string().max(2000, 'Notes cannot exceed 2000 characters').optional().or(z.literal('')),
  assignedTo: z.string().optional().or(z.literal('')),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain an uppercase letter')
      .regex(/[a-z]/, 'Password must contain a lowercase letter')
      .regex(/[0-9]/, 'Password must contain a number'),
    confirmNewPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  });
