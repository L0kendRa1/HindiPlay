import { useRef, useCallback } from 'react';

/**
 * Reusable activity timer hook.
 *
 * Uses Date timestamps and refs so that timing never causes
 * gameplay re-renders during interactions.
 */
export function useActivityTimer() {
  const startTimeRef = useRef<number>(Date.now());
  const stoppedTimeRef = useRef<number | null>(null);

  /** Start or reset the timer to the current moment */
  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    stoppedTimeRef.current = null;
  }, []);

  /**
   * Stop the timer and return the elapsed time in integer seconds (minimum 1 second).
   */
  const stopTimer = useCallback((): number => {
    if (stoppedTimeRef.current === null) {
      stoppedTimeRef.current = Date.now();
    }
    const elapsedMs = stoppedTimeRef.current - startTimeRef.current;
    return Math.max(1, Math.round(elapsedMs / 1000));
  }, []);

  /**
   * Read the current elapsed time without freezing the timer.
   */
  const getElapsedSeconds = useCallback((): number => {
    const end = stoppedTimeRef.current ?? Date.now();
    const elapsedMs = end - startTimeRef.current;
    return Math.max(1, Math.round(elapsedMs / 1000));
  }, []);

  /** Reset the timer for a new attempt */
  const resetTimer = useCallback(() => {
    startTimer();
  }, [startTimer]);

  return {
    startTime: startTimeRef.current,
    startTimer,
    stopTimer,
    getElapsedSeconds,
    resetTimer,
  };
}
