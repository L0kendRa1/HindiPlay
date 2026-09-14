import React from 'react';
import { PersonalizedRecommendation } from '../types/adaptive';
import { ACTIVITIES_REGISTRY, ActivityMeta } from '../data/activityRegistry';
import { Sparkles, ArrowRight, BookOpen } from 'lucide-react';

interface PersonalizedRecommendationsProps {
  recommendation: PersonalizedRecommendation;
  onSelectActivity?: (activity: ActivityMeta) => void;
  onViewAllActivities?: () => void;
}

export const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({
  recommendation,
  onSelectActivity,
  onViewAllActivities,
}) => {
  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'hard':
        return { label: 'कठिन (Advanced)', color: 'bg-rose-100 text-rose-800 border-rose-300' };
      case 'medium':
        return { label: 'मध्यम (Intermediate)', color: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'easy':
      default:
        return { label: 'सरल (Foundational)', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    }
  };

  const diffBadge = getDifficultyBadge(recommendation.recommendedDifficulty);

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-toy-sky shadow-toy-sm space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-toy-blue to-toy-sky text-white flex items-center justify-center text-xl shadow-2xs shrink-0">
            🎯
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-black text-slate-800">
                आपके लिए विशेष सुझाव (Personalized Practice)
              </h3>
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${diffBadge.color}`}>
                {diffBadge.label}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 mt-0.5">
              {recommendation.messageHindi}
            </p>
          </div>
        </div>

        {onViewAllActivities && (
          <button
            onClick={onViewAllActivities}
            className="text-xs font-black text-toy-blue hover:text-toy-purple flex items-center gap-1 shrink-0 self-start sm:self-auto transition-colors"
          >
            <span>सभी गतिविधियाँ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Weak / Focus Areas Note (if detected) */}
      {recommendation.weakAreas && recommendation.weakAreas.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-2.5">
          <div className="text-base mt-0.5">💡</div>
          <div className="text-xs text-amber-900">
            <span className="font-black">सुझाया गया फोकस: </span>
            <span>
              {recommendation.weakAreas.map((w) => w.nameHindi).join(', ')} में और अभ्यास करने से आपका समग्र स्कोर बढ़ेगा।
            </span>
          </div>
        </div>
      )}

      {/* Recommended Activities Grid */}
      <div>
        <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-toy-yellow" />
          <span>सुझाई गई गतिविधियाँ (Recommended Activities)</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {recommendation.recommendedActivities.map((recAct) => {
            const registeredActivity = ACTIVITIES_REGISTRY.find(
              (a) => a.activityCode === recAct.activityCode
            );

            const title = registeredActivity ? registeredActivity.title : recAct.title;
            const subtitle = registeredActivity ? registeredActivity.subtitle : recAct.highlightTextHindi || 'अभ्यास करें';
            const icon = registeredActivity ? registeredActivity.icon : '🎮';
            const themeBg = registeredActivity ? registeredActivity.theme.bg : 'bg-slate-50';
            const themeBorder = registeredActivity ? registeredActivity.theme.border : 'border-slate-200';

            return (
              <div
                key={recAct.activityCode}
                onClick={() => {
                  if (registeredActivity && onSelectActivity) {
                    onSelectActivity(registeredActivity);
                  }
                }}
                className={`${themeBg} border-2 ${themeBorder} rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-2xs hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl shrink-0 p-1.5 bg-white/80 rounded-xl shadow-2xs group-hover:rotate-6 transition-transform">
                    {icon}
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-slate-800 leading-tight">
                      {title}
                    </h5>
                    <p className="text-[11px] font-bold text-slate-500 mt-1 line-clamp-2">
                      {subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                  <span className="text-[10px] font-extrabold text-toy-blue bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    {recAct.highlightTextHindi || 'विशेष अभ्यास'}
                  </span>
                  <span className="text-xs font-black text-slate-700 flex items-center gap-0.5 group-hover:text-toy-blue transition-colors">
                    <span>शुरू करें</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommended Practice Words */}
      {recommendation.recommendedWords && recommendation.recommendedWords.length > 0 && (
        <div className="pt-2">
          <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2.5 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-toy-sky" />
            <span>आज के अनुशंसित शब्द (Recommended Words)</span>
          </h4>

          <div className="flex items-center gap-2 flex-wrap">
            {recommendation.recommendedWords.map((wordObj) => (
              <div
                key={wordObj._id || wordObj.word}
                className="bg-slate-50 border border-slate-200 hover:border-toy-sky rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs font-black text-slate-700 shadow-2xs transition-colors"
              >
                {wordObj.image?.url && (
                  <img
                    src={wordObj.image.url}
                    alt={wordObj.word}
                    className="w-5 h-5 object-contain rounded"
                  />
                )}
                <span>{wordObj.word}</span>
                {wordObj.meaning && (
                  <span className="text-[10px] font-bold text-slate-400">
                    ({wordObj.meaning})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
