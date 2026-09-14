import React from 'react';
import { DomainInsightItem } from '../types/insights';
import { CheckCircle2, AlertCircle, HelpCircle, Award } from 'lucide-react';

interface StrengthWeaknessOverviewProps {
  strengths: DomainInsightItem[];
  weaknesses: DomainInsightItem[];
  needsMoreData: DomainInsightItem[];
}

export const StrengthWeaknessOverview: React.FC<StrengthWeaknessOverviewProps> = ({
  strengths,
  weaknesses,
  needsMoreData,
}) => {
  const hasNoCategories =
    strengths.length === 0 && weaknesses.length === 0 && needsMoreData.length === 0;

  if (hasNoCategories) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 select-none">
      {/* 1. Strengths Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-emerald-200 shadow-sm flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center text-xl shadow-2xs shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800">
                मज़बूत क्षेत्र (Mastered Strengths)
              </h3>
              <p className="text-xs font-bold text-slate-500">
                इन क्षेत्रों में छात्र की समझ और सटीकता बहुत अच्छी है (≥80%)
              </p>
            </div>
          </div>

          {strengths.length > 0 ? (
            <div className="space-y-2.5">
              {strengths.map((item) => (
                <div
                  key={item.domain}
                  className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="text-sm font-black text-slate-800 block">
                        {item.nameHindi}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {item.attempts} अभ्यास सत्र
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-emerald-700 bg-white px-2.5 py-1 rounded-xl border border-emerald-200 shadow-2xs">
                      {Math.round(item.accuracy)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
              <p className="text-xs font-bold text-slate-400">
                अभी कोई क्षेत्र 80% स्तर तक नहीं पहुंचा है। नियमित अभ्यास से यह अनलॉक होगा! 🌟
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 2. Weaknesses / Focus Areas Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-200 shadow-sm flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 text-amber-600 flex items-center justify-center text-xl shadow-2xs shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800">
                अभ्यास की ज़रूरत (Focus Areas)
              </h3>
              <p className="text-xs font-bold text-slate-500">
                इन क्षेत्रों में अतिरिक्त अभ्यास से सटीकता में तेजी से सुधार होगा (&lt;70%)
              </p>
            </div>
          </div>

          {weaknesses.length > 0 ? (
            <div className="space-y-2.5">
              {weaknesses.map((item) => (
                <div
                  key={item.domain}
                  className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                    <div>
                      <span className="text-sm font-black text-slate-800 block">
                        {item.nameHindi}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {item.attempts} अभ्यास सत्र
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-amber-700 bg-white px-2.5 py-1 rounded-xl border border-amber-200 shadow-2xs">
                      {Math.round(item.accuracy)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
              <p className="text-xs font-bold text-emerald-700 font-hindi">
                शानदार! किसी भी क्षेत्र में लगातार कम अंक नहीं हैं। 🎯
              </p>
            </div>
          )}
        </div>

        {/* Needs more data note */}
        {needsMoreData.length > 0 && (
          <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              {needsMoreData.map((n) => n.nameHindi).join(', ')} में केवल 1 अभ्यास हुआ है (सटीक विश्लेषण के लिए 2+ प्रयास जरूरी हैं)।
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
