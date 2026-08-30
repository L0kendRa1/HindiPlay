import React from 'react';
import { WordLengthOption } from '../types/wordBuilder';
import { Star, Sparkles } from 'lucide-react';

interface WordLengthSelectorProps {
  options: WordLengthOption[];
  onSelect: (unitCount: number) => void;
}

export const WordLengthSelector: React.FC<WordLengthSelectorProps> = ({ options, onSelect }) => {
  const cardThemes = [
    {
      border: 'border-toy-orange',
      badgeBg: 'bg-toy-orange',
      badgeText: 'text-white',
      bg: 'bg-amber-50/60',
      shadow: 'hover:shadow-toy-xl',
    },
    {
      border: 'border-toy-sky',
      badgeBg: 'bg-toy-sky-dark',
      badgeText: 'text-white',
      bg: 'bg-sky-50/60',
      shadow: 'hover:shadow-toy-xl',
    },
    {
      border: 'border-toy-purple',
      badgeBg: 'bg-toy-purple',
      badgeText: 'text-white',
      bg: 'bg-purple-50/60',
      shadow: 'hover:shadow-toy-xl',
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto my-6 px-4 animate-pop-in">
      {/* Title & Banner */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-toy-yellow to-toy-orange text-slate-900 px-5 py-2 rounded-full font-extrabold text-sm md:text-base shadow-toy-sm mb-2">
          <Sparkles className="w-4 h-4" />
          <span>कठिनाई चुनें (Select Difficulty)</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black font-hindi text-slate-800 tracking-tight">
          कितने अक्षर का शब्द बनाना है?
        </h2>
        <p className="text-xs md:text-sm font-semibold text-slate-500 mt-1">
          जितने अक्षर चुनेंगे, उतने ही टुकड़ों को जोड़कर शब्द बनेगा!
        </p>
      </div>

      {/* Difficulty Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
        {options.map((opt, idx) => {
          const theme = cardThemes[idx % cardThemes.length];

          return (
            <button
              key={opt.unitCount}
              onClick={() => onSelect(opt.unitCount)}
              className={`relative flex flex-col items-center justify-between p-6 rounded-3xl border-4 ${theme.border} ${theme.bg} bg-white shadow-toy-lg ${theme.shadow} hover:-translate-y-1.5 active:translate-y-1 active:shadow-toy-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-toy-yellow/70 group`}
            >
              {/* Keyboard index tag */}
              <span className="absolute top-3 left-3 w-6 h-6 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 font-extrabold text-xs flex items-center justify-center shadow-xs">
                {idx + 1}
              </span>

              {/* Star Rating Badge */}
              <div className="flex items-center justify-center gap-1 my-2">
                {Array.from({ length: opt.stars }).map((_, sIdx) => (
                  <Star key={sIdx} className="w-5 h-5 fill-toy-yellow text-toy-yellow-dark" />
                ))}
              </div>

              {/* Main Label */}
              <span className="text-3xl md:text-4xl font-black font-hindi text-slate-800 my-2 group-hover:scale-105 transition-transform">
                {opt.label}
              </span>

              {/* Preview Word Chips */}
              <div className="mt-3 flex items-center justify-center gap-1.5 flex-wrap">
                {opt.examples.map((ex, eIdx) => (
                  <span
                    key={eIdx}
                    className="bg-white border border-slate-200 text-slate-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full shadow-xs"
                  >
                    {ex}
                  </span>
                ))}
              </div>

              {/* Action Prompt */}
              <div
                className={`mt-4 w-full py-2 rounded-2xl font-extrabold text-xs md:text-sm ${theme.badgeBg} ${theme.badgeText} shadow-toy-sm group-hover:opacity-95 transition-opacity`}
              >
                शुरू करें ➔
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
