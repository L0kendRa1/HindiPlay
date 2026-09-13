import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { ActivityMeta } from './data/activityRegistry';
import { AuthEntry } from './components/AuthEntry';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
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
import { ReadingComprehensionActivity } from './components/ReadingComprehensionActivity';
import { ReadingPracticeActivity } from './components/ReadingPracticeActivity';

import { audioService } from './services/audioService';

type AppView = 'auth-entry' | 'login' | 'register' | 'library' | 'playing';

export function App() {
  const { isAuthenticated, isLoading } = useAuth();

  const [isGuest, setIsGuest] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('hindiplay_guest') === 'true';
    } catch {
      return false;
    }
  });

  const [currentView, setCurrentView] = useState<AppView>(() => {
    try {
      if (sessionStorage.getItem('hindiplay_guest') === 'true') {
        return 'library';
      }
    } catch {}
    return 'auth-entry';
  });

  const [previewActivity, setPreviewActivity] = useState<ActivityMeta | null>(null);
  const [activeActivity, setActiveActivity] = useState<ActivityMeta | null>(null);
  const [sessionKey, setSessionKey] = useState<number>(0);

  // Sync view when auth status is determined
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        setIsGuest(false);
        try {
          sessionStorage.removeItem('hindiplay_guest');
        } catch {}
        if (currentView === 'auth-entry' || currentView === 'login' || currentView === 'register') {
          setCurrentView('library');
        }
      } else if (!isGuest) {
        if (currentView !== 'playing' && currentView !== 'login' && currentView !== 'register') {
          setCurrentView('auth-entry');
        }
      }
    }
  }, [isAuthenticated, isLoading, isGuest, currentView]);

  // Guest entry
  const handleContinueGuest = useCallback(() => {
    audioService.stopSpeech();
    setIsGuest(true);
    try {
      sessionStorage.setItem('hindiplay_guest', 'true');
    } catch {}
    setCurrentView('library');
  }, []);

  // Auth navigation
  const handleGoToLogin = useCallback(() => {
    audioService.stopSpeech();
    setCurrentView('login');
  }, []);

  const handleGoToRegister = useCallback(() => {
    audioService.stopSpeech();
    setCurrentView('register');
  }, []);

  const handleBackToAuthEntry = useCallback(() => {
    audioService.stopSpeech();
    setCurrentView('auth-entry');
  }, []);

  const handleAuthSuccess = useCallback(() => {
    audioService.stopSpeech();
    setIsGuest(false);
    try {
      sessionStorage.removeItem('hindiplay_guest');
    } catch {}
    setCurrentView('library');
  }, []);

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

  // 0. Loading Screen during token validation
  if (isLoading) {
    return (
      <div className="min-h-screen bg-toy-canvas flex flex-col items-center justify-center font-hindi select-none">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-toy-orange to-toy-yellow flex items-center justify-center text-3xl shadow-toy-md animate-bounce-short mb-4">
          🎨
        </div>
        <p className="text-base font-extrabold text-slate-600">लोड हो रहा है...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-toy-canvas text-slate-800 flex flex-col font-hindi select-none">
      {/* 1. Auth Entry Screen */}
      {currentView === 'auth-entry' && (
        <AuthEntry
          onSelectLogin={handleGoToLogin}
          onSelectRegister={handleGoToRegister}
          onContinueGuest={handleContinueGuest}
        />
      )}

      {/* 2. Login Form Screen */}
      {currentView === 'login' && (
        <LoginForm
          onSuccess={handleAuthSuccess}
          onBack={handleBackToAuthEntry}
          onSwitchToRegister={handleGoToRegister}
        />
      )}

      {/* 3. Register Form Screen */}
      {currentView === 'register' && (
        <RegisterForm
          onSuccess={handleAuthSuccess}
          onBack={handleBackToAuthEntry}
          onSwitchToLogin={handleGoToLogin}
        />
      )}

      {/* 4. Activity Library (Home Screen) */}
      {currentView === 'library' && (
        <>
          <ActivityLibrary
            onSelectActivity={handleSelectActivity}
            onLoginClick={handleGoToLogin}
          />

          {/* Activity Preview Modal (Opened when an activity is clicked) */}
          {previewActivity && (
            <ActivityPreviewModal
              activity={previewActivity}
              onStart={handleStartActivity}
              onBack={handleClosePreview}
            />
          )}
        </>
      )}

      {/* 5. Active Gameplay Screen (Launched only after "शुरू करें") */}
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
          {activeActivity.activityCode === 'reading-comprehension' && (
            <ReadingComprehensionActivity onBackToLibrary={handleBackToLibrary} />
          )}
          {activeActivity.activityCode === 'reading-practice' && (
            <ReadingPracticeActivity onBackToLibrary={handleBackToLibrary} />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
