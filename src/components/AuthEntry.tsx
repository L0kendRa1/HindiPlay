import React from 'react';
import { LogIn, UserPlus, ArrowRight, Sparkles } from 'lucide-react';

interface AuthEntryProps {
  onSelectLogin: () => void;
  onSelectRegister: () => void;
  onContinueGuest: () => void;
}

export const AuthEntry: React.FC<AuthEntryProps> = ({
  onSelectLogin,
  onSelectRegister,
  onContinueGuest,
}) => {
  return (
    <div className="min-h-screen bg-toy-canvas flex flex-col justify-between items-center px-4 py-8 font-hindi select-none">
      {/* Top spacing */}
      <div className="w-full" />

      {/* Center Welcome Card */}
      <div className="w-full max-w-md bg-white rounded-3xl border-4 border-toy-yellow p-6 sm:p-8 shadow-toy-xl text-center animate-pop-in relative overflow-hidden">
        {/* Background decorative blobs */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-toy-yellow/20 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-toy-sky/20 rounded-full blur-xl pointer-events-none" />

        {/* Playful App Logo */}
        <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-3xl bg-gradient-to-tr from-toy-orange to-toy-yellow flex items-center justify-center text-4xl md:text-5xl shadow-toy-md mb-5 animate-bounce-short">
          🎨
        </div>

        {/* App Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 tracking-tight leading-tight mb-2">
          हिंदीप्ले में आपका स्वागत है! 👋
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg font-bold text-slate-600 mb-8">
          सीखने के लिए तैयार हैं?
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3.5 w-full">
          {/* 1. Login Button */}
          <button
            onClick={onSelectLogin}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-toy-sky to-toy-blue text-white text-base sm:text-lg font-black shadow-toy-md hover:shadow-toy-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
          >
            <LogIn className="w-5 h-5 stroke-[2.5]" />
            <span>लॉगिन करें</span>
          </button>

          {/* 2. Register Button */}
          <button
            onClick={onSelectRegister}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-toy-yellow to-toy-orange text-slate-900 text-base sm:text-lg font-black shadow-toy-md hover:shadow-toy-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
          >
            <UserPlus className="w-5 h-5 stroke-[2.5]" />
            <span>नया खाता बनाएँ</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-0.5 bg-slate-200" />
            <span className="text-xs font-bold text-slate-400">या</span>
            <div className="flex-1 h-0.5 bg-slate-200" />
          </div>

          {/* 3. Continue as Guest Button */}
          <button
            onClick={onContinueGuest}
            className="w-full py-3.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-200 text-slate-700 text-sm sm:text-base font-black shadow-toy-sm hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-toy-orange" />
            <span>अतिथि के रूप में जारी रखें</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Safe notice for parents/kids */}
        <p className="text-xs text-slate-400 font-semibold mt-6">
          अतिथि मोड में आप तुरंत बिना किसी लॉगिन के सभी गतिविधियाँ खेल सकते हैं।
        </p>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 font-medium">
        हिंदी बाल मंच • खेल-खेल में सीखें
      </footer>
    </div>
  );
};
