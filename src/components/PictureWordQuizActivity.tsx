import React, { useEffect, useRef } from 'react';
import { usePictureWordQuiz } from '../hooks/usePictureWordQuiz';
import { Header } from './Header';
import { ProgressBar } from './ProgressBar';
import { FeedbackBanner } from './FeedbackBanner';
import { RoundSummary } from './RoundSummary';
import { WordOptionCard } from './WordOptionCard';
import { PicturePromptCard } from './PicturePromptCard';
import { ArrowRight } from 'lucide-react';

interface PictureWordQuizActivityProps {
  onBackToLibrary?: () => void;
}

export const PictureWordQuizActivity: React.FC<PictureWordQuizActivityProps> = ({ onBackToLibrary }) => {
  const {
    currentIndex,
    totalQuestions,
    currentQuestion,
    selectedOptionId,
    wrongOptionIds,
    feedback,
    attempts,
    isSolved,
    isRoundComplete,
    categoryFilter,
    stats,
    playCurrentTargetAudio,
    selectOption,
    handleNextQuestion,
    setCategoryFilter,
    restartQuiz,
  } = usePictureWordQuiz();

  const nextButtonRef = useRef<HTMLButtonElement | null>(null);

  // Auto-focus next button on solve
  useEffect(() => {
    if (isSolved && nextButtonRef.current) {
      nextButtonRef.current.focus();
    }
  }, [isSolved]);

  // Keyboard navigation (1, 2, 3, Space, Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
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
        playCurrentTargetAudio();
        return;
      }

      if (e.key === 'Enter' && isSolved) {
        e.preventDefault();
        handleNextQuestion();
        return;
      }

      // Hotkeys 1, 2, 3 to select options
      if (!isSolved && currentQuestion) {
        if (e.key === '1' && currentQuestion.options[0]) {
          e.preventDefault();
          selectOption(currentQuestion.options[0].id);
        } else if (e.key === '2' && currentQuestion.options[1]) {
          e.preventDefault();
          selectOption(currentQuestion.options[1].id);
        } else if (e.key === '3' && currentQuestion.options[2]) {
          e.preventDefault();
          selectOption(currentQuestion.options[2].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isRoundComplete,
    isSolved,
    currentQuestion,
    selectOption,
    playCurrentTargetAudio,
    handleNextQuestion,
    restartQuiz,
  ]);

  if (isRoundComplete) {
    return (
      <div className="min-h-screen bg-toy-canvas flex flex-col justify-between">
        <Header
          score={stats.score}
          streak={stats.streak}
          categoryFilter={categoryFilter}
          onSelectCategory={setCategoryFilter}
          title="चित्र-शब्द पहचानो"
          subtitle="चित्र देखकर सही शब्द चुनो"
          onBackToLibrary={onBackToLibrary}
        />
        <main className="flex-1 flex items-center justify-center py-6">
          <RoundSummary
            stats={stats}
            categoryFilter={categoryFilter}
            onRestart={restartQuiz}
            onBackToLibrary={onBackToLibrary}
          />
        </main>
        <footer className="py-4 text-center text-xs text-slate-400 font-medium">
          हिंदी बाल मंच • Toy Theater Inspired Prototype
        </footer>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-toy-canvas flex items-center justify-center">
        <p className="text-lg font-bold text-slate-500">लोड हो रहा है...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-toy-canvas flex flex-col justify-between">
      {/* Top Header */}
      <Header
        score={stats.score}
        streak={stats.streak}
        categoryFilter={categoryFilter}
        onSelectCategory={setCategoryFilter}
        title="चित्र-शब्द पहचानो"
        subtitle="चित्र देखकर सही शब्द चुनो"
        onBackToLibrary={onBackToLibrary}
      />

      {/* Main Quiz View */}
      <main className="flex-1 flex flex-col items-center justify-start max-w-4xl w-full mx-auto px-4 py-2">
        {/* Progress Bar */}
        <ProgressBar currentIndex={currentIndex} totalQuestions={totalQuestions} />

        {/* Illustrated Picture Prompt */}
        <PicturePromptCard
          item={currentQuestion.targetItem}
          onPlayAudio={playCurrentTargetAudio}
        />

        {/* Feedback / Instructions Banner */}
        <FeedbackBanner
          feedback={feedback}
          attempts={attempts}
          promptText="चित्र देखकर सही शब्द चुनो 👇"
          correctMessage={`बहुत बढ़िया! 🎉 ${currentQuestion.targetItem.emoji} ${currentQuestion.targetItem.word}`}
        />

        {/* 3 Word Options List */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 w-full max-w-xl my-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOptionId === option.id;
            const isCorrect = isSolved && option.id === currentQuestion.correctAnswerId;
            const isWrong = wrongOptionIds.includes(option.id);

            return (
              <WordOptionCard
                key={option.id}
                option={option}
                index={idx}
                isSelected={isSelected}
                isCorrect={isCorrect}
                isWrong={isWrong}
                disabled={isSolved}
                onClick={() => selectOption(option.id)}
              />
            );
          })}
        </div>

        {/* Next Question Action Button */}
        <div className="h-16 flex items-center justify-center mt-2">
          {isSolved && (
            <button
              ref={nextButtonRef}
              onClick={handleNextQuestion}
              className="flex items-center gap-3 bg-gradient-to-b from-toy-mint to-toy-mint-dark text-white text-xl md:text-2xl font-extrabold px-10 py-3.5 rounded-3xl border-4 border-emerald-600 shadow-toy-lg hover:shadow-toy-xl hover:-translate-y-1 active:translate-y-1 active:shadow-toy-sm animate-pop-in focus:outline-none focus:ring-4 focus:ring-toy-mint/50"
            >
              <span>{currentIndex + 1 === totalQuestions ? 'परिणाम देखें' : 'अगला प्रश्न'}</span>
              <ArrowRight className="w-7 h-7 stroke-[3]" />
            </button>
          )}
        </div>
      </main>

      {/* Footer Keyboard Instructions */}
      <footer className="py-3 px-4 text-center text-xs md:text-sm text-slate-500 font-semibold flex items-center justify-center gap-4 flex-wrap">
        <span>💡 सुझाव: शब्द चुनने के लिए [1], [2], [3] दबाएँ</span>
        <span className="hidden sm:inline">•</span>
        <span className="hidden sm:inline">आवाज़ के लिए [Space]</span>
        <span className="hidden sm:inline">•</span>
        <span className="hidden sm:inline">आगे बढ़ने के लिए [Enter]</span>
      </footer>
    </div>
  );
};
