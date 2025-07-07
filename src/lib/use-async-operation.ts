"use client";

import { useState } from 'react';
import { ErrorService } from './error-service';

export function useAsyncOperation<T>(
  operation: () => Promise<T>,
  options: { onSuccess?: (data: T) => void; onError?: (error: any) => void } = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await operation();
      setData(result);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      setError(err);
      options.onError?.(err);
      ErrorService.handleError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { execute, data, error, isLoading };
} 