import React from 'react';
import { PictureWordItem } from '../types/pictureMatch';
import { FeedbackType } from '../types/activity';
import { Check, X } from 'lucide-react';

interface ImageWordCardProps {
  item: PictureWordItem;
  index: number;
  isSelected: boolean;
  isWrong: boolean;
  feedback: FeedbackType;
  isQuestionAnswered: boolean;
  onSelect: (id: string) => void;
}

export const ImageWordCard: React.FC<ImageWordCardProps> = ({
  item,
  index,
  isSelected,
  isWrong,
  feedback,
  isQuestionAnswered,
  onSelect,
}) => {
  const isCorrect = isSelected && feedback === 'correct';
  const keyboardKeys = ['1', '2', '3'];

  // Card background and border color themes
  const colorThemes = [
    { border: 'border-toy-blue', bg: 'bg-blue-50', text: 'text-toy-blue-dark' },
    { border: 'border-toy-purple', bg: 'bg-purple-50', text: 'text-toy-purple-dark' },
    { border: 'border-toy-pink', bg: 'bg-pink-50', text: 'text-toy-pink-dark' },
  ];

  const currentTheme = colorThemes[index % colorThemes.length];

  let cardStyle = `bg-white border-4 ${currentTheme.border} text-slate-800 shadow-toy-lg hover:shadow-toy-xl hover:-translate-y-1 active:translate-y-1 active:shadow-toy-sm`;

  if (isCorrect) {
    cardStyle = 'bg-toy-mint border-4 border-toy-mint-dark text-white shadow-toy-lg animate-pop-in scale-105';
  } else if (isWrong) {
    cardStyle = 'bg-rose-50 border-4 border-rose-400 text-slate-400 opacity-60 shadow-toy-sm animate-shake cursor-not-allowed';
  }

  return (
    <button
      onClick={() => onSelect(item.id)}
      disabled={isQuestionAnswered || isWrong}
      className={`relative flex flex-col items-center justify-between p-4 md:p-6 rounded-3xl transition-all duration-200 w-full min-h-[190px] md:min-h-[230px] focus:outline-none focus:ring-4 focus:ring-toy-yellow/70 ${cardStyle}`}
      aria-label={`शब्द ${item.word}, विकल्प ${index + 1}`}
      title={`${item.word} चुनें (${keyboardKeys[index]})`}
    >
      {/* Keyboard Shortcut Badge */}
      <span className="absolute top-3 left-3 w-7 h-7 rounded-xl bg-slate-100/90 border border-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center shadow-sm">
        {keyboardKeys[index]}
      </span>

      {/* Status indicator on top right */}
      {isCorrect && (
        <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white text-toy-mint-dark flex items-center justify-center shadow-md animate-bounce-short">
          <Check className="w-5 h-5 stroke-[3]" />
        </span>
      )}
      {isWrong && (
        <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-rose-200 text-rose-600 flex items-center justify-center shadow-sm">
          <X className="w-5 h-5 stroke-[2.5]" />
        </span>
      )}

      {/* Large Visual Illustration / Emoji */}
      <div className="flex-1 flex items-center justify-center my-2">
        <span className="text-6xl md:text-7xl select-none filter drop-shadow-sm transform hover:scale-110 transition-transform">
          {item.emoji}
        </span>
      </div>

      {/* Hindi Word Label */}
      <div className="w-full text-center mt-1">
        <span
          className={`block text-2xl md:text-3xl lg:text-4xl font-extrabold font-hindi tracking-normal select-none ${
            isCorrect ? 'text-white' : 'text-slate-800'
          }`}
        >
          {item.word}
        </span>
        {/* Subtle English meaning hint */}
        <span
          className={`block text-xs font-semibold mt-0.5 ${
            isCorrect ? 'text-emerald-100' : 'text-slate-400'
          }`}
        >
          {item.meaning}
        </span>
      </div>
    </button>
  );
};
