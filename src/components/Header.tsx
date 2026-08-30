import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Star } from 'lucide-react';
import { audioService } from '../services/audioService';

interface HeaderProps {
  score: number;
  streak: number;
}

export const Header: React.FC<HeaderProps> = ({ score, streak }) => {
  const [isMuted, setIsMuted] = useState<boolean>(() => audioService.getIsMuted());

  const handleToggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioService.setMuted(nextMuted);
    if (!nextMuted) {
      audioService.playSfx('pop');
    }
  };

  return (
    <header className="w-full max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
      {/* Brand & Activity Title */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-toy-yellow to-toy-orange flex items-center justify-center shadow-toy-sm text-2xl transform -rotate-3 hover:rotate-0 transition-transform">
          🎨
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            अक्षर पहचानो
          </h1>
          <p className="text-xs md:text-sm font-semibold text-toy-orange-dark flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 inline" /> स्वर सीखो (Hindi Vowels)
          </p>
        </div>
      </div>

      {/* Right Controls: Score & Sound Toggle */}
      <div className="flex items-center gap-3">
        {/* Score Pill */}
        <div
          className="flex items-center gap-1.5 bg-white border-2 border-toy-yellow px-3.5 py-1.5 rounded-full shadow-toy-sm font-bold text-slate-800 transition-transform hover:scale-105"
          aria-label={`स्कोर: ${score}`}
        >
          <Star className="w-5 h-5 text-toy-yellow fill-toy-yellow animate-bounce-short" />
          <span className="text-base md:text-lg">{score}</span>
          {streak > 1 && (
            <span className="ml-1 text-xs bg-toy-orange text-white px-2 py-0.5 rounded-full font-extrabold animate-pulse">
              🔥 {streak}x
            </span>
          )}
        </div>

        {/* Sound Toggle Button */}
        <button
          onClick={handleToggleSound}
          className={`w-11 h-11 rounded-2xl flex items-center justify-center border-2 transition-all active:translate-y-1 active:shadow-toy-sunken ${
            isMuted
              ? 'bg-slate-200 border-slate-300 text-slate-500 shadow-toy-sm'
              : 'bg-white border-toy-blue text-toy-blue shadow-toy-sm hover:bg-toy-canvas'
          }`}
          title={isMuted ? 'आवाज़ चालू करें (Unmute)' : 'आवाज़ बंद करें (Mute)'}
          aria-label={isMuted ? 'आवाज़ चालू करें' : 'आवाज़ बंद करें'}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
};
