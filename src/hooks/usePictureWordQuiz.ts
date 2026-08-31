import { useState, useCallback, useEffect, useRef } from 'react';
import { PictureWordQuizQuestion, PictureWordItem } from '../types/pictureMatch';
import { CategoryFilter, FeedbackType, ActivityStats } from '../types/activity';
import { generatePictureWordQuizRound } from '../data/pictureWords';
import { audioService } from '../services/audioService';

const TOTAL_ROUND_QUESTIONS = 10;

interface UsePictureWordQuizOptions {
  totalQuestions?: number;
  initialCategory?: CategoryFilter;
}

export function usePictureWordQuiz(options: UsePictureWordQuizOptions = {}) {
  const {
    totalQuestions = TOTAL_ROUND_QUESTIONS,
    initialCategory = 'all',
  } = options;

  const [categoryFilter, setCategoryFilterState] = useState<CategoryFilter>(initialCategory);
  const [questions, setQuestions] = useState<PictureWordQuizQuestion[]>(() =>
    generatePictureWordQuizRound({ count: totalQuestions, categoryFilter: initialCategory })
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

  // Speak word audio prompt on question change
  const initialMountRef = useRef(true);
  useEffect(() => {
    if (initialMountRef.current) {
      initialMountRef.current = false;
      return;
    }
    // We don't auto-speak word answer before solving in picture-to-word quiz,
    // but the student can press the audio button or hear it upon correct selection!
  }, [currentIndex, isRoundComplete, currentQuestion]);

  const playCurrentTargetAudio = useCallback(() => {
    if (!currentQuestion) return;
    audioService.playWordAudio(currentQuestion.targetItem.word);
  }, [currentQuestion]);

  const playOptionAudio = useCallback((option: PictureWordItem) => {
    audioService.playWordAudio(option.word);
  }, []);

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
  const handleNextQuestion = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      setIsRoundComplete(true);
      audioService.playSfx('celebrate');
    } else {
      audioService.playSfx('pop');
      const nextIndex = currentIndex + 1;

      setCurrentIndex(nextIndex);
      setSelectedOptionId(null);
      setWrongOptionIds([]);
      setFeedback('idle');
      setIsSolved(false);
      setAttempts(0);

      setStats((prev) => ({
        ...prev,
        currentQuestionIndex: nextIndex,
      }));
    }
  }, [currentIndex, questions.length]);

  const setCategoryFilter = useCallback(
    (newFilter: CategoryFilter) => {
      audioService.playSfx('pop');
      setCategoryFilterState(newFilter);
      const newQuestions = generatePictureWordQuizRound({
        count: totalQuestions,
        categoryFilter: newFilter,
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

  const restartQuiz = useCallback(() => {
    audioService.playSfx('pop');
    const newQuestions = generatePictureWordQuizRound({
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

  return {
    questions,
    currentIndex,
    totalQuestions: questions.length,
    currentQuestion,
    selectedOptionId,
    wrongOptionIds,
    feedback,
    attempts,
    isSolved,
    isRoundComplete,
    categoryFilter,
    stats,
    playCurrentTargetAudio,
    playOptionAudio,
    selectOption,
    handleNextQuestion,
    setCategoryFilter,
    restartQuiz,
  };
}
