import { useState } from 'react';
import { LetterQuizActivity } from './components/LetterQuizActivity';
import { PictureMatchActivity } from './components/PictureMatchActivity';
import { WordBuilderActivity } from './components/WordBuilderActivity';
import { CharacterTracingActivity } from './components/CharacterTracingActivity';
import { ActivityNav, ActivityMode } from './components/ActivityNav';

export function App() {
  const [currentActivity, setCurrentActivity] = useState<ActivityMode>('tracing');

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
      {currentActivity === 'tracing' && <CharacterTracingActivity />}
    </div>
  );
}

export default App;
