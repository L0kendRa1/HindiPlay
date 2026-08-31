import React from 'react';

export type ActivityMode = 'letter-quiz' | 'picture-match' | 'word-builder' | 'tracing' | 'picture-word-quiz';

interface ActivityNavProps {
  currentActivity: ActivityMode;
  onSelectActivity: (mode: ActivityMode) => void;
}

export const ActivityNav: React.FC<ActivityNavProps> = ({ currentActivity, onSelectActivity }) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 pt-3 pb-1 flex items-center justify-center">
      <nav
        aria-label="गतिविधि चुनें"
        className="flex items-center gap-1.5 md:gap-2 bg-white/90 backdrop-blur p-1.5 rounded-2xl border-2 border-slate-200 shadow-toy-sm flex-wrap justify-center"
      >
        <button
          onClick={() => onSelectActivity('letter-quiz')}
          className={`flex items-center gap-1.5 px-3 md:px-3.5 py-1.5 rounded-xl font-extrabold text-xs md:text-sm transition-all duration-200 ${
            currentActivity === 'letter-quiz'
              ? 'bg-gradient-to-r from-toy-yellow to-toy-orange text-slate-900 shadow-toy-sm scale-105'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span className="text-base md:text-lg">🔤</span>
          <span>1. पहचानो</span>
        </button>

        <button
          onClick={() => onSelectActivity('picture-match')}
          className={`flex items-center gap-1.5 px-3 md:px-3.5 py-1.5 rounded-xl font-extrabold text-xs md:text-sm transition-all duration-200 ${
            currentActivity === 'picture-match'
              ? 'bg-gradient-to-r from-toy-sky to-toy-blue text-white shadow-toy-sm scale-105'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span className="text-base md:text-lg">🥭</span>
          <span>2. मिलाओ</span>
        </button>

        <button
          onClick={() => onSelectActivity('word-builder')}
          className={`flex items-center gap-1.5 px-3 md:px-3.5 py-1.5 rounded-xl font-extrabold text-xs md:text-sm transition-all duration-200 ${
            currentActivity === 'word-builder'
              ? 'bg-gradient-to-r from-toy-purple to-toy-pink text-white shadow-toy-sm scale-105'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span className="text-base md:text-lg">🧩</span>
          <span>3. शब्द बनाओ</span>
        </button>

        <button
          onClick={() => onSelectActivity('tracing')}
          className={`flex items-center gap-1.5 px-3 md:px-3.5 py-1.5 rounded-xl font-extrabold text-xs md:text-sm transition-all duration-200 ${
            currentActivity === 'tracing'
              ? 'bg-gradient-to-r from-toy-mint to-emerald-600 text-white shadow-toy-sm scale-105'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span className="text-base md:text-lg">✏️</span>
          <span>4. अक्षर लिखो</span>
        </button>

        <button
          onClick={() => onSelectActivity('picture-word-quiz')}
          className={`flex items-center gap-1.5 px-3 md:px-3.5 py-1.5 rounded-xl font-extrabold text-xs md:text-sm transition-all duration-200 ${
            currentActivity === 'picture-word-quiz'
              ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-toy-sm scale-105'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span className="text-base md:text-lg">🖼️</span>
          <span>5. चित्र-शब्द</span>
        </button>
      </nav>
    </div>
  );
};
