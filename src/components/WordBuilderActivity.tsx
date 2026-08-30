import React, { useEffect, useRef } from 'react';
import { useWordBuilder } from '../hooks/useWordBuilder';
import { Header } from './Header';
import { ProgressBar } from './ProgressBar';
import { FeedbackBanner } from './FeedbackBanner';
import { RoundSummary } from './RoundSummary';
import { LearningUnitCard } from './LearningUnitCard';
import { WordConstructionArea } from './WordConstructionArea';
import { WordResultCard } from './WordResultCard';
import { WordLengthSelector } from './WordLengthSelector';
import { ArrowRight, Sparkles, Compass, Search, SlidersHorizontal } from 'lucide-react';

export const WordBuilderActivity: React.FC = () => {
  const {
    mode,
    setMode,
    selectedUnitCount,
    availableWordLengths,
    selectDifficulty,
    returnToDifficultySelector,
    // Guided
    currentQuestion,
    currentIndex,
    totalQuestions,
    selectedUnits,
    availableUnits,
    feedback,
    attempts,
    isSolved,
    isRoundComplete,
    stats,
    playCurrentWordAudio,
    selectUnit,
    removeUnit,
    resetSelection,
    handleNextQuestion,
    restartQuiz,
    // Discovery
    discoveryTrayUnits,
    discoveryUnits,
    discoveredWord,
    discoveredList,
    discoveryFeedback,
    discoveryMessage,
    addDiscoveryUnit,
    removeDiscoveryUnit,
    clearDiscovery,
    checkDiscoveryWord,
  } = useWordBuilder();

  const nextButtonRef = useRef<HTMLButtonElement | null>(null);

  // Auto-focus next button on solve
  useEffect(() => {
    if (isSolved && nextButtonRef.current) {
      nextButtonRef.current.focus();
    }
  }, [isSolved]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // If on selector screen, 1, 2, 3 select difficulty
      if (selectedUnitCount === null) {
        if (e.key === '1' && availableWordLengths[0]) {
          e.preventDefault();
          selectDifficulty(availableWordLengths[0].unitCount);
        } else if (e.key === '2' && availableWordLengths[1]) {
          e.preventDefault();
          selectDifficulty(availableWordLengths[1].unitCount);
        } else if (e.key === '3' && availableWordLengths[2]) {
          e.preventDefault();
          selectDifficulty(availableWordLengths[2].unitCount);
        }
        return;
      }

      if (isRoundComplete) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          restartQuiz();
        }
        return;
      }

      if (e.key === ' ' || e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        playCurrentWordAudio();
        return;
      }

      if (e.key === 'Enter') {
        if (mode === 'guided' && isSolved) {
          e.preventDefault();
          handleNextQuestion();
          return;
        } else if (mode === 'discovery' && discoveryUnits.length > 0) {
          e.preventDefault();
          checkDiscoveryWord();
          return;
        }
      }

      // 1, 2, 3 hotkeys to pick available units in guided mode
      if (mode === 'guided' && !isSolved && availableUnits.length > 0) {
        if (e.key === '1' && availableUnits[0]) {
          e.preventDefault();
          selectUnit(availableUnits[0]);
        } else if (e.key === '2' && availableUnits[1]) {
          e.preventDefault();
          selectUnit(availableUnits[1]);
        } else if (e.key === '3' && availableUnits[2]) {
          e.preventDefault();
          selectUnit(availableUnits[2]);
        } else if (e.key === '4' && availableUnits[3]) {
          e.preventDefault();
          selectUnit(availableUnits[3]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    mode,
    selectedUnitCount,
    availableWordLengths,
    selectDifficulty,
    isRoundComplete,
    isSolved,
    availableUnits,
    discoveryUnits,
    playCurrentWordAudio,
    handleNextQuestion,
    selectUnit,
    checkDiscoveryWord,
    restartQuiz,
  ]);

  // Round summary view
  if (isRoundComplete && mode === 'guided') {
    return (
      <div className="min-h-screen bg-toy-canvas flex flex-col justify-between">
        <Header score={stats.score} streak={stats.streak} categoryFilter="all" onSelectCategory={() => {}} />
        <main className="flex-1 flex items-center justify-center py-6">
          <div className="flex flex-col items-center">
            <RoundSummary stats={stats} onRestart={restartQuiz} />
            <button
              onClick={returnToDifficultySelector}
              className="mt-4 flex items-center gap-2 text-sm font-extrabold text-slate-600 bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-xs hover:bg-slate-50 transition-all"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>कठिनाई बदलें (Change Difficulty)</span>
            </button>
          </div>
        </main>
        <footer className="py-4 text-center text-xs text-slate-400 font-medium">
          हिंदी बाल मंच • Toy Theater Inspired Prototype
        </footer>
      </div>
    );
  }

  // Difficulty selection view
  if (selectedUnitCount === null) {
    return (
      <div className="min-h-screen bg-toy-canvas flex flex-col justify-between">
        <Header score={stats.score} streak={stats.streak} categoryFilter="all" onSelectCategory={() => {}} />
        <main className="flex-1 flex items-center justify-center py-6">
          <WordLengthSelector
            options={availableWordLengths}
            onSelect={selectDifficulty}
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
      <Header score={stats.score} streak={stats.streak} categoryFilter="all" onSelectCategory={() => {}} />

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-start max-w-4xl w-full mx-auto px-4 py-3">
        {/* Controls Bar: Mode Tabs + Change Difficulty */}
        <div className="w-full flex items-center justify-between gap-2 max-w-2xl mb-3 flex-wrap">
          {/* Mode Selector Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setMode('guided')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-extrabold text-xs md:text-sm transition-all ${
                mode === 'guided'
                  ? 'bg-white text-toy-orange-dark border border-toy-orange shadow-toy-sm scale-105'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>1. शब्द बनाओ</span>
            </button>

            <button
              onClick={() => setMode('discovery')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-extrabold text-xs md:text-sm transition-all ${
                mode === 'discovery'
                  ? 'bg-white text-toy-purple-dark border border-toy-purple shadow-toy-sm scale-105'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>2. शब्द खोजो</span>
            </button>
          </div>

          {/* Active Difficulty Pill & Switcher */}
          <button
            onClick={returnToDifficultySelector}
            className="flex items-center gap-1.5 bg-white border-2 border-toy-yellow text-slate-700 px-3.5 py-1.5 rounded-xl font-bold text-xs md:text-sm shadow-toy-sm hover:bg-amber-50 active:scale-95 transition-all"
            title="कठिनाई बदलें"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-toy-orange" />
            <span className="font-extrabold text-toy-orange-dark">{selectedUnitCount} अक्षर</span>
            <span className="text-slate-400 text-xs">बदलें 🔄</span>
          </button>
        </div>

        {/* ----------------- MODE 1: GUIDED WORD BUILDING ----------------- */}
        {mode === 'guided' && currentQuestion && (
          <div className="w-full flex flex-col items-center animate-pop-in">
            {/* Progress */}
            <ProgressBar currentIndex={currentIndex} totalQuestions={totalQuestions} />

            {/* Target Word Prompt (Emoji + Clue) */}
            <div className="flex items-center gap-3 bg-white px-6 py-2.5 rounded-3xl border-4 border-toy-yellow shadow-toy-md my-2">
              <span className="text-4xl md:text-5xl select-none filter drop-shadow-sm">
                {currentQuestion.targetWord.emoji}
              </span>
              <div className="text-left">
                <span className="text-xs font-extrabold text-toy-orange-dark block">
                  लक्ष्य शब्द ({selectedUnitCount} अक्षर)
                </span>
                <span className="text-base md:text-lg font-bold text-slate-700">
                  {currentQuestion.targetWord.meaning}
                </span>
              </div>
            </div>

            {/* Dynamic Prompt / Feedback */}
            <FeedbackBanner
              feedback={feedback}
              attempts={attempts}
              promptText="अक्षर-इकाइयों को सही क्रम में चुनकर शब्द बनाओ 👇"
              correctMessage={`बहुत बढ़िया! 🎉 ${currentQuestion.targetWord.word}`}
            />

            {/* Word Construction Slot Area */}
            <WordConstructionArea
              totalSlots={currentQuestion.targetWord.units.length}
              selectedUnits={selectedUnits}
              onRemoveUnit={removeUnit}
              onReset={resetSelection}
              isSolved={isSolved}
            />

            {/* Solved Result Card Reveal */}
            {isSolved && (
              <WordResultCard
                word={currentQuestion.targetWord}
                onPlayAudio={playCurrentWordAudio}
              />
            )}

            {/* Available Units Pool */}
            {!isSolved && (
              <div className="my-3 flex flex-col items-center">
                <span className="text-xs font-bold text-slate-500 mb-2">
                  उपलब्ध अक्षर-इकाइयाँ (Tap to select):
                </span>
                <div className="flex items-center justify-center gap-3 md:gap-4 flex-wrap">
                  {availableUnits.map((unit, idx) => (
                    <LearningUnitCard
                      key={unit.id}
                      unit={unit}
                      index={idx}
                      onClick={() => selectUnit(unit)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Next Word Action */}
            <div className="h-16 flex items-center justify-center mt-2">
              {isSolved && (
                <button
                  ref={nextButtonRef}
                  onClick={handleNextQuestion}
                  className="flex items-center gap-3 bg-gradient-to-b from-toy-mint to-toy-mint-dark text-white text-xl md:text-2xl font-extrabold px-10 py-3.5 rounded-3xl border-4 border-emerald-600 shadow-toy-lg hover:shadow-toy-xl hover:-translate-y-1 active:translate-y-1 active:shadow-toy-sm animate-pop-in focus:outline-none focus:ring-4 focus:ring-toy-mint/50"
                >
                  <span>{currentIndex + 1 === totalQuestions ? 'परिणाम देखें' : 'अगला शब्द'}</span>
                  <ArrowRight className="w-7 h-7 stroke-[3]" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ----------------- MODE 2: WORD DISCOVERY ----------------- */}
        {mode === 'discovery' && (
          <div className="w-full flex flex-col items-center animate-pop-in max-w-2xl">
            {/* Title & Instructions */}
            <div className="text-center my-1">
              <h2 className="text-xl md:text-2xl font-black text-slate-800 flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-toy-purple" />
                अक्षर जोड़ो — क्या बनेगा?
              </h2>
              <p className="text-xs md:text-sm font-semibold text-slate-500 mt-0.5">
                नीचे से अक्षर-इकाइयाँ जोड़ें और देखें कौन सा नया शब्द बनता है!
              </p>
            </div>

            {/* Construction Area */}
            <div className="w-full my-3">
              <div className="flex items-center justify-center gap-3 bg-purple-50/80 border-4 border-dashed border-purple-300 p-4 rounded-3xl min-h-[110px] w-full shadow-inner">
                {discoveryUnits.length === 0 ? (
                  <span className="text-sm font-bold text-slate-400">
                    अक्षर चुनने के लिए नीचे दिए गए कार्ड्स पर क्लिक करें
                  </span>
                ) : (
                  discoveryUnits.map((u, idx) => (
                    <div key={`${u.id}_${idx}`} className="relative group">
                      <LearningUnitCard
                        unit={u}
                        isPlaced={true}
                        onClick={() => removeDiscoveryUnit(idx)}
                      />
                      <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-[10px] text-slate-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        हटाएँ ✕
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-center gap-3 mt-3">
                <button
                  onClick={checkDiscoveryWord}
                  disabled={discoveryUnits.length === 0}
                  className="flex items-center gap-2 bg-gradient-to-b from-toy-purple to-toy-purple-dark text-white font-extrabold text-base md:text-lg px-6 py-2.5 rounded-2xl border-2 border-purple-800 shadow-toy-md hover:shadow-toy-lg active:translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Search className="w-5 h-5" />
                  <span>शब्द खोजें</span>
                </button>

                {discoveryUnits.length > 0 && (
                  <button
                    onClick={clearDiscovery}
                    className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-xs hover:text-slate-800"
                  >
                    साफ़ करें 🔄
                  </button>
                )}
              </div>
            </div>

            {/* Discovery Feedback / Result */}
            {discoveryMessage && (
              <div className="my-2 animate-pop-in text-center">
                <div
                  className={`inline-flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm md:text-base border ${
                    discoveryFeedback === 'correct'
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-900 shadow-toy-sm'
                      : 'bg-amber-100 border-amber-300 text-amber-900'
                  }`}
                >
                  <span>{discoveryMessage}</span>
                </div>
              </div>
            )}

            {/* Discovered Word Card */}
            {discoveredWord && (
              <WordResultCard word={discoveredWord} />
            )}

            {/* Discovery Tray (Learning Units to pick from) */}
            <div className="w-full bg-white border-2 border-slate-200 rounded-3xl p-4 shadow-toy-sm my-2">
              <span className="text-xs font-extrabold text-slate-500 block mb-2 text-center">
                अक्षर और मात्रा इकाइयाँ (Click to combine):
              </span>
              <div className="flex items-center justify-center gap-2.5 flex-wrap max-h-48 overflow-y-auto p-1">
                {discoveryTrayUnits.map((unit) => (
                  <LearningUnitCard
                    key={unit.id}
                    unit={unit}
                    size="compact"
                    onClick={() => addDiscoveryUnit(unit)}
                  />
                ))}
              </div>
            </div>

            {/* Discovered Badges History */}
            {discoveredList.length > 0 && (
              <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 my-2 text-center">
                <span className="text-xs font-bold text-slate-500 block mb-1.5">
                  🌟 अब तक खोजे गए शब्द ({discoveredList.length}):
                </span>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {discoveredList.map((dw) => (
                    <span
                      key={dw.id}
                      className="bg-white border border-slate-200 px-3 py-1 rounded-full text-xs font-extrabold text-toy-purple-dark shadow-xs flex items-center gap-1 animate-pop-in"
                    >
                      <span>{dw.emoji}</span>
                      <span>{dw.word}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer Instructions */}
      <footer className="py-3 px-4 text-center text-xs md:text-sm text-slate-500 font-semibold flex items-center justify-center gap-4 flex-wrap">
        <span>💡 सुझाव: अक्षर चुनने के लिए [1], [2], [3] दबाएँ</span>
        <span className="hidden sm:inline">•</span>
        <span className="hidden sm:inline">आवाज़ के लिए [Space]</span>
        <span className="hidden sm:inline">•</span>
        <span className="hidden sm:inline">आगे बढ़ने के लिए [Enter]</span>
      </footer>
    </div>
  );
};
