/**
 * Auth API functions.
 */

import { apiClient } from './client.js';

export const authApi = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  logout: () => apiClient.post('/auth/logout'),
  getMe: () => apiClient.get('/auth/me'),
  changePassword: (data) => apiClient.patch('/auth/password', data),
  updateProfile: (data) => apiClient.patch('/auth/profile', data),
};
