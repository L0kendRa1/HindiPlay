import { useState, useCallback, useEffect, useRef } from 'react';
import {
  MemoryDifficulty,
  MemoryCardItem,
  MEMORY_DIFFICULTIES,
} from '../types/memoryGame';
import { getValidatedPictureWords } from '../data/pictureWords';
import { shuffleArray } from '../data/hindiCharacters';
import { audioService } from '../services/audioService';

export function generateMemoryDeck(difficulty: MemoryDifficulty): MemoryCardItem[] {
  const config = MEMORY_DIFFICULTIES[difficulty];
  const validatedPool = getValidatedPictureWords('all');
  const availableCount = Math.min(config.pairsCount, validatedPool.length);

  // Pick random target items for pairs
  const selectedItems = shuffleArray(validatedPool).slice(0, availableCount);

  const deck: MemoryCardItem[] = [];

  selectedItems.forEach((item) => {
    // 1. Hindi Word Card
    deck.push({
      id: `card_${item.id}_word`,
      pairId: item.id,
      type: 'word',
      word: item.word,
      meaning: item.meaning,
      emoji: item.emoji,
    });

    // 2. Illustrated Picture Card
    deck.push({
      id: `card_${item.id}_image`,
      pairId: item.id,
      type: 'image',
      word: item.word,
      meaning: item.meaning,
      image: item.image,
      emoji: item.emoji,
    });
  });

  return shuffleArray(deck);
}

export function useMemoryGame(initialDifficulty: MemoryDifficulty = 'easy') {
  const [difficulty, setDifficultyState] = useState<MemoryDifficulty>(initialDifficulty);
  const [cards, setCards] = useState<MemoryCardItem[]>(() => generateMemoryDeck(initialDifficulty));
  const [flippedCardIds, setFlippedCardIds] = useState<string[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isGameComplete, setIsGameComplete] = useState<boolean>(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear pending flip-back timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const totalPairs = MEMORY_DIFFICULTIES[difficulty].pairsCount;
  const matchedPairsCount = matchedPairIds.length;

  const flipCard = useCallback(
    (cardId: string) => {
      // 1. Strict guard conditions against rapid clicks and race conditions
      if (isChecking) return;
      if (flippedCardIds.includes(cardId)) return;
      if (flippedCardIds.length >= 2) return;

      const card = cards.find((c) => c.id === cardId);
      if (!card) return;
      if (matchedPairIds.includes(card.pairId)) return;

      // 2. Flip the card
      audioService.playSfx('pop');

      if (flippedCardIds.length === 0) {
        setFlippedCardIds([cardId]);
        return;
      }

      if (flippedCardIds.length === 1) {
        const firstCardId = flippedCardIds[0];
        const firstCard = cards.find((c) => c.id === firstCardId);
        if (!firstCard) return;

        const newFlipped = [firstCardId, cardId];
        setFlippedCardIds(newFlipped);
        setIsChecking(true);
        setMoves((prev) => prev + 1);

        // 3. Evaluate match
        const isMatch = firstCard.pairId === card.pairId;

        if (isMatch) {
          const newMatched = [...matchedPairIds, card.pairId];
          setMatchedPairIds(newMatched);
          setScore((prev) => prev + 20);
          audioService.playSfx('correct');

          // Speak word pronunciation once on match
          setTimeout(() => {
            audioService.playWordAudio(card.word);
          }, 300);

          setFlippedCardIds([]);
          setIsChecking(false);

          // Check if all pairs are solved
          if (newMatched.length >= totalPairs) {
            setIsGameComplete(true);
            setTimeout(() => {
              audioService.playSfx('celebrate');
            }, 600);
          }
        } else {
          // Mismatch: keep visible for 900ms then flip back
          audioService.playSfx('wrong');
          timeoutRef.current = setTimeout(() => {
            setFlippedCardIds([]);
            setIsChecking(false);
          }, 900);
        }
      }
    },
    [isChecking, flippedCardIds, cards, matchedPairIds, totalPairs]
  );

  const setDifficulty = useCallback((newDiff: MemoryDifficulty) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    audioService.stopSpeech();
    audioService.playSfx('click');
    setDifficultyState(newDiff);
    setCards(generateMemoryDeck(newDiff));
    setFlippedCardIds([]);
    setMatchedPairIds([]);
    setMoves(0);
    setScore(0);
    setIsChecking(false);
    setIsGameComplete(false);
  }, []);

  const restartGame = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    audioService.stopSpeech();
    audioService.playSfx('pop');
    setCards(generateMemoryDeck(difficulty));
    setFlippedCardIds([]);
    setMatchedPairIds([]);
    setMoves(0);
    setScore(0);
    setIsChecking(false);
    setIsGameComplete(false);
  }, [difficulty]);

  return {
    difficulty,
    cards,
    flippedCardIds,
    matchedPairIds,
    moves,
    score,
    isChecking,
    isGameComplete,
    totalPairs,
    matchedPairsCount,
    flipCard,
    setDifficulty,
    restartGame,
  };
}
