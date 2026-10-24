/**
 * Formatting helpers for dates, numbers, currency, and IDs.
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Format a Date object or ISO string to "24 Oct 2026".
 * @param {string|Date|number} input
 * @returns {string}
 */
export function formatDate(input) {
  if (!input) return '—';
  const d = new Date(input);
  if (isNaN(d.getTime())) return '—';
  const day = String(d.getDate()).padStart(2, '0');
  const month = MONTHS[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Format a Date object or ISO string to "24 Oct 2026, 14:30".
 * @param {string|Date|number} input
 * @returns {string}
 */
export function formatDateTime(input) {
  if (!input) return '—';
  const d = new Date(input);
  if (isNaN(d.getTime())) return '—';
  const day = String(d.getDate()).padStart(2, '0');
  const month = MONTHS[d.getMonth()];
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day} ${month} ${year}, ${hours}:${minutes}`;
}

/**
 * Check if a date is strictly before today (00:00:00).
 * @param {string|Date|number} input
 * @returns {boolean}
 */
export function isOverdue(input) {
  if (!input) return false;
  const d = new Date(input);
  if (isNaN(d.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
}

/**
 * Check if a date falls on today.
 * @param {string|Date|number} input
 * @returns {boolean}
 */
export function isToday(input) {
  if (!input) return false;
  const d = new Date(input);
  if (isNaN(d.getTime())) return false;
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

/**
 * Format an ID to a clean short hash (e.g. "6adc68").
 * @param {string} id
 * @returns {string}
 */
export function formatShortId(id) {
  if (!id) return '';
  const str = String(id);
  return str.length > 8 ? str.slice(-6).toUpperCase() : str.toUpperCase();
}

/**
 * Format a number as 2-digit zero-padded index (e.g. 1 -> "01").
 * @param {number} idx
 * @returns {string}
 */
export function formatIndex(idx) {
  return String(idx).padStart(2, '0');
}
