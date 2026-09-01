import React from 'react';
import { useMemoryGame } from '../hooks/useMemoryGame';
import { MemoryCard } from './MemoryCard';
import { MemoryDifficultySelector } from './MemoryDifficultySelector';
import { Header } from './Header';
import { MEMORY_DIFFICULTIES } from '../types/memoryGame';
import { RotateCcw, Sparkles, Trophy, Star, Home } from 'lucide-react';

interface MemoryGameActivityProps {
  onBackToLibrary: () => void;
}

export const MemoryGameActivity: React.FC<MemoryGameActivityProps> = ({ onBackToLibrary }) => {
  const {
    difficulty,
    cards,
    flippedCardIds,
    matchedPairIds,
    moves,
    score,
    isChecking,
    isGameComplete,
    totalPairs,
    matchedPairsCount,
    flipCard,
    setDifficulty,
    restartGame,
  } = useMemoryGame('easy');

  const config = MEMORY_DIFFICULTIES[difficulty];

  return (
    <div className="min-h-screen bg-toy-canvas flex flex-col items-center justify-between p-3 md:p-6 font-hindi select-none">
      {/* 1. Top Header */}
      <Header
        score={score}
        title="याद करो और मिलाओ"
        subtitle="चित्र और शब्द के जोड़े याद करके मिलाओ"
        onBackToLibrary={onBackToLibrary}
      />

      {/* 2. Main Game Canvas */}
      <main className="w-full max-w-4xl flex flex-col items-center my-auto py-2">
        {/* Difficulty Selector */}
        <MemoryDifficultySelector
          currentDifficulty={difficulty}
          onSelectDifficulty={setDifficulty}
          disabled={isChecking}
        />

        {/* Live Game Stats Banner */}
        <div className="w-full max-w-2xl flex items-center justify-between bg-white border-2 border-toy-mint px-4 py-2 rounded-2xl shadow-toy-sm mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎴</span>
            <div className="flex items-center gap-1 text-xs md:text-sm font-black text-slate-700">
              <span>जोड़े:</span>
              <span className="text-emerald-600 text-sm md:text-base">
                {matchedPairsCount} / {totalPairs}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-xs md:text-sm font-black text-slate-700">
              <span>चालें:</span>
              <span className="text-toy-blue text-sm md:text-base">{moves}</span>
            </div>

            <div className="flex items-center gap-1 bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full text-xs font-black">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{score} अंक</span>
            </div>
          </div>
        </div>

        {/* Memory Game Card Grid */}
        <div className={`w-full grid ${config.gridColsClass} gap-2.5 sm:gap-3.5 md:gap-4 max-w-3xl my-2 px-1`}>
          {cards.map((card, idx) => (
            <MemoryCard
              key={card.id}
              card={card}
              index={idx}
              isFlipped={flippedCardIds.includes(card.id)}
              isMatched={matchedPairIds.includes(card.pairId)}
              disabled={isChecking}
              onClick={() => flipCard(card.id)}
            />
          ))}
        </div>

        {/* Bottom Actions Bar */}
        <div className="w-full max-w-2xl flex items-center justify-between mt-3 pt-2">
          <button
            onClick={restartGame}
            disabled={isChecking}
            className="inline-flex items-center gap-1.5 bg-white border-2 border-slate-300 text-slate-700 px-4 py-2 rounded-2xl font-black text-xs md:text-sm shadow-toy-sm hover:bg-slate-100 hover:border-slate-400 active:scale-95 transition-all"
            title="नया गेम शुरू करें"
          >
            <RotateCcw className="w-4 h-4" />
            <span>फिर से खेलें</span>
          </button>

          <span className="text-xs font-semibold text-slate-400">
            हिंदी बाल मंच • स्मृति खेल
          </span>
        </div>
      </main>

      {/* 3. Celebratory End-of-Game Completion Modal */}
      {isGameComplete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-pop-in">
          <div className="bg-white rounded-3xl border-4 border-toy-yellow p-6 md:p-8 max-w-md w-full shadow-toy-xl text-center relative overflow-hidden">
            {/* Top Trophy / Badge */}
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-500 mx-auto flex items-center justify-center shadow-toy-md mb-4 animate-bounce-short">
              <Trophy className="w-10 h-10 text-white stroke-[2.5]" />
            </div>

            <h2 className="text-3xl font-black font-hindi text-slate-800 mb-1">
              बधाई! 🎉
            </h2>
            <p className="text-base font-bold text-emerald-600 mb-4">
              सभी जोड़े मिल गए!
            </p>

            {/* Stars */}
            <div className="flex justify-center gap-2 mb-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Star
                  key={i}
                  className="w-7 h-7 text-toy-yellow fill-toy-yellow animate-pop-in"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 mb-6">
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-500">कुल जोड़े</span>
                <span className="text-2xl font-black text-slate-800">
                  {totalPairs} / {totalPairs}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-500">कुल चालें</span>
                <span className="text-2xl font-black text-toy-blue">
                  {moves}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={restartGame}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-toy-yellow to-toy-orange text-slate-900 font-black text-base shadow-toy-md hover:shadow-toy-lg active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                <span>फिर से खेलें</span>
              </button>

              <button
                onClick={onBackToLibrary}
                className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 border-2 border-slate-200 text-slate-700 font-black text-base shadow-toy-sm hover:bg-slate-200 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                <span>गतिविधियाँ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
