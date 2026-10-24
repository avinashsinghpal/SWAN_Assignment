/**
 * Application constants, tokens, and status configuration.
 */

export const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];

export const LEAD_SERVICES = [
  'Web Development',
  'Mobile App Development',
  'SEO',
  'Social Media Marketing',
  'Performance Marketing',
  'UI/UX Design',
  'Custom Software',
  'Other',
];

export const STATUS_CONFIG = {
  New: {
    color: '#8A8A8A',
    label: 'New',
    shape: 'hollow',
  },
  Contacted: {
    color: '#D4D4D4',
    label: 'Contacted',
    shape: 'half',
  },
  Qualified: {
    color: '#FE6A00',
    label: 'Qualified',
    shape: 'filled',
  },
  Converted: {
    color: '#5FB878',
    label: 'Converted',
    shape: 'check',
  },
  Lost: {
    color: '#C2544B',
    label: 'Lost',
    shape: 'slash',
  },
};

export const DEMO_CREDENTIALS = {
  admin: {
    email: import.meta.env.VITE_DEMO_ADMIN_EMAIL || 'admin@swandigital.io',
    password: import.meta.env.VITE_DEMO_PASSWORD || 'Admin@1234',
    role: 'ADMIN',
  },
  sales: {
    email: import.meta.env.VITE_DEMO_SALES_EMAIL || 'priya.sales@swandigital.io',
    password: import.meta.env.VITE_DEMO_PASSWORD || 'Sales@1234',
    role: 'SALES',
  },
};
