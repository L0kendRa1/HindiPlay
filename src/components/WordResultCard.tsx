import React from 'react';
import { WordBuilderWord } from '../types/wordBuilder';
import { Volume2, Sparkles } from 'lucide-react';
import { audioService } from '../services/audioService';

interface WordResultCardProps {
  word: WordBuilderWord;
  onPlayAudio?: () => void;
}

export const WordResultCard: React.FC<WordResultCardProps> = ({ word, onPlayAudio }) => {
  const handlePlay = () => {
    if (onPlayAudio) {
      onPlayAudio();
    } else {
      audioService.playWordAudio(word.word);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-3 bg-gradient-to-br from-emerald-50 to-teal-50 border-4 border-toy-mint p-5 rounded-3xl shadow-toy-lg animate-pop-in text-center relative overflow-hidden">
      {/* Decorative sparkle */}
      <div className="absolute top-3 right-3 text-toy-mint">
        <Sparkles className="w-6 h-6 animate-spin" />
      </div>

      {/* Large Emoji / Visual */}
      <div className="text-6xl md:text-7xl my-1 transform hover:scale-110 transition-transform select-none">
        {word.emoji}
      </div>

      {/* Complete Hindi Word */}
      <h3 className="text-4xl md:text-5xl font-black font-hindi text-slate-800 tracking-wide mt-1">
        {word.word}
      </h3>

      {/* Audio Button */}
      <button
        onClick={handlePlay}
        className="inline-flex items-center gap-2 bg-toy-mint text-white px-4 py-2 rounded-2xl font-extrabold text-sm md:text-base my-2 shadow-toy-sm hover:bg-toy-mint-dark transition-all active:translate-y-0.5"
        title="शब्द का उच्चारण सुनें"
      >
        <Volume2 className="w-5 h-5" />
        <span>सुनो 🔊</span>
      </button>

      {/* Meaning description */}
      <p className="text-sm md:text-base font-bold text-slate-600 mt-1 bg-white/70 px-4 py-2 rounded-2xl border border-emerald-100">
        {word.meaning}
      </p>
    </div>
  );
};
