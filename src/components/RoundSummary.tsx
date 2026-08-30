import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, RotateCcw } from 'lucide-react';
import { ActivityStats, CategoryFilter } from '../types/activity';

interface RoundSummaryProps {
  stats: ActivityStats;
  categoryFilter?: CategoryFilter;
  onRestart: () => void;
}

export const RoundSummary: React.FC<RoundSummaryProps> = ({ stats, categoryFilter = 'all', onRestart }) => {
  useEffect(() => {
    // Launch playful confetti burst
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#FFD12A', '#FF8A00', '#FF5C5C', '#2F80ED', '#27AE60'],
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, []);

  const totalPossible = stats.totalQuestions * 10;
  const percentage = Math.round((stats.score / totalPossible) * 100);

  let starsEarned = 1;
  let title = 'बहुत अच्छा प्रयास! 👏';
  
  const categoryName =
    categoryFilter === 'vowel'
      ? 'स्वरों'
      : categoryFilter === 'consonant'
      ? 'व्यंजनों'
      : 'अक्षरों';

  let message = `आपने सभी ${categoryName} का अभ्यास पूरा कर लिया!`;

  if (percentage >= 80) {
    starsEarned = 3;
    title = 'शानदार! अद्भुत प्रदर्शन! 🏆';
    message = `आपने लगभग सभी ${categoryName} पहली बार में सही पहचाने!`;
  } else if (percentage >= 50) {
    starsEarned = 2;
    title = 'शाबाश! बहुत बढ़िया! ⭐';
    message = 'आप बहुत अच्छा सीख रहे हैं!';
  }

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8 animate-pop-in">
      <div className="bg-white rounded-3xl border-4 border-toy-yellow p-8 text-center shadow-toy-xl relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-toy-yellow/20 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-toy-sky/20 rounded-full blur-xl pointer-events-none" />

        {/* Trophy / Badge Icon */}
        <div className="inline-flex p-4 rounded-3xl bg-gradient-to-br from-toy-yellow to-toy-orange text-white shadow-toy-md mb-4 transform hover:scale-110 transition-transform">
          <Trophy className="w-16 h-16" />
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-2">
          {title}
        </h2>
        <p className="text-slate-600 font-bold text-base md:text-lg mb-6">
          {message}
        </p>

        {/* Big 3-Star Rating */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {[1, 2, 3].map((starIdx) => {
            const isFilled = starIdx <= starsEarned;
            return (
              <div
                key={starIdx}
                className={`transform transition-all duration-500 ${
                  isFilled
                    ? 'scale-110 text-toy-yellow'
                    : 'scale-90 text-slate-200'
                }`}
                style={{
                  transitionDelay: `${starIdx * 200}ms`,
                }}
              >
                <Star
                  className={`w-14 h-14 md:w-16 md:h-16 ${
                    isFilled ? 'fill-toy-yellow filter drop-shadow-md' : 'fill-slate-200'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 mb-8">
          <div className="flex flex-col items-center">
            <span className="text-xs md:text-sm font-bold text-slate-500">कुल अंक (Score)</span>
            <span className="text-2xl md:text-3xl font-extrabold text-toy-blue">
              {stats.score} <span className="text-base text-slate-400">/ {totalPossible}</span>
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-xs md:text-sm font-bold text-slate-500">पहली बार में सही</span>
            <span className="text-2xl md:text-3xl font-extrabold text-toy-mint">
              {stats.firstAttemptSuccessCount} <span className="text-base text-slate-400">/ {stats.totalQuestions}</span>
            </span>
          </div>
        </div>

        {/* Play Again Button */}
        <button
          onClick={onRestart}
          className="w-full max-w-sm mx-auto flex items-center justify-center gap-3 bg-gradient-to-b from-toy-mint to-toy-mint-dark text-white text-xl md:text-2xl font-extrabold px-8 py-4 rounded-3xl border-4 border-emerald-600 shadow-toy-lg hover:shadow-toy-xl hover:-translate-y-1 active:translate-y-1 active:shadow-toy-sm transition-all"
        >
          <RotateCcw className="w-6 h-6 stroke-[3]" />
          <span>फिर से खेलें</span>
        </button>
      </div>
    </div>
  );
};
