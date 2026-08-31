import React, { useEffect, useRef } from 'react';
import { ActivityMeta } from '../data/activityRegistry';
import { Star, Play, X, Target, Sparkles } from 'lucide-react';

interface ActivityPreviewModalProps {
  activity: ActivityMeta;
  onStart: () => void;
  onBack: () => void;
}

export const ActivityPreviewModal: React.FC<ActivityPreviewModalProps> = ({
  activity,
  onStart,
  onBack,
}) => {
  const startButtonRef = useRef<HTMLButtonElement | null>(null);

  // Auto-focus the prominent start button
  useEffect(() => {
    startButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onBack();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onStart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStart, onBack]);

  const { theme } = activity;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-pop-in">
      <div
        className={`relative w-full max-w-lg bg-white rounded-3xl border-4 ${theme.border} shadow-toy-xl p-6 md:p-8 flex flex-col items-center text-center overflow-hidden`}
      >
        {/* Top Close / Back button */}
        <button
          onClick={onBack}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
          title="वापस जाएँ (Esc)"
          aria-label="वापस जाएँ"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Category Pill */}
        <div className="flex items-center gap-2 mb-2">
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

        {/* Big Illustration Icon */}
        <div className="text-7xl md:text-8xl my-3 select-none filter drop-shadow-md animate-bounce-gentle">
          {activity.icon}
        </div>

        {/* Title & Subtitle */}
        <h2 className="text-2xl md:text-3xl font-black font-hindi text-slate-800 tracking-tight">
          {activity.title}
        </h2>
        <p className="text-sm md:text-base font-bold text-toy-orange-dark mt-0.5">
          {activity.subtitle}
        </p>

        {/* Description Box */}
        <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 my-4 text-left">
          <p className="text-xs md:text-sm font-semibold text-slate-700 leading-relaxed mb-2">
            {activity.description}
          </p>

          <div className="flex items-start gap-2 pt-2 border-t border-slate-200 text-xs font-bold text-slate-600">
            <Target className="w-4 h-4 text-toy-purple shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-800">उद्देश्य: </strong>
              {activity.objective}
            </span>
          </div>
        </div>

        {/* Prominent "शुरू करें" Action Button */}
        <button
          ref={startButtonRef}
          onClick={onStart}
          className={`w-full py-3.5 md:py-4 px-8 rounded-2xl font-black font-hindi text-xl md:text-2xl text-white bg-gradient-to-r ${theme.buttonGradient} shadow-toy-lg hover:shadow-toy-xl hover:-translate-y-1 active:translate-y-1 active:shadow-toy-sm transition-all duration-200 flex items-center justify-center gap-3 focus:outline-none focus:ring-4 focus:ring-toy-yellow/80 group`}
        >
          <Sparkles className="w-6 h-6 animate-spin text-toy-yellow" />
          <span>शुरू करें</span>
          <Play className="w-6 h-6 fill-white group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Cancel / Back Link */}
        <button
          onClick={onBack}
          className="mt-3 text-xs md:text-sm font-bold text-slate-400 hover:text-slate-700 transition-colors"
        >
          वापस पुस्तकालय में जाएँ
        </button>
      </div>
    </div>
  );
};
