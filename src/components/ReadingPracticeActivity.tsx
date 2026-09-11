import React from 'react';
import { useReadingPractice, RecognitionState } from '../hooks/useReadingPractice';
import { ReadingPracticeDifficulty } from '../data/readingPractice';
import { Header } from './Header';
import {
  Mic,
  MicOff,
  Volume2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  AlertCircle,
  Sparkles,
  Trophy,
} from 'lucide-react';

interface ReadingPracticeActivityProps {
  onBackToLibrary: () => void;
}

const DIFFICULTY_OPTIONS: { key: ReadingPracticeDifficulty; label: string; emoji: string }[] = [
  { key: 'easy', label: 'आसान', emoji: '🌱' },
  { key: 'medium', label: 'मध्यम', emoji: '🌿' },
  { key: 'hard', label: 'कठिन', emoji: '🌳' },
];

function getStatusIndicator(
  state: RecognitionState,
  isCorrect?: boolean
): { text: string; emoji: string; color: string } {
  switch (state) {
    case 'idle':
      return { text: 'माइक शुरू करने के लिए तैयार', emoji: '🎤', color: 'text-slate-500' };
    case 'listening':
      return { text: 'सुन रहा हूँ... बोलिए', emoji: '🔴', color: 'text-rose-600' };
    case 'processing':
      return { text: 'शब्द पहचान जाँच हो रही है...', emoji: '⏳', color: 'text-amber-600' };
    case 'result':
      if (isCorrect) {
        return { text: 'जाँच पूरी: सही पढ़ा!', emoji: '🎉', color: 'text-emerald-600' };
      }
      return { text: 'जाँच पूरी: सुधार की ज़रूरत है', emoji: '🔍', color: 'text-amber-600' };
    case 'error':
      return { text: 'आवाज़ पहचान नहीं हो सकी', emoji: '⚠️', color: 'text-rose-500' };
  }
}

