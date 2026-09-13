import { useState, useCallback } from 'react';

const MAX_RECENT_ITEMS = 25;

/**
 * Reusable hook to track recently shown content items (IDs or words)
 * across activity rounds in the current browser session.
 *
 * - Non-blocking: works seamlessly in guest mode and authenticated mode
 * - Rolling window: caps stored items at MAX_RECENT_ITEMS (default 25)
 * - Safe sessionStorage persistence with graceful in-memory fallback
 *
 * @param activityId Identifier for the activity (e.g. 'picture-word-quiz')
 */
export function useRecentContent(activityId: string) {
  const storageKey = `hindiplay_recent_${activityId}`;

  const [recentItems, setRecentItems] = useState<string[]>(() => {
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.slice(0, MAX_RECENT_ITEMS);
        }
      }
    } catch {
      // Ignore sessionStorage parsing or security errors
    }
    return [];
  });

  const recordRecent = useCallback(
    (newItems: string[]) => {
      if (!newItems || newItems.length === 0) return;

      setRecentItems((prev) => {
        // Prepend new items, deduplicate, and cap length
        const combined = Array.from(new Set([...newItems, ...prev])).slice(0, MAX_RECENT_ITEMS);

        try {
          sessionStorage.setItem(storageKey, JSON.stringify(combined));
        } catch {
          // Ignore write errors (quota, incognito, etc.)
        }

        return combined;
      });
    },
    [storageKey]
  );

  const clearRecent = useCallback(() => {
    setRecentItems([]);
    try {
      sessionStorage.removeItem(storageKey);
    } catch {
      // Ignore errors
    }
  }, [storageKey]);

  return {
    recentItems,
    recordRecent,
    clearRecent,
  };
}
