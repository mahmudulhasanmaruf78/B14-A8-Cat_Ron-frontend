import { apiClient } from '../lib/api-client';
import { BackendHealthResponse } from '../types';

export const healthService = {
  checkBackendHealth: async (): Promise<BackendHealthResponse> => {
    return apiClient<BackendHealthResponse>('/');
  },
};
