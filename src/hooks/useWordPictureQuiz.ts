import { useState, useCallback, useEffect } from 'react';
import { WordPictureQuizQuestion } from '../types/pictureMatch';
import { CategoryFilter, FeedbackType, ActivityStats } from '../types/activity';
import { generateWordPictureQuizRound } from '../data/pictureWords';
import { audioService } from '../services/audioService';

const TOTAL_ROUND_QUESTIONS = 10;

interface UseWordPictureQuizOptions {
  totalQuestions?: number;
  initialCategory?: CategoryFilter;
}

export function useWordPictureQuiz(options: UseWordPictureQuizOptions = {}) {
  const {
    totalQuestions = TOTAL_ROUND_QUESTIONS,
    initialCategory = 'all',
  } = options;

  const [categoryFilter, setCategoryFilterState] = useState<CategoryFilter>(initialCategory);
  const [questions, setQuestions] = useState<WordPictureQuizQuestion[]>(() =>
    generateWordPictureQuizRound({ count: totalQuestions, categoryFilter: initialCategory })
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [wrongOptionIds, setWrongOptionIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<FeedbackType>('idle');
  const [attempts, setAttempts] = useState<number>(0);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [isRoundComplete, setIsRoundComplete] = useState<boolean>(false);
  const [stats, setStats] = useState<ActivityStats>({
    totalQuestions,
    currentQuestionIndex: 0,
    score: 0,
    firstAttemptSuccessCount: 0,
    streak: 0,
    bestStreak: 0,
  });

  const currentQuestion = questions[currentIndex] || null;

  const playCurrentWordAudio = useCallback(() => {
    if (!currentQuestion) return;
    audioService.playWordAudio(currentQuestion.targetItem.word);
  }, [currentQuestion]);

  const selectOption = useCallback(
    (optionId: string) => {
      if (isSolved || !currentQuestion || wrongOptionIds.includes(optionId)) return;

      const isCorrect = optionId === currentQuestion.correctAnswerId;

      if (isCorrect) {
        setSelectedOptionId(optionId);
        setIsSolved(true);
        setFeedback('correct');
        audioService.playSfx('correct');

        setTimeout(() => {
          audioService.playWordAudio(currentQuestion.targetItem.word);
        }, 350);

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
        setWrongOptionIds((prev) => [...prev, optionId]);
        setFeedback('incorrect');
        setAttempts((prev) => prev + 1);
        audioService.playSfx('wrong');
        setStats((prev) => ({ ...prev, streak: 0 }));
      }
    },
    [isSolved, currentQuestion, wrongOptionIds, attempts]
  );

  // Synchronous, complete reset for next question
  const nextQuestion = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      setIsRoundComplete(true);
      audioService.playSfx('celebrate');
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setSelectedOptionId(null);
    setWrongOptionIds([]);
    setFeedback('idle');
    setAttempts(0);
    setIsSolved(false);

    setStats((prev) => ({
      ...prev,
      currentQuestionIndex: currentIndex + 1,
    }));
  }, [currentIndex, questions.length]);

  // Complete clean reset of round
  const restartRound = useCallback(() => {
    audioService.stopSpeech();
    audioService.playSfx('pop');
    const newQuestions = generateWordPictureQuizRound({
      count: totalQuestions,
      categoryFilter,
    });
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setWrongOptionIds([]);
    setFeedback('idle');
    setAttempts(0);
    setIsSolved(false);
    setIsRoundComplete(false);
    setStats({
      totalQuestions,
      currentQuestionIndex: 0,
      score: 0,
      firstAttemptSuccessCount: 0,
      streak: 0,
      bestStreak: 0,
    });
  }, [totalQuestions, categoryFilter]);

  const setCategoryFilter = useCallback(
    (newCat: CategoryFilter) => {
      audioService.stopSpeech();
      audioService.playSfx('click');
      setCategoryFilterState(newCat);
      const newQuestions = generateWordPictureQuizRound({
        count: totalQuestions,
        categoryFilter: newCat,
      });
      setQuestions(newQuestions);
      setCurrentIndex(0);
      setSelectedOptionId(null);
      setWrongOptionIds([]);
      setFeedback('idle');
      setAttempts(0);
      setIsSolved(false);
      setIsRoundComplete(false);
      setStats({
        totalQuestions,
        currentQuestionIndex: 0,
        score: 0,
        firstAttemptSuccessCount: 0,
        streak: 0,
        bestStreak: 0,
      });
    },
    [totalQuestions]
  );

  // Keyboard shortcut listener (1, 2, 3 for options; Space/Enter for Next)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isRoundComplete) return;

      if (!isSolved && currentQuestion) {
        if (e.key === '1' && currentQuestion.options[0]) {
          selectOption(currentQuestion.options[0].id);
        } else if (e.key === '2' && currentQuestion.options[1]) {
          selectOption(currentQuestion.options[1].id);
        } else if (e.key === '3' && currentQuestion.options[2]) {
          selectOption(currentQuestion.options[2].id);
        }
      } else if (isSolved && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        nextQuestion();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRoundComplete, isSolved, currentQuestion, selectOption, nextQuestion]);

  return {
    questions,
    currentIndex,
    currentQuestion,
    selectedOptionId,
    wrongOptionIds,
    feedback,
    attempts,
    isSolved,
    isRoundComplete,
    categoryFilter,
    stats,
    selectOption,
    playCurrentWordAudio,
    nextQuestion,
    restartRound,
    setCategoryFilter,
  };
}
