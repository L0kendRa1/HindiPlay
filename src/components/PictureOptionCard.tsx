import React from 'react';
import { PictureWordItem } from '../types/pictureMatch';
import { PictureImage } from './PictureImage';
import { Check, X } from 'lucide-react';

interface PictureOptionCardProps {
  option: PictureWordItem;
  index: number;
  isCorrect: boolean;
  isWrong: boolean;
  disabled: boolean;
  onClick: () => void;
}

export const PictureOptionCard: React.FC<PictureOptionCardProps> = ({
  option,
  index,
  isCorrect,
  isWrong,
  disabled,
  onClick,
}) => {
  const keyboardKeys = ['1', '2', '3'];

  // Card themes
  const colorThemes = [
    { border: 'border-toy-blue', bg: 'bg-blue-50', hover: 'hover:border-toy-blue-dark' },
    { border: 'border-toy-purple', bg: 'bg-purple-50', hover: 'hover:border-toy-purple-dark' },
    { border: 'border-toy-pink', bg: 'bg-pink-50', hover: 'hover:border-toy-pink-dark' },
  ];

  const currentTheme = colorThemes[index % colorThemes.length];

  let cardStyle = `bg-white border-4 ${currentTheme.border} text-slate-800 shadow-toy-lg hover:shadow-toy-xl hover:-translate-y-1 active:translate-y-1 active:shadow-toy-sm`;

  if (isCorrect) {
    cardStyle = 'bg-gradient-to-br from-emerald-50 to-teal-50 border-4 border-toy-mint text-emerald-900 shadow-toy-lg animate-pop-in scale-105';
  } else if (isWrong) {
    cardStyle = 'bg-rose-50 border-4 border-rose-300 text-slate-400 opacity-60 shadow-toy-sm animate-shake cursor-not-allowed';
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || isWrong}
      className={`relative flex flex-col items-center justify-between p-4 md:p-5 rounded-3xl transition-all duration-200 w-full min-h-[170px] md:min-h-[200px] focus:outline-none focus:ring-4 focus:ring-toy-yellow/70 ${cardStyle}`}
      aria-label={`चित्र विकल्प ${index + 1}: ${option.meaning}`}
      title={`चित्र चुनें (${keyboardKeys[index]})`}
    >
      {/* Keyboard Shortcut Badge */}
      <span className="absolute top-3 left-3 w-7 h-7 rounded-xl bg-slate-100/90 border border-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center shadow-xs">
        {keyboardKeys[index]}
      </span>

      {/* Status indicator on top right */}
      {isCorrect && (
        <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-toy-mint text-white flex items-center justify-center shadow-md animate-bounce-short">
          <Check className="w-5 h-5 stroke-[3]" />
        </span>
      )}
      {isWrong && (
        <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-rose-200 text-rose-600 flex items-center justify-center shadow-xs">
          <X className="w-5 h-5 stroke-[2.5]" />
        </span>
      )}

      {/* Visual Vector Illustration */}
      <div className="flex-1 flex items-center justify-center my-2 w-full">
        <PictureImage
          src={option.image}
          alt={option.word}
          fallbackEmoji={option.emoji}
          sizeClassName="w-20 h-20 md:w-24 md:h-24"
        />
      </div>

      {/* Educational Label: Reveals Hindi word only when solved correctly for reinforcement */}
      <div className="w-full text-center mt-1 min-h-[24px]">
        {isCorrect ? (
          <span className="text-xl md:text-2xl font-black font-hindi text-emerald-700 animate-pop-in">
            {option.word}
          </span>
        ) : (
          <span className="text-xs font-semibold text-slate-400">
            {option.meaning}
          </span>
        )}
      </div>
    </button>
  );
};
