import React from 'react';
import { StoryQuestion } from '../types/readingComprehension';
import { HelpCircle, Check, X } from 'lucide-react';

interface StoryQuestionCardProps {
  question: StoryQuestion;
  questionIndex: number;
  totalQuestions: number;
  selectedOption: string | null;
  isChecked: boolean;
  isCorrect: boolean;
  disabled: boolean;
  onSelectOption: (option: string) => void;
}

export const StoryQuestionCard: React.FC<StoryQuestionCardProps> = ({
  question,
  questionIndex,
  totalQuestions,
  selectedOption,
  isChecked,
  isCorrect,
  disabled,
  onSelectOption,
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white/95 backdrop-blur-xs border-4 border-toy-purple/80 rounded-3xl p-5 sm:p-6 shadow-toy-lg transition-all">
      {/* Question Header */}
      <div className="flex items-center justify-between mb-3 text-xs md:text-sm font-extrabold text-purple-700">
        <div className="flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4" />
          <span>समझ का सवाल:</span>
        </div>
        <span className="bg-purple-100 text-purple-800 px-3 py-0.5 rounded-full font-black">
          सवाल {questionIndex + 1} / {totalQuestions}
        </span>
      </div>

      {/* Question Text */}
      <h3 className="text-xl sm:text-2xl md:text-3xl font-black font-hindi text-slate-900 leading-snug mb-5">
        {question.question}
      </h3>

      {/* Multiple Choice Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {question.options.map((option, idx) => {
          const isSelected = selectedOption === option;
          const isThisCorrect = isChecked && option === question.correctAnswer;
          const isThisWrongSelected = isChecked && isSelected && !isCorrect;

          let btnClass = '';

          if (isThisCorrect) {
            btnClass =
              'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-700 shadow-toy-md scale-102';
          } else if (isThisWrongSelected) {
            btnClass =
              'bg-gradient-to-r from-rose-500 to-pink-600 text-white border-rose-700 shadow-toy-md animate-shake';
          } else if (isSelected) {
            btnClass =
              'bg-gradient-to-r from-toy-blue to-indigo-600 text-white border-indigo-700 shadow-toy-md scale-102';
          } else {
            btnClass =
              'bg-white text-slate-800 border-slate-200 shadow-toy-sm hover:border-toy-sky hover:bg-sky-50/50 hover:shadow-toy-md active:scale-95';
          }

          return (
            <button
              key={idx}
              onClick={() => onSelectOption(option)}
              disabled={disabled || (isChecked && isCorrect)}
              className={`relative flex items-center justify-between p-4 sm:p-5 rounded-2xl border-3 font-black font-hindi text-lg sm:text-xl text-left transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-toy-yellow/70 ${btnClass}`}
              aria-label={`विकल्प ${idx + 1}: ${option}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black select-none ${
                    isSelected || isThisCorrect || isThisWrongSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {idx + 1}
                </span>
                <span className="drop-shadow-xs">{option}</span>
              </div>

              {isThisCorrect && (
                <span className="w-6 h-6 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-xs ml-2">
                  <Check className="w-4 h-4 stroke-[3]" />
                </span>
              )}

              {isThisWrongSelected && (
                <span className="w-6 h-6 rounded-full bg-white text-rose-600 flex items-center justify-center shadow-xs ml-2">
                  <X className="w-4 h-4 stroke-[3]" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
