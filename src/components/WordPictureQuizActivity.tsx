import React from 'react';
import { useWordPictureQuiz } from '../hooks/useWordPictureQuiz';
import { WordPromptCard } from './WordPromptCard';
import { PictureOptionCard } from './PictureOptionCard';
import { Header } from './Header';
import { ProgressBar } from './ProgressBar';
import { FeedbackBanner } from './FeedbackBanner';
import { RoundSummary } from './RoundSummary';
import { ArrowRight } from 'lucide-react';

interface WordPictureQuizActivityProps {
  onBackToLibrary: () => void;
}

export const WordPictureQuizActivity: React.FC<WordPictureQuizActivityProps> = ({ onBackToLibrary }) => {
  const {
    questions,
    currentIndex,
    currentQuestion,
    wrongOptionIds,
    feedback,
    attempts,
    isSolved,
    isRoundComplete,
    categoryFilter,
    stats,
    selectOption,
    playCurrentWordAudio,
    nextQuestion,
    restartRound,
    setCategoryFilter,
  } = useWordPictureQuiz();

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-toy-canvas flex items-center justify-center font-hindi p-4">
        <div className="bg-white p-8 rounded-3xl shadow-toy-md text-center max-w-md">
          <p className="text-xl font-bold text-slate-700">कोई प्रश्न उपलब्ध नहीं है।</p>
          <button
            onClick={restartRound}
            className="mt-4 bg-toy-blue text-white px-6 py-2.5 rounded-2xl font-bold shadow-toy-sm hover:bg-toy-blue-dark transition-all"
          >
            फिर से लोड करें
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-toy-canvas flex flex-col items-center justify-between p-3 md:p-6 font-hindi select-none">
      {/* 1. Header with dynamic score, streak, category filters and back button */}
      <Header
        score={stats.score}
        streak={stats.streak}
        categoryFilter={categoryFilter}
        onSelectCategory={setCategoryFilter}
        title="शब्द देखकर चित्र चुनो"
        subtitle="हिन्दी शब्द पढ़कर सही चित्र चुनो"
        onBackToLibrary={onBackToLibrary}
      />

      {/* 2. Main Game Canvas */}
      <main className="w-full max-w-3xl flex flex-col items-center my-auto py-2">
        {/* Progress Bar (e.g. प्रश्न 3 / 10) */}
        <ProgressBar
          currentIndex={currentIndex}
          totalQuestions={questions.length}
        />

        {/* Word Prompt Card (Hindi Word + Audio button) */}
        <WordPromptCard
          item={currentQuestion.targetItem}
          onPlayAudio={playCurrentWordAudio}
        />

        {/* Feedback Message */}
        <div className="w-full max-w-md my-1 min-h-[50px] flex items-center justify-center">
          <FeedbackBanner
            feedback={feedback}
            attempts={attempts}
            promptText="सही चित्र पहचानकर चुनें 👇"
          />
        </div>

        {/* 3 Picture Choice Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 my-2 px-2">
          {currentQuestion.options.map((opt, idx) => (
            <PictureOptionCard
              key={opt.id}
              option={opt}
              index={idx}
              isCorrect={isSolved && opt.id === currentQuestion.correctAnswerId}
              isWrong={wrongOptionIds.includes(opt.id)}
              disabled={isSolved}
              onClick={() => selectOption(opt.id)}
            />
          ))}
        </div>

        {/* Next Question CTA Button */}
        {isSolved && (
          <div className="w-full max-w-md flex justify-center mt-3 animate-pop-in">
            <button
              onClick={nextQuestion}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-toy-mint to-emerald-600 text-white font-black text-lg md:text-xl shadow-toy-md hover:shadow-toy-lg hover:from-toy-mint-dark hover:to-emerald-700 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <span>अगला प्रश्न</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        )}
      </main>

      {/* 3. Celebratory End-of-Round Summary Modal */}
      {isRoundComplete && (
        <RoundSummary
          stats={stats}
          onRestart={restartRound}
          onBackToLibrary={onBackToLibrary}
        />
      )}
    </div>
  );
};
