import { useState, useCallback, useEffect, useRef } from 'react';
import {
  CharacterTracingData,
  Point2D,
  UserStroke,
} from '../types/tracing';
import { FeedbackType, ActivityStats } from '../types/activity';
import { CHARACTER_STROKES_DATA } from '../data/characterStrokes';
import { evaluateStroke } from '../services/strokeEvaluation';
import { audioService } from '../services/audioService';

interface UseCharacterTracingOptions {
  charactersList?: CharacterTracingData[];
}

export function useCharacterTracing(options: UseCharacterTracingOptions = {}) {
  const { charactersList = CHARACTER_STROKES_DATA } = options;

  const [characters] = useState<CharacterTracingData[]>(charactersList);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentStrokeIndex, setCurrentStrokeIndex] = useState<number>(0);
  const [userCompletedStrokes, setUserCompletedStrokes] = useState<UserStroke[]>([]);
  const [activeUserStroke, setActiveUserStroke] = useState<Point2D[]>([]);
  const [feedback, setFeedback] = useState<FeedbackType>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [isCharacterComplete, setIsCharacterComplete] = useState<boolean>(false);
  const [isRoundComplete, setIsRoundComplete] = useState<boolean>(false);
  const [stats, setStats] = useState<ActivityStats>({
    totalQuestions: characters.length,
    currentQuestionIndex: 0,
    score: 0,
    firstAttemptSuccessCount: 0,
    streak: 0,
    bestStreak: 0,
  });

  const currentCharacter = characters[currentIndex] || characters[0];
  const currentExpectedStroke = currentCharacter?.strokes[currentStrokeIndex] || null;

  // Speak character on change
  const initialMountRef = useRef(true);
  useEffect(() => {
    if (initialMountRef.current) {
      initialMountRef.current = false;
      return;
    }
    if (currentCharacter && !isRoundComplete) {
      const timer = setTimeout(() => {
        audioService.playLetterAudio(currentCharacter.character);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isRoundComplete, currentCharacter]);

  const playCurrentAudio = useCallback(() => {
    if (!currentCharacter) return;
    audioService.playLetterAudio(currentCharacter.character);
  }, [currentCharacter]);

  // Pointer drawing handlers
  const startStroke = useCallback(
    (point: Point2D) => {
      if (isCharacterComplete || !currentExpectedStroke) return;
      setActiveUserStroke([point]);
      setFeedback('idle');
      setFeedbackMessage('');
    },
    [isCharacterComplete, currentExpectedStroke]
  );

  const extendStroke = useCallback(
    (point: Point2D) => {
      if (isCharacterComplete || !currentExpectedStroke) return;
      setActiveUserStroke((prev) => {
        if (prev.length === 0) return [point];
        const last = prev[prev.length - 1];
        // Throttle close points (within 0.008 normalized distance)
        const dx = point.x - last.x;
        const dy = point.y - last.y;
        if (dx * dx + dy * dy < 0.000064) return prev;
        return [...prev, point];
      });
    },
    [isCharacterComplete, currentExpectedStroke]
  );

  const endStroke = useCallback(() => {
    if (isCharacterComplete || !currentExpectedStroke || activeUserStroke.length < 2) {
      setActiveUserStroke([]);
      return;
    }

    const evalResult = evaluateStroke(currentExpectedStroke, activeUserStroke);

    if (evalResult.passed) {
      audioService.playSfx('pop');
      const newStroke: UserStroke = {
        strokeIndex: currentStrokeIndex,
        points: activeUserStroke,
        timestamp: Date.now(),
      };
      const updatedStrokes = [...userCompletedStrokes, newStroke];
      setUserCompletedStrokes(updatedStrokes);
      setActiveUserStroke([]);

      // Check if all strokes of current character are completed
      if (currentStrokeIndex + 1 >= currentCharacter.strokes.length) {
        setIsCharacterComplete(true);
        setFeedback('correct');
        setFeedbackMessage(`बहुत बढ़िया! 🎉 आपने "${currentCharacter.character}" लिखना सीख लिया!`);
        audioService.playSfx('correct');

        setTimeout(() => {
          audioService.playLetterAudio(currentCharacter.character);
        }, 400);

        setStats((prev) => {
          const newStreak = prev.streak + 1;
          return {
            ...prev,
            score: prev.score + 10,
            firstAttemptSuccessCount: prev.firstAttemptSuccessCount + 1,
            streak: newStreak,
            bestStreak: Math.max(prev.bestStreak, newStreak),
          };
        });
      } else {
        // Advance to next stroke of the same character
        setCurrentStrokeIndex((prev) => prev + 1);
        setFeedback('correct');
        setFeedbackMessage('शाबाश! अब अगला स्ट्रोक बनाएँ ➔');
      }
    } else {
      audioService.playSfx('wrong');
      setActiveUserStroke([]);
      setFeedback('incorrect');
      setFeedbackMessage(evalResult.feedbackMessage || 'फिर से कोशिश करो 😊');
    }
  }, [
    isCharacterComplete,
    currentExpectedStroke,
    activeUserStroke,
    currentStrokeIndex,
    currentCharacter,
    userCompletedStrokes,
  ]);

  // Clear current drawing attempt for active character
  const clearCurrentAttempt = useCallback(() => {
    audioService.playSfx('pop');
    setUserCompletedStrokes([]);
    setActiveUserStroke([]);
    setCurrentStrokeIndex(0);
    setFeedback('idle');
    setFeedbackMessage('');
    setIsCharacterComplete(false);
  }, []);

  // Synchronous, complete reset when moving to the next character
  const handleNextCharacter = useCallback(() => {
    if (currentIndex + 1 >= characters.length) {
      setIsRoundComplete(true);
      audioService.playSfx('celebrate');
    } else {
      audioService.playSfx('pop');
      const nextIndex = currentIndex + 1;

      // Clean state reset for next character
      setCurrentIndex(nextIndex);
      setCurrentStrokeIndex(0);
      setUserCompletedStrokes([]);
      setActiveUserStroke([]);
      setFeedback('idle');
      setFeedbackMessage('');
      setIsCharacterComplete(false);

      setStats((prev) => ({
        ...prev,
        currentQuestionIndex: nextIndex,
      }));
    }
  }, [currentIndex, characters.length]);

  const selectCharacterByIndex = useCallback(
    (index: number) => {
      if (index < 0 || index >= characters.length) return;
      audioService.playSfx('pop');
      setCurrentIndex(index);
      setCurrentStrokeIndex(0);
      setUserCompletedStrokes([]);
      setActiveUserStroke([]);
      setFeedback('idle');
      setFeedbackMessage('');
      setIsCharacterComplete(false);

      setStats((prev) => ({
        ...prev,
        currentQuestionIndex: index,
      }));
    },
    [characters.length]
  );

  const restartTracing = useCallback(() => {
    audioService.playSfx('pop');
    setCurrentIndex(0);
    setCurrentStrokeIndex(0);
    setUserCompletedStrokes([]);
    setActiveUserStroke([]);
    setFeedback('idle');
    setFeedbackMessage('');
    setIsCharacterComplete(false);
    setIsRoundComplete(false);
    setStats({
      totalQuestions: characters.length,
      currentQuestionIndex: 0,
      score: 0,
      firstAttemptSuccessCount: 0,
      streak: 0,
      bestStreak: 0,
    });
  }, [characters.length]);

  return {
    characters,
    currentIndex,
    totalCharacters: characters.length,
    currentCharacter,
    currentStrokeIndex,
    currentExpectedStroke,
    userCompletedStrokes,
    activeUserStroke,
    feedback,
    feedbackMessage,
    isCharacterComplete,
    isRoundComplete,
    stats,
    playCurrentAudio,
    startStroke,
    extendStroke,
    endStroke,
    clearCurrentAttempt,
    handleNextCharacter,
    selectCharacterByIndex,
    restartTracing,
  };
}
