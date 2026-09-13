import React from 'react';
import { ProgressRecord, ActivityBreakdown } from '../types/api';
import { ACTIVITIES_REGISTRY, ActivityMeta } from '../data/activityRegistry';
import { Target, CheckCircle2, Clock, Zap } from 'lucide-react';

interface ActivityProgressListProps {
  progressRecords: ProgressRecord[];
  activityBreakdown: ActivityBreakdown[];
}

export const ActivityProgressList: React.FC<ActivityProgressListProps> = ({
  progressRecords,
  activityBreakdown,
}) => {
  // Map activityId to ActivityMeta from registry
  const registryMap = React.useMemo(() => {
    const map = new Map<string, ActivityMeta>();
    ACTIVITIES_REGISTRY.forEach((act) => {
      map.set(act.activityCode, act);
      map.set(act.id, act);
    });
    return map;
  }, []);

  // Format date helper
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('hi-IN', {
        day: 'numeric',
        month: 'short',
      });
    } catch {
      return '';
    }
  };

  // If there are breakdown items, we display summary by activity
  // Otherwise we fall back to raw progress records
  const hasBreakdown = activityBreakdown && activityBreakdown.length > 0;

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border-2 border-slate-200 shadow-sm select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-toy-blue to-toy-sky text-white flex items-center justify-center shadow-xs text-xl">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-black text-slate-800">
              गतिविधि प्रगति (Activity Progress)
            </h3>
            <p className="text-xs font-bold text-slate-500">
              आपके द्वारा खेले गए अभ्यासों का विवरण
            </p>
          </div>
        </div>

        <div className="bg-sky-50 border border-sky-200 text-sky-900 px-3 py-1 rounded-full text-xs font-black">
          {hasBreakdown ? activityBreakdown.length : progressRecords.length} गतिविधियाँ
        </div>
      </div>

      {/* List content */}
      <div className="space-y-3">
        {hasBreakdown ? (
          activityBreakdown.map((item) => {
            const meta = registryMap.get(item.activityId);
            const title = meta?.title || item.activityId;
            const icon = meta?.icon || '📝';
            const categoryLabel = meta?.categoryDisplayLabel || 'अभ्यास';

            return (
              <div
                key={item.activityId}
                className="bg-slate-50 hover:bg-slate-100/80 border-2 border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors"
              >
                {/* Left: Icon + Title + Category */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-200 shadow-2xs flex items-center justify-center text-2xl shrink-0">
                    {icon}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm md:text-base font-black text-slate-800 truncate">
                      {title}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                        {categoryLabel}
                      </span>
                      {item.lastAttemptAt && (
                        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(item.lastAttemptAt)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Stats pills */}
                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                  {/* Attempts */}
                  <div className="text-center bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      प्रयास
                    </span>
                    <span className="text-xs sm:text-sm font-black text-slate-700">
                      {item.attempts} बार
                    </span>
                  </div>

                  {/* Best Score */}
                  <div className="text-center bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      सर्वश्रेष्ठ अंक
                    </span>
                    <span className="text-xs sm:text-sm font-black text-amber-600 flex items-center justify-center gap-0.5">
                      <Zap className="w-3 h-3 text-amber-500 fill-amber-400" />
                      {item.bestScore}
                    </span>
                  </div>

                  {/* Accuracy */}
                  <div className="text-center bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      औसत सटीकता
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-black ${
                        item.averageAccuracy >= 80
                          ? 'text-emerald-600'
                          : item.averageAccuracy >= 50
                          ? 'text-amber-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {Math.round(item.averageAccuracy)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          // Fallback: Recent raw progress records if breakdown aggregation is empty
          progressRecords.map((record) => {
            const meta = registryMap.get(record.activityId);
            const title = meta?.title || record.activityId;
            const icon = meta?.icon || '📝';

            return (
              <div
                key={record._id}
                className="bg-slate-50 border-2 border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-white border-2 border-slate-200 shadow-2xs flex items-center justify-center text-xl shrink-0">
                    {icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800">{title}</h4>
                    <span className="text-[11px] font-bold text-slate-400">
                      {formatDate(record.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-xs font-black text-slate-700 bg-white px-2.5 py-1 rounded-xl border border-slate-200">
                    अंक: {record.score} / {record.total}
                  </div>
                  <div className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                    {Math.round(record.accuracy)}%
                  </div>
                  {record.completed && (
                    <div className="flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-100 px-2 py-1 rounded-xl">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>पूर्ण</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
