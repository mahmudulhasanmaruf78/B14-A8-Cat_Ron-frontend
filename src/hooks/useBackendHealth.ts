'use client';

import { useState, useEffect, useCallback } from 'react';
import { healthService } from '../services/health.service';
import { BackendHealthResponse } from '../types';
import { getApiBaseUrl } from '../lib/api-client';

export function useBackendHealth() {
  const [data, setData] = useState<BackendHealthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await healthService.checkBackendHealth();
      setData(response);
    } catch (err) {
      setData(null);
      setError(
        err instanceof Error
          ? err.message
          : `Unable to reach backend server at ${getApiBaseUrl()}`
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function initCheck() {
      try {
        const response = await healthService.checkBackendHealth();
        if (!ignore) {
          setData(response);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          setData(null);
          setError(
            err instanceof Error
              ? err.message
              : `Unable to reach backend server at ${getApiBaseUrl()}`
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    initCheck();
    return () => {
      ignore = true;
    };
  }, []);

  return { data, loading, error, refetch: checkHealth };
}

