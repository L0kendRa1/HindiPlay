import React from 'react';
import { StoryDifficulty, STORY_DIFFICULTIES } from '../types/readingComprehension';
import { Star } from 'lucide-react';

interface StoryDifficultySelectorProps {
  currentDifficulty: StoryDifficulty;
  onSelectDifficulty: (difficulty: StoryDifficulty) => void;
  disabled?: boolean;
}

export const StoryDifficultySelector: React.FC<StoryDifficultySelectorProps> = ({
  currentDifficulty,
  onSelectDifficulty,
  disabled = false,
}) => {
  const difficulties: StoryDifficulty[] = ['easy', 'medium', 'hard'];

  return (
    <div className="flex items-center justify-center gap-2 bg-white/80 backdrop-blur-xs p-1.5 rounded-2xl border-2 border-slate-200 shadow-toy-sm max-w-lg mx-auto mb-3">
      {difficulties.map((diffKey) => {
        const config = STORY_DIFFICULTIES[diffKey];
        const isActive = currentDifficulty === diffKey;

        return (
          <button
            key={diffKey}
            onClick={() => onSelectDifficulty(diffKey)}
            disabled={disabled}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-black font-hindi text-xs md:text-sm transition-all duration-200 ${
              isActive
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-toy-sm border-2 border-amber-700 scale-105'
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
                    isActive ? 'text-toy-yellow fill-toy-yellow' : 'text-slate-400 fill-slate-400'
                  }`}
                />
              ))}
            </div>
            <span className="hidden sm:inline text-[11px] opacity-80">
              ({config.sentenceCountLabel})
            </span>
          </button>
        );
      })}
    </div>
  );
};
