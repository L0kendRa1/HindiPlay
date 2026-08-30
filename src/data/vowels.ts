import { LetterItem, Question } from '../types/activity';

export const HINDI_VOWELS: LetterItem[] = [
  {
    id: 'vowel_a',
    char: 'अ',
    name: 'a',
    pronunciationHint: 'अ (छोटा अ)',
    exampleWord: {
      word: 'अनार',
      meaning: 'Pomegranate',
      emoji: '🍎',
    },
  },
  {
    id: 'vowel_aa',
    char: 'आ',
    name: 'aa',
    pronunciationHint: 'आ (बड़ा आ)',
    exampleWord: {
      word: 'आम',
      meaning: 'Mango',
      emoji: '🥭',
    },
  },
  {
    id: 'vowel_i',
    char: 'इ',
    name: 'i',
    pronunciationHint: 'इ (छोटी इ)',
    exampleWord: {
      word: 'इमली',
      meaning: 'Tamarind',
      emoji: '🌿',
    },
  },
  {
    id: 'vowel_ee',
    char: 'ई',
    name: 'ee',
    pronunciationHint: 'ई (बड़ी ई)',
    exampleWord: {
      word: 'ईख',
      meaning: 'Sugarcane',
      emoji: '🎋',
    },
  },
  {
    id: 'vowel_u',
    char: 'उ',
    name: 'u',
    pronunciationHint: 'उ (छोटा उ)',
    exampleWord: {
      word: 'उल्लू',
      meaning: 'Owl',
      emoji: '🦉',
    },
  },
  {
    id: 'vowel_oo',
    char: 'ऊ',
    name: 'oo',
    pronunciationHint: 'ऊ (बड़ा ऊ)',
    exampleWord: {
      word: 'ऊन',
      meaning: 'Wool',
      emoji: '🧶',
    },
  },
  {
    id: 'vowel_e',
    char: 'ए',
    name: 'e',
    pronunciationHint: 'ए (छोटा ए)',
    exampleWord: {
      word: 'एक',
      meaning: 'One',
      emoji: '1️⃣',
    },
  },
  {
    id: 'vowel_ai',
    char: 'ऐ',
    name: 'ai',
    pronunciationHint: 'ऐ (बड़ा ऐ)',
    exampleWord: {
      word: 'ऐनक',
      meaning: 'Glasses',
      emoji: '👓',
    },
  },
  {
    id: 'vowel_o',
    char: 'ओ',
    name: 'o',
    pronunciationHint: 'ओ (छोटा ओ)',
    exampleWord: {
      word: 'ओखली',
      meaning: 'Mortar',
      emoji: '🥣',
    },
  },
  {
    id: 'vowel_au',
    char: 'औ',
    name: 'au',
    pronunciationHint: 'औ (बड़ा औ)',
    exampleWord: {
      word: 'औरत',
      meaning: 'Woman',
      emoji: '👩',
    },
  },
];

/**
 * Fisher-Yates shuffle helper
 */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generates a full round of questions.
 * Ensures every target letter appears in random order and options are randomized.
 */
export function generateVowelRound(count: number = 10, optionsCount: number = 3): Question[] {
  // Shuffle all 10 vowels to determine the sequence of target letters
  const shuffledTargets = shuffleArray(HINDI_VOWELS).slice(0, count);

  return shuffledTargets.map((target, idx) => {
    // Pick (optionsCount - 1) distractor letters from the remaining pool
    const otherLetters = HINDI_VOWELS.filter((item) => item.id !== target.id);
    const shuffledOthers = shuffleArray(otherLetters);
    const distractors = shuffledOthers.slice(0, optionsCount - 1);

    // Combine target with distractors and shuffle the 3 options
    const options = shuffleArray([target, ...distractors]);

    return {
      id: `q_${idx + 1}_${target.name}`,
      targetLetter: target,
      options,
      correctAnswerId: target.id,
    };
  });
}
