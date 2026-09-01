import React from 'react';
import { useSentenceBuilder } from '../hooks/useSentenceBuilder';
import { SentenceWordCard } from './SentenceWordCard';
import { SentenceConstructionArea } from './SentenceConstructionArea';
import { SentenceDifficultySelector } from './SentenceDifficultySelector';
import { Header } from './Header';
import { ProgressBar } from './ProgressBar';
import { FeedbackBanner } from './FeedbackBanner';
import { RoundSummary } from './RoundSummary';
import { Check, RotateCcw, Lightbulb, Volume2, ArrowRight } from 'lucide-react';

interface SentenceBuilderActivityProps {
  onBackToLibrary: () => void;
}

export const SentenceBuilderActivity: React.FC<SentenceBuilderActivityProps> = ({
  onBackToLibrary,
}) => {
  const {
    difficulty,
    questions,
    currentIndex,
    currentQuestion,
    availableWords,
    placedWords,
    isChecked,
    isCorrect,
    feedback,
    attempts,
    hintUsed,
    isRoundComplete,
    stats,
    placeWord,
    removeWord,
    clearPlacedWords,
    useHint,
    checkSentence,
    playFullSentenceAudio,
    nextQuestion,
    restartRound,
    setDifficulty,
  } = useSentenceBuilder();

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-toy-canvas flex items-center justify-center font-hindi p-4">
        <div className="bg-white p-8 rounded-3xl shadow-toy-md text-center max-w-md">
          <p className="text-xl font-bold text-slate-700">कोई वाक्य उपलब्ध नहीं है।</p>
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

  const totalWordsCount = currentQuestion.sentence.words.length;
  const isAllPlaced = placedWords.length === totalWordsCount;

  return (
    <div className="min-h-screen bg-toy-canvas flex flex-col items-center justify-between p-3 md:p-6 font-hindi select-none">
      {/* 1. Header with dynamic score, streak, and back button */}
      <Header
        score={stats.score}
        streak={stats.streak}
        title="वाक्य बनाओ"
        subtitle="शब्दों को सही क्रम में लगाकर वाक्य बनाओ"
        onBackToLibrary={onBackToLibrary}
      />

      {/* 2. Main Game Canvas */}
      <main className="w-full max-w-3xl flex flex-col items-center my-auto py-2">
        {/* Progress Bar */}
        <ProgressBar
          currentIndex={currentIndex}
          totalQuestions={questions.length}
        />

        {/* Difficulty Selector */}
        <SentenceDifficultySelector
          currentDifficulty={difficulty}
          onSelectDifficulty={setDifficulty}
          disabled={isCorrect}
        />

        {/* Target Context Prompt Card */}
        <div className="w-full max-w-xl mx-auto flex items-center justify-between bg-white/90 border-2 border-toy-purple/40 px-4 py-2 rounded-2xl shadow-toy-sm mb-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{currentQuestion.sentence.emoji || '📝'}</span>
            <div className="text-left">
              <p className="text-xs md:text-sm font-extrabold text-slate-700">
                इन शब्दों को सही क्रम में लगाओ:
              </p>
              {isCorrect && (
                <p className="text-xs font-semibold text-emerald-600 animate-pop-in">
                  अर्थ: {currentQuestion.sentence.meaning}
                </p>
              )}
            </div>
          </div>

          {/* Full Sentence Audio Button (Available always, highlighted upon solve) */}
          <button
            onClick={playFullSentenceAudio}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all ${
              isCorrect
                ? 'bg-toy-mint text-white shadow-toy-sm hover:bg-emerald-600 scale-105 animate-bounce-short'
                : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
            }`}
            title="पूरा वाक्य सुनें"
            aria-label="पूरा वाक्य सुनें"
          >
            <Volume2 className="w-4 h-4" />
            <span>सुनो 🔊</span>
          </button>
        </div>

        {/* Placed Words Sentence Construction Area */}
        <SentenceConstructionArea
          placedWords={placedWords}
          totalExpectedCount={totalWordsCount}
          isCorrect={isCorrect}
          isIncorrect={isChecked && !isCorrect}
          onRemoveWord={removeWord}
        />

        {/* Feedback Message */}
        <div className="w-full max-w-md my-1 min-h-[44px] flex items-center justify-center">
          <FeedbackBanner
            feedback={feedback}
            attempts={attempts}
            promptText="शब्द चुनकर सही क्रम में लगाएँ 👇"
            correctMessage={`बहुत बढ़िया! 🎉 सही वाक्य: ${currentQuestion.sentence.fullSentence}`}
            incorrectMessage="फिर कोशिश करो! 😊 शब्दों का क्रम बदलें"
          />
        </div>

        {/* Available Words Tray */}
        <div className="w-full max-w-2xl mx-auto my-2 p-4 bg-white/80 border-2 border-slate-200 rounded-3xl shadow-toy-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
              उपलब्ध शब्द
            </span>
            <span className="text-xs font-bold text-slate-400">
              {availableWords.length} बाकी
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 min-h-[56px]">
            {availableWords.length === 0 ? (
              <span className="text-xs font-bold text-slate-400 select-none">
                सभी शब्द वाक्य में रखे जा चुके हैं ✨
              </span>
            ) : (
              availableWords.map((word) => (
                <SentenceWordCard
                  key={word.id}
                  word={word}
                  mode="available"
                  disabled={isCorrect}
                  onClick={() => placeWord(word)}
                />
              ))
            )}
          </div>
        </div>

        {/* Interactive Action Buttons */}
        <div className="w-full max-w-xl flex items-center justify-center gap-2 sm:gap-3 mt-2">
          {!isCorrect ? (
            <>
              {/* Hint Button */}
              <button
                onClick={useHint}
                disabled={hintUsed}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm border-2 transition-all ${
                  hintUsed
                    ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-amber-50 border-amber-300 text-amber-800 shadow-toy-sm hover:bg-amber-100 active:scale-95'
                }`}
                title="संकेत देखें"
              >
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>संकेत</span>
              </button>

              {/* Clear Placed Words Button */}
              <button
                onClick={clearPlacedWords}
                disabled={placedWords.length === 0}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm border-2 transition-all ${
                  placedWords.length === 0
                    ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-white border-slate-300 text-slate-700 shadow-toy-sm hover:bg-slate-50 active:scale-95'
                }`}
                title="सभी रखे गए शब्द हटाएँ"
              >
                <RotateCcw className="w-4 h-4" />
                <span>साफ़ करें</span>
              </button>

              {/* Check Answer CTA Button */}
              <button
                onClick={checkSentence}
                disabled={!isAllPlaced}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black text-base sm:text-lg transition-all ${
                  isAllPlaced
                    ? 'bg-gradient-to-r from-toy-blue to-indigo-600 text-white shadow-toy-md hover:shadow-toy-lg hover:from-toy-blue-dark hover:to-indigo-700 active:scale-95 animate-pop-in'
                    : 'bg-slate-200 text-slate-400 border-2 border-slate-300 cursor-not-allowed'
                }`}
              >
                <Check className="w-5 h-5 stroke-[3]" />
                <span>जाँचें</span>
              </button>
            </>
          ) : (
            /* Next Question CTA Button (When Solved) */
            <button
              onClick={nextQuestion}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-toy-mint to-emerald-600 text-white font-black text-lg md:text-xl shadow-toy-md hover:shadow-toy-lg hover:from-toy-mint-dark hover:to-emerald-700 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 animate-pop-in"
            >
              <span>अगला प्रश्न</span>
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
