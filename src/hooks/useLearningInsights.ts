import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import * as insightsService from '../services/insightsService';
import { LearningInsightsData } from '../types/insights';

export function useLearningInsights() {
  const { isAuthenticated } = useAuth();
  const [insights, setInsights] = useState<LearningInsightsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await insightsService.getLearningInsights();
      if (res && res.data) {
        setInsights(res.data);
      }
    } catch (err) {
      console.warn('[LearningInsights] Could not load insights:', err);
      setError('अंतर्दृष्टि अभी लोड नहीं हो सकी।');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  return {
    insights,
    isLoading,
    error,
    refetch: fetchInsights,
  };
}
