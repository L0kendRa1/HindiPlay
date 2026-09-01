import { useState, useCallback, useEffect } from 'react';
import {
  StoryDifficulty,
  StoryData,
} from '../types/readingComprehension';
import { FeedbackType, ActivityStats } from '../types/activity';
import { generateReadingRound } from '../data/readingStories';
import { audioService } from '../services/audioService';

const DEFAULT_STORY_COUNT = 5;

interface UseReadingComprehensionOptions {
  storyCount?: number;
  initialDifficulty?: StoryDifficulty;
}

export function useReadingComprehension(options: UseReadingComprehensionOptions = {}) {
  const { storyCount = DEFAULT_STORY_COUNT, initialDifficulty = 'easy' } = options;

  const [difficulty, setDifficultyState] = useState<StoryDifficulty>(initialDifficulty);
  const [stories, setStories] = useState<StoryData[]>(() =>
    generateReadingRound(initialDifficulty, storyCount)
  );
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number>(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<FeedbackType>('idle');
  const [attempts, setAttempts] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isRoundComplete, setIsRoundComplete] = useState<boolean>(false);

  // Compute total questions across all stories in this round
  const totalQuestionsInRound = stories.reduce(
    (sum, s) => sum + s.questions.length,
    0
  );

  const [stats, setStats] = useState<ActivityStats>({
    totalQuestions: totalQuestionsInRound || 10,
    currentQuestionIndex: 0,
    score: 0,
    firstAttemptSuccessCount: 0,
    streak: 0,
    bestStreak: 0,
  });

  const currentStory = stories[currentStoryIndex] || null;
  const currentQuestion = currentStory?.questions[currentQuestionIndex] || null;
  const totalStoryQuestions = currentStory?.questions.length || 0;

  // Cleanup speech audio on unmount or story change
  useEffect(() => {
    return () => {
      audioService.stopSpeech();
    };
  }, []);

  const selectOption = useCallback(
    (option: string) => {
      if (isCorrect) return;
      audioService.playSfx('pop');
      setSelectedOption(option);
      setIsChecked(false);
      setFeedback('idle');
    },
    [isCorrect]
  );

  const checkAnswer = useCallback(() => {
    if (!selectedOption || !currentQuestion || isCorrect) return;

    setIsChecked(true);
    const correct = selectedOption === currentQuestion.correctAnswer;

    if (correct) {
      setIsCorrect(true);
      setFeedback('correct');
      audioService.playSfx('correct');

      setStats((prev) => {
        const isFirst = attempts === 0;
        const newStreak = prev.streak + 1;
        return {
          ...prev,
          score: prev.score + (isFirst ? 10 : 5),
          firstAttemptSuccessCount: prev.firstAttemptSuccessCount + (isFirst ? 1 : 0),
          streak: newStreak,
          bestStreak: Math.max(prev.bestStreak, newStreak),
        };
      });
    } else {
      setIsCorrect(false);
      setFeedback('incorrect');
      setAttempts((prev) => prev + 1);
      audioService.playSfx('wrong');
      setStats((prev) => ({ ...prev, streak: 0 }));
    }
  }, [selectedOption, currentQuestion, isCorrect, attempts]);

  const stopStoryAudio = useCallback(() => {
    audioService.stopSpeech();
    setIsPlayingAudio(false);
  }, []);

  const playStoryAudio = useCallback(() => {
    if (!currentStory) return;

    if (isPlayingAudio) {
      stopStoryAudio();
      return;
    }

    setIsPlayingAudio(true);
    audioService.playStoryAudio(
      currentStory.paragraphs,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false)
    );
  }, [currentStory, isPlayingAudio, stopStoryAudio]);

  const nextQuestion = useCallback(() => {
    stopStoryAudio();

    if (!currentStory) return;

    // Check if more questions remain in current story
    if (currentQuestionIndex + 1 < currentStory.questions.length) {
      const nextQIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextQIdx);
      setSelectedOption(null);
      setIsChecked(false);
      setIsCorrect(false);
      setFeedback('idle');
      setAttempts(0);
      setStats((prev) => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 }));
      return;
    }

    // Check if more stories remain in round
    if (currentStoryIndex + 1 < stories.length) {
      const nextStoryIdx = currentStoryIndex + 1;
      setCurrentStoryIndex(nextStoryIdx);
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setIsChecked(false);
      setIsCorrect(false);
      setFeedback('idle');
      setAttempts(0);
      setStats((prev) => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 }));
      return;
    }

    // Round completed!
    setIsRoundComplete(true);
    audioService.playSfx('celebrate');
  }, [stopStoryAudio, currentStory, currentQuestionIndex, currentStoryIndex, stories.length]);

  const restartRound = useCallback(() => {
    stopStoryAudio();
    audioService.playSfx('pop');
    const newStories = generateReadingRound(difficulty, storyCount);
    setStories(newStories);
    setCurrentStoryIndex(0);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsChecked(false);
    setIsCorrect(false);
    setFeedback('idle');
    setAttempts(0);
    setIsRoundComplete(false);

    const totalQ = newStories.reduce((sum, s) => sum + s.questions.length, 0);
    setStats({
      totalQuestions: totalQ,
      currentQuestionIndex: 0,
      score: 0,
      firstAttemptSuccessCount: 0,
      streak: 0,
      bestStreak: 0,
    });
  }, [stopStoryAudio, difficulty, storyCount]);

  const setDifficulty = useCallback(
    (newDiff: StoryDifficulty) => {
      stopStoryAudio();
      audioService.playSfx('click');
      setDifficultyState(newDiff);
      const newStories = generateReadingRound(newDiff, storyCount);
      setStories(newStories);
      setCurrentStoryIndex(0);
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setIsChecked(false);
      setIsCorrect(false);
      setFeedback('idle');
      setAttempts(0);
      setIsRoundComplete(false);

      const totalQ = newStories.reduce((sum, s) => sum + s.questions.length, 0);
      setStats({
        totalQuestions: totalQ,
        currentQuestionIndex: 0,
        score: 0,
        firstAttemptSuccessCount: 0,
        streak: 0,
        bestStreak: 0,
      });
    },
    [stopStoryAudio, storyCount]
  );

  return {
    difficulty,
    stories,
    currentStoryIndex,
    currentStory,
    currentQuestionIndex,
    currentQuestion,
    totalStoryQuestions,
    selectedOption,
    isChecked,
    isCorrect,
    feedback,
    attempts,
    isPlayingAudio,
    isRoundComplete,
    stats,
    selectOption,
    checkAnswer,
    playStoryAudio,
    stopStoryAudio,
    nextQuestion,
    restartRound,
    setDifficulty,
  };
}
