import React from 'react';
import { MatraDefinition } from '../data/matras';

interface MatraSelectorProps {
  matras: MatraDefinition[];
  selectedMatra: MatraDefinition | null;
  onSelectMatra: (matra: MatraDefinition | null) => void;
}

export const MatraSelector: React.FC<MatraSelectorProps> = ({
  matras,
  selectedMatra,
  onSelectMatra,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto my-3">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm md:text-base font-extrabold text-slate-700 flex items-center gap-1.5">
          <span className="w-6 h-6 rounded-full bg-toy-purple text-white font-black text-xs flex items-center justify-center shadow-xs">
            2
          </span>
          <span>मात्रा चुनें:</span>
        </label>
        <span className="text-xs font-bold text-slate-400">
          {selectedMatra ? (
            <strong className="text-toy-purple-dark text-sm">{selectedMatra.name} ({selectedMatra.symbol})</strong>
          ) : (
            <span className="text-slate-500">बिना मात्रा</span>
          )}
        </span>
      </div>

      {/* Grid of Matra Buttons */}
      <div className="grid grid-cols-5 md:grid-cols-10 gap-2 md:gap-2.5 p-3 bg-purple-50/60 border-2 border-purple-200/80 rounded-3xl shadow-toy-sm">
        {/* Option 0: बिना मात्रा (अ) */}
        <button
          onClick={() => onSelectMatra(null)}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-toy-purple/60 select-none min-h-[64px] md:min-h-[70px] ${
            selectedMatra === null
              ? 'bg-toy-purple text-white border-4 border-toy-purple-dark shadow-toy-md -translate-y-1 scale-105 animate-pop-in'
              : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-toy-purple hover:bg-purple-50/50 hover:-translate-y-0.5 active:translate-y-0.5 shadow-xs'
          }`}
          aria-label="बिना मात्रा"
          title="बिना मात्रा (अ)"
        >
          <span className="text-[10px] font-black opacity-75">स्वर</span>
          <span className="text-lg font-black font-hindi mt-0.5">अ</span>
          <span className="text-[9px] font-bold opacity-75 mt-0.5">बिना मात्रा</span>
        </button>

        {/* 9 Standard Matras */}
        {matras.map((item) => {
          const isSelected = selectedMatra?.id === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectMatra(item)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-toy-purple/60 select-none min-h-[64px] md:min-h-[70px] ${
                isSelected
                  ? 'bg-toy-purple text-white border-4 border-toy-purple-dark shadow-toy-md -translate-y-1 scale-105 animate-pop-in'
                  : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-toy-purple hover:bg-purple-50/50 hover:-translate-y-0.5 active:translate-y-0.5 shadow-xs'
              }`}
              aria-label={item.name}
              title={`${item.name} (${item.symbol})`}
            >
              {/* Associated Vowel Badge */}
              <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                isSelected ? 'bg-white/20 text-white' : 'bg-purple-100 text-toy-purple-dark'
              }`}>
                {item.vowel}
              </span>

              {/* Matra Symbol */}
              <span className="text-2xl md:text-3xl font-black font-hindi leading-none my-1">
                {item.symbol}
              </span>

              {/* Matra position hint */}
              <span className="text-[9px] font-bold opacity-75 capitalize">
                {item.position === 'top' ? 'ऊपर' : item.position === 'bottom' ? 'नीचे' : item.position === 'left' ? 'बाईं' : 'दाईं'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
