import React from 'react';
import { MemoryCardItem } from '../types/memoryGame';
import { PictureImage } from './PictureImage';
import { Check, Sparkles } from 'lucide-react';

interface MemoryCardProps {
  card: MemoryCardItem;
  index: number;
  isFlipped: boolean;
  isMatched: boolean;
  disabled: boolean;
  onClick: () => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({
  card,
  index,
  isFlipped,
  isMatched,
  disabled,
  onClick,
}) => {
  const isOpen = isFlipped || isMatched;

  return (
    <button
      onClick={onClick}
      disabled={disabled || isOpen}
      className={`relative w-full aspect-[3/4] rounded-3xl transition-all duration-300 transform select-none focus:outline-none focus:ring-4 focus:ring-toy-yellow/70 ${
        isMatched
          ? 'bg-gradient-to-br from-emerald-50 to-teal-100 border-4 border-toy-mint shadow-toy-md scale-95 opacity-90'
          : isOpen
          ? 'bg-white border-4 border-toy-blue shadow-toy-xl scale-100 rotate-0'
          : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 border-4 border-white/80 shadow-toy-lg hover:shadow-toy-xl hover:-translate-y-1 active:translate-y-1 active:shadow-toy-sm'
      }`}
      aria-label={`कार्ड ${index + 1}: ${
        isOpen ? (card.type === 'word' ? `शब्द ${card.word}` : `चित्र ${card.meaning}`) : 'बंद कार्ड'
      }`}
    >
      {isOpen ? (
        /* --- FACE UP CONTENT --- */
        <div className="w-full h-full flex flex-col items-center justify-between p-3 md:p-4 animate-pop-in">
          {/* Top Badge: Type Indicator */}
          <div className="w-full flex items-center justify-between">
            <span
              className={`text-[10px] md:text-xs font-black px-2 py-0.5 rounded-full ${
                card.type === 'word'
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : 'bg-sky-100 text-sky-700 border border-sky-200'
              }`}
            >
              {card.type === 'word' ? '📖 शब्द' : '🖼️ चित्र'}
            </span>

            {isMatched && (
              <span className="w-6 h-6 rounded-full bg-toy-mint text-white flex items-center justify-center shadow-xs">
                <Check className="w-4 h-4 stroke-[3]" />
              </span>
            )}
          </div>

          {/* Main Card Center Content */}
          <div className="flex-1 flex items-center justify-center w-full my-1">
            {card.type === 'word' ? (
              <span className="text-2xl sm:text-3xl md:text-4xl font-black font-hindi text-slate-800 tracking-wide text-center drop-shadow-xs">
                {card.word}
              </span>
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center">
                <PictureImage
                  src={card.image}
                  alt={card.word}
                  fallbackEmoji={card.emoji}
                  sizeClassName="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
                />
              </div>
            )}
          </div>

          {/* Bottom Hint / Meaning Label */}
          <span className="text-[11px] md:text-xs font-bold text-slate-400">
            {isMatched ? card.word : 'मिलाओ'}
          </span>
        </div>
      ) : (
        /* --- FACE DOWN CONTENT (Card Back) --- */
        <div className="w-full h-full flex flex-col items-center justify-center p-3 text-white">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/20 backdrop-blur-xs border-2 border-white/40 flex items-center justify-center shadow-inner mb-1.5">
            <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-toy-yellow fill-toy-yellow animate-pulse" />
          </div>
          <span className="text-[11px] md:text-xs font-black tracking-wider uppercase opacity-90">
            HindiPlay
          </span>
          <span className="text-[16px] md:text-[18px] opacity-75">🃏</span>
        </div>
      )}
    </button>
  );
};
