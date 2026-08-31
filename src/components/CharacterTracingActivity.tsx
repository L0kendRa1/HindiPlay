import React, { useEffect, useRef } from 'react';
import { useCharacterTracing } from '../hooks/useCharacterTracing';
import { Header } from './Header';
import { ProgressBar } from './ProgressBar';
import { FeedbackBanner } from './FeedbackBanner';
import { RoundSummary } from './RoundSummary';
import { TracingCanvas } from './TracingCanvas';
import { StrokeGuideBar } from './StrokeGuideBar';
import { ArrowRight, RotateCcw, Volume2 } from 'lucide-react';

interface CharacterTracingActivityProps {
  onBackToLibrary?: () => void;
}

export const CharacterTracingActivity: React.FC<CharacterTracingActivityProps> = ({ onBackToLibrary }) => {
  const {
    characters,
    currentIndex,
    totalCharacters,
    currentCharacter,
    currentStrokeIndex,
    userCompletedStrokes,
    activeUserStroke,
    feedback,
    feedbackMessage,
    isCharacterComplete,
    isRoundComplete,
    stats,
    playCurrentAudio,
    startStroke,
    extendStroke,
    endStroke,
    clearCurrentAttempt,
    handleNextCharacter,
    selectCharacterByIndex,
    restartTracing,
  } = useCharacterTracing();

  const nextButtonRef = useRef<HTMLButtonElement | null>(null);

  // Auto-focus next button on completion
  useEffect(() => {
    if (isCharacterComplete && nextButtonRef.current) {
      nextButtonRef.current.focus();
    }
  }, [isCharacterComplete]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (isRoundComplete) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          restartTracing();
        }
        return;
      }

      if (e.key === ' ' || e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        playCurrentAudio();
        return;
      }

      if (e.key === 'Enter' && isCharacterComplete) {
        e.preventDefault();
        handleNextCharacter();
        return;
      }

      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        clearCurrentAttempt();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isRoundComplete,
    isCharacterComplete,
    playCurrentAudio,
    handleNextCharacter,
    clearCurrentAttempt,
    restartTracing,
  ]);

  if (isRoundComplete) {
    return (
      <div className="min-h-screen bg-toy-canvas flex flex-col justify-between">
        <Header
          score={stats.score}
          streak={stats.streak}
          title="अक्षर लिखो"
          subtitle="स्ट्रोक देखकर अक्षर लिखो"
          onBackToLibrary={onBackToLibrary}
        />
        <main className="flex-1 flex items-center justify-center py-6">
          <RoundSummary
            stats={stats}
            onRestart={restartTracing}
            onBackToLibrary={onBackToLibrary}
          />
        </main>
        <footer className="py-4 text-center text-xs text-slate-400 font-medium">
          हिंदी बाल मंच • Toy Theater Inspired Prototype
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-toy-canvas flex flex-col justify-between">
      {/* Top Header */}
      <Header
        score={stats.score}
        streak={stats.streak}
        title="अक्षर लिखो"
        subtitle="स्ट्रोक देखकर अक्षर लिखो"
        onBackToLibrary={onBackToLibrary}
      />

      {/* Main Tracing View */}
      <main className="flex-1 flex flex-col items-center justify-start max-w-4xl w-full mx-auto px-4 py-2">
        {/* Progress Bar */}
        <ProgressBar currentIndex={currentIndex} totalQuestions={totalCharacters} />

        {/* Character Navigation Pills */}
        <div className="flex items-center gap-1.5 md:gap-2 my-1 overflow-x-auto py-1 max-w-full">
          {characters.map((charData, idx) => (
            <button
              key={charData.id}
              onClick={() => selectCharacterByIndex(idx)}
              className={`w-9 h-9 md:w-11 md:h-11 rounded-2xl font-black font-hindi text-base md:text-lg flex items-center justify-center border-2 transition-all ${
                idx === currentIndex
                  ? 'bg-toy-orange text-white border-toy-orange-dark shadow-toy-sm scale-110'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
              title={`अक्षर ${charData.character}`}
            >
              {charData.character}
            </button>
          ))}
        </div>

        {/* Character Header Clue & Sound */}
        <div className="flex items-center gap-3 bg-white px-5 py-2 rounded-2xl border-2 border-toy-yellow shadow-toy-sm my-1.5">
          <span className="text-3xl md:text-4xl font-black font-hindi text-slate-800">
            {currentCharacter.character}
          </span>
          <div className="text-left">
            <span className="text-xs font-bold text-slate-500 block">
              {currentCharacter.meaning || `अक्षर ${currentCharacter.character}`}
            </span>
            <span className="text-xs font-extrabold text-toy-orange-dark">
              कुल {currentCharacter.strokes.length} स्ट्रोक
            </span>
          </div>

          <button
            onClick={playCurrentAudio}
            className="p-2 bg-toy-yellow/30 hover:bg-toy-yellow/60 rounded-xl text-slate-700 transition-colors ml-2"
            title="उच्चारण सुनें"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Feedback / Instructions Banner */}
        <FeedbackBanner
          feedback={feedback}
          attempts={0}
          promptText={feedbackMessage || 'नीली रेखा पर उंगली या माउस चलाकर अक्षर बनाएँ 👇'}
          correctMessage={feedbackMessage || `बहुत बढ़िया! 🎉 आपने "${currentCharacter.character}" लिखा!`}
        />

        {/* Stroke Progression Bar */}
        <StrokeGuideBar
          strokes={currentCharacter.strokes}
          currentStrokeIndex={currentStrokeIndex}
          isComplete={isCharacterComplete}
        />

        {/* Tracing Canvas Area */}
        <TracingCanvas
          character={currentCharacter}
          currentStrokeIndex={currentStrokeIndex}
          completedStrokes={userCompletedStrokes}
          activeUserStroke={activeUserStroke}
          onStartStroke={startStroke}
          onExtendStroke={extendStroke}
          onEndStroke={endStroke}
          isComplete={isCharacterComplete}
        />

        {/* Action Controls Toolbar */}
        <div className="flex items-center justify-center gap-3 my-2 min-h-[52px]">
          {/* Clear Attempt */}
          <button
            onClick={clearCurrentAttempt}
            className="flex items-center gap-1.5 bg-white border-2 border-slate-200 text-slate-600 px-4 py-2.5 rounded-2xl font-extrabold text-xs md:text-sm shadow-toy-sm hover:bg-slate-50 active:scale-95 transition-all"
            title="साफ़ करें (Shortcut: C)"
          >
            <RotateCcw className="w-4 h-4" />
            <span>साफ़ करो</span>
          </button>

          {/* Next Character (Visible on complete) */}
          {isCharacterComplete && (
            <button
              ref={nextButtonRef}
              onClick={handleNextCharacter}
              className="flex items-center gap-2 bg-gradient-to-b from-toy-mint to-toy-mint-dark text-white font-extrabold text-base md:text-lg px-8 py-2.5 rounded-2xl border-4 border-emerald-600 shadow-toy-lg hover:shadow-toy-xl hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-toy-sm animate-pop-in focus:outline-none focus:ring-4 focus:ring-toy-mint/50"
            >
              <span>{currentIndex + 1 === totalCharacters ? 'परिणाम देखें' : 'अगला अक्षर'}</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>
          )}
        </div>
      </main>

      {/* Footer Instructions */}
      <footer className="py-2.5 px-4 text-center text-xs text-slate-500 font-semibold flex items-center justify-center gap-4 flex-wrap">
        <span>💡 सुझाव: टच, पेन या माउस से स्ट्रोक खींचें</span>
        <span className="hidden sm:inline">•</span>
        <span className="hidden sm:inline">साफ़ करने के लिए [C]</span>
        <span className="hidden sm:inline">•</span>
        <span className="hidden sm:inline">आवाज़ के लिए [Space]</span>
        <span className="hidden sm:inline">•</span>
        <span className="hidden sm:inline">आगे बढ़ने के लिए [Enter]</span>
      </footer>
    </div>
  );
};
