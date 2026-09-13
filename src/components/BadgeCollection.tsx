import React from 'react';
import { Badge } from '../types/api';
import { Award, CheckCircle2, Lock } from 'lucide-react';

interface BadgeCollectionProps {
  badges: Badge[];
  earnedCount: number;
  totalBadges: number;
}

export const BadgeCollection: React.FC<BadgeCollectionProps> = ({
  badges,
  earnedCount,
  totalBadges,
}) => {
  // Format date helper (Hindi locale friendly)
  const formatEarnedDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('hi-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border-2 border-slate-200 shadow-sm select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-white flex items-center justify-center shadow-xs text-xl">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-black text-slate-800">
              बैज संग्रह (Badges)
            </h3>
            <p className="text-xs font-bold text-slate-500">
              आपकी उपलब्धियों के पदक
            </p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1 rounded-full text-xs font-black">
          {earnedCount} / {totalBadges} मिले
        </div>
      </div>

      {/* Empty State: If no badges are earned */}
      {earnedCount === 0 ? (
        <div className="bg-amber-50/60 border-2 border-dashed border-amber-200 rounded-2xl p-6 text-center">
          <div className="text-3xl mb-2">🌱</div>
          <p className="text-sm font-black text-amber-900 mb-1">
            अभी कोई बैज नहीं मिला। अभ्यास करते रहें! 🌱
          </p>
          <p className="text-xs font-bold text-amber-700/80">
            गतिविधियाँ पूरी करने और नियमित अभ्यास से नए बैज अनलॉक होंगे।
          </p>
        </div>
      ) : null}

      {/* Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3">
        {badges.map((badge) => {
          const isEarned = badge.isEarned;
          const formattedDate = formatEarnedDate(badge.earnedAt);

          return (
            <div
              key={badge.id}
              className={`relative rounded-2xl p-3.5 flex flex-col items-center text-center transition-all ${
                isEarned
                  ? 'bg-gradient-to-b from-amber-50/80 to-white border-2 border-amber-300 shadow-xs hover:shadow-md'
                  : 'bg-slate-50 border-2 border-slate-200/80 opacity-60'
              }`}
            >
              {/* Earned / Lock Status Pill */}
              <div className="absolute top-2.5 right-2.5">
                {isEarned ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>

              {/* Badge Icon */}
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-2.5 shadow-2xs ${
                  isEarned
                    ? 'bg-gradient-to-tr from-amber-100 to-amber-200 border border-amber-300'
                    : 'bg-slate-200 border border-slate-300 grayscale'
                }`}
              >
                <span>{badge.icon || '🏅'}</span>
              </div>

              {/* Badge Name */}
              <h4 className="text-xs md:text-sm font-black text-slate-800 leading-tight mb-1">
                {badge.name}
              </h4>

              {/* Badge Description */}
              <p className="text-[11px] font-bold text-slate-500 leading-tight mb-2 line-clamp-2">
                {badge.description}
              </p>

              {/* Earned Date or Unearned Notice */}
              <div className="mt-auto pt-1 w-full border-t border-slate-200/60">
                {isEarned && formattedDate ? (
                  <span className="text-[10px] font-black text-amber-700 block">
                    {formattedDate}
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-400 block">
                    अनलॉक नहीं हुआ
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
