/**
 * Dashboard API functions.
 */

import { apiClient } from './client.js';

export const dashboardApi = {
  getStats: () => apiClient.get('/dashboard/stats'),
  getTrends: () => apiClient.get('/dashboard/trends'),
  getServices: () => apiClient.get('/dashboard/services'),
  getFollowUps: () => apiClient.get('/dashboard/follow-ups'),
  getRecentLeads: () => apiClient.get('/dashboard/recent-leads'),
};

/**
 * Users API functions (ADMIN only).
 */
export const usersApi = {
  list: () => apiClient.get('/users'),
};
