import React from 'react';
import { MemoryDifficulty, MEMORY_DIFFICULTIES } from '../types/memoryGame';
import { Star } from 'lucide-react';

interface MemoryDifficultySelectorProps {
  currentDifficulty: MemoryDifficulty;
  onSelectDifficulty: (difficulty: MemoryDifficulty) => void;
  disabled?: boolean;
}

export const MemoryDifficultySelector: React.FC<MemoryDifficultySelectorProps> = ({
  currentDifficulty,
  onSelectDifficulty,
  disabled = false,
}) => {
  const difficulties: MemoryDifficulty[] = ['easy', 'medium', 'hard'];

  return (
    <div className="flex items-center justify-center gap-2 bg-white/80 backdrop-blur-xs p-1.5 rounded-2xl border-2 border-slate-200 shadow-toy-sm max-w-lg mx-auto mb-3">
      {difficulties.map((diffKey) => {
        const config = MEMORY_DIFFICULTIES[diffKey];
        const isActive = currentDifficulty === diffKey;

        return (
          <button
            key={diffKey}
            onClick={() => onSelectDifficulty(diffKey)}
            disabled={disabled}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-black font-hindi text-xs md:text-sm transition-all duration-200 ${
              isActive
                ? 'bg-gradient-to-r from-toy-yellow to-toy-orange text-slate-900 shadow-toy-sm border-2 border-toy-orange scale-105'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-2 border-transparent'
            }`}
            title={config.description}
          >
            <span>{config.label}</span>
            <div className="flex items-center">
              {Array.from({ length: config.stars }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    isActive ? 'text-slate-900 fill-slate-900' : 'text-slate-400 fill-slate-400'
                  }`}
                />
              ))}
            </div>
            <span className="hidden sm:inline text-[11px] opacity-75">
              ({config.pairsCount})
            </span>
          </button>
        );
      })}
    </div>
  );
};
