import { useState, useCallback } from 'react';
import {
  SentenceDifficulty,
  SentenceQuestion,
  SentenceWordItem,
} from '../types/sentenceBuilder';
import { FeedbackType, ActivityStats } from '../types/activity';
import { generateSentenceBuilderRound } from '../data/sentences';
import { audioService } from '../services/audioService';

const TOTAL_ROUND_QUESTIONS = 10;

interface UseSentenceBuilderOptions {
  totalQuestions?: number;
  initialDifficulty?: SentenceDifficulty;
}

export function useSentenceBuilder(options: UseSentenceBuilderOptions = {}) {
  const {
    totalQuestions = TOTAL_ROUND_QUESTIONS,
    initialDifficulty = 'easy',
  } = options;

  const [difficulty, setDifficultyState] = useState<SentenceDifficulty>(initialDifficulty);
  const [questions, setQuestions] = useState<SentenceQuestion[]>(() =>
    generateSentenceBuilderRound(initialDifficulty, totalQuestions)
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const currentQuestion = questions[currentIndex] || null;

  const [availableWords, setAvailableWords] = useState<SentenceWordItem[]>(() =>
    currentQuestion ? [...currentQuestion.shuffledWords] : []
  );
  const [placedWords, setPlacedWords] = useState<SentenceWordItem[]>([]);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<FeedbackType>('idle');
  const [attempts, setAttempts] = useState<number>(0);
  const [hintUsed, setHintUsed] = useState<boolean>(false);
  const [isRoundComplete, setIsRoundComplete] = useState<boolean>(false);
  const [stats, setStats] = useState<ActivityStats>({
    totalQuestions,
    currentQuestionIndex: 0,
    score: 0,
    firstAttemptSuccessCount: 0,
    streak: 0,
    bestStreak: 0,
  });

  // Move word from Available tray to Placed sentence area
  const placeWord = useCallback(
    (word: SentenceWordItem) => {
      if (isCorrect) return;
      if (!availableWords.some((w) => w.id === word.id)) return;

      audioService.playSfx('pop');
      setAvailableWords((prev) => prev.filter((w) => w.id !== word.id));
      setPlacedWords((prev) => [...prev, word]);
      setIsChecked(false);
      setFeedback('idle');
    },
    [isCorrect, availableWords]
  );

  // Move word from Placed area back to Available tray
  const removeWord = useCallback(
    (word: SentenceWordItem) => {
      if (isCorrect) return;
      if (!placedWords.some((w) => w.id === word.id)) return;

      audioService.playSfx('pop');
      setPlacedWords((prev) => prev.filter((w) => w.id !== word.id));
      setAvailableWords((prev) => [...prev, word]);
      setIsChecked(false);
      setFeedback('idle');
    },
    [isCorrect, placedWords]
  );

  // Reset all placed words back to available tray for current question
  const clearPlacedWords = useCallback(() => {
    if (isCorrect || !currentQuestion) return;

    audioService.playSfx('click');
    setAvailableWords([...currentQuestion.shuffledWords]);
    setPlacedWords([]);
    setIsChecked(false);
    setFeedback('idle');
  }, [isCorrect, currentQuestion]);

  // Hint logic: highlights/places the next expected word in sequence
  const useHint = useCallback(() => {
    if (hintUsed || isCorrect || !currentQuestion) return;

    audioService.playSfx('pop');
    setHintUsed(true);

    // Determine the next expected index
    const nextExpectedIdx = placedWords.length;
    const targetWordText = currentQuestion.sentence.words[nextExpectedIdx];
    if (!targetWordText) return;

    // Find the word in available words or move wrong placed words back
    const wordInAvailable = availableWords.find((w) => w.text === targetWordText && w.originalIndex === nextExpectedIdx);
    if (wordInAvailable) {
      setAvailableWords((prev) => prev.filter((w) => w.id !== wordInAvailable.id));
      setPlacedWords((prev) => [...prev, wordInAvailable]);
      setIsChecked(false);
      setFeedback('idle');
    }
  }, [hintUsed, isCorrect, currentQuestion, placedWords, availableWords]);

  // Validate placed sentence order
  const checkSentence = useCallback(() => {
    if (!currentQuestion || isCorrect) return;
    if (placedWords.length !== currentQuestion.sentence.words.length) return;

    const isOrderCorrect = placedWords.every(
      (w, idx) => w.text === currentQuestion.sentence.words[idx]
    );

    setIsChecked(true);

    if (isOrderCorrect) {
      setIsCorrect(true);
      setFeedback('correct');
      audioService.playSfx('correct');

      setTimeout(() => {
        audioService.playWordAudio(currentQuestion.sentence.fullSentence);
      }, 350);

      setStats((prev) => {
        const isFirst = attempts === 0 && !hintUsed;
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
      setFeedback('incorrect');
      setAttempts((prev) => prev + 1);
      audioService.playSfx('wrong');
      setStats((prev) => ({ ...prev, streak: 0 }));
    }
  }, [currentQuestion, isCorrect, placedWords, attempts, hintUsed]);

  // Pronounce complete full sentence as single utterance
  const playFullSentenceAudio = useCallback(() => {
    if (!currentQuestion) return;
    audioService.playWordAudio(currentQuestion.sentence.fullSentence);
  }, [currentQuestion]);

  // Synchronous clean state transition to next question
  const nextQuestion = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      setIsRoundComplete(true);
      audioService.playSfx('celebrate');
      return;
    }

    const nextIdx = currentIndex + 1;
    const nextQ = questions[nextIdx];

    setCurrentIndex(nextIdx);
    setAvailableWords([...nextQ.shuffledWords]);
    setPlacedWords([]);
    setIsChecked(false);
    setIsCorrect(false);
    setFeedback('idle');
    setAttempts(0);
    setHintUsed(false);

    setStats((prev) => ({
      ...prev,
      currentQuestionIndex: nextIdx,
    }));
  }, [currentIndex, questions]);

  // Clean restart of current difficulty round
  const restartRound = useCallback(() => {
    audioService.stopSpeech();
    audioService.playSfx('pop');
    const newQuestions = generateSentenceBuilderRound(difficulty, totalQuestions);
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setAvailableWords(newQuestions[0] ? [...newQuestions[0].shuffledWords] : []);
    setPlacedWords([]);
    setIsChecked(false);
    setIsCorrect(false);
    setFeedback('idle');
    setAttempts(0);
    setHintUsed(false);
    setIsRoundComplete(false);
    setStats({
      totalQuestions,
      currentQuestionIndex: 0,
      score: 0,
      firstAttemptSuccessCount: 0,
      streak: 0,
      bestStreak: 0,
    });
  }, [difficulty, totalQuestions]);

  // Switch difficulty
  const setDifficulty = useCallback(
    (newDiff: SentenceDifficulty) => {
      audioService.stopSpeech();
      audioService.playSfx('click');
      setDifficultyState(newDiff);
      const newQuestions = generateSentenceBuilderRound(newDiff, totalQuestions);
      setQuestions(newQuestions);
      setCurrentIndex(0);
      setAvailableWords(newQuestions[0] ? [...newQuestions[0].shuffledWords] : []);
      setPlacedWords([]);
      setIsChecked(false);
      setIsCorrect(false);
      setFeedback('idle');
      setAttempts(0);
      setHintUsed(false);
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

  return {
    difficulty,
    questions,
    currentIndex,
    currentQuestion,
    availableWords,
    placedWords,
    isChecked,
    isCorrect,
    feedback,
    attempts,
    hintUsed,
    isRoundComplete,
    stats,
    placeWord,
    removeWord,
    clearPlacedWords,
    useHint,
    checkSentence,
    playFullSentenceAudio,
    nextQuestion,
    restartRound,
    setDifficulty,
  };
}