export const ReadingPracticeActivity: React.FC<ReadingPracticeActivityProps> = ({
  onBackToLibrary,
}) => {
  const {
    currentItem,
    currentIndex,
    totalItems,
    difficulty,
    recognitionState,
    interimText,
    finalText,
    comparisonResult,
    errorMessage,
    isSupported,
    score,
    isRoundComplete,
    startRecognition,
    stopRecognition,
    retryRecognition,
    nextItem,
    previousItem,
    restartRound,
    setDifficulty,
    listenToExpectedText,
    pronounceWord,
  } = useReadingPractice();

  const isListening = recognitionState === 'listening';
  const status = getStatusIndicator(recognitionState, comparisonResult?.isCorrect);

  // 1. Browser does not support speech recognition
  if (!isSupported) {
    return (
      <div className="min-h-screen bg-toy-canvas flex flex-col font-hindi">
        <Header onBackToLibrary={onBackToLibrary} title="📖 पढ़कर सुनाओ" />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-toy-md p-8 max-w-md text-center border-2 border-slate-200">
            <div className="text-5xl mb-4">🎤</div>
            <h2 className="text-xl font-extrabold text-slate-700 mb-3">
              आवाज़ पहचान उपलब्ध नहीं है
            </h2>
            <p className="text-slate-500 text-base mb-6">
              आपके ब्राउज़र में आवाज़ पहचानने की सुविधा उपलब्ध नहीं है।
              कृपया Google Chrome या समर्थित ब्राउज़र का उपयोग करें।
            </p>
            <button
              onClick={onBackToLibrary}
              className="px-6 py-3 bg-gradient-to-r from-toy-sky to-toy-blue text-white font-extrabold rounded-2xl shadow-toy-sm hover:scale-105 transition-transform"
            >
              ← लाइब्रेरी में वापस जाएँ
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Round Complete Celebration View
  if (isRoundComplete) {
    return (
      <div className="min-h-screen bg-toy-canvas flex flex-col font-hindi">
        <Header onBackToLibrary={onBackToLibrary} title="📖 पढ़कर सुनाओ" score={score} />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-toy-md p-8 max-w-md w-full text-center border-2 border-violet-200 animate-pop-in">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-amber-300">
              <Trophy className="w-10 h-10 text-amber-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800 mb-2">
              🎉 पढ़ने का अभ्यास पूरा हुआ!
            </h2>
            <p className="text-slate-500 text-base mb-6">
              आपने बहुत अच्छा प्रयास किया। रोज़ अभ्यास करने से आपका पठन और बेहतर होगा।
            </p>

            <div className="bg-violet-50 rounded-2xl p-4 mb-6 border border-violet-200">
              <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">
                आपका स्कोर (पहली बार में सही)
              </span>
              <div className="text-4xl font-extrabold text-violet-900 mt-1">
                {score} / {totalItems}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={restartRound}
                className="w-full py-3.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-extrabold rounded-2xl shadow-toy-sm hover:scale-105 transition-transform"
              >
                🔄 फिर से खेलें
              </button>
              <button
                onClick={onBackToLibrary}
                className="w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition-colors"
              >
                ← लाइब्रेरी में वापस जाएँ
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Main Activity Gameplay View
  return (
    <div className="min-h-screen bg-toy-canvas flex flex-col font-hindi">
      <Header
        onBackToLibrary={onBackToLibrary}
        title="📖 पढ़कर सुनाओ"
        score={score}
        subtitle="शब्द पहचान जाँच"
      />

      <main className="flex-1 flex flex-col items-center px-4 py-4 gap-4 max-w-2xl mx-auto w-full">
        {/* Difficulty Selector */}
        <div className="flex items-center gap-2">
          {DIFFICULTY_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setDifficulty(opt.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-extrabold text-sm transition-all duration-200 ${
                difficulty === opt.key
                  ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-toy-sm scale-105'
                  : 'bg-white text-slate-600 border-2 border-slate-200 hover:border-violet-300 hover:bg-violet-50'
              }`}
            >
              <span>{opt.emoji}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-between w-full text-xs font-bold text-slate-500 px-2">
          <span>
            प्रगति: {currentIndex + 1} / {totalItems}
          </span>
          <span className="bg-violet-100 text-violet-700 px-2.5 py-0.5 rounded-full">
            स्कोर: {score}
          </span>
        </div>

        {/* Expected Text Card */}
        {currentItem && (
          <div className="w-full bg-white rounded-3xl shadow-toy-md border-2 border-violet-200 p-6 md:p-8 text-center relative overflow-hidden">
            <p className="text-xs font-extrabold text-violet-600 uppercase tracking-wide mb-1">
              पढ़ें ({currentItem.type === 'word' ? 'शब्द' : 'वाक्य'})
            </p>
            <p className="text-3xl md:text-4xl font-extrabold text-slate-800 leading-relaxed tracking-wide my-2 select-text">
              {currentItem.text}
            </p>
            {currentItem.hint && (
              <p className="text-xs text-slate-400 mt-1">💡 {currentItem.hint}</p>
            )}

            {/* Listen button for the expected reading */}
            <div className="mt-3 flex justify-center">
              <button
                onClick={listenToExpectedText}
                className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 text-violet-700 hover:bg-violet-100 font-bold text-xs md:text-sm rounded-xl border border-violet-200 transition-colors"
                title="शुद्ध उच्चारण सुनें"
              >
                <Volume2 className="w-4 h-4 text-violet-600" />
                <span>सुनें</span>
              </button>
            </div>
          </div>
        )}

        {/* Microphone / Action Controls */}
        <div className="flex flex-col items-center gap-3">
          {recognitionState === 'idle' && (
            <button
              onClick={startRecognition}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white font-extrabold text-lg rounded-2xl shadow-toy-md hover:scale-105 active:scale-95 transition-transform"
            >
              <Mic className="w-6 h-6" />
              <span>🎤 बोलना शुरू करें</span>
            </button>
          )}

          {isListening && (
            <button
              onClick={stopRecognition}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-rose-600 to-red-700 text-white font-extrabold text-lg rounded-2xl shadow-toy-md animate-pulse hover:scale-105 active:scale-95 transition-transform"
            >
              <MicOff className="w-6 h-6" />
              <span>🔴 रोकें</span>
            </button>
          )}

          {recognitionState === 'processing' && (
            <div className="flex items-center gap-3 px-8 py-4 bg-amber-100 text-amber-800 font-extrabold text-lg rounded-2xl shadow-toy-sm">
              <span>⏳ शब्द पहचान जाँच हो रही है...</span>
            </div>
          )}

          {(recognitionState === 'result' || recognitionState === 'error') && (
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <button
                onClick={retryRecognition}
                className="flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-extrabold text-base rounded-2xl shadow-toy-md hover:scale-105 active:scale-95 transition-transform"
              >
                <RotateCcw className="w-5 h-5" />
                <span>🔄 फिर से बोलें</span>
              </button>

              {comparisonResult?.isCorrect && (
                <button
                  onClick={nextItem}
                  className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-base rounded-2xl shadow-toy-md hover:scale-105 active:scale-95 transition-transform"
                >
                  <span>अगला पढ़ें</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Status / Recognition Feedback Area */}
        <div className="w-full bg-white rounded-3xl shadow-toy-sm border-2 border-slate-200 p-5 min-h-[140px] flex flex-col items-center justify-center text-center">
          {/* Status Label */}
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-base">{status.emoji}</span>
            <span className={`text-xs font-bold ${status.color}`}>
              {status.text}
            </span>
          </div>

          {/* Real-time Interim text while speaking */}
          {isListening && interimText && (
            <div className="mt-1">
              <p className="text-xs text-slate-400 font-bold mb-1">आप बोल रहे हैं...</p>
              <p className="text-xl md:text-2xl font-extrabold text-violet-600 animate-pulse">
                {interimText}
              </p>
            </div>
          )}

          {/* Final Recognized Result & Comparison */}
          {recognitionState === 'result' && finalText && comparisonResult && (
            <div className="w-full flex flex-col items-center gap-3">
              {/* What the student said */}
              <div className="w-full bg-slate-50 rounded-2xl p-3 border border-slate-200">
                <span className="text-xs font-bold text-slate-500">आपने कहा:</span>
                <p className="text-2xl font-extrabold text-slate-800 mt-0.5">
                  {finalText}
                </p>
              </div>

              {/* 1. Correct Match Feedback */}
              {comparisonResult.isCorrect && (
                <div className="flex items-center gap-2 bg-emerald-50 border-2 border-emerald-300 text-emerald-800 font-extrabold text-base md:text-lg px-5 py-2.5 rounded-2xl shadow-toy-sm animate-pop-in">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <span>🎉 बहुत बढ़िया! आपने सही पढ़ा।</span>
                </div>
              )}

              {/* 2. Incorrect / Needs Improvement Feedback */}
              {!comparisonResult.isCorrect && (
                <div className="w-full flex flex-col gap-3 items-center">
                  <div className="flex items-center gap-2 text-amber-800 bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl text-sm font-bold">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      {comparisonResult.hasMissing && !comparisonResult.hasSubstitutions
                        ? 'छूटे हुए शब्द पर ध्यान दें:'
                        : 'एक शब्द पर फिर से कोशिश करें:'}
                    </span>
                  </div>

                  {/* Highlighted Error Corrections */}
                  <div className="flex flex-wrap gap-2 justify-center w-full">
                    {comparisonResult.errors.map((err, idx) => {
                      if (err.type === 'substitution' && err.expectedWord) {
                        return (
                          <div
                            key={idx}
                            className="flex items-center gap-2 bg-rose-50 border-2 border-rose-200 rounded-2xl p-3 shadow-toy-sm"
                          >
                            <div className="text-left">
                              <div className="text-[11px] font-bold text-rose-500 line-through">
                                आपने कहा: {err.recognizedWord}
                              </div>
                              <div className="text-lg font-extrabold text-emerald-700">
                                सही शब्द: {err.expectedWord}
                              </div>
                            </div>
                            <button
                              onClick={() => pronounceWord(err.expectedWord!)}
                              className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl transition-colors"
                              title={`"${err.expectedWord}" का उच्चारण सुनें`}
                            >
                              <Volume2 className="w-5 h-5" />
                            </button>
                          </div>
                        );
                      }

                      if (err.type === 'missing' && err.expectedWord) {
                        return (
                          <div
                            key={idx}
                            className="flex items-center gap-2 bg-amber-50 border-2 border-amber-200 rounded-2xl p-3 shadow-toy-sm"
                          >
                            <div className="text-left">
                              <div className="text-[11px] font-bold text-amber-600">
                                ❌ छूटा हुआ शब्द:
                              </div>
                              <div className="text-lg font-extrabold text-amber-900">
                                {err.expectedWord}
                              </div>
                            </div>
                            <button
                              onClick={() => pronounceWord(err.expectedWord!)}
                              className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl transition-colors"
                              title={`"${err.expectedWord}" का उच्चारण सुनें`}
                            >
                              <Volume2 className="w-5 h-5" />
                            </button>
                          </div>
                        );
                      }

                      if (err.type === 'extra' && err.recognizedWord) {
                        return (
                          <div
                            key={idx}
                            className="flex items-center gap-1.5 bg-slate-100 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-600"
                          >
                            <span>एक अतिरिक्त शब्द सुनाई दिया:</span>
                            <span className="text-rose-600 font-extrabold">"{err.recognizedWord}"</span>
                          </div>
                        );
                      }

                      return null;
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {recognitionState === 'error' && errorMessage && (
            <div className="flex items-start gap-2 text-left max-w-md bg-rose-50 border border-rose-200 p-3 rounded-2xl">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <p className="text-sm font-bold text-rose-700">{errorMessage}</p>
            </div>
          )}

          {/* Idle Placeholder */}
          {recognitionState === 'idle' && (
            <p className="text-slate-400 text-sm font-medium">
              ऊपर दिया गया शब्द/वाक्य ज़ोर से और साफ़ आवाज़ में पढ़ें
            </p>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={previousItem}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-white border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>पिछला</span>
          </button>
          <button
            onClick={nextItem}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-white border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            <span>अगला</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
};
