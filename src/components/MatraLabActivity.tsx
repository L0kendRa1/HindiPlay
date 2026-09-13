import React, { useState } from 'react';
import { useMatraLab } from '../hooks/useMatraLab';
import { useActivityProgress } from '../hooks/useActivityProgress';
import { useActivityTimer } from '../hooks/useActivityTimer';
import { ConsonantSelector } from './ConsonantSelector';
import { MatraSelector } from './MatraSelector';
import { MatraResultCard } from './MatraResultCard';
import { Header } from './Header';
import { RewardFeedback } from './RewardFeedback';
import { RotateCcw, Sparkles, CheckCircle2, Trophy, Home } from 'lucide-react';

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

  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const { submitProgress, resetProgress, isSubmitting, error, rewards } = useActivityProgress();
  const timer = useActivityTimer();

  const handleComplete = () => {
    setIsCompleted(true);
    const elapsed = timer.stopTimer();
    const safeScore = Math.min(Math.max(1, exploredCount), 10);
    submitProgress({
      activityId: 'matra-lab',
      score: safeScore,
      total: 10,
      completed: true,
      timeSpentSeconds: elapsed,
    });
  };

  const handleRestart = () => {
    resetLab();
    setIsCompleted(false);
    resetProgress();
    timer.resetTimer();
  };

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
        <div className="w-full max-w-2xl flex items-center justify-between mt-2 pt-2 gap-2 flex-wrap">
          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-1.5 bg-white border-2 border-slate-300 text-slate-600 px-4 py-2 rounded-2xl font-extrabold text-xs md:text-sm shadow-toy-sm hover:bg-slate-100 hover:border-slate-400 active:scale-95 transition-all"
            title="प्रयोगशाला को शुरू से सेट करें"
          >
            <RotateCcw className="w-4 h-4" />
            <span>साफ़ करें</span>
          </button>

          {/* Complete practice button */}
          <button
            onClick={handleComplete}
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-toy-mint to-emerald-600 text-white px-4 py-2 rounded-2xl font-black text-xs md:text-sm shadow-toy-sm hover:scale-105 active:scale-95 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>अभ्यास पूरा करें</span>
          </button>
        </div>
      </main>

      {/* Completion Modal */}
      {isCompleted && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-pop-in">
          <div className="bg-white rounded-3xl border-4 border-toy-mint p-6 md:p-8 max-w-md w-full shadow-toy-xl text-center relative overflow-hidden">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-toy-mint to-emerald-600 mx-auto flex items-center justify-center shadow-toy-md mb-4 animate-bounce-short text-white">
              <Trophy className="w-10 h-10 stroke-[2.5]" />
            </div>

            <h2 className="text-2xl md:text-3xl font-black font-hindi text-slate-800 mb-1">
              शाबाश! 🧪
            </h2>
            <p className="text-base font-bold text-emerald-600 mb-4">
              मात्रा प्रयोग सफल रहा!
            </p>

            <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 mb-4">
              <span className="text-xs font-bold text-slate-500">खोजी गई कुल इकाइयाँ</span>
              <div className="text-3xl font-black text-emerald-700 mt-1">
                {exploredCount}
              </div>
            </div>

            {/* Authenticated Reward Feedback */}
            <RewardFeedback
              rewards={rewards}
              isSubmitting={isSubmitting}
              error={error}
            />

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                onClick={handleRestart}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-toy-mint to-emerald-600 text-white font-black text-base shadow-toy-md hover:shadow-toy-lg active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                <span>और खोजें</span>
              </button>

              <button
                onClick={onBackToLibrary}
                className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 border-2 border-slate-200 text-slate-700 font-black text-base shadow-toy-sm hover:bg-slate-200 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5 text-toy-orange" />
                <span>गतिविधियाँ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
