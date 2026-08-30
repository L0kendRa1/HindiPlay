import React from 'react';
import { FeedbackType } from '../types/activity';
import { Sparkles, Smile } from 'lucide-react';

interface FeedbackBannerProps {
  feedback: FeedbackType;
  attempts: number;
}

export const FeedbackBanner: React.FC<FeedbackBannerProps> = ({ feedback, attempts }) => {
  if (feedback === 'idle') {
    return (
      <div className="h-16 flex items-center justify-center text-slate-500 font-bold text-base md:text-lg">
        <span>कौन सा अक्षर है? सही उत्तर चुनें 👇</span>
      </div>
    );
  }

  if (feedback === 'correct') {
    const praiseList = [
      'बहुत बढ़िया! 🎉',
      'शाबाश! ⭐',
      'शानदार! 🌟',
      'अरे वाह! कमाल कर दिया! 🎈',
    ];
    const praise = praiseList[Math.floor(Math.random() * praiseList.length)] || 'बहुत बढ़िया! 🎉';

    return (
      <div className="h-16 flex items-center justify-center animate-pop-in">
        <div className="flex items-center gap-2 bg-gradient-to-r from-toy-mint to-emerald-500 text-white font-extrabold text-lg md:text-xl px-6 py-2.5 rounded-full shadow-toy-md">
          <Sparkles className="w-6 h-6 animate-spin" />
          <span>{praise}</span>
        </div>
      </div>
    );
  }

  // Incorrect feedback
  const encouragement =
    attempts > 1
      ? 'कोई बात नहीं, एक बार फिर आवाज़ सुनो और चुनो! 🎧'
      : 'फिर से कोशिश करो 😊';

  return (
    <div className="h-16 flex items-center justify-center animate-shake">
      <div className="flex items-center gap-2 bg-amber-100 border-2 border-amber-300 text-amber-900 font-bold text-base md:text-lg px-6 py-2.5 rounded-full shadow-toy-sm">
        <Smile className="w-5 h-5 text-amber-600" />
        <span>{encouragement}</span>
      </div>
    </div>
  );
};
