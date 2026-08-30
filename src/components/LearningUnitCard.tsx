import React from 'react';
import { HindiUnit } from '../types/wordBuilder';

interface LearningUnitCardProps {
  unit: HindiUnit;
  index?: number;
  onClick?: () => void;
  disabled?: boolean;
  isPlaced?: boolean;
  size?: 'normal' | 'large' | 'compact';
}

export const LearningUnitCard: React.FC<LearningUnitCardProps> = ({
  unit,
  index,
  onClick,
  disabled = false,
  isPlaced = false,
  size = 'normal',
}) => {
  const sizeClasses = {
    compact: 'w-14 h-14 md:w-16 md:h-16 text-2xl md:text-3xl rounded-2xl p-2',
    normal: 'w-20 h-20 md:w-24 md:h-24 text-4xl md:text-5xl rounded-3xl p-3',
    large: 'w-24 h-24 md:w-28 md:h-28 text-5xl md:text-6xl rounded-3xl p-4',
  };

  const isMatraUnit = unit.type === 'consonant-matra';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative group flex flex-col items-center justify-center font-black font-hindi transition-all duration-200 border-4 ${
        sizeClasses[size]
      } ${
        isPlaced
          ? 'bg-toy-sky text-white border-toy-sky-dark shadow-toy-md scale-105 animate-pop-in'
          : disabled
          ? 'bg-slate-100 border-slate-200 text-slate-300 shadow-none cursor-not-allowed opacity-40'
          : isMatraUnit
          ? 'bg-white border-toy-purple text-toy-purple-dark shadow-toy-lg hover:shadow-toy-xl hover:-translate-y-1 active:translate-y-1 active:shadow-toy-sm'
          : 'bg-white border-toy-orange text-slate-800 shadow-toy-lg hover:shadow-toy-xl hover:-translate-y-1 active:translate-y-1 active:shadow-toy-sm'
      }`}
      aria-label={`अक्षर इकाई ${unit.display}`}
      title={unit.hint ? `इकाई: ${unit.display} (${unit.hint})` : `इकाई: ${unit.display}`}
    >
      {/* Keyboard Shortcut or index if present */}
      {index !== undefined && !isPlaced && (
        <span className="absolute top-1.5 left-1.5 w-5 h-5 rounded-lg bg-slate-100 text-slate-500 font-bold text-[10px] flex items-center justify-center shadow-xs">
          {index + 1}
        </span>
      )}

      {/* Main Display Unit */}
      <span className="leading-none select-none tracking-normal">
        {unit.display}
      </span>

      {/* Matra Decomposition Sub-hint */}
      {unit.hint && !isPlaced && (
        <span className="text-[10px] md:text-xs font-bold text-toy-purple-dark opacity-75 mt-0.5 tracking-tight hidden sm:block">
          {unit.hint}
        </span>
      )}
    </button>
  );
};
