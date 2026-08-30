import React from 'react';
import { Volume2, Sparkles } from 'lucide-react';

interface AudioButtonProps {
  isPlaying: boolean;
  onPlay: () => void;
  hasPlayedOnce?: boolean;
}

export const AudioButton: React.FC<AudioButtonProps> = ({ isPlaying, onPlay, hasPlayedOnce = false }) => {
  return (
    <div className="flex flex-col items-center justify-center my-4">
      {/* Gentle Subtitle / Instruction */}
      <div className="flex items-center gap-1.5 text-sm md:text-base font-bold text-toy-orange-dark mb-2 animate-bounce-short">
        <Sparkles className="w-4 h-4 text-toy-orange" />
        <span>ध्यान से सुनो</span>
      </div>

      {/* Main Big Audio Trigger Button */}
      <button
        onClick={onPlay}
        disabled={isPlaying}
        className={`relative group flex items-center justify-center gap-3 px-8 py-5 rounded-3xl font-extrabold text-xl md:text-2xl transition-all duration-200 border-4 ${
          isPlaying
            ? 'bg-toy-yellow text-slate-900 border-toy-yellow-dark shadow-toy-sunken scale-95'
            : 'bg-gradient-to-b from-toy-orange to-toy-orange-dark text-white border-orange-600 shadow-toy-lg hover:shadow-toy-xl hover:-translate-y-1 active:translate-y-1 active:shadow-toy-sm animate-pulse-glow'
        }`}
        aria-label="अक्षर की आवाज़ सुनें"
        title="आवाज़ सुनने के लिए क्लिक करें या Space दबाएँ"
      >
        {/* Animated sound waves icon */}
        <div className={`p-2 rounded-2xl bg-white/20 ${isPlaying ? 'animate-wiggle' : 'group-hover:scale-110 transition-transform'}`}>
          <Volume2 className="w-8 h-8 md:w-9 md:h-9" />
        </div>

        <span className="tracking-wide">
          {isPlaying ? 'सुन रहे हैं...' : hasPlayedOnce ? 'फिर से सुनो 🔊' : 'सुनो 🔊'}
        </span>

        {/* Keyboard hint */}
        <span className="hidden sm:inline-block text-xs font-bold px-2 py-0.5 bg-black/20 text-white rounded-md ml-1">
          Space
        </span>
      </button>

      {/* Helper label */}
      <p className="text-xs text-slate-500 font-semibold mt-2">
        बटन दबाकर आवाज़ सुनें
      </p>
    </div>
  );
};
