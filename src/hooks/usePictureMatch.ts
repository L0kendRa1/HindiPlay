import { useState, useCallback, useEffect, useRef } from 'react';
import { PictureMatchQuestion } from '../types/pictureMatch';
import { FeedbackType, ActivityStats, CategoryFilter } from '../types/activity';
import { generatePictureMatchRound } from '../data/pictureWords';
import { audioService } from '../services/audioService';

const TOTAL_ROUND_QUESTIONS = 10;

interface UsePictureMatchOptions {
  initialCategory?: CategoryFilter;
  totalQuestions?: number;
}

export function usePictureMatch(options: UsePictureMatchOptions = {}) {
  const { initialCategory = 'all', totalQuestions = TOTAL_ROUND_QUESTIONS } = options;

  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>(initialCategory);
  const [questions, setQuestions] = useState<PictureMatchQuestion[]>(() =>
    generatePictureMatchRound({ count: totalQuestions, categoryFilter: initialCategory })
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [wrongOptionIds, setWrongOptionIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<FeedbackType>('idle');
  const [attempts, setAttempts] = useState<number>(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
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
  const isQuestionAnswered = feedback === 'correct';

  // Play audio for current target character
  const playTargetAudio = useCallback(() => {
    if (!currentQuestion) return;
    setIsAudioPlaying(true);
    audioService.playLetterAudio(
      currentQuestion.targetCharacter.char,
      () => setIsAudioPlaying(true),
      () => setIsAudioPlaying(false)
    );
  }, [currentQuestion]);

  // Autoplay audio on question change
  const initialMountRef = useRef(true);
  useEffect(() => {
    if (initialMountRef.current) {
      initialMountRef.current = false;
      return;
    }
    if (currentQuestion && !isRoundComplete) {
      const timer = setTimeout(() => {
        playTargetAudio();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isRoundComplete, playTargetAudio]);

  // Handle option selection
  const handleSelectOption = useCallback(
    (optionId: string) => {
      if (isQuestionAnswered || !currentQuestion) return;

      setSelectedOptionId(optionId);

      if (optionId === currentQuestion.correctAnswerId) {
        // Correct answer!
        setFeedback('correct');
        audioService.playSfx('correct');

        // Play encouraging association audio ("आ से आम")
        setTimeout(() => {
          audioService.playAssociationAudio(
            currentQuestion.targetCharacter.char,
            currentQuestion.targetWord.word
          );
        }, 350);

        setStats((prev) => {
          const newStreak = prev.streak + 1;
          const isFirstAttempt = attempts === 0;
          return {
            ...prev,
            score: prev.score + (isFirstAttempt ? 10 : 5),
            firstAttemptSuccessCount: prev.firstAttemptSuccessCount + (isFirstAttempt ? 1 : 0),
            streak: newStreak,
            bestStreak: Math.max(prev.bestStreak, newStreak),
          };
        });
      } else {
        // Incorrect answer
        setFeedback('incorrect');
        setWrongOptionIds((prev) => (prev.includes(optionId) ? prev : [...prev, optionId]));
        setAttempts((prev) => prev + 1);
        audioService.playSfx('wrong');

        setStats((prev) => ({
          ...prev,
          streak: 0,
        }));
      }
    },
    [isQuestionAnswered, currentQuestion, attempts]
  );

  // Advance to next question
  const handleNextQuestion = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      // Round complete!
      setIsRoundComplete(true);
      audioService.playSfx('celebrate');
    } else {
      audioService.playSfx('pop');
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSelectedOptionId(null);
      setWrongOptionIds([]);
      setFeedback('idle');
      setAttempts(0);
      setStats((prev) => ({
        ...prev,
        currentQuestionIndex: nextIndex,
      }));
    }
  }, [currentIndex, questions.length]);

  // Restart or change category
  const restartQuiz = useCallback(
    (newFilter?: CategoryFilter) => {
      audioService.playSfx('pop');
      const activeFilter = newFilter !== undefined ? newFilter : categoryFilter;
      if (newFilter !== undefined) {
        setCategoryFilter(newFilter);
      }
      const newQuestions = generatePictureMatchRound({
        count: totalQuestions,
        categoryFilter: activeFilter,
      });
      setQuestions(newQuestions);
      setCurrentIndex(0);
      setSelectedOptionId(null);
      setWrongOptionIds([]);
      setFeedback('idle');
      setAttempts(0);
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
    [categoryFilter, totalQuestions]
  );

  const changeCategoryFilter = useCallback(
    (filter: CategoryFilter) => {
      restartQuiz(filter);
    },
    [restartQuiz]
  );

  return {
    questions,
    currentQuestion,
    currentIndex,
    totalQuestions: questions.length,
    selectedOptionId,
    wrongOptionIds,
    feedback,
    attempts,
    isQuestionAnswered,
    isAudioPlaying,
    isRoundComplete,
    categoryFilter,
    stats,
    playTargetAudio,
    handleSelectOption,
    handleNextQuestion,
    restartQuiz,
    changeCategoryFilter,
  };
}
