import React from 'react';
import { SentenceWordItem } from '../types/sentenceBuilder';
import { Check, X } from 'lucide-react';

interface SentenceWordCardProps {
  word: SentenceWordItem;
  mode: 'available' | 'placed';
  isCorrect?: boolean;
  isIncorrect?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export const SentenceWordCard: React.FC<SentenceWordCardProps> = ({
  word,
  mode,
  isCorrect = false,
  isIncorrect = false,
  disabled = false,
  onClick,
}) => {
  let style = '';

  if (isCorrect) {
    style =
      'bg-gradient-to-r from-emerald-400 to-teal-500 text-white border-emerald-600 shadow-toy-md scale-105 animate-pop-in';
  } else if (isIncorrect) {
    style =
      'bg-rose-100 text-rose-800 border-rose-300 shadow-toy-sm animate-shake';
  } else if (mode === 'placed') {
    style =
      'bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-indigo-700 shadow-toy-md hover:from-indigo-600 hover:to-purple-700 active:scale-95';
  } else {
    // available
    style =
      'bg-white text-slate-800 border-slate-300 shadow-toy-md hover:border-toy-sky hover:text-toy-sky-dark hover:shadow-toy-lg hover:-translate-y-1 active:translate-y-1 active:shadow-toy-sm';
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-2xl font-black font-hindi text-xl sm:text-2xl md:text-3xl transition-all duration-200 border-3 select-none focus:outline-none focus:ring-4 focus:ring-toy-yellow/70 ${style}`}
      aria-label={`${mode === 'placed' ? 'चुना हुआ शब्द' : 'उपलब्ध शब्द'}: ${word.text}`}
      title={mode === 'placed' ? 'हटाने के लिए टैप करें' : 'वाक्य में जोड़ने के लिए टैप करें'}
    >
      <span>{word.text}</span>

      {mode === 'placed' && !isCorrect && !isIncorrect && (
        <span className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center text-white/90 text-xs ml-1">
          <X className="w-3 h-3 stroke-[3]" />
        </span>
      )}

      {isCorrect && (
        <span className="w-5 h-5 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-xs ml-1">
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </span>
      )}
    </button>
  );
};
