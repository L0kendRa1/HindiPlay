import { useState } from 'react';
import { LetterQuizActivity } from './components/LetterQuizActivity';
import { PictureMatchActivity } from './components/PictureMatchActivity';
import { WordBuilderActivity } from './components/WordBuilderActivity';
import { ActivityNav, ActivityMode } from './components/ActivityNav';

export function App() {
  const [currentActivity, setCurrentActivity] = useState<ActivityMode>('word-builder');

  return (
    <div className="min-h-screen bg-toy-canvas text-slate-800 flex flex-col font-hindi">
      {/* Top Activity Switcher Bar */}
      <ActivityNav
        currentActivity={currentActivity}
        onSelectActivity={setCurrentActivity}
      />

      {/* Active Activity View */}
      {currentActivity === 'letter-quiz' && <LetterQuizActivity />}
      {currentActivity === 'picture-match' && <PictureMatchActivity />}
      {currentActivity === 'word-builder' && <WordBuilderActivity />}
    </div>
  );
}

export default App;
