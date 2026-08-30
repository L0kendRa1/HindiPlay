import React from 'react';
import { Star, Circle } from 'lucide-react';

interface ProgressBarProps {
  currentIndex: number;
  totalQuestions: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentIndex, totalQuestions }) => {
  return (
    <div className="w-full max-w-xl mx-auto px-4 py-2">
      <div className="flex items-center justify-between text-xs md:text-sm font-bold text-slate-600 mb-2">
        <span className="bg-slate-100 border border-slate-200 px-3 py-1 rounded-full text-slate-700">
          प्रश्न {currentIndex + 1} / {totalQuestions}
        </span>
        <span className="text-toy-mint-dark font-extrabold text-sm">
          {Math.round(((currentIndex) / totalQuestions) * 100)}% पूरा
        </span>
      </div>

      {/* Progress Dots / Stars */}
      <div className="flex items-center justify-between gap-1.5 bg-white p-2.5 rounded-2xl border-2 border-slate-100 shadow-toy-sm">
        {Array.from({ length: totalQuestions }).map((_, idx) => {
          const isPast = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div
              key={idx}
              className={`flex-1 h-3 rounded-full transition-all duration-300 flex items-center justify-center ${
                isPast
                  ? 'bg-toy-yellow scale-100'
                  : isCurrent
                  ? 'bg-toy-blue scale-110 shadow-sm ring-2 ring-toy-sky'
                  : 'bg-slate-200 opacity-60'
              }`}
              title={`प्रश्न ${idx + 1}`}
            >
              {isPast && (
                <Star className="w-2.5 h-2.5 text-white fill-white" />
              )}
              {isCurrent && (
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
              )}
              {!isPast && !isCurrent && (
                <Circle className="w-1.5 h-1.5 text-slate-400" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
