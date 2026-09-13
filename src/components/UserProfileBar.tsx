import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as gamificationService from '../services/gamificationService';
import { LogOut, LogIn, User as UserIcon, Sparkles, Flame } from 'lucide-react';

interface UserProfileBarProps {
  onLoginClick?: () => void;
}

export const UserProfileBar: React.FC<UserProfileBarProps> = ({ onLoginClick }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [xp, setXp] = useState<number | null>(null);
  const [streak, setStreak] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (isAuthenticated) {
      gamificationService
        .getGamification()
        .then((res) => {
          if (!cancelled && res?.data) {
            setXp(res.data.totalXp ?? 0);
            setStreak(res.data.currentStreak ?? 0);
          }
        })
        .catch(() => {
          // Silent catch — non-blocking
        });
    } else {
      setXp(null);
      setStreak(null);
    }

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  // 1. Authenticated User Control
  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap font-hindi select-none">
        {/* User Badge / Name */}
        <div className="flex items-center gap-1.5 bg-slate-100/90 border border-slate-200 px-3 py-1.5 rounded-2xl">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-toy-sky to-toy-blue text-white flex items-center justify-center text-xs font-black shadow-2xs">
            <UserIcon className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs sm:text-sm font-black text-slate-700 max-w-[120px] truncate" title={user.name}>
            {user.name}
          </span>
        </div>

        {/* Small Gamification Pills (if available) */}
        {xp !== null && xp > 0 && (
          <div
            className="hidden sm:flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 px-2.5 py-1 rounded-2xl text-xs font-black"
            title={`${xp} कुल XP`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>{xp} XP</span>
          </div>
        )}

        {streak !== null && streak > 0 && (
          <div
            className="hidden sm:flex items-center gap-1 bg-orange-50 border border-orange-200 text-orange-900 px-2.5 py-1 rounded-2xl text-xs font-black"
            title={`${streak} दिन की लय`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            <span>{streak} दिन</span>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={logout}
          className="flex items-center gap-1 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-600 px-2.5 py-1.5 rounded-2xl text-xs font-black shadow-2xs transition-colors"
          title="लॉगआउट करें"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">लॉगआउट</span>
        </button>
      </div>
    );
  }

  // 2. Guest User Control: show login option
  return (
    <div className="flex items-center gap-2 font-hindi select-none">
      <span className="hidden md:inline-block text-xs font-bold text-slate-400">
        अतिथि मोड
      </span>
      {onLoginClick && (
        <button
          onClick={onLoginClick}
          className="flex items-center gap-1.5 bg-gradient-to-r from-toy-sky to-toy-blue text-white px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-black shadow-toy-sm hover:scale-105 active:scale-95 transition-all"
          title="प्रगति सुरक्षित करने के लिए लॉगिन करें"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>लॉगिन</span>
        </button>
      )}
    </div>
  );
};
