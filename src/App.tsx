import { useState } from 'react';
import { LetterQuizActivity } from './components/LetterQuizActivity';
import { PictureMatchActivity } from './components/PictureMatchActivity';
import { ActivityNav, ActivityMode } from './components/ActivityNav';

export function App() {
  const [currentActivity, setCurrentActivity] = useState<ActivityMode>('picture-match');

  return (
    <div className="min-h-screen bg-toy-canvas text-slate-800 flex flex-col font-hindi">
      {/* Activity Switcher Bar */}
      <ActivityNav
        currentActivity={currentActivity}
        onSelectActivity={setCurrentActivity}
      />

      {/* Active Activity View */}
      {currentActivity === 'letter-quiz' ? (
        <LetterQuizActivity />
      ) : (
        <PictureMatchActivity />
      )}
    </div>
  );
}

export default App;
