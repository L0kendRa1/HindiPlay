import React from 'react';
import { StoryData } from '../types/readingComprehension';
import { Volume2, Square, BookOpen } from 'lucide-react';

interface StoryReaderProps {
  story: StoryData;
  isPlayingAudio: boolean;
  onPlayAudio: () => void;
  onStopAudio: () => void;
}

export const StoryReader: React.FC<StoryReaderProps> = ({
  story,
  isPlayingAudio,
  onPlayAudio,
  onStopAudio,
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white/95 backdrop-blur-xs border-4 border-toy-yellow/80 rounded-3xl p-5 sm:p-7 shadow-toy-lg mb-4 select-text">
      {/* Story Title & Audio Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b-2 border-amber-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-2xl shadow-xs select-none">
            {story.emoji || '📖'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
                कहानी
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-hindi text-slate-800 mt-0.5">
              {story.title}
            </h2>
          </div>
        </div>

        {/* Audio Narration Button */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {isPlayingAudio ? (
            <button
              onClick={onStopAudio}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-black text-sm px-4 py-2 rounded-2xl shadow-toy-sm active:scale-95 transition-all animate-pulse"
              title="कहानी सुनना रोकें"
              aria-label="कहानी सुनना रोकें"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>रोकें</span>
            </button>
          ) : (
            <button
              onClick={onPlayAudio}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-gradient-to-r from-toy-yellow to-toy-orange hover:from-amber-400 hover:to-orange-500 text-slate-900 font-black text-sm px-4 py-2 rounded-2xl shadow-toy-sm active:scale-95 transition-all"
              title="पूरी कहानी सुनो (भारतीय हिन्दी उच्चारण)"
              aria-label="पूरी कहानी सुनो"
            >
              <Volume2 className="w-4 h-4 stroke-[2.5]" />
              <span>कहानी सुनो 🔊</span>
            </button>
          )}
        </div>
      </div>

      {/* Story Paragraphs Content with High-Readability Devanagari Typography */}
      <div className="my-4 space-y-3 sm:space-y-4">
        {story.paragraphs.map((paragraph, idx) => (
          <p
            key={idx}
            className="text-lg sm:text-xl md:text-2xl font-bold font-hindi text-slate-800 leading-relaxed md:leading-loose tracking-wide bg-amber-50/40 p-3.5 rounded-2xl border border-amber-100/80"
          >
            {paragraph}
          </p>
        ))}
      </div>

      {/* Hint Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-bold text-slate-400 select-none">
        <span className="flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5" />
          <span>कहानी ध्यान से पढ़ें और नीचे दिए गए सवालों के जवाब दें</span>
        </span>
      </div>
    </div>
  );
};
