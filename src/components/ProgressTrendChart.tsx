import React from 'react';
import { RecentProgressPoint } from '../types/insights';
import { TrendingUp } from 'lucide-react';

interface ProgressTrendChartProps {
  trendPoints: RecentProgressPoint[];
}

export const ProgressTrendChart: React.FC<ProgressTrendChartProps> = ({ trendPoints }) => {
  if (!trendPoints || trendPoints.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 text-center select-none">
        <p className="text-xs font-bold text-slate-400">
          प्रगति का ग्राफ़ देखने के लिए कम से कम 1 अभ्यास पूरा करें।
        </p>
      </div>
    );
  }

  // Calculate average accuracy over the recent trend
  const avgAccuracy = Math.round(
    trendPoints.reduce((acc, curr) => acc + curr.accuracy, 0) / trendPoints.length
  );

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-slate-200 shadow-sm space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-toy-blue to-toy-sky text-white flex items-center justify-center text-xl shadow-2xs">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-800">
              हाल की प्रगति (Recent Performance Trend)
            </h3>
            <p className="text-xs font-bold text-slate-500">
              पिछले {trendPoints.length} अभ्यासों में सटीकता का उतार-चढ़ाव
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">औसत:</span>
          <span className="text-sm font-black text-toy-blue bg-sky-50 px-2.5 py-1 rounded-xl border border-sky-200">
            {avgAccuracy}%
          </span>
        </div>
      </div>

      {/* Visual Bar Graph */}
      <div className="pt-4 pb-2">
        <div className="h-44 w-full flex items-end justify-between gap-1.5 sm:gap-3 px-2 border-b-2 border-slate-200 relative">
          {/* Background Reference Grid Lines (100%, 50%, 0%) */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
            <div className="border-b border-dashed border-slate-200 text-[9px] font-bold text-slate-400 pl-1">
              100%
            </div>
            <div className="border-b border-dashed border-slate-200 text-[9px] font-bold text-slate-400 pl-1">
              50%
            </div>
            <div className="text-[9px] font-bold text-slate-400 pl-1">0%</div>
          </div>

          {/* Render Bars for Each Trend Point */}
          {trendPoints.map((pt, idx) => {
            const heightPercent = Math.max(8, Math.min(100, pt.accuracy));
            const barBg =
              pt.accuracy >= 80
                ? 'bg-gradient-to-t from-emerald-500 to-emerald-400 border-emerald-400'
                : pt.accuracy >= 50
                ? 'bg-gradient-to-t from-amber-500 to-amber-400 border-amber-400'
                : 'bg-gradient-to-t from-rose-500 to-rose-400 border-rose-400';

            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center h-full justify-end group relative z-10"
              >
                {/* Accuracy floating label on hover / top */}
                <span className="text-[10px] font-black text-slate-600 mb-1 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                  {Math.round(pt.accuracy)}%
                </span>

                {/* The Bar */}
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full max-w-[36px] rounded-t-xl border-t-2 border-x-2 ${barBg} shadow-2xs group-hover:brightness-110 transition-all cursor-pointer`}
                />

                {/* Tooltip on Hover */}
                <div className="absolute bottom-full mb-8 hidden group-hover:flex flex-col items-center pointer-events-none z-30">
                  <div className="bg-slate-900 text-white text-[11px] font-bold py-1.5 px-3 rounded-xl shadow-toy-md whitespace-nowrap text-center">
                    <p className="font-black text-amber-300">{pt.skillName}</p>
                    <p className="text-[10px] text-slate-300">
                      अंक: {pt.score}/{pt.total} • {Math.round(pt.accuracy)}%
                    </p>
                  </div>
                  <div className="w-2 h-2 bg-slate-900 rotate-45 -mt-1" />
                </div>
              </div>
            );
          })}
        </div>

        {/* X-axis Session Labels */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-3 px-2 mt-2">
          {trendPoints.map((pt, idx) => (
            <div
              key={idx}
              className="flex-1 text-center text-[10px] font-extrabold text-slate-400 truncate"
              title={pt.skillName}
            >
              #{idx + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Legend / Tip */}
      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 pt-2 border-t border-slate-100 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>उत्कृष्ट (≥80%)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>मध्यम (50-79%)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>अभ्यास आवश्यक (&lt;50%)</span>
          </span>
        </div>

        <span className="text-[10px] text-slate-400">
          *सत्र पर कर्सर ले जाकर विवरण देखें
        </span>
      </div>
    </div>
  );
};
