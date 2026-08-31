import React from 'react';
import { PictureWordItem } from '../types/pictureMatch';
import { Check, X } from 'lucide-react';

interface WordOptionCardProps {
  option: PictureWordItem;
  index: number;
  isSelected: boolean;
  isCorrect: boolean;
  isWrong: boolean;
  disabled: boolean;
  onClick: () => void;
}

export const WordOptionCard: React.FC<WordOptionCardProps> = ({
  option,
  index,
  isSelected,
  isCorrect,
  isWrong,
  disabled,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isWrong}
      className={`relative group flex items-center justify-between px-6 py-4 md:py-5 w-full rounded-3xl font-black font-hindi text-3xl md:text-4xl transition-all duration-200 border-4 ${
        isCorrect
          ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white border-emerald-600 shadow-toy-lg scale-105 animate-pop-in'
          : isWrong
          ? 'bg-slate-100 border-rose-200 text-slate-400 shadow-none cursor-not-allowed opacity-50'
          : isSelected
          ? 'bg-toy-yellow text-slate-900 border-toy-yellow-dark shadow-toy-md'
          : 'bg-white border-slate-200 text-slate-800 shadow-toy-lg hover:border-toy-sky hover:shadow-toy-xl hover:-translate-y-1 active:translate-y-1 active:shadow-toy-sm'
      }`}
      aria-label={`विकल्प ${index + 1}: ${option.word}`}
    >
      {/* Keyboard Shortcut Badge */}
      <span
        className={`w-7 h-7 md:w-8 md:h-8 rounded-xl flex items-center justify-center font-bold text-xs md:text-sm border ${
          isCorrect
            ? 'bg-emerald-600 text-white border-emerald-700'
            : isWrong
            ? 'bg-slate-200 text-slate-400 border-slate-300'
            : 'bg-slate-100 text-slate-600 border-slate-200 group-hover:bg-toy-sky/20 group-hover:text-toy-sky-dark'
        }`}
      >
        {index + 1}
      </span>

      {/* Main Devanagari Word */}
      <span className="flex-1 text-center select-none tracking-normal">
        {option.word}
      </span>

      {/* Status Icon Indicator */}
      <div className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center">
        {isCorrect && (
          <div className="w-7 h-7 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-xs">
            <Check className="w-5 h-5 stroke-[3]" />
          </div>
        )}
        {isWrong && (
          <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center">
            <X className="w-4 h-4 stroke-[3]" />
          </div>
        )}
      </div>
    </button>
  );
};
