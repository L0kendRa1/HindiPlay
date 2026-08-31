import React from 'react';
import { StrokeData } from '../types/tracing';
import { Check } from 'lucide-react';

interface StrokeGuideBarProps {
  strokes: StrokeData[];
  currentStrokeIndex: number;
  isComplete: boolean;
}

export const StrokeGuideBar: React.FC<StrokeGuideBarProps> = ({
  strokes,
  currentStrokeIndex,
  isComplete,
}) => {
  return (
    <div className="w-full max-w-lg mx-auto my-2 px-2">
      <div className="flex items-center justify-center gap-1.5 md:gap-2 flex-wrap">
        {strokes.map((stroke, idx) => {
          const isDone = isComplete || idx < currentStrokeIndex;
          const isCurrent = !isComplete && idx === currentStrokeIndex;

          return (
            <div
              key={stroke.id}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border-2 text-xs md:text-sm font-extrabold transition-all duration-200 ${
                isDone
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs'
                  : isCurrent
                  ? 'bg-sky-50 border-sky-400 text-sky-800 shadow-toy-sm scale-105 animate-pulse'
                  : 'bg-white border-slate-200 text-slate-400'
              }`}
            >
              {/* Step Badge */}
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                  isDone
                    ? 'bg-emerald-500 text-white'
                    : isCurrent
                    ? 'bg-sky-500 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : stroke.order}
              </span>

              {/* Stroke Name */}
              <span className="truncate max-w-[120px] md:max-w-none">
                {stroke.name.split(' (')[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
