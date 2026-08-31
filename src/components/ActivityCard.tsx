import React from 'react';
import { ActivityMeta } from '../data/activityRegistry';
import { Star, ArrowRight } from 'lucide-react';

interface ActivityCardProps {
  activity: ActivityMeta;
  onClick: () => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onClick }) => {
  const { theme } = activity;

  return (
    <button
      onClick={onClick}
      className={`relative group flex flex-col justify-between p-5 md:p-6 rounded-3xl border-4 ${theme.border} ${theme.bg} bg-white shadow-toy-lg hover:shadow-toy-xl hover:-translate-y-1.5 active:translate-y-1 active:shadow-toy-sm transition-all duration-200 text-left w-full focus:outline-none focus:ring-4 focus:ring-toy-yellow/70`}
      aria-label={`गतिविधि: ${activity.title}`}
    >
      <div>
        {/* Top bar: Category Badge + Difficulty Stars */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-extrabold shadow-xs ${theme.badgeBg} ${theme.badgeText}`}
          >
            {activity.categoryDisplayLabel}
          </span>

          <div className="flex items-center gap-0.5">
            {Array.from({ length: activity.difficultyStars }).map((_, idx) => (
              <Star key={idx} className="w-4 h-4 fill-toy-yellow text-toy-yellow-dark" />
            ))}
          </div>
        </div>

        {/* Large Central Illustration Icon */}
        <div className="text-6xl md:text-7xl my-2 text-center select-none transform group-hover:scale-110 transition-transform filter drop-shadow-sm">
          {activity.icon}
        </div>

        {/* Activity Title */}
        <h3 className="text-xl md:text-2xl font-black font-hindi text-slate-800 tracking-tight mt-2 text-center group-hover:text-toy-orange-dark transition-colors">
          {activity.title}
        </h3>

        {/* Short Subtitle */}
        <p className="text-xs md:text-sm font-bold text-slate-600 mt-1 text-center line-clamp-2">
          {activity.subtitle}
        </p>
      </div>

      {/* Action Prompt */}
      <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-center gap-1.5 text-xs md:text-sm font-extrabold text-slate-700 group-hover:text-slate-900">
        <span>गतिविधि देखें</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </button>
  );
};
