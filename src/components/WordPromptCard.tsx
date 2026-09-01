import React from 'react';
import { PictureWordItem } from '../types/pictureMatch';
import { Volume2, Sparkles } from 'lucide-react';

interface WordPromptCardProps {
  item: PictureWordItem;
  onPlayAudio: () => void;
}

export const WordPromptCard: React.FC<WordPromptCardProps> = ({ item, onPlayAudio }) => {
  return (
    <div className="w-full max-w-md mx-auto my-3 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-4 border-toy-purple p-5 rounded-3xl shadow-toy-lg text-center relative overflow-hidden animate-pop-in">
      {/* Decorative Sparkle */}
      <div className="absolute top-3 right-3 text-toy-purple opacity-60">
        <Sparkles className="w-5 h-5 animate-spin" />
      </div>

      <span className="inline-block bg-toy-purple text-white text-xs md:text-sm font-extrabold px-3 py-1 rounded-full mb-1 shadow-xs">
        📖 शब्द पढ़ें
      </span>

      {/* Large Devanagari Word Prompt */}
      <div className="my-2 select-none">
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-black font-hindi text-slate-800 tracking-wide filter drop-shadow-sm">
          {item.word}
        </h2>
      </div>

      {/* Audio Button */}
      <div className="my-2 flex items-center justify-center">
        <button
          onClick={onPlayAudio}
          className="inline-flex items-center gap-2 bg-toy-purple text-white px-4 py-2 rounded-2xl font-black text-sm md:text-base shadow-toy-sm hover:bg-toy-purple-dark active:scale-95 transition-all"
          title="शब्द का उच्चारण सुनें"
          aria-label={`शब्द ${item.word} का उच्चारण सुनें`}
        >
          <Volume2 className="w-4 h-4" />
          <span>सुनो 🔊</span>
        </button>
      </div>

      {/* Question Prompt */}
      <p className="text-base md:text-lg font-black font-hindi text-slate-700 mt-2 border-t border-purple-200/60 pt-2">
        कौन सा चित्र सही है?
      </p>
    </div>
  );
};
