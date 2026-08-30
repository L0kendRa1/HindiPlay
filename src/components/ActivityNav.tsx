import React from 'react';

export type ActivityMode = 'letter-quiz' | 'picture-match';

interface ActivityNavProps {
  currentActivity: ActivityMode;
  onSelectActivity: (mode: ActivityMode) => void;
}

export const ActivityNav: React.FC<ActivityNavProps> = ({ currentActivity, onSelectActivity }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 pt-3 pb-1 flex items-center justify-center">
      <nav
        aria-label="गतिविधि चुनें"
        className="flex items-center gap-2 bg-white/80 backdrop-blur p-1.5 rounded-2xl border-2 border-slate-200 shadow-toy-sm"
      >
        <button
          onClick={() => onSelectActivity('letter-quiz')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-extrabold text-sm md:text-base transition-all duration-200 ${
            currentActivity === 'letter-quiz'
              ? 'bg-gradient-to-r from-toy-yellow to-toy-orange text-slate-900 shadow-toy-sm scale-105'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span className="text-lg">🔤</span>
          <span>1. अक्षर पहचानो</span>
        </button>

        <button
          onClick={() => onSelectActivity('picture-match')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-extrabold text-sm md:text-base transition-all duration-200 ${
            currentActivity === 'picture-match'
              ? 'bg-gradient-to-r from-toy-sky to-toy-blue text-white shadow-toy-sm scale-105'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span className="text-lg">🥭</span>
          <span>2. अक्षर और चित्र मिलाओ</span>
        </button>
      </nav>
    </div>
  );
};
