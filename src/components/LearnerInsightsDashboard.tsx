import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLearningInsights } from '../hooks/useLearningInsights';
import { ProgressTrendChart } from './ProgressTrendChart';
import { StrengthWeaknessOverview } from './StrengthWeaknessOverview';
import { PersonalizedRecommendations } from './PersonalizedRecommendations';
import { ACTIVITIES_REGISTRY, ActivityMeta } from '../data/activityRegistry';
import {
  RotateCw,
  ArrowLeft,
  LogIn,
  Compass,
  AlertTriangle,
  BarChart3,
} from 'lucide-react';

interface LearnerInsightsDashboardProps {
  onBackToLibrary: () => void;
  onBackToDashboard?: () => void;
  onLoginClick?: () => void;
  onContinueGuest?: () => void;
  onSelectActivity?: (activity: ActivityMeta) => void;
}

export const LearnerInsightsDashboard: React.FC<LearnerInsightsDashboardProps> = ({
  onBackToLibrary,
  onBackToDashboard,
  onLoginClick,
  onContinueGuest,
  onSelectActivity,
}) => {
  const { user, isAuthenticated } = useAuth();
  const { insights, isLoading, error, refetch } = useLearningInsights();

  // Helper to format study duration
  const formatTimeSpent = (seconds: number) => {
    if (!seconds || seconds <= 0) return '0 मिनट';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs} सेकंड`;
    return `${mins} मिनट ${secs > 0 ? `${secs} से.` : ''}`;
  };

  // 1. Guest Mode State
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-toy-canvas flex flex-col justify-between font-hindi select-none">
        <header className="w-full bg-white/90 backdrop-blur border-b-2 border-slate-200 sticky top-0 z-30 shadow-xs">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <button
              onClick={onBackToLibrary}
              className="flex items-center gap-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 px-3.5 py-1.5 rounded-2xl text-xs sm:text-sm font-black shadow-2xs transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>लाइब्रेरी पर वापस</span>
            </button>
            <span className="text-sm font-black text-slate-700">सीखने के अंतर्दृष्टि</span>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-12 text-center flex-1 flex flex-col justify-center items-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-toy-blue to-toy-sky text-white flex items-center justify-center text-4xl shadow-toy-md mb-6 animate-bounce-short">
            📊
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-2">
            अभिभावक व शिक्षक अंतर्दृष्टि
          </h2>
          <p className="text-sm font-bold text-slate-500 mb-8 max-w-sm">
            विस्तृत सीखने की प्रगति, सटीकता ग्राफ़ और मज़बूत/कमज़ोर क्षेत्रों का विश्लेषण देखने के लिए लॉगिन करें।
          </p>

          <div className="w-full flex flex-col gap-3">
            {onLoginClick && (
              <button
                onClick={onLoginClick}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-toy-orange to-toy-yellow text-white font-black text-base shadow-toy-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                <span>लॉगिन करें</span>
              </button>
            )}

            {onContinueGuest && (
              <button
                onClick={onContinueGuest}
                className="w-full py-3 px-6 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-700 font-extrabold text-sm shadow-2xs hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                अतिथि के रूप में जारी रखें
              </button>
            )}
          </div>
        </main>

        <footer className="py-4 text-center text-xs font-bold text-slate-400">
          HindiPlay • हिंदी बाल मंच
        </footer>
      </div>
    );
  }

  // 2. Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-toy-canvas flex flex-col items-center justify-center font-hindi select-none">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-toy-blue to-toy-sky flex items-center justify-center text-3xl shadow-toy-md animate-bounce-short mb-4 text-white">
          📈
        </div>
        <p className="text-base font-extrabold text-slate-700">
          सीखने के आंकड़े तैयार हो रहे हैं...
        </p>
      </div>
    );
  }

  // 3. Error State
  if (error && !insights) {
    return (
      <div className="min-h-screen bg-toy-canvas flex flex-col items-center justify-center font-hindi select-none p-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 border-2 border-rose-200 flex items-center justify-center text-3xl shadow-2xs mb-4 text-rose-600">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-black text-slate-800 mb-1">{error}</h2>
        <p className="text-xs font-bold text-slate-500 mb-6 text-center max-w-xs">
          कृपया इंटरनेट कनेक्शन जांचें या थोड़ी देर बाद दोबारा प्रयास करें।
        </p>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-1.5 bg-gradient-to-r from-toy-sky to-toy-blue text-white px-5 py-2.5 rounded-2xl text-sm font-black shadow-toy-sm hover:scale-105 active:scale-95 transition-all"
        >
          <RotateCw className="w-4 h-4" />
          <span>फिर से कोशिश करें</span>
        </button>
      </div>
    );
  }

  const overview = insights?.overview || {
    totalActivitiesCompleted: 0,
    totalAttempts: 0,
    totalQuestions: 0,
    totalCorrect: 0,
    overallAccuracy: 0,
    totalTimeSpentSeconds: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalXp: 0,
    totalStars: 0,
    badgesEarnedCount: 0,
  };

  const hasData = insights?.hasData ?? false;
  const displayName = user?.name ? `नमस्ते, ${user.name}! 👋` : 'नमस्ते! 👋';

  return (
    <div className="min-h-screen bg-toy-canvas flex flex-col justify-between font-hindi select-none">
      {/* Header */}
      <header className="w-full bg-white/90 backdrop-blur border-b-2 border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToLibrary}
              className="flex items-center gap-1.5 bg-white hover:bg-slate-100 border-2 border-slate-200 text-slate-700 px-3 py-1.5 rounded-2xl text-xs font-black shadow-2xs hover:scale-105 active:scale-95 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>लाइब्रेरी</span>
            </button>

            {onBackToDashboard && (
              <button
                onClick={onBackToDashboard}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-2xl text-xs font-black shadow-2xs transition-all"
              >
                <span>मेरी प्रगति</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-700 bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-2xl">
              📊 अभिभावक व शिक्षक अंतर्दृष्टि
            </span>
            <button
              onClick={() => refetch()}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black shadow-2xs transition-all"
              title="ताज़ा करें"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 py-6 sm:py-8 w-full flex-1 space-y-6">
        {/* Welcome & Persona Banner */}
        <div className="bg-gradient-to-r from-toy-blue via-indigo-600 to-toy-purple rounded-3xl p-6 md:p-8 text-white shadow-toy-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black bg-white/20 backdrop-blur px-3 py-1 rounded-full uppercase tracking-wider block w-fit mb-2">
              सीखने का विश्लेषण (Learning Insights)
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black drop-shadow-xs">
              {displayName}
            </h1>
            <p className="text-xs sm:text-sm font-bold text-sky-100 mt-1">
              हिंदी सीखने की क्षमता, निरंतरता और सटीकता का विस्तृत विवरण
            </p>
          </div>

          <button
            onClick={onBackToLibrary}
            className="bg-white hover:bg-sky-50 text-indigo-900 px-5 py-2.5 rounded-2xl text-sm font-black shadow-toy-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shrink-0 self-stretch sm:self-auto justify-center"
          >
            <Compass className="w-4 h-4 text-indigo-600" />
            <span>अभ्यास शुरू करें</span>
          </button>
        </div>

        {/* 1. High-Level Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* कुल अभ्यास पूर्ण */}
          <div className="bg-white rounded-2xl p-3.5 border-2 border-slate-200 shadow-2xs text-center">
            <span className="text-[10px] font-black text-slate-400 block uppercase">
              पूर्ण अभ्यास
            </span>
            <span className="text-xl font-black text-emerald-600">
              {overview.totalActivitiesCompleted}
            </span>
          </div>

          {/* औसत सटीकता */}
          <div className="bg-white rounded-2xl p-3.5 border-2 border-slate-200 shadow-2xs text-center">
            <span className="text-[10px] font-black text-slate-400 block uppercase">
              औसत सटीकता
            </span>
            <span className="text-xl font-black text-toy-blue">
              {Math.round(overview.overallAccuracy)}%
            </span>
          </div>

          {/* कुल अभ्यास समय */}
          <div className="bg-white rounded-2xl p-3.5 border-2 border-slate-200 shadow-2xs text-center">
            <span className="text-[10px] font-black text-slate-400 block uppercase">
              अभ्यास समय
            </span>
            <span className="text-xs sm:text-sm font-black text-slate-700 block mt-1">
              {formatTimeSpent(overview.totalTimeSpentSeconds)}
            </span>
          </div>

          {/* वर्तमान लय */}
          <div className="bg-white rounded-2xl p-3.5 border-2 border-slate-200 shadow-2xs text-center">
            <span className="text-[10px] font-black text-slate-400 block uppercase">
              वर्तमान लय
            </span>
            <span className="text-xl font-black text-toy-orange">
              {overview.currentStreak} दिन
            </span>
          </div>

          {/* कुल XP */}
          <div className="bg-white rounded-2xl p-3.5 border-2 border-slate-200 shadow-2xs text-center">
            <span className="text-[10px] font-black text-slate-400 block uppercase">
              कुल XP
            </span>
            <span className="text-xl font-black text-amber-500">
              {overview.totalXp}
            </span>
          </div>

          {/* कुल स्टार */}
          <div className="bg-white rounded-2xl p-3.5 border-2 border-slate-200 shadow-2xs text-center">
            <span className="text-[10px] font-black text-slate-400 block uppercase">
              कुल स्टार
            </span>
            <span className="text-xl font-black text-yellow-500">
              {overview.totalStars}
            </span>
          </div>
        </div>

        {/* 2. Empty State if No Activity Records */}
        {!hasData ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-dashed border-slate-300 text-center shadow-xs">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-toy-sky to-toy-blue text-white flex items-center justify-center text-4xl shadow-toy-md mx-auto mb-4 animate-bounce-short">
              🚀
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-2">
              अभी कोई अभ्यास पूरा नहीं हुआ है।
            </h2>
            <p className="text-sm font-bold text-slate-500 mb-6 max-w-md mx-auto">
              पहला अभ्यास शुरू करें और अपनी सीखने की प्रगति का विश्लेषण देखें! 🚀
            </p>
            <button
              onClick={onBackToLibrary}
              className="py-3 px-8 rounded-2xl bg-gradient-to-r from-toy-orange to-toy-yellow text-white font-black text-base shadow-toy-md hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
            >
              <span>अभ्यास शुरू करें</span>
            </button>
          </div>
        ) : (
          <>
            {/* 3. Personalized Focus Recommendations ("अभी किस पर ध्यान दें?") */}
            {insights?.focusRecommendations && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-1">
                  <span className="text-sm font-black text-slate-800">
                    💡 अभी किस पर ध्यान दें? (Targeted Learning Focus)
                  </span>
                </div>
                <PersonalizedRecommendations
                  recommendation={insights.focusRecommendations}
                  onSelectActivity={onSelectActivity}
                  onViewAllActivities={onBackToLibrary}
                />
              </div>
            )}

            {/* 4. Strengths & Weaknesses Domain Overview */}
            <StrengthWeaknessOverview
              strengths={insights?.strengths || []}
              weaknesses={insights?.weaknesses || []}
              needsMoreData={insights?.needsMoreData || []}
            />

            {/* 5. Recent Performance Trend Sparkline */}
            {insights?.recentProgressTrend && (
              <ProgressTrendChart trendPoints={insights.recentProgressTrend} />
            )}

            {/* 6. Activity-Level Performance Breakdown */}
            {insights?.activityPerformance && insights.activityPerformance.length > 0 && (
              <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 text-white flex items-center justify-center text-xl shadow-2xs">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-800">
                        गतिविधि अनुसार प्रदर्शन (Activity Breakdown)
                      </h3>
                      <p className="text-xs font-bold text-slate-500">
                        प्रत्येक गतिविधि में प्रयास, सर्वश्रेष्ठ अंक और वर्तमान स्थिति
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                    {insights.activityPerformance.length} गतिविधियाँ
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {insights.activityPerformance.map((act) => {
                    const regAct = ACTIVITIES_REGISTRY.find(
                      (a) => a.activityCode === act.activityId
                    );
                    const title = regAct?.title || act.skillName;
                    const icon = regAct?.icon || '🎮';

                    const statusBadge =
                      act.status === 'strong'
                        ? { text: 'मज़बूत', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' }
                        : act.status === 'needs-practice'
                        ? { text: 'अभ्यास आवश्यक', color: 'bg-rose-100 text-rose-800 border-rose-300' }
                        : { text: 'प्रगति पर', color: 'bg-amber-100 text-amber-800 border-amber-300' };

                    return (
                      <div
                        key={act.activityId}
                        className="bg-slate-50 border-2 border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between gap-3 hover:bg-slate-100/80 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-2xl shrink-0 p-1 bg-white rounded-xl border border-slate-200 shadow-2xs">
                              {icon}
                            </span>
                            <div className="min-w-0">
                              <h4 className="text-sm font-black text-slate-800 truncate">
                                {title}
                              </h4>
                              <span className="text-[11px] font-bold text-slate-400">
                                {act.attempts} प्रयास • {act.completedCount} बार पूर्ण
                              </span>
                            </div>
                          </div>

                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${statusBadge.color} shrink-0`}>
                            {statusBadge.text}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-center">
                          <div className="bg-white rounded-xl p-1.5 border border-slate-200">
                            <span className="text-[9px] font-bold text-slate-400 block uppercase">
                              सटीकता
                            </span>
                            <span className="text-xs sm:text-sm font-black text-toy-blue">
                              {Math.round(act.averageAccuracy)}%
                            </span>
                          </div>

                          <div className="bg-white rounded-xl p-1.5 border border-slate-200">
                            <span className="text-[9px] font-bold text-slate-400 block uppercase">
                              सर्वश्रेष्ठ
                            </span>
                            <span className="text-xs sm:text-sm font-black text-amber-600">
                              {act.bestScore}
                            </span>
                          </div>

                          <div className="bg-white rounded-xl p-1.5 border border-slate-200">
                            <span className="text-[9px] font-bold text-slate-400 block uppercase">
                              हालिया अंक
                            </span>
                            <span className="text-xs sm:text-sm font-black text-slate-700">
                              {act.mostRecentScore}/{act.mostRecentTotal}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs font-bold text-slate-400 border-t border-slate-200 bg-white/50">
        HindiPlay • अभिभावक व शिक्षक अंतर्दृष्टि मंच
      </footer>
    </div>
  );
};
