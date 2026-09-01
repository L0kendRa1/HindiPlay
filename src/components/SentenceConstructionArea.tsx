import React from 'react';
import { SentenceWordItem } from '../types/sentenceBuilder';
import { SentenceWordCard } from './SentenceWordCard';
import { Sparkles } from 'lucide-react';

interface SentenceConstructionAreaProps {
  placedWords: SentenceWordItem[];
  totalExpectedCount: number;
  isCorrect: boolean;
  isIncorrect: boolean;
  onRemoveWord: (word: SentenceWordItem) => void;
}

export const SentenceConstructionArea: React.FC<SentenceConstructionAreaProps> = ({
  placedWords,
  totalExpectedCount,
  isCorrect,
  isIncorrect,
  onRemoveWord,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto my-3 bg-white/90 backdrop-blur-xs border-4 border-toy-purple rounded-3xl p-4 sm:p-6 shadow-toy-lg transition-all">
      {/* Title & Slot Counter */}
      <div className="flex items-center justify-between mb-3 text-xs md:text-sm font-extrabold text-slate-500">
        <div className="flex items-center gap-1.5 text-purple-700">
          <Sparkles className="w-4 h-4" />
          <span>आपका वाक्य:</span>
        </div>
        <span className="bg-purple-100 text-purple-800 px-3 py-0.5 rounded-full">
          {placedWords.length} / {totalExpectedCount} शब्द
        </span>
      </div>

      {/* Words Construction Tray */}
      <div className="min-h-[70px] sm:min-h-[85px] flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-3 bg-purple-50/50 rounded-2xl border-2 border-dashed border-purple-200">
        {placedWords.length === 0 ? (
          <p className="text-sm md:text-base font-bold text-purple-400 select-none text-center">
            नीचे दिए गए शब्दों पर टैप करके वाक्य पूरा करें 👇
          </p>
        ) : (
          placedWords.map((word) => (
            <SentenceWordCard
              key={word.id}
              word={word}
              mode="placed"
              isCorrect={isCorrect}
              isIncorrect={isIncorrect}
              disabled={isCorrect}
              onClick={() => onRemoveWord(word)}
            />
          ))
        )}

        {/* Decorative Hindi Punctuation '।' when sentence complete */}
        {placedWords.length === totalExpectedCount && (
          <span className="text-3xl font-black font-hindi text-purple-600 select-none ml-1">
            ।
          </span>
        )}
      </div>
    </div>
  );
};
