import React from 'react';
import { Star, Flame, Sparkles, Award } from 'lucide-react';
import type { RewardSummary } from '../types/api';

export interface RewardFeedbackProps {
  rewards?: RewardSummary | null;
  isSubmitting?: boolean;
  error?: string | null;
  className?: string;
}

export const RewardFeedback: React.FC<RewardFeedbackProps> = ({
  rewards,
  isSubmitting = false,
  error = null,
  className = '',
}) => {
  // 1. Pending submission notice
  if (isSubmitting) {
    return (
      <div
        className={`w-full max-w-sm mx-auto my-3 flex items-center justify-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs md:text-sm font-bold py-2 px-3 rounded-2xl animate-pulse ${className}`}
      >
        <span className="animate-spin text-base">⏳</span>
        <span>प्रगति सहेजी जा रही है...</span>
      </div>
    );
  }

  // 2. Error notice (non-blocking)
  if (error) {
    return (
      <div
        className={`w-full max-w-sm mx-auto my-3 flex items-center justify-center gap-2 bg-slate-100 border border-slate-300 text-slate-600 text-xs md:text-sm font-semibold py-2 px-3 rounded-2xl ${className}`}
      >
        <span>⚠️</span>
        <span>{error}</span>
      </div>
    );
  }

  // 3. If no rewards returned (e.g. guest mode or not submitted), render nothing
  if (!rewards) {
    return null;
  }

  const { xpEarned, starsEarned, currentStreak, newBadges } = rewards;
  const hasBadges = Array.isArray(newBadges) && newBadges.length > 0;

  return (
    <div
      className={`w-full max-w-md mx-auto my-4 p-4 rounded-3xl bg-gradient-to-br from-amber-50/90 via-orange-50/70 to-yellow-50/90 border-2 border-toy-yellow/60 shadow-toy-sm text-center font-hindi animate-pop-in ${className}`}
    >
      <div className="flex items-center justify-center gap-1.5 mb-2">
        <Sparkles className="w-4 h-4 text-toy-yellow fill-toy-yellow" />
        <span className="text-xs md:text-sm font-black text-amber-900 tracking-wide">
          इनाम और प्रगति
        </span>
        <Sparkles className="w-4 h-4 text-toy-yellow fill-toy-yellow" />
      </div>

      {/* Rewards Pill Row */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
        {/* XP Earned */}
        {xpEarned > 0 && (
          <div className="flex items-center gap-1 bg-white border border-amber-200 text-amber-900 px-3 py-1.5 rounded-2xl text-xs md:text-sm font-black shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>+{xpEarned} XP</span>
          </div>
        )}

        {/* Stars Earned */}
        {starsEarned > 0 && (
          <div className="flex items-center gap-1 bg-white border border-yellow-200 text-yellow-900 px-3 py-1.5 rounded-2xl text-xs md:text-sm font-black shadow-xs">
            <Star className="w-3.5 h-3.5 text-toy-yellow fill-toy-yellow" />
            <span>{starsEarned} सितारे</span>
          </div>
        )}

        {/* Current Streak */}
        {currentStreak > 0 && (
          <div className="flex items-center gap-1 bg-white border border-orange-200 text-orange-900 px-3 py-1.5 rounded-2xl text-xs md:text-sm font-black shadow-xs">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            <span>{currentStreak} दिन की लय</span>
          </div>
        )}
      </div>

      {/* Newly Earned Badges */}
      {hasBadges && (
        <div className="mt-3 pt-2.5 border-t border-amber-200/70 flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-1 text-xs font-black text-amber-900">
            <Award className="w-3.5 h-3.5 text-toy-orange" />
            <span>नया बैज मिला!</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {newBadges.map((badge) => (
              <div
                key={badge.id}
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 font-extrabold text-xs px-3 py-1 rounded-full shadow-xs animate-bounce-short"
                title={badge.description}
              >
                <span>{badge.icon || '🏅'}</span>
                <span>{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
