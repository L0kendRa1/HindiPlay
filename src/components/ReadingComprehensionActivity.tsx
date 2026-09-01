import React from 'react';
import { useReadingComprehension } from '../hooks/useReadingComprehension';
import { StoryReader } from './StoryReader';
import { StoryQuestionCard } from './StoryQuestionCard';
import { StoryDifficultySelector } from './StoryDifficultySelector';
import { Header } from './Header';
import { ProgressBar } from './ProgressBar';
import { FeedbackBanner } from './FeedbackBanner';
import { RoundSummary } from './RoundSummary';
import { Check, ArrowRight } from 'lucide-react';

interface ReadingComprehensionActivityProps {
  onBackToLibrary: () => void;
}

export const ReadingComprehensionActivity: React.FC<ReadingComprehensionActivityProps> = ({
  onBackToLibrary,
}) => {
  const {
    difficulty,
    stories,
    currentStoryIndex,
    currentStory,
    currentQuestionIndex,
    currentQuestion,
    totalStoryQuestions,
    selectedOption,
    isChecked,
    isCorrect,
    feedback,
    attempts,
    isPlayingAudio,
    isRoundComplete,
    stats,
    selectOption,
    checkAnswer,
    playStoryAudio,
    stopStoryAudio,
    nextQuestion,
    restartRound,
    setDifficulty,
  } = useReadingComprehension();

  if (!currentStory || !currentQuestion) {
    return (
      <div className="min-h-screen bg-toy-canvas flex items-center justify-center font-hindi p-4">
        <div className="bg-white p-8 rounded-3xl shadow-toy-md text-center max-w-md">
          <p className="text-xl font-bold text-slate-700">कोई कहानी उपलब्ध नहीं है।</p>
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

  const isLastQuestionInStory = currentQuestionIndex + 1 >= totalStoryQuestions;
  const isLastStory = currentStoryIndex + 1 >= stories.length;

  return (
    <div className="min-h-screen bg-toy-canvas flex flex-col items-center justify-between p-3 md:p-6 font-hindi select-none">
      {/* 1. Top Header */}
      <Header
        score={stats.score}
        streak={stats.streak}
        title="कहानी पढ़ो और समझो"
        subtitle="छोटी कहानी पढ़ो, सुनो और सवालों के जवाब दो"
        onBackToLibrary={onBackToLibrary}
      />

      {/* 2. Main Activity Canvas */}
      <main className="w-full max-w-4xl flex flex-col items-center my-auto py-2">
        {/* Progress Bar (Shows story & question progression) */}
        <ProgressBar
          currentIndex={stats.currentQuestionIndex}
          totalQuestions={stats.totalQuestions}
        />

        {/* Story Index Banner & Difficulty Selector */}
        <div className="w-full max-w-3xl flex flex-col sm:flex-row items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 bg-white/80 border-2 border-amber-200 px-3 py-1 rounded-2xl text-xs font-black text-slate-700 shadow-xs">
            <span className="text-base">📚</span>
            <span>कहानी: {currentStoryIndex + 1} / {stories.length}</span>
          </div>

          <StoryDifficultySelector
            currentDifficulty={difficulty}
            onSelectDifficulty={setDifficulty}
            disabled={isCorrect}
          />
        </div>

        {/* Story Reader Box */}
        <StoryReader
          story={currentStory}
          isPlayingAudio={isPlayingAudio}
          onPlayAudio={playStoryAudio}
          onStopAudio={stopStoryAudio}
        />

        {/* Comprehension Question Card */}
        <StoryQuestionCard
          question={currentQuestion}
          questionIndex={currentQuestionIndex}
          totalQuestions={totalStoryQuestions}
          selectedOption={selectedOption}
          isChecked={isChecked}
          isCorrect={isCorrect}
          disabled={false}
          onSelectOption={selectOption}
        />

        {/* Feedback Message */}
        <div className="w-full max-w-md my-2 min-h-[44px] flex items-center justify-center">
          <FeedbackBanner
            feedback={feedback}
            attempts={attempts}
            promptText="सही जवाब चुनकर 'जाँचें' दबाएँ 👇"
            correctMessage={`🎉 बहुत बढ़िया! सही जवाब: ${currentQuestion.correctAnswer}`}
            incorrectMessage="फिर कोशिश करो! 😊 कहानी दोबारा पढ़कर सही जवाब चुनें"
          />
        </div>

        {/* Action Controls Bar */}
        <div className="w-full max-w-md flex items-center justify-center mt-1">
          {!isCorrect ? (
            /* Check Answer Button */
            <button
              onClick={checkAnswer}
              disabled={!selectedOption}
              className={`w-full py-3.5 px-6 rounded-2xl font-black text-lg md:text-xl transition-all flex items-center justify-center gap-2 ${
                selectedOption
                  ? 'bg-gradient-to-r from-toy-blue to-indigo-600 text-white shadow-toy-md hover:shadow-toy-lg active:scale-95 animate-pop-in'
                  : 'bg-slate-200 text-slate-400 border-2 border-slate-300 cursor-not-allowed'
              }`}
            >
              <Check className="w-5 h-5 stroke-[3]" />
              <span>जाँचें</span>
            </button>
          ) : (
            /* Next Question / Story Button */
            <button
              onClick={nextQuestion}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-toy-mint to-emerald-600 text-white font-black text-lg md:text-xl shadow-toy-md hover:shadow-toy-lg active:translate-y-0.5 transition-all flex items-center justify-center gap-2 animate-pop-in"
            >
              <span>
                {isLastQuestionInStory
                  ? isLastStory
                    ? 'परिणाम देखें 🎉'
                    : 'अगली कहानी ➔'
                  : 'अगला सवाल ➔'}
              </span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>
          )}
        </div>
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
