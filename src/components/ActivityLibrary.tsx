import React, { useState, useMemo } from 'react';
import {
  ACTIVITY_CATEGORIES,
  ActivityCategoryKey,
  ActivityMeta,
  filterActivities,
} from '../data/activityRegistry';
import { ActivityCard } from './ActivityCard';
import { Search, Sparkles, X } from 'lucide-react';

interface ActivityLibraryProps {
  onSelectActivity: (activity: ActivityMeta) => void;
}

export const ActivityLibrary: React.FC<ActivityLibraryProps> = ({ onSelectActivity }) => {
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategoryKey>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredActivities = useMemo(() => {
    return filterActivities(selectedCategory, searchQuery);
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-toy-canvas flex flex-col justify-between font-hindi">
      {/* Top Brand Header */}
      <header className="w-full bg-white/90 backdrop-blur border-b-2 border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
          {/* Logo / Brand Name */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gradient-to-tr from-toy-orange to-toy-yellow flex items-center justify-center text-white shadow-toy-sm text-2xl select-none">
              🎨
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black font-hindi text-slate-800 tracking-tight leading-none">
                HindiPlay
              </h1>
              <span className="text-[10px] md:text-xs font-bold text-slate-500 block">
                हिंदी बाल मंच • खेल-खेल में सीखें
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64 md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="गतिविधि खोजें..."
              className="w-full pl-9 pr-8 py-2 rounded-2xl border-2 border-slate-200 focus:border-toy-sky bg-slate-50 text-xs md:text-sm font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                title="साफ़ करें"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        {/* Welcome Banner */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-toy-yellow to-toy-orange text-slate-900 px-4 py-1.5 rounded-full font-extrabold text-xs md:text-sm shadow-toy-sm mb-2">
            <Sparkles className="w-4 h-4" />
            <span>गतिविधि चुनें (Choose an Activity)</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight">
            आज आप क्या सीखना चाहते हैं?
          </h2>
          <p className="text-xs md:text-sm font-bold text-slate-500 mt-1">
            नीचे दी गई किसी भी गतिविधि पर क्लिक करके अभ्यास शुरू करें!
          </p>
        </div>

        {/* Category Navigation Buttons */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
          {ACTIVITY_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-extrabold text-xs md:text-sm transition-all duration-200 border-2 ${
                  isSelected
                    ? 'bg-gradient-to-r from-toy-orange to-toy-yellow text-slate-900 border-toy-orange-dark shadow-toy-sm scale-105'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <span className="text-base">{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Activity Cards Grid */}
        {filteredActivities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {filteredActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onClick={() => onSelectActivity(activity)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border-2 border-dashed border-slate-200 rounded-3xl p-6 my-4">
            <div className="text-5xl mb-2">🔍</div>
            <h3 className="text-lg font-black text-slate-700">कोई गतिविधि नहीं मिली</h3>
            <p className="text-xs md:text-sm font-bold text-slate-400 mt-1">
              कृपया कुछ और शब्द खोजकर देखें या श्रेणी बदलें।
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-toy-orange text-white rounded-xl text-xs font-extrabold shadow-toy-sm hover:bg-toy-orange-dark transition-colors"
            >
              सभी गतिविधियाँ देखें
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 font-semibold border-t border-slate-200 bg-white/50">
        HindiPlay • Toy Theater Inspired Hindi Learning Toys
      </footer>
    </div>
  );
};
