import React, { useState } from 'react';
import { Volume2, VolumeX, Star, Sparkles, Home } from 'lucide-react';
import { audioService } from '../services/audioService';
import { CategoryFilter } from '../types/activity';

interface HeaderProps {
  score?: number;
  streak?: number;
  categoryFilter?: CategoryFilter;
  onSelectCategory?: (category: CategoryFilter) => void;
  title?: string;
  subtitle?: string;
  onBackToLibrary?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  score,
  streak = 0,
  categoryFilter = 'all',
  onSelectCategory,
  title = 'HindiPlay',
  subtitle = 'हिंदी बाल मंच',
  onBackToLibrary,
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(() => audioService.getIsMuted());

  const handleToggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioService.setMuted(nextMuted);
    if (!nextMuted) {
      audioService.playSfx('pop');
    }
  };

  const categories: { id: CategoryFilter; label: string; emoji: string }[] = [
    { id: 'all', label: 'सभी', emoji: '🌟' },
    { id: 'vowel', label: 'स्वर', emoji: '🅰️' },
    { id: 'consonant', label: 'व्यंजन', emoji: '🅱️' },
  ];

  return (
    <header className="w-full max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
      {/* Brand / Title & Home Button */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        <div className="flex items-center gap-2.5">
          {onBackToLibrary && (
            <button
              onClick={onBackToLibrary}
              className="flex items-center gap-1.5 bg-white border-2 border-slate-200 text-slate-700 px-3 py-2 rounded-2xl font-black text-xs md:text-sm shadow-toy-sm hover:border-toy-orange hover:text-toy-orange-dark active:scale-95 transition-all"
              title="गतिविधि सूची पर वापस जाएँ"
            >
              <Home className="w-4 h-4 text-toy-orange" />
              <span className="hidden xs:inline">गतिविधियाँ</span>
            </button>
          )}

          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              {title}
            </h1>
            <p className="text-xs font-bold text-toy-orange-dark flex items-center gap-1">
              <Sparkles className="w-3 h-3 inline" /> {subtitle}
            </p>
          </div>
        </div>

        {/* Mobile-only Sound & Score */}
        <div className="flex items-center gap-2 sm:hidden">
          {score !== undefined && (
            <div className="flex items-center gap-1 bg-white border-2 border-toy-yellow px-2.5 py-1 rounded-full shadow-toy-sm font-bold text-sm text-slate-800">
              <Star className="w-4 h-4 text-toy-yellow fill-toy-yellow" />
              <span>{score}</span>
            </div>
          )}
          <button
            onClick={handleToggleSound}
            className={`w-9 h-9 rounded-xl flex items-center justify-center border-2 transition-all ${
              isMuted
                ? 'bg-slate-200 border-slate-300 text-slate-500'
                : 'bg-white border-toy-blue text-toy-blue'
            }`}
            aria-label={isMuted ? 'आवाज़ चालू करें' : 'आवाज़ बंद करें'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Center/Sub: Category Filter Pills (if onSelectCategory provided) */}
      {onSelectCategory && (
        <nav aria-label="अक्षर श्रेणी" className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          {categories.map((cat) => {
            const isActive = categoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs md:text-sm transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white text-toy-blue-dark shadow-toy-sm border border-toy-blue scale-105'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* Desktop Controls: Score & Sound Toggle */}
      <div className="hidden sm:flex items-center gap-3">
        {/* Score Pill */}
        {score !== undefined && (
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
        )}

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
