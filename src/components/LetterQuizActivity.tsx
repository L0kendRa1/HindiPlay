import React, { useEffect, useRef } from 'react';
import { useLetterQuiz } from '../hooks/useLetterQuiz';
import { Header } from './Header';
import { ProgressBar } from './ProgressBar';
import { AudioButton } from './AudioButton';
import { AnswerCard } from './AnswerCard';
import { FeedbackBanner } from './FeedbackBanner';
import { RoundSummary } from './RoundSummary';
import { ArrowRight } from 'lucide-react';

interface LetterQuizActivityProps {
  onBackToLibrary?: () => void;
}

export const LetterQuizActivity: React.FC<LetterQuizActivityProps> = ({ onBackToLibrary }) => {
  const {
    currentQuestion,
    currentIndex,
    totalQuestions,
    selectedOptionId,
    wrongOptionIds,
    feedback,
    isQuestionAnswered,
    isAudioPlaying,
    isRoundComplete,
    categoryFilter,
    stats,
    playCurrentAudio,
    handleSelectOption,
    handleNextQuestion,
    restartQuiz,
    changeCategoryFilter,
  } = useLetterQuiz();

  const nextButtonRef = useRef<HTMLButtonElement | null>(null);

  // Auto-focus next button when question is answered
  useEffect(() => {
    if (isQuestionAnswered && nextButtonRef.current) {
      nextButtonRef.current.focus();
    }
  }, [isQuestionAnswered]);

  // Global Keyboard shortcuts (1, 2, 3, Space, Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid firing if user is inside an input or select
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
        playCurrentAudio();
        return;
      }

      if (e.key === 'Enter' && isQuestionAnswered) {
        e.preventDefault();
        handleNextQuestion();
        return;
      }

      if (!isQuestionAnswered && currentQuestion) {
        if (e.key === '1' && currentQuestion.options[0]) {
          e.preventDefault();
          handleSelectOption(currentQuestion.options[0].id);
        } else if (e.key === '2' && currentQuestion.options[1]) {
          e.preventDefault();
          handleSelectOption(currentQuestion.options[1].id);
        } else if (e.key === '3' && currentQuestion.options[2]) {
          e.preventDefault();
          handleSelectOption(currentQuestion.options[2].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isRoundComplete,
    isQuestionAnswered,
    currentQuestion,
    playCurrentAudio,
    handleNextQuestion,
    handleSelectOption,
    restartQuiz,
  ]);

  if (isRoundComplete) {
    return (
      <div className="min-h-screen bg-toy-canvas flex flex-col justify-between">
        <Header
          score={stats.score}
          streak={stats.streak}
          categoryFilter={categoryFilter}
          onSelectCategory={changeCategoryFilter}
          title="अक्षर पहचानो"
          subtitle="ध्वनि सुनकर सही अक्षर चुनो"
          onBackToLibrary={onBackToLibrary}
        />
        <main className="flex-1 flex items-center justify-center py-6">
          <RoundSummary
            stats={stats}
            categoryFilter={categoryFilter}
            onRestart={() => restartQuiz()}
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
    return null;
  }

  return (
    <div className="min-h-screen bg-toy-canvas flex flex-col justify-between">
      {/* Top Bar with Category Filter & Stats */}
      <Header
        score={stats.score}
        streak={stats.streak}
        categoryFilter={categoryFilter}
        onSelectCategory={changeCategoryFilter}
        title="अक्षर पहचानो"
        subtitle="ध्वनि सुनकर सही अक्षर चुनो"
        onBackToLibrary={onBackToLibrary}
      />

      {/* Main Play Area */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-4xl w-full mx-auto px-4 py-4">
        {/* Visual Progress Bar */}
        <ProgressBar currentIndex={currentIndex} totalQuestions={totalQuestions} />

        {/* Audio Speaker Prompt */}
        <AudioButton
          isPlaying={isAudioPlaying}
          onPlay={playCurrentAudio}
          hasPlayedOnce={true}
        />

        {/* Feedback Message / Prompt Banner */}
        <FeedbackBanner feedback={feedback} attempts={wrongOptionIds.length} />

        {/* 3 Character Option Cards */}
        <div className="w-full grid grid-cols-3 gap-3 md:gap-6 my-4 max-w-2xl">
          {currentQuestion.options.map((option, idx) => (
            <AnswerCard
              key={option.id}
              character={option}
              index={idx}
              isSelected={selectedOptionId === option.id}
              isWrong={wrongOptionIds.includes(option.id)}
              feedback={feedback}
              isQuestionAnswered={isQuestionAnswered}
              onSelect={handleSelectOption}
            />
          ))}
        </div>

        {/* Action Area (Next Button after correct answer) */}
        <div className="h-20 flex items-center justify-center mt-2">
          {isQuestionAnswered && (
            <button
              ref={nextButtonRef}
              onClick={handleNextQuestion}
              className="flex items-center gap-3 bg-gradient-to-b from-toy-mint to-toy-mint-dark text-white text-xl md:text-2xl font-extrabold px-10 py-4 rounded-3xl border-4 border-emerald-600 shadow-toy-lg hover:shadow-toy-xl hover:-translate-y-1 active:translate-y-1 active:shadow-toy-sm animate-pop-in focus:outline-none focus:ring-4 focus:ring-toy-mint/50"
            >
              <span>{currentIndex + 1 === totalQuestions ? 'परिणाम देखें' : 'अगला प्रश्न'}</span>
              <ArrowRight className="w-7 h-7 stroke-[3]" />
            </button>
          )}
        </div>
      </main>

      {/* Footer Instructions / Keyboard shortcuts helper */}
      <footer className="py-3 px-4 text-center text-xs md:text-sm text-slate-500 font-semibold flex items-center justify-center gap-4 flex-wrap">
        <span>💡 सुझाव: कार्ड चुनने के लिए [1], [2], [3] दबाएँ</span>
        <span className="hidden sm:inline">•</span>
        <span className="hidden sm:inline">आवाज़ के लिए [Space]</span>
        <span className="hidden sm:inline">•</span>
        <span className="hidden sm:inline">आगे बढ़ने के लिए [Enter]</span>
      </footer>
    </div>
  );
};
