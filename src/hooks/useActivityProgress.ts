import { useState, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import * as progressService from '../services/progressService';
import type {
  ProgressPayload,
  RewardSummary,
  ProgressRecord,
  CreateProgressResponse,
} from '../types/api';

export interface SubmitProgressOptions {
  activityId: string;
  score: number;
  total: number;
  completed?: boolean;
  timeSpentSeconds?: number;
  subject?: string;
  metadata?: Record<string, unknown>;
}

export interface UseActivityProgressReturn {
  submitProgress: (options: SubmitProgressOptions) => Promise<CreateProgressResponse | null>;
  resetProgress: () => void;
  isSubmitting: boolean;
  error: string | null;
  rewards: RewardSummary | null;
  savedProgress: ProgressRecord | null;
}

/**
 * Reusable hook for submitting activity completion to the backend.
 *
 * - Only submits when the user is authenticated.
 * - Protects against duplicate submissions via refs.
 * - Runs asynchronously without blocking completion screens.
 * - Catches errors gracefully without crashing the UI.
 */
export function useActivityProgress(): UseActivityProgressReturn {
  const { isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [rewards, setRewards] = useState<RewardSummary | null>(null);
  const [savedProgress, setSavedProgress] = useState<ProgressRecord | null>(null);

  const submittedRef = useRef<boolean>(false);
  const inFlightRef = useRef<boolean>(false);

  const submitProgress = useCallback(
    async (options: SubmitProgressOptions): Promise<CreateProgressResponse | null> => {
      // Guest mode: do not call backend
      if (!isAuthenticated) {
        return null;
      }

      // Prevent duplicate submissions for the same completion event
      if (submittedRef.current || inFlightRef.current) {
        return null;
      }

      inFlightRef.current = true;
      setIsSubmitting(true);
      setError(null);

      try {
        const safeTotal = Math.max(1, options.total);
        const safeScore = Math.max(0, Math.min(options.score, safeTotal));

        const payload: ProgressPayload = {
          activityId: options.activityId,
          score: safeScore,
          total: safeTotal,
          completed: options.completed ?? true,
          timeSpentSeconds: Math.max(0, Math.round(options.timeSpentSeconds ?? 0)),
          subject: options.subject ?? 'hindi',
          metadata: options.metadata,
        };

        const response = await progressService.saveProgress(payload);
        submittedRef.current = true;

        if (response?.data) {
          const pRecord = response.data.progress || response.data;
          setSavedProgress(pRecord);
          if (response.data.rewards) {
            setRewards(response.data.rewards);
          }
        }

        return response;
      } catch (err: unknown) {
        console.warn('[ActivityProgress] Could not save progress:', err instanceof Error ? err.message : err);
        setError('प्रगति अभी सेव नहीं हो सकी।');
        return null;
      } finally {
        inFlightRef.current = false;
        setIsSubmitting(false);
      }
    },
    [isAuthenticated]
  );

  const resetProgress = useCallback(() => {
    submittedRef.current = false;
    inFlightRef.current = false;
    setIsSubmitting(false);
    setError(null);
    setRewards(null);
    setSavedProgress(null);
  }, []);

  return {
    submitProgress,
    resetProgress,
    isSubmitting,
    error,
    rewards,
    savedProgress,
  };
}
