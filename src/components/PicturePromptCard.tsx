import React from 'react';
import { PictureWordItem } from '../types/pictureMatch';
import { PictureImage } from './PictureImage';
import { Volume2, Sparkles } from 'lucide-react';

interface PicturePromptCardProps {
  item: PictureWordItem;
  onPlayAudio: () => void;
}

export const PicturePromptCard: React.FC<PicturePromptCardProps> = ({ item, onPlayAudio }) => {
  return (
    <div className="w-full max-w-md mx-auto my-3 bg-gradient-to-br from-amber-50 to-orange-50 border-4 border-toy-yellow p-5 rounded-3xl shadow-toy-lg text-center relative overflow-hidden animate-pop-in">
      {/* Decorative Sparkle */}
      <div className="absolute top-3 right-3 text-toy-yellow-dark opacity-60">
        <Sparkles className="w-5 h-5" />
      </div>

      {/* Large Illustrated Vector Image with Fallback */}
      <div className="flex items-center justify-center my-2">
        <PictureImage
          src={item.image}
          alt={item.word}
          fallbackEmoji={item.emoji}
          sizeClassName="w-28 h-28 md:w-36 md:h-36"
        />
      </div>

      {/* Question Prompt */}
      <h2 className="text-xl md:text-2xl font-black font-hindi text-slate-800 tracking-tight">
        यह क्या है?
      </h2>

      {/* Audio Button */}
      <div className="mt-2 flex items-center justify-center">
        <button
          onClick={onPlayAudio}
          className="inline-flex items-center gap-1.5 bg-white border-2 border-toy-yellow text-slate-700 px-3.5 py-1 rounded-full font-bold text-xs md:text-sm shadow-xs hover:bg-amber-50 active:scale-95 transition-all"
          title="आवाज़ सुनें"
        >
          <Volume2 className="w-4 h-4 text-toy-orange" />
          <span>सुनो 🔊</span>
        </button>
      </div>
    </div>
  );
};
