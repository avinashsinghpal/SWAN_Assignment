/**
 * Leads API functions.
 */

import { apiClient } from './client.js';

/**
 * @param {object} params - query parameters
 */
export const leadsApi = {
  list: (params) => apiClient.get('/leads', { params }),
  get: (id) => apiClient.get(`/leads/${id}`),
  create: (data) => apiClient.post('/leads', data),
  update: (id, data) => apiClient.put(`/leads/${id}`, data),
  updateStatus: (id, status) => apiClient.patch(`/leads/${id}/status`, { status }),
  delete: (id) => apiClient.delete(`/leads/${id}`),
  getActivities: (id) => apiClient.get(`/leads/${id}/activities`),
  export: (params) =>
    apiClient.get('/leads/export', {
      params,
      responseType: 'blob',
    }),
};
