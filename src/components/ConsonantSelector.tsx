import React from 'react';
import { HindiCharacter } from '../types/activity';

interface ConsonantSelectorProps {
  consonants: HindiCharacter[];
  selectedConsonant: HindiCharacter;
  onSelectConsonant: (consonant: HindiCharacter) => void;
}

export const ConsonantSelector: React.FC<ConsonantSelectorProps> = ({
  consonants,
  selectedConsonant,
  onSelectConsonant,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto my-3">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm md:text-base font-extrabold text-slate-700 flex items-center gap-1.5">
          <span className="w-6 h-6 rounded-full bg-toy-yellow text-slate-900 font-black text-xs flex items-center justify-center shadow-xs">
            1
          </span>
          <span>व्यंजन अक्षर चुनें:</span>
        </label>
        <span className="text-xs font-bold text-slate-400">
          चुना हुआ: <strong className="text-toy-blue-dark text-sm">{selectedConsonant.char}</strong>
        </span>
      </div>

      {/* Responsive horizontal wrapping flex grid */}
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 p-3 bg-amber-50/60 border-2 border-amber-200/80 rounded-3xl shadow-toy-sm">
        {consonants.map((item) => {
          const isSelected = item.char === selectedConsonant.char;
          return (
            <button
              key={item.id}
              onClick={() => onSelectConsonant(item)}
              className={`w-12 h-14 md:w-14 md:h-16 rounded-2xl font-black font-hindi text-2xl md:text-3xl transition-all duration-150 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-toy-yellow/60 select-none ${
                isSelected
                  ? 'bg-toy-yellow text-slate-900 border-4 border-toy-yellow-dark shadow-toy-md -translate-y-1 scale-105 animate-pop-in'
                  : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-toy-yellow hover:bg-amber-50/50 hover:-translate-y-0.5 active:translate-y-0.5 shadow-xs'
              }`}
              aria-label={`व्यंजन ${item.char}`}
              title={`अक्षर ${item.char} चुनें`}
            >
              {item.char}
            </button>
          );
        })}
      </div>
    </div>
  );
};
