import React from 'react';
import { HindiCharacter } from '../types/activity';
import { HindiUnit } from '../types/wordBuilder';
import { MatraDefinition } from '../data/matras';
import { Volume2, Sparkles, BookOpen } from 'lucide-react';

interface MatraResultCardProps {
  consonant: HindiCharacter;
  matra: MatraDefinition | null;
  unit: HindiUnit;
  isAudioPlaying: boolean;
  onPlayAudio: () => void;
}

export const MatraResultCard: React.FC<MatraResultCardProps> = ({
  consonant,
  matra,
  unit,
  isAudioPlaying,
  onPlayAudio,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto my-4 bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 border-4 border-toy-mint p-5 md:p-6 rounded-3xl shadow-toy-lg text-center relative overflow-hidden animate-pop-in">
      {/* Decorative Sparkle */}
      <div className="absolute top-4 right-4 text-toy-mint opacity-70">
        <Sparkles className="w-6 h-6 animate-pulse" />
      </div>

      <span className="inline-block bg-toy-mint text-white text-xs md:text-sm font-extrabold px-3 py-1 rounded-full mb-2 shadow-xs">
        ✨ नया शब्दांश (New Learning Unit)
      </span>

      {/* Large Devanagari Syllable Result */}
      <div className="my-2 transform hover:scale-105 transition-transform">
        <span
          className="text-7xl md:text-8xl lg:text-9xl font-black font-hindi text-slate-800 tracking-wide filter drop-shadow-sm select-none"
          aria-label={`परिणाम: ${unit.display}`}
        >
          {unit.display}
        </span>
      </div>

      {/* Combination Equation */}
      <div className="inline-flex items-center justify-center gap-2 bg-white/80 border-2 border-emerald-200 px-4 py-2 rounded-2xl my-2 shadow-xs">
        <span className="text-xl md:text-2xl font-black font-hindi text-toy-blue-dark">
          {consonant.char}
        </span>
        <span className="text-base md:text-lg font-extrabold text-slate-400">+</span>
        <span className="text-xl md:text-2xl font-black font-hindi text-toy-purple-dark">
          {matra ? matra.symbol : 'अ'}
        </span>
        <span className="text-base md:text-lg font-extrabold text-slate-400">=</span>
        <span className="text-2xl md:text-3xl font-black font-hindi text-emerald-700">
          {unit.display}
        </span>
      </div>

      {/* Matra Description Badge */}
      <div className="mt-1 mb-3">
        <span className="text-xs md:text-sm font-bold text-slate-600 bg-emerald-100/70 border border-emerald-200 px-3 py-1 rounded-xl">
          {matra ? (
            <>
              <strong>{matra.name}</strong> ({matra.vowel}) — {matra.description}
            </>
          ) : (
            <>
              <strong>मूल व्यंजन (अ)</strong> — बिना किसी मात्रा के
            </>
          )}
        </span>
      </div>

      {/* Prominent Audio Button */}
      <div className="flex items-center justify-center gap-3 mt-2">
        <button
          onClick={onPlayAudio}
          disabled={isAudioPlaying}
          className={`inline-flex items-center gap-2 bg-toy-mint text-white px-6 py-2.5 rounded-2xl font-black text-base md:text-lg shadow-toy-md hover:bg-toy-mint-dark hover:shadow-toy-lg transition-all active:translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-toy-mint/60 ${
            isAudioPlaying ? 'animate-pulse scale-105 bg-toy-mint-dark ring-4 ring-toy-mint/50' : ''
          }`}
          aria-label={`उच्चारण सुनें: ${unit.display}`}
          title="उच्चारण सुनें"
        >
          <Volume2 className={`w-6 h-6 ${isAudioPlaying ? 'animate-bounce' : ''}`} />
          <span>सुनो 🔊</span>
        </button>
      </div>

      {/* Example Words Hint */}
      {matra && matra.exampleWords.length > 0 && (
        <div className="mt-4 pt-3 border-t border-emerald-200/60 flex items-center justify-center gap-2 text-xs md:text-sm text-slate-500 font-bold">
          <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            इस मात्रा से बने शब्द: {matra.exampleWords.map((w) => `"${w}"`).join(', ')}
          </span>
        </div>
      )}
    </div>
  );
};
