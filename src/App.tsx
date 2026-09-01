import { useState, useCallback } from 'react';
import { ActivityMeta } from './data/activityRegistry';
import { ActivityLibrary } from './components/ActivityLibrary';
import { ActivityPreviewModal } from './components/ActivityPreviewModal';
import { LetterQuizActivity } from './components/LetterQuizActivity';
import { PictureMatchActivity } from './components/PictureMatchActivity';
import { WordBuilderActivity } from './components/WordBuilderActivity';
import { CharacterTracingActivity } from './components/CharacterTracingActivity';
import { PictureWordQuizActivity } from './components/PictureWordQuizActivity';
import { MatraLabActivity } from './components/MatraLabActivity';
import { WordPictureQuizActivity } from './components/WordPictureQuizActivity';
import { MemoryGameActivity } from './components/MemoryGameActivity';
import { SentenceBuilderActivity } from './components/SentenceBuilderActivity';

import { audioService } from './services/audioService';

type AppView = 'library' | 'playing';

export function App() {
  const [currentView, setCurrentView] = useState<AppView>('library');
  const [previewActivity, setPreviewActivity] = useState<ActivityMeta | null>(null);
  const [activeActivity, setActiveActivity] = useState<ActivityMeta | null>(null);
  const [sessionKey, setSessionKey] = useState<number>(0);

  // Click on activity card: opens Preview (game does NOT start yet)
  const handleSelectActivity = useCallback((activity: ActivityMeta) => {
    audioService.stopSpeech();
    setPreviewActivity(activity);
  }, []);

  // Close Preview modal: return to Library
  const handleClosePreview = useCallback(() => {
    audioService.stopSpeech();
    setPreviewActivity(null);
  }, []);

  // Click "शुरू करें": launches actual activity gameplay with fresh state
  const handleStartActivity = useCallback(() => {
    if (!previewActivity) return;
    audioService.stopSpeech();
    setActiveActivity(previewActivity);
    setPreviewActivity(null);
    setCurrentView('playing');
    setSessionKey((prev) => prev + 1); // Ensures clean component state mount
  }, [previewActivity]);

  // Back to Library from any game
  const handleBackToLibrary = useCallback(() => {
    audioService.stopSpeech();
    setCurrentView('library');
    setActiveActivity(null);
    setPreviewActivity(null);
  }, []);

  return (
    <div className="min-h-screen bg-toy-canvas text-slate-800 flex flex-col font-hindi select-none">
      {/* 1. Activity Library (Home Screen) */}
      {currentView === 'library' && (
        <>
          <ActivityLibrary onSelectActivity={handleSelectActivity} />

          {/* 2. Activity Preview Modal (Opened when an activity is clicked) */}
          {previewActivity && (
            <ActivityPreviewModal
              activity={previewActivity}
              onStart={handleStartActivity}
              onBack={handleClosePreview}
            />
          )}
        </>
      )}

      {/* 3. Active Gameplay Screen (Launched only after "शुरू करें") */}
      {currentView === 'playing' && activeActivity && (
        <div key={`${activeActivity.activityCode}_${sessionKey}`}>
          {activeActivity.activityCode === 'letter-quiz' && (
            <LetterQuizActivity onBackToLibrary={handleBackToLibrary} />
          )}
          {activeActivity.activityCode === 'picture-match' && (
            <PictureMatchActivity onBackToLibrary={handleBackToLibrary} />
          )}
          {activeActivity.activityCode === 'word-builder' && (
            <WordBuilderActivity onBackToLibrary={handleBackToLibrary} />
          )}
          {activeActivity.activityCode === 'tracing' && (
            <CharacterTracingActivity onBackToLibrary={handleBackToLibrary} />
          )}
          {activeActivity.activityCode === 'picture-word-quiz' && (
            <PictureWordQuizActivity onBackToLibrary={handleBackToLibrary} />
          )}
          {activeActivity.activityCode === 'matra-lab' && (
            <MatraLabActivity onBackToLibrary={handleBackToLibrary} />
          )}
          {activeActivity.activityCode === 'word-picture-quiz' && (
            <WordPictureQuizActivity onBackToLibrary={handleBackToLibrary} />
          )}
          {activeActivity.activityCode === 'memory-match' && (
            <MemoryGameActivity onBackToLibrary={handleBackToLibrary} />
          )}
          {activeActivity.activityCode === 'sentence-builder' && (
            <SentenceBuilderActivity onBackToLibrary={handleBackToLibrary} />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
