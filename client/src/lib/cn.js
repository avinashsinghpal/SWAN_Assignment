/**
 * cn - utility to merge Tailwind class names with clsx + tailwind-merge.
 * Eliminates class conflicts (e.g. two bg-* classes) while supporting
 * conditional class application.
 *
 * @param {...import('clsx').ClassValue} inputs
 * @returns {string}
 */
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
