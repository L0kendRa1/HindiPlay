import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as gamificationService from '../services/gamificationService';
import * as progressService from '../services/progressService';
import {
  GamificationProfile,
  Badge,
  ProgressStats,
  ProgressRecord,
} from '../types/api';
import { BadgeCollection } from './BadgeCollection';
import { ActivityProgressList } from './ActivityProgressList';
import { PersonalizedRecommendations } from './PersonalizedRecommendations';
import { usePersonalizedLearning } from '../hooks/usePersonalizedLearning';
import { ActivityMeta } from '../data/activityRegistry';
import {
  Sparkles,
  Flame,
  Trophy,
  Star,
  RotateCw,
  ArrowLeft,
  LogIn,
  CheckCircle2,
  Clock,
  Compass,
  AlertTriangle,
} from 'lucide-react';

interface LearnerDashboardProps {
  onBackToLibrary: () => void;
  onLoginClick?: () => void;
  onContinueGuest?: () => void;
  onSelectActivity?: (activity: ActivityMeta) => void;
  onInsightsClick?: () => void;
}

export const LearnerDashboard: React.FC<LearnerDashboardProps> = ({
  onBackToLibrary,
  onLoginClick,
  onContinueGuest,
  onSelectActivity,
  onInsightsClick,
}) => {
  const { user, isAuthenticated } = useAuth();
  const { recommendation, refetch: refetchRecommendations } = usePersonalizedLearning();

  // Data states
  const [gamification, setGamification] = useState<GamificationProfile | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [earnedBadgeCount, setEarnedBadgeCount] = useState<number>(0);
  const [totalBadgeCount, setTotalBadgeCount] = useState<number>(0);
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [progressRecords, setProgressRecords] = useState<ProgressRecord[]>([]);

  // UI states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all dashboard data concurrently
  const loadDashboardData = useCallback(async (isRefresh = false) => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const [gamificationRes, badgesRes, statsRes, progressRes] = await Promise.all([
        gamificationService.getGamification(),
        gamificationService.getBadges(),
        progressService.getProgressStats(),
        progressService.getProgress({ limit: 50 }),
      ]);

      if (gamificationRes?.data) {
        setGamification(gamificationRes.data);
      }

      if (badgesRes?.data) {
        setBadges(badgesRes.data.badges || []);
        setEarnedBadgeCount(badgesRes.data.earnedCount || 0);
        setTotalBadgeCount(badgesRes.data.totalBadges || 0);
      }

      if (statsRes?.data) {
        setStats(statsRes.data);
      }

      if (progressRes?.data) {
        setProgressRecords(progressRes.data);
      }

      if (isRefresh) {
        await refetchRecommendations();
      }
    } catch {
      setError('प्रगति अभी लोड नहीं हो सकी।');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [isAuthenticated, refetchRecommendations]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Helper: format total study time in minutes and seconds
  const formatTimeSpent = (seconds: number) => {
    if (!seconds || seconds <= 0) return '0 मिनट';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs} सेकंड`;
    return `${mins} मिनट ${secs > 0 ? `${secs} से.` : ''}`;
  };

  // 1. Guest User State
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-toy-canvas flex flex-col justify-between font-hindi select-none">
        {/* Header */}
        <header className="w-full bg-white/90 backdrop-blur border-b-2 border-slate-200 sticky top-0 z-30 shadow-xs">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <button
              onClick={onBackToLibrary}
              className="flex items-center gap-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-black shadow-2xs transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>लाइब्रेरी पर वापस</span>
            </button>
            <span className="text-sm font-black text-slate-700">मेरी प्रगति</span>
          </div>
        </header>

        {/* Guest Lock Banner */}
        <main className="max-w-md mx-auto px-4 py-12 text-center flex-1 flex flex-col justify-center items-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-500 text-white flex items-center justify-center text-4xl shadow-toy-md mb-6 animate-bounce-short">
            🔒
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-2">
            अपनी प्रगति सुरक्षित करें
          </h2>
          <p className="text-sm font-bold text-slate-500 mb-8 max-w-sm">
            अपनी प्रगति सेव करने के लिए लॉगिन करें। आप अपने अर्जित XP, सितारे, और बैज देख पाएंगे!
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
          HindiPlay • खेल-खेल में सीखें
        </footer>
      </div>
    );
  }

  // 2. Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-toy-canvas flex flex-col items-center justify-center font-hindi select-none">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-toy-blue to-toy-sky flex items-center justify-center text-3xl shadow-toy-md animate-bounce-short mb-4 text-white">
          📊
        </div>
        <p className="text-base font-extrabold text-slate-700">
          प्रगति लोड हो रही है...
        </p>
      </div>
    );
  }

  // 3. Error State
  if (error && !gamification && !stats) {
    return (
      <div className="min-h-screen bg-toy-canvas flex flex-col items-center justify-center font-hindi select-none p-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 border-2 border-rose-200 flex items-center justify-center text-3xl shadow-2xs mb-4 text-rose-600">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-black text-slate-800 mb-1">
          {error}
        </h2>
        <p className="text-xs font-bold text-slate-500 mb-6 text-center max-w-xs">
          कृपया इंटरनेट कनेक्शन जांचें या थोड़ी देर बाद दोबारा प्रयास करें।
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => loadDashboardData()}
            className="flex items-center gap-1.5 bg-gradient-to-r from-toy-sky to-toy-blue text-white px-5 py-2.5 rounded-2xl text-sm font-black shadow-toy-sm hover:scale-105 active:scale-95 transition-all"
          >
            <RotateCw className="w-4 h-4" />
            <span>फिर से कोशिश करें</span>
          </button>
          <button
            onClick={onBackToLibrary}
            className="bg-white border-2 border-slate-200 text-slate-700 px-4 py-2.5 rounded-2xl text-sm font-black shadow-2xs hover:bg-slate-50 transition-colors"
          >
            लाइब्रेरी पर वापस
          </button>
        </div>
      </div>
    );
  }

  // Check if student is completely new with 0 attempts
  const hasNoActivity = (stats?.totalAttempts ?? 0) === 0 && progressRecords.length === 0;

  const displayName = user?.name ? `नमस्ते, ${user.name}! 👋` : 'नमस्ते! 👋';

  return (
    <div className="min-h-screen bg-toy-canvas flex flex-col justify-between font-hindi select-none">
      {/* Dashboard Top Header */}
      <header className="w-full bg-white/90 backdrop-blur border-b-2 border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
          {/* Back button */}
          <button
            onClick={onBackToLibrary}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-100 border-2 border-slate-200 text-slate-700 px-3.5 py-1.5 rounded-2xl text-xs sm:text-sm font-black shadow-2xs hover:scale-105 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>लाइब्रेरी पर वापस</span>
          </button>

          {/* Title & Refresh & Insights */}
          <div className="flex items-center gap-2">
            {onInsightsClick && (
              <button
                onClick={onInsightsClick}
                className="flex items-center gap-1.5 bg-gradient-to-r from-toy-blue to-toy-sky text-white px-3 py-1.5 rounded-2xl text-xs font-black shadow-toy-sm hover:scale-105 active:scale-95 transition-all"
                title="अभिभावक व शिक्षक अंतर्दृष्टि देखें"
              >
                <span>📊 अंतर्दृष्टि</span>
              </button>
            )}

            <button
              onClick={() => loadDashboardData(true)}
              disabled={isRefreshing}
              className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-2xl text-xs font-black shadow-2xs transition-all disabled:opacity-50"
              title="ताज़ा करें"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden xs:inline">ताज़ा करें</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="max-w-5xl mx-auto px-4 py-6 sm:py-8 w-full flex-1 space-y-6">
        {/* 1. Welcome Profile Card */}
        <div className="bg-gradient-to-r from-toy-orange via-amber-500 to-toy-yellow rounded-3xl p-6 md:p-8 text-white shadow-toy-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs md:text-sm font-black bg-white/20 backdrop-blur px-3 py-1 rounded-full uppercase tracking-wider block w-fit mb-2">
              छात्र डैशबोर्ड (Learner Dashboard)
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black drop-shadow-xs">
              {displayName}
            </h1>
            <p className="text-xs sm:text-sm font-bold text-amber-50 mt-1">
              हिंदी सीखने की आपकी यात्रा और प्रगति
            </p>
          </div>

          <button
            onClick={onBackToLibrary}
            className="bg-white hover:bg-amber-50 text-amber-900 px-5 py-2.5 rounded-2xl text-sm font-black shadow-toy-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shrink-0 self-stretch sm:self-auto justify-center"
          >
            <Compass className="w-4 h-4 text-amber-600" />
            <span>अभ्यास शुरू करें</span>
          </button>
        </div>

        {/* 2. Gamification Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* ⭐ कुल XP */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-amber-200 shadow-sm flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-600 flex items-center justify-center text-2xl shadow-2xs shrink-0">
              <Sparkles className="w-6 h-6 fill-amber-400 text-amber-500" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold text-slate-400 block uppercase">
                कुल XP
              </span>
              <span className="text-xl sm:text-2xl font-black text-slate-800">
                {gamification?.totalXp ?? 0}
              </span>
            </div>
          </div>

          {/* 🌟 कुल स्टार */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-yellow-200 shadow-sm flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-yellow-100 border border-yellow-300 text-yellow-600 flex items-center justify-center text-2xl shadow-2xs shrink-0">
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-500" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold text-slate-400 block uppercase">
                कुल स्टार
              </span>
              <span className="text-xl sm:text-2xl font-black text-slate-800">
                {gamification?.totalStars ?? 0}
              </span>
            </div>
          </div>

          {/* 🔥 वर्तमान लय */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-orange-200 shadow-sm flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 border border-orange-300 text-orange-600 flex items-center justify-center text-2xl shadow-2xs shrink-0">
              <Flame className="w-6 h-6 fill-orange-500 text-orange-500" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold text-slate-400 block uppercase">
                वर्तमान लय
              </span>
              <span className="text-xl sm:text-2xl font-black text-slate-800">
                {gamification?.currentStreak ?? 0} दिन
              </span>
            </div>
          </div>

          {/* 🏆 सबसे लंबी लय */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-purple-200 shadow-sm flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-300 text-purple-600 flex items-center justify-center text-2xl shadow-2xs shrink-0">
              <Trophy className="w-6 h-6 fill-purple-300 text-purple-600" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold text-slate-400 block uppercase">
                सबसे लंबी लय
              </span>
              <span className="text-xl sm:text-2xl font-black text-slate-800">
                {gamification?.longestStreak ?? 0} दिन
              </span>
            </div>
          </div>
        </div>

        {/* 3. Adaptive Learning & Personalized Recommendations */}
        {recommendation && (
          <PersonalizedRecommendations
            recommendation={recommendation}
            onSelectActivity={onSelectActivity}
            onViewAllActivities={onBackToLibrary}
          />
        )}

        {/* 4. Empty State For New Students */}
        {hasNoActivity ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-dashed border-slate-300 text-center shadow-xs">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-toy-sky to-toy-blue text-white flex items-center justify-center text-4xl shadow-toy-md mx-auto mb-4 animate-bounce-short">
              🚀
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-2">
              अभी आपकी कोई प्रगति नहीं है।
            </h2>
            <p className="text-sm font-bold text-slate-500 mb-6 max-w-md mx-auto">
              ऊपर दिए गए सुझाए गए अभ्यासों में से कोई चुनें या लाइब्रेरी से शुरू करें! 🚀
            </p>
            <button
              onClick={onBackToLibrary}
              className="py-3 px-8 rounded-2xl bg-gradient-to-r from-toy-orange to-toy-yellow text-white font-black text-base shadow-toy-md hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
            >
              <span>लाइब्रेरी पर वापस</span>
            </button>
          </div>
        ) : (
          <>
            {/* 5. Overall Statistics Cards */}
            {stats && (
              <div className="bg-white rounded-3xl p-5 md:p-6 border-2 border-slate-200 shadow-sm">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-xs text-xl">
                    📈
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-black text-slate-800">
                      सीखने के समग्र आंकड़े (Overall Statistics)
                    </h3>
                    <p className="text-xs font-bold text-slate-500">
                      आपकी अब तक की सीखने की कुल गतिविधि
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {/* कुल अभ्यास */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      कुल अभ्यास
                    </span>
                    <span className="text-lg font-black text-slate-800">
                      {stats.activityCount ?? 0}
                    </span>
                  </div>

                  {/* पूरे किए गए अभ्यास */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      पूरे किए गए
                    </span>
                    <span className="text-lg font-black text-emerald-600 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      {stats.totalActivitiesCompleted ?? 0}
                    </span>
                  </div>

                  {/* कुल प्रयास */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      कुल प्रयास
                    </span>
                    <span className="text-lg font-black text-slate-800">
                      {stats.totalAttempts ?? 0}
                    </span>
                  </div>

                  {/* औसत सटीकता */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      औसत सटीकता
                    </span>
                    <span className="text-lg font-black text-toy-blue">
                      {Math.round(stats.overallAccuracy ?? 0)}%
                    </span>
                  </div>

                  {/* कुल बिताया समय */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      कुल समय
                    </span>
                    <span className="text-xs sm:text-sm font-black text-slate-700 flex items-center justify-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {formatTimeSpent(stats.totalTimeSpentSeconds ?? 0)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Activity Progress List */}
            <ActivityProgressList
              progressRecords={progressRecords}
              activityBreakdown={stats?.activityBreakdown || []}
            />

            {/* 6. Badges Collection */}
            <BadgeCollection
              badges={badges}
              earnedCount={earnedBadgeCount}
              totalBadges={totalBadgeCount}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs font-bold text-slate-400 border-t border-slate-200 bg-white/50">
        HindiPlay • हिंदी बाल मंच
      </footer>
    </div>
  );
};
