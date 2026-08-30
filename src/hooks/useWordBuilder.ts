import { useState, useCallback, useEffect, useRef } from 'react';
import {
  WordBuilderQuestion,
  HindiUnit,
  WordBuilderWord,
  WordBuilderMode,
  WordLengthOption,
} from '../types/wordBuilder';
import { FeedbackType, ActivityStats } from '../types/activity';
import {
  generateWordBuilderRound,
  findWordByUnitSequence,
  getAvailableWordLengths,
  DISCOVERY_TRAY_UNITS,
} from '../data/wordBuilder';
import { audioService } from '../services/audioService';

const TOTAL_ROUND_QUESTIONS = 10;

interface UseWordBuilderOptions {
  initialMode?: WordBuilderMode;
  initialUnitCount?: number | null;
  totalQuestions?: number;
}

export function useWordBuilder(options: UseWordBuilderOptions = {}) {
  const {
    initialMode = 'guided',
    initialUnitCount = null, // null shows difficulty selector first
    totalQuestions = TOTAL_ROUND_QUESTIONS,
  } = options;

  const [mode, setModeState] = useState<WordBuilderMode>(initialMode);
  const [selectedUnitCount, setSelectedUnitCount] = useState<number | null>(initialUnitCount);
  const availableWordLengths = useRef<WordLengthOption[]>(getAvailableWordLengths()).current;

  // --- Guided Mode State ---
  const [questions, setQuestions] = useState<WordBuilderQuestion[]>(() =>
    generateWordBuilderRound({ count: totalQuestions, unitCount: initialUnitCount || undefined })
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedUnits, setSelectedUnits] = useState<HindiUnit[]>([]);
  const [availableUnits, setAvailableUnits] = useState<HindiUnit[]>(() =>
    questions[0]?.availableUnits ? [...questions[0].availableUnits] : []
  );
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

  // --- Discovery Mode State ---
  const [discoveryUnits, setDiscoveryUnits] = useState<HindiUnit[]>([]);
  const [discoveredWord, setDiscoveredWord] = useState<WordBuilderWord | null>(null);
  const [discoveredList, setDiscoveredList] = useState<WordBuilderWord[]>([]);
  const [discoveryFeedback, setDiscoveryFeedback] = useState<FeedbackType>('idle');
  const [discoveryMessage, setDiscoveryMessage] = useState<string>('');

  const currentQuestion = questions[currentIndex] || null;

  // Autoplay target word audio on guided question start
  const initialMountRef = useRef(true);
  useEffect(() => {
    if (initialMountRef.current) {
      initialMountRef.current = false;
      return;
    }
    if (
      currentQuestion &&
      mode === 'guided' &&
      selectedUnitCount !== null &&
      !isRoundComplete &&
      !isSolved
    ) {
      const timer = setTimeout(() => {
        audioService.playWordAudio(currentQuestion.targetWord.word);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, mode, selectedUnitCount, isRoundComplete, isSolved, currentQuestion]);

  // --- Difficulty / Length Selection ---
  const selectDifficulty = useCallback(
    (unitCount: number) => {
      audioService.playSfx('pop');
      setSelectedUnitCount(unitCount);
      const newQuestions = generateWordBuilderRound({
        count: totalQuestions,
        unitCount,
      });
      setQuestions(newQuestions);
      setCurrentIndex(0);
      setSelectedUnits([]);
      setAvailableUnits(newQuestions[0]?.availableUnits ? [...newQuestions[0].availableUnits] : []);
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

  const returnToDifficultySelector = useCallback(() => {
    audioService.playSfx('pop');
    setSelectedUnitCount(null);
    setSelectedUnits([]);
    setFeedback('idle');
    setIsSolved(false);
    setIsRoundComplete(false);
  }, []);

  // --- Mode Switcher ---
  const setMode = useCallback(
    (newMode: WordBuilderMode) => {
      setModeState(newMode);
      if (newMode === 'guided') {
        const activeQ = questions[currentIndex];
        if (activeQ && !isSolved) {
          setAvailableUnits([...activeQ.availableUnits]);
          setSelectedUnits([]);
          setFeedback('idle');
        }
      } else {
        setDiscoveryUnits([]);
        setDiscoveryFeedback('idle');
        setDiscoveryMessage('');
        setDiscoveredWord(null);
      }
    },
    [questions, currentIndex, isSolved]
  );

  // --- Guided Mode Actions ---
  const playCurrentWordAudio = useCallback(() => {
    if (!currentQuestion) return;
    audioService.playWordAudio(currentQuestion.targetWord.word);
  }, [currentQuestion]);

  const selectUnit = useCallback(
    (unit: HindiUnit) => {
      if (isSolved || !currentQuestion) return;

      audioService.playLetterAudio(unit.display);

      const nextSelected = [...selectedUnits, unit];
      const nextAvailable = availableUnits.filter((u) => u.id !== unit.id);

      setSelectedUnits(nextSelected);
      setAvailableUnits(nextAvailable);

      // Validate when all units have been placed
      if (nextSelected.length === currentQuestion.targetWord.units.length) {
        const isCorrect = nextSelected.every(
          (u, idx) =>
            u.id === currentQuestion.targetWord.units[idx].id ||
            u.display === currentQuestion.targetWord.units[idx].display
        );

        if (isCorrect) {
          setIsSolved(true);
          setFeedback('correct');
          audioService.playSfx('correct');

          setTimeout(() => {
            audioService.playWordAudio(currentQuestion.targetWord.word);
          }, 350);

          setStats((prev) => {
            const isFirstAttempt = attempts === 0;
            const newStreak = prev.streak + 1;
            return {
              ...prev,
              score: prev.score + (isFirstAttempt ? 10 : 5),
              firstAttemptSuccessCount: prev.firstAttemptSuccessCount + (isFirstAttempt ? 1 : 0),
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
      } else {
        setFeedback('idle');
      }
    },
    [isSolved, currentQuestion, selectedUnits, availableUnits, attempts]
  );

  const removeUnit = useCallback(
    (unit: HindiUnit) => {
      if (isSolved) return;
      audioService.playSfx('pop');
      setSelectedUnits((prev) => prev.filter((u) => u.id !== unit.id));
      setAvailableUnits((prev) => [...prev, unit]);
      setFeedback('idle');
    },
    [isSolved]
  );

  const resetSelection = useCallback(() => {
    if (isSolved || !currentQuestion) return;
    audioService.playSfx('pop');
    setSelectedUnits([]);
    setAvailableUnits([...currentQuestion.availableUnits]);
    setFeedback('idle');
  }, [isSolved, currentQuestion]);

  const handleNextQuestion = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      setIsRoundComplete(true);
      audioService.playSfx('celebrate');
    } else {
      audioService.playSfx('pop');
      const nextIndex = currentIndex + 1;
      const nextQuestion = questions[nextIndex];

      setCurrentIndex(nextIndex);
      setSelectedUnits([]);
      setAvailableUnits(nextQuestion ? [...nextQuestion.availableUnits] : []);
      setFeedback('idle');
      setIsSolved(false);
      setAttempts(0);

      setStats((prev) => ({
        ...prev,
        currentQuestionIndex: nextIndex,
      }));
    }
  }, [currentIndex, questions]);

  const restartQuiz = useCallback(() => {
    audioService.playSfx('pop');
    const newQuestions = generateWordBuilderRound({
      count: totalQuestions,
      unitCount: selectedUnitCount || undefined,
    });
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setSelectedUnits([]);
    setAvailableUnits(newQuestions[0]?.availableUnits ? [...newQuestions[0].availableUnits] : []);
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
  }, [totalQuestions, selectedUnitCount]);

  // --- Discovery Mode Actions ---
  const addDiscoveryUnit = useCallback((unit: HindiUnit) => {
    audioService.playLetterAudio(unit.display);
    setDiscoveryUnits((prev) => [...prev, unit]);
    setDiscoveryFeedback('idle');
    setDiscoveryMessage('');
    setDiscoveredWord(null);
  }, []);

  const removeDiscoveryUnit = useCallback((index: number) => {
    audioService.playSfx('pop');
    setDiscoveryUnits((prev) => prev.filter((_, idx) => idx !== index));
    setDiscoveryFeedback('idle');
    setDiscoveryMessage('');
    setDiscoveredWord(null);
  }, []);

  const clearDiscovery = useCallback(() => {
    audioService.playSfx('pop');
    setDiscoveryUnits([]);
    setDiscoveryFeedback('idle');
    setDiscoveryMessage('');
    setDiscoveredWord(null);
  }, []);

  const checkDiscoveryWord = useCallback(() => {
    if (discoveryUnits.length === 0) return;

    const matchedWord = findWordByUnitSequence(
      discoveryUnits,
      selectedUnitCount || undefined
    );

    if (matchedWord) {
      audioService.playSfx('correct');
      setDiscoveredWord(matchedWord);
      setDiscoveryFeedback('correct');
      setDiscoveryMessage(`अरे वाह! आपने नया शब्द खोजा: "${matchedWord.word}" 🎉`);

      setTimeout(() => {
        audioService.playWordAudio(matchedWord.word);
      }, 350);

      setDiscoveredList((prev) =>
        prev.some((w) => w.id === matchedWord.id) ? prev : [matchedWord, ...prev]
      );
    } else {
      audioService.playSfx('wrong');
      setDiscoveredWord(null);
      setDiscoveryFeedback('incorrect');
      const attempted = discoveryUnits.map((u) => u.display).join('');
      setDiscoveryMessage(`"${attempted}" अभी हमारी सूची में नहीं है। कोई और अक्षर जोड़कर देखो! 😊`);
    }
  }, [discoveryUnits, selectedUnitCount]);

  return {
    mode,
    setMode,
    selectedUnitCount,
    availableWordLengths,
    selectDifficulty,
    returnToDifficultySelector,
    // Guided Mode
    questions,
    currentQuestion,
    currentIndex,
    totalQuestions: questions.length,
    selectedUnits,
    availableUnits,
    feedback,
    attempts,
    isSolved,
    isRoundComplete,
    stats,
    playCurrentWordAudio,
    selectUnit,
    removeUnit,
    resetSelection,
    handleNextQuestion,
    restartQuiz,
    // Discovery Mode
    discoveryTrayUnits: DISCOVERY_TRAY_UNITS,
    discoveryUnits,
    discoveredWord,
    discoveredList,
    discoveryFeedback,
    discoveryMessage,
    addDiscoveryUnit,
    removeDiscoveryUnit,
    clearDiscovery,
    checkDiscoveryWord,
  };
}
