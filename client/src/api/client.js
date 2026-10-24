/**
 * Axios API client with interceptors.
 *
 * - Base URL is /api/v1 (proxied to backend in dev, VITE_API_URL in prod)
 * - withCredentials: true sends the httpOnly cookie on every request
 * - Request interceptor: add Accept: application/json
 * - Response interceptor: normalise error shape, handle 401 globally
 */

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/v1`
  : '/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Include httpOnly cookies on all requests
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
});

// Response interceptor: unwrap the data envelope on success,
// and expose a clean error object on failure.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Structured API error
      const apiError = error.response.data?.error || {};
      const enriched = new Error(apiError.message || 'An unexpected error occurred.');
      enriched.code = apiError.code || 'UNKNOWN_ERROR';
      enriched.status = error.response.status;
      enriched.details = apiError.details || [];
      return Promise.reject(enriched);
    }
    if (error.request) {
      const networkError = new Error('Network error. Please check your connection.');
      networkError.code = 'NETWORK_ERROR';
      return Promise.reject(networkError);
    }
    return Promise.reject(error);
  }
);
