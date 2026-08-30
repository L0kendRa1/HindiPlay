import React from 'react';
import { HindiUnit } from '../types/wordBuilder';
import { LearningUnitCard } from './LearningUnitCard';
import { RotateCcw } from 'lucide-react';

interface WordConstructionAreaProps {
  totalSlots: number;
  selectedUnits: HindiUnit[];
  onRemoveUnit: (unit: HindiUnit) => void;
  onReset: () => void;
  isSolved?: boolean;
}

export const WordConstructionArea: React.FC<WordConstructionAreaProps> = ({
  totalSlots,
  selectedUnits,
  onRemoveUnit,
  onReset,
  isSolved = false,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto my-4 flex flex-col items-center">
      {/* Construction Slot Bar */}
      <div className="flex items-center justify-center gap-3 md:gap-4 bg-amber-50/80 border-4 border-dashed border-amber-300 p-4 md:p-6 rounded-3xl min-h-[120px] md:min-h-[140px] w-full shadow-inner relative">
        {Array.from({ length: totalSlots }).map((_, idx) => {
          const placedUnit = selectedUnits[idx];

          if (placedUnit) {
            return (
              <div key={placedUnit.id} className="relative group">
                <LearningUnitCard
                  unit={placedUnit}
                  isPlaced={true}
                  onClick={() => !isSolved && onRemoveUnit(placedUnit)}
                />
                {!isSolved && (
                  <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-[10px] text-slate-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    हटाएँ ✕
                  </span>
                )}
              </div>
            );
          }

          return (
            <div
              key={idx}
              className="w-20 h-20 md:w-24 md:h-24 rounded-3xl border-4 border-dashed border-slate-300 bg-white/60 flex items-center justify-center text-slate-300 font-bold text-sm select-none"
            >
              <div className="w-3 h-3 rounded-full bg-slate-300/80" />
            </div>
          );
        })}
      </div>

      {/* Helper Controls (Reset button if units placed) */}
      <div className="h-8 flex items-center justify-center mt-2">
        {selectedUnits.length > 0 && !isSolved && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs font-extrabold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-xs transition-transform active:scale-95"
            title="सभी अक्षर हटाएँ"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>साफ़ करें</span>
          </button>
        )}
      </div>
    </div>
  );
};
