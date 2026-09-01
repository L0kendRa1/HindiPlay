import React from 'react';
import { useMatraLab } from '../hooks/useMatraLab';
import { ConsonantSelector } from './ConsonantSelector';
import { MatraSelector } from './MatraSelector';
import { MatraResultCard } from './MatraResultCard';
import { Header } from './Header';
import { RotateCcw, Sparkles } from 'lucide-react';

interface MatraLabActivityProps {
  onBackToLibrary: () => void;
}

export const MatraLabActivity: React.FC<MatraLabActivityProps> = ({ onBackToLibrary }) => {
  const {
    consonants,
    matras,
    selectedConsonant,
    selectedMatra,
    currentUnit,
    exploredCount,
    isAudioPlaying,
    selectConsonant,
    selectMatra,
    playCurrentAudio,
    resetLab,
  } = useMatraLab();

  return (
    <div className="min-h-screen bg-toy-canvas flex flex-col items-center justify-between p-3 md:p-6 font-hindi select-none">
      {/* Top Header */}
      <Header
        title="मात्रा प्रयोगशाला"
        subtitle="अक्षर और मात्राएँ जोड़कर नए शब्दांश बनाओ"
        onBackToLibrary={onBackToLibrary}
      />

      {/* Main Lab Canvas */}
      <main className="w-full max-w-3xl flex flex-col items-center my-auto py-2">
        {/* Instruction & Exploration Stats Banner */}
        <div className="w-full max-w-2xl mx-auto flex items-center justify-between bg-white/90 border-2 border-toy-mint px-4 py-2 rounded-2xl shadow-toy-sm mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧪</span>
            <p className="text-xs md:text-sm font-extrabold text-slate-700">
              अक्षर चुनो, फिर मात्रा लगाओ!
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-100/80 text-emerald-800 px-3 py-1 rounded-full text-xs font-black">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{exploredCount} खोजी गई इकाइयाँ</span>
          </div>
        </div>

        {/* 1. Consonant Selector */}
        <ConsonantSelector
          consonants={consonants}
          selectedConsonant={selectedConsonant}
          onSelectConsonant={selectConsonant}
        />

        {/* 2. Matra Selector */}
        <MatraSelector
          matras={matras}
          selectedMatra={selectedMatra}
          onSelectMatra={selectMatra}
        />

        {/* 3. Live Result Card */}
        <MatraResultCard
          consonant={selectedConsonant}
          matra={selectedMatra}
          unit={currentUnit}
          isAudioPlaying={isAudioPlaying}
          onPlayAudio={playCurrentAudio}
        />

        {/* Bottom Actions Bar */}
        <div className="w-full max-w-2xl flex items-center justify-between mt-2 pt-2">
          <button
            onClick={resetLab}
            className="inline-flex items-center gap-1.5 bg-white border-2 border-slate-300 text-slate-600 px-4 py-2 rounded-2xl font-extrabold text-xs md:text-sm shadow-toy-sm hover:bg-slate-100 hover:border-slate-400 active:scale-95 transition-all"
            title="प्रयोगशाला को शुरू से सेट करें"
          >
            <RotateCcw className="w-4 h-4" />
            <span>साफ़ करें</span>
          </button>

          <span className="text-xs font-semibold text-slate-400">
            हिंदी बाल मंच • मात्रा प्रयोगशाला
          </span>
        </div>
      </main>
    </div>
  );
};
