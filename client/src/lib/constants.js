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
