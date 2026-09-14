import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import * as adaptiveService from '../services/adaptiveService';
import { PersonalizedRecommendation } from '../types/adaptive';

export function usePersonalizedLearning() {
  const { isAuthenticated } = useAuth();
  const [recommendation, setRecommendation] = useState<PersonalizedRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adaptiveService.getPersonalizedRecommendations();
      if (res && res.data) {
        setRecommendation(res.data);
      }
    } catch (err) {
      console.warn('[AdaptiveLearning] Could not load recommendations:', err);
      setError('सुझाव अभी लोड नहीं हो सके');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations, isAuthenticated]);

  return {
    recommendation,
    isLoading,
    error,
    refetch: fetchRecommendations,
  };
}
