import { HindiCharacter, CategoryFilter, Question } from '../types/activity';
import { HINDI_VOWELS } from './vowels';
import { HINDI_CONSONANTS } from './consonants';

/**
 * Complete master collection of Hindi characters.
 * Ready for future extension with MATRAS and CONJUNCTS.
 */
export const ALL_HINDI_CHARACTERS: HindiCharacter[] = [
  ...HINDI_VOWELS,
  ...HINDI_CONSONANTS,
];

/**
 * Retrieve characters filtered by category.
 */
export function getCharactersByCategory(filter: CategoryFilter = 'all'): HindiCharacter[] {
  if (filter === 'all') {
    return ALL_HINDI_CHARACTERS;
  }
  return ALL_HINDI_CHARACTERS.filter((item) => item.category === filter);
}

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

export interface RoundGenerationOptions {
  count?: number;
  optionsCount?: number;
  categoryFilter?: CategoryFilter;
}

/**
 * Generates a full round of questions based on a generic Hindi character pool.
 * - Chooses target characters randomly from the filtered pool.
 * - Chooses intelligent distractors from the same category where possible.
 * - Guarantees 0 duplicate options.
 */
export function generateCharacterRound(options: RoundGenerationOptions = {}): Question[] {
  const { count = 10, optionsCount = 3, categoryFilter = 'all' } = options;

  const candidatePool = getCharactersByCategory(categoryFilter);
  if (candidatePool.length === 0) {
    return [];
  }

  // Shuffle candidate pool to pick targets
  const shuffledCandidates = shuffleArray(candidatePool);
  const targetCharacters = shuffledCandidates.slice(0, Math.min(count, shuffledCandidates.length));

  return targetCharacters.map((target, idx) => {
    // Attempt to pick distractors from the same category first for pedagogical relevance
    const sameCategoryCandidates = candidatePool.filter((item) => item.id !== target.id);
    let distractors: HindiCharacter[] = [];

    if (sameCategoryCandidates.length >= optionsCount - 1) {
      distractors = shuffleArray(sameCategoryCandidates).slice(0, optionsCount - 1);
    } else {
      // Fallback to broader pool if candidate pool is small
      const fallbackCandidates = ALL_HINDI_CHARACTERS.filter((item) => item.id !== target.id);
      distractors = shuffleArray(fallbackCandidates).slice(0, optionsCount - 1);
    }

    // Combine target and distractors and shuffle
    const roundOptions = shuffleArray([target, ...distractors]);

    return {
      id: `q_${idx + 1}_${target.id}`,
      targetCharacter: target,
      options: roundOptions,
      correctAnswerId: target.id,
    };
  });
}
