import {
  PictureWordItem,
  PictureMatchQuestion,
  PictureWordQuizQuestion,
  WordPictureQuizQuestion,
} from '../types/pictureMatch';
import { CategoryFilter, HindiCharacter } from '../types/activity';
import { ALL_HINDI_CHARACTERS, shuffleArray } from './hindiCharacters';

export const HINDI_PICTURE_WORDS: PictureWordItem[] = [
  // --- VOWELS (स्वर) ---
  {
    id: 'pw_a_anar',
    character: 'अ',
    characterId: 'vowel_a',
    word: 'अनार',
    meaning: 'Pomegranate',
    emoji: '🍎',
    image: '/images/words/anar.svg',
    category: 'vowel',
    hint: 'अ से अनार',
  },
  {
    id: 'pw_aa_aam',
    character: 'आ',
    characterId: 'vowel_aa',
    word: 'आम',
    meaning: 'Mango',
    emoji: '🥭',
    image: '/images/words/aam.svg',
    category: 'vowel',
    hint: 'आ से आम',
  },
  {
    id: 'pw_i_imli',
    character: 'इ',
    characterId: 'vowel_i',
    word: 'इमली',
    meaning: 'Tamarind',
    emoji: '🌿',
    image: '/images/words/imli.svg',
    category: 'vowel',
    hint: 'इ से इमली',
  },
  {
    id: 'pw_ee_eekh',
    character: 'ई',
    characterId: 'vowel_ee',
    word: 'ईख',
    meaning: 'Sugarcane',
    emoji: '🎋',
    image: '/images/words/eekh.svg',
    category: 'vowel',
    hint: 'ई से ईख',
  },
  {
    id: 'pw_u_ullu',
    character: 'उ',
    characterId: 'vowel_u',
    word: 'उल्लू',
    meaning: 'Owl',
    emoji: '🦉',
    image: '/images/words/ullu.svg',
    category: 'vowel',
    hint: 'उ से उल्लू',
  },
  {
    id: 'pw_oo_oon',
    character: 'ऊ',
    characterId: 'vowel_oo',
    word: 'ऊन',
    meaning: 'Wool',
    emoji: '🧶',
    image: '/images/words/oon.svg',
    category: 'vowel',
    hint: 'ऊ से ऊन',
  },
  {
    id: 'pw_ri_rishi',
    character: 'ऋ',
    characterId: 'vowel_ri',
    word: 'ऋषि',
    meaning: 'Sage',
    emoji: '🧘',
    image: '/images/words/rishi.svg',
    category: 'vowel',
    hint: 'ऋ से ऋषि',
  },
  {
    id: 'pw_e_ek',
    character: 'ए',
    characterId: 'vowel_e',
    word: 'एक',
    meaning: 'One',
    emoji: '1️⃣',
    image: '/images/words/ek.svg',
    category: 'vowel',
    hint: 'ए से एक',
  },
  {
    id: 'pw_ai_ainak',
    character: 'ऐ',
    characterId: 'vowel_ai',
    word: 'ऐनक',
    meaning: 'Glasses',
    emoji: '👓',
    image: '/images/words/ainak.svg',
    category: 'vowel',
    hint: 'ऐ से ऐनक',
  },
  {
    id: 'pw_o_okhli',
    character: 'ओ',
    characterId: 'vowel_o',
    word: 'ओखली',
    meaning: 'Mortar',
    emoji: '🥣',
    image: '/images/words/okhli.svg',
    category: 'vowel',
    hint: 'ओ से ओखली',
  },
  {
    id: 'pw_au_aurat',
    character: 'औ',
    characterId: 'vowel_au',
    word: 'औरत',
    meaning: 'Woman',
    emoji: '👩',
    image: '/images/words/aurat.svg',
    category: 'vowel',
    hint: 'औ से औरत',
  },
  {
    id: 'pw_am_angoor',
    character: 'अं',
    characterId: 'vowel_am',
    word: 'अंगूर',
    meaning: 'Grapes',
    emoji: '🍇',
    image: '/images/words/angoor.svg',
    category: 'vowel',
    hint: 'अं से अंगूर',
  },

  // --- CONSONANTS (व्यंजन) ---
  {
    id: 'pw_ka_kamal',
    character: 'क',
    characterId: 'cons_ka',
    word: 'कमल',
    meaning: 'Lotus',
    emoji: '🪷',
    image: '/images/words/kamal.svg',
    category: 'consonant',
    hint: 'क से कमल',
  },
  {
    id: 'pw_kha_khargosh',
    character: 'ख',
    characterId: 'cons_kha',
    word: 'खरगोश',
    meaning: 'Rabbit',
    emoji: '🐇',
    image: '/images/words/khargosh.svg',
    category: 'consonant',
    hint: 'ख से खरगोश',
  },
  {
    id: 'pw_ga_gamla',
    character: 'ग',
    characterId: 'cons_ga',
    word: 'गमला',
    meaning: 'Pot',
    emoji: '🪴',
    image: '/images/words/gamla.svg',
    category: 'consonant',
    hint: 'ग से गमला',
  },
  {
    id: 'pw_gha_ghadi',
    character: 'घ',
    characterId: 'cons_gha',
    word: 'घड़ी',
    meaning: 'Clock',
    emoji: '⏰',
    image: '/images/words/ghadi.svg',
    category: 'consonant',
    hint: 'घ से घड़ी',
  },
  {
    id: 'pw_cha_chammach',
    character: 'च',
    characterId: 'cons_cha',
    word: 'चम्मच',
    meaning: 'Spoon',
    emoji: '🥄',
    image: '/images/words/chammach.svg',
    category: 'consonant',
    hint: 'च से चम्मच',
  },
  {
    id: 'pw_chha_chhata',
    character: 'छ',
    characterId: 'cons_chha',
    word: 'छाता',
    meaning: 'Umbrella',
    emoji: '☂️',
    image: '/images/words/chhata.svg',
    category: 'consonant',
    hint: 'छ से छाता',
  },
  {
    id: 'pw_ja_jahaj',
    character: 'ज',
    characterId: 'cons_ja',
    word: 'जहाज',
    meaning: 'Ship',
    emoji: '🚢',
    image: '/images/words/jahaj.svg',
    category: 'consonant',
    hint: 'ज से जहाज',
  },
  {
    id: 'pw_jha_jhanda',
    character: 'झ',
    characterId: 'cons_jha',
    word: 'झंडा',
    meaning: 'Flag',
    emoji: '🚩',
    image: '/images/words/jhanda.svg',
    category: 'consonant',
    hint: 'झ से झंडा',
  },
  {
    id: 'pw_ta_tamatar',
    character: 'ट',
    characterId: 'cons_ta_retro',
    word: 'टमाटर',
    meaning: 'Tomato',
    emoji: '🍅',
    image: '/images/words/tamatar.svg',
    category: 'consonant',
    hint: 'ट से टमाटर',
  },
  {
    id: 'pw_tha_thappa',
    character: 'ठ',
    characterId: 'cons_tha_retro',
    word: 'ठप्पा',
    meaning: 'Stamp',
    emoji: '🏷️',
    image: '/images/words/thappa.svg',
    category: 'consonant',
    hint: 'ठ से ठप्पा',
  },
  {
    id: 'pw_da_damru',
    character: 'ड',
    characterId: 'cons_da_retro',
    word: 'डमरू',
    meaning: 'Drum',
    emoji: '🥁',
    image: '/images/words/damru.svg',
    category: 'consonant',
    hint: 'ड से डमरू',
  },
  {
    id: 'pw_dha_dhakkan',
    character: 'ढ',
    characterId: 'cons_dha_retro',
    word: 'ढक्कन',
    meaning: 'Lid',
    emoji: '🫙',
    image: '/images/words/dhakkan.svg',
    category: 'consonant',
    hint: 'ढ से ढक्कन',
  },
  {
    id: 'pw_ta_tarbooj',
    character: 'त',
    characterId: 'cons_ta_dental',
    word: 'तरबूज',
    meaning: 'Watermelon',
    emoji: '🍉',
    image: '/images/words/tarbooj.svg',
    category: 'consonant',
    hint: 'त से तरबूज',
  },
  {
    id: 'pw_tha_thali',
    character: 'थ',
    characterId: 'cons_tha_dental',
    word: 'थाली',
    meaning: 'Plate',
    emoji: '🍽️',
    image: '/images/words/thali.svg',
    category: 'consonant',
    hint: 'थ से थाली',
  },
  {
    id: 'pw_da_darwaja',
    character: 'द',
    characterId: 'cons_da_dental',
    word: 'दरवाजा',
    meaning: 'Door',
    emoji: '🚪',
    image: '/images/words/darwaja.svg',
    category: 'consonant',
    hint: 'द से दरवाजा',
  },
  {
    id: 'pw_dha_dhanush',
    character: 'ध',
    characterId: 'cons_dha_dental',
    word: 'धनुष',
    meaning: 'Bow',
    emoji: '🏹',
    image: '/images/words/dhanush.svg',
    category: 'consonant',
    hint: 'ध से धनुष',
  },
  {
    id: 'pw_na_nal',
    character: 'न',
    characterId: 'cons_na_dental',
    word: 'नल',
    meaning: 'Tap',
    emoji: '🚰',
    image: '/images/words/nal.svg',
    category: 'consonant',
    hint: 'न से नल',
  },
  {
    id: 'pw_pa_patang',
    character: 'प',
    characterId: 'cons_pa',
    word: 'पतंग',
    meaning: 'Kite',
    emoji: '🪁',
    image: '/images/words/patang.svg',
    category: 'consonant',
    hint: 'प से पतंग',
  },
  {
    id: 'pw_pha_phal',
    character: 'फ',
    characterId: 'cons_pha',
    word: 'फल',
    meaning: 'Fruit',
    emoji: '🍎',
    image: '/images/words/phal.svg',
    category: 'consonant',
    hint: 'फ से फल',
  },
  {
    id: 'pw_ba_battakh',
    character: 'ब',
    characterId: 'cons_ba',
    word: 'बत्तख',
    meaning: 'Duck',
    emoji: '🦆',
    image: '/images/words/battakh.svg',
    category: 'consonant',
    hint: 'ब से बत्तख',
  },
  {
    id: 'pw_bha_bhalu',
    character: 'भ',
    characterId: 'cons_bha',
    word: 'भालू',
    meaning: 'Bear',
    emoji: '🐻',
    image: '/images/words/bhalu.svg',
    category: 'consonant',
    hint: 'भ से भालू',
  },
  {
    id: 'pw_ma_machhli',
    character: 'म',
    characterId: 'cons_ma',
    word: 'मछली',
    meaning: 'Fish',
    emoji: '🐟',
    image: '/images/words/machhli.svg',
    category: 'consonant',
    hint: 'म से मछली',
  },
  {
    id: 'pw_ya_yagya',
    character: 'य',
    characterId: 'cons_ya',
    word: 'यज्ञ',
    meaning: 'Sacred fire',
    emoji: '🔥',
    image: '/images/words/yagya.svg',
    category: 'consonant',
    hint: 'य से यज्ञ',
  },
  {
    id: 'pw_ra_rath',
    character: 'र',
    characterId: 'cons_ra',
    word: 'रथ',
    meaning: 'Chariot',
    emoji: '🏎️',
    image: '/images/words/rath.svg',
    category: 'consonant',
    hint: 'र से रथ',
  },
  {
    id: 'pw_la_lattu',
    character: 'ल',
    characterId: 'cons_la',
    word: 'लट्टू',
    meaning: 'Spinning Top',
    emoji: '🪀',
    image: '/images/words/lattu.svg',
    category: 'consonant',
    hint: 'ल से लट्टू',
  },
  {
    id: 'pw_va_vriksh',
    character: 'व',
    characterId: 'cons_va',
    word: 'वृक्ष',
    meaning: 'Tree',
    emoji: '🌳',
    image: '/images/words/vriksh.svg',
    category: 'consonant',
    hint: 'व से वृक्ष',
  },
  {
    id: 'pw_sha_shaljam',
    character: 'श',
    characterId: 'cons_sha_palatal',
    word: 'शलजम',
    meaning: 'Turnip',
    emoji: '🪴',
    image: '/images/words/shaljam.svg',
    category: 'consonant',
    hint: 'श से शलजम',
  },
  {
    id: 'pw_sha_shatkon',
    character: 'ष',
    characterId: 'cons_sha_retro',
    word: 'षट्कोण',
    meaning: 'Hexagon',
    emoji: '⬡',
    image: '/images/words/shatkon.svg',
    category: 'consonant',
    hint: 'ष से षट्कोण',
  },
  {
    id: 'pw_sa_seb',
    character: 'स',
    characterId: 'cons_sa',
    word: 'सेब',
    meaning: 'Apple',
    emoji: '🍎',
    image: '/images/words/seb.svg',
    category: 'consonant',
    hint: 'स से सेब',
  },
  {
    id: 'pw_ha_hathi',
    character: 'ह',
    characterId: 'cons_ha',
    word: 'हाथी',
    meaning: 'Elephant',
    emoji: '🐘',
    image: '/images/words/hathi.svg',
    category: 'consonant',
    hint: 'ह से हाथी',
  },
];

/**
 * Validates that a PictureWordItem has complete, non-empty metadata and a valid image path.
 */
export function validatePictureWordItem(item: PictureWordItem): boolean {
  if (!item) return false;
  if (!item.id || !item.word || !item.character || !item.emoji) return false;
  if (!item.image || typeof item.image !== 'string' || !item.image.startsWith('/images/words/')) {
    return false;
  }
  return true;
}

/**
 * Filter picture-word items by category, strictly including only validated entries.
 */
export function getPictureWordsByCategory(filter: CategoryFilter = 'all'): PictureWordItem[] {
  let pool = HINDI_PICTURE_WORDS;
  if (filter !== 'all') {
    pool = pool.filter((item) => item.category === filter);
  }
  // Enforce validation so broken items never appear in playable pools
  return pool.filter(validatePictureWordItem);
}

/**
 * Alias for getPictureWordsByCategory for explicit clarity.
 */
export const getValidatedPictureWords = getPictureWordsByCategory;


export interface PictureMatchRoundOptions {
  count?: number;
  optionsCount?: number;
  categoryFilter?: CategoryFilter;
}

/**
 * Generates a full round for Picture-Word matching (Task 2).
 * - Targets a character & its corresponding word.
 * - Selects 2 distractor picture words from the same category where possible.
 * - Guarantees 0 duplicate options and validated image assets.
 */
export function generatePictureMatchRound(options: PictureMatchRoundOptions = {}): PictureMatchQuestion[] {
  const { count = 10, optionsCount = 3, categoryFilter = 'all' } = options;

  const candidatePool = getPictureWordsByCategory(categoryFilter);
  if (candidatePool.length === 0) {
    return [];
  }

  const shuffledTargets = shuffleArray(candidatePool);
  const selectedTargets = shuffledTargets.slice(0, Math.min(count, shuffledTargets.length));

  return selectedTargets.map((targetWord, idx) => {
    // Find matching HindiCharacter object
    const targetCharObj: HindiCharacter =
      ALL_HINDI_CHARACTERS.find((c) => c.id === targetWord.characterId || c.char === targetWord.character) || {
        id: targetWord.characterId,
        char: targetWord.character,
        name: targetWord.word,
        category: targetWord.category,
      };

    // Pick distractors from matching category candidates
    const sameCategoryCandidates = candidatePool.filter((item) => item.id !== targetWord.id);
    let distractors: PictureWordItem[] = [];

    if (sameCategoryCandidates.length >= optionsCount - 1) {
      distractors = shuffleArray(sameCategoryCandidates).slice(0, optionsCount - 1);
    } else {
      const fallbackPool = HINDI_PICTURE_WORDS.filter((item) => item.id !== targetWord.id && validatePictureWordItem(item));
      distractors = shuffleArray(fallbackPool).slice(0, optionsCount - 1);
    }

    const roundOptions = shuffleArray([targetWord, ...distractors]);

    return {
      id: `pm_q_${idx + 1}_${targetWord.id}`,
      targetCharacter: targetCharObj,
      targetWord,
      options: roundOptions,
      correctAnswerId: targetWord.id,
    };
  });
}

/**
 * Generates a full round for Picture-to-Word Recognition Quiz (Task 5).
 * - Target is an illustrated picture prompt.
 * - Options are 3 distinct Hindi word choices (1 correct + 2 distractors).
 * - Guarantees 0 duplicate options, randomized correct answer position, and validated image assets.
 */
export function generatePictureWordQuizRound(options: PictureMatchRoundOptions = {}): PictureWordQuizQuestion[] {
  const { count = 10, optionsCount = 3, categoryFilter = 'all' } = options;

  const candidatePool = getPictureWordsByCategory(categoryFilter);
  if (candidatePool.length === 0) {
    return [];
  }

  const shuffledTargets = shuffleArray(candidatePool);
  const selectedTargets = shuffledTargets.slice(0, Math.min(count, shuffledTargets.length));

  return selectedTargets.map((targetItem, idx) => {
    // Pick distractors from matching category candidates
    const sameCategoryCandidates = candidatePool.filter((item) => item.id !== targetItem.id);
    let distractors: PictureWordItem[] = [];

    if (sameCategoryCandidates.length >= optionsCount - 1) {
      distractors = shuffleArray(sameCategoryCandidates).slice(0, optionsCount - 1);
    } else {
      const fallbackPool = HINDI_PICTURE_WORDS.filter((item) => item.id !== targetItem.id && validatePictureWordItem(item));
      distractors = shuffleArray(fallbackPool).slice(0, optionsCount - 1);
    }

    const roundOptions = shuffleArray([targetItem, ...distractors]);

    return {
      id: `pwq_q_${idx + 1}_${targetItem.id}`,
      targetItem,
      options: roundOptions,
      correctAnswerId: targetItem.id,
    };
  });
}

/**
 * Generates a full round for Word-to-Picture Recognition Quiz (Task 7).
 * - Target is a Hindi Word prompt (e.g. 'आम', 'कमल', 'तरबूज').
 * - Options are 3 distinct illustrated Picture choices (1 correct + 2 distractors).
 * - Guarantees 0 duplicate options, randomized correct answer position, and validated image assets.
 */
export function generateWordPictureQuizRound(options: PictureMatchRoundOptions = {}): WordPictureQuizQuestion[] {
  const { count = 10, optionsCount = 3, categoryFilter = 'all' } = options;

  const candidatePool = getPictureWordsByCategory(categoryFilter);
  if (candidatePool.length === 0) {
    return [];
  }

  const shuffledTargets = shuffleArray(candidatePool);
  const selectedTargets = shuffledTargets.slice(0, Math.min(count, shuffledTargets.length));

  return selectedTargets.map((targetItem, idx) => {
    // Pick distractors from matching category candidates
    const sameCategoryCandidates = candidatePool.filter((item) => item.id !== targetItem.id);
    let distractors: PictureWordItem[] = [];

    if (sameCategoryCandidates.length >= optionsCount - 1) {
      distractors = shuffleArray(sameCategoryCandidates).slice(0, optionsCount - 1);
    } else {
      const fallbackPool = HINDI_PICTURE_WORDS.filter((item) => item.id !== targetItem.id && validatePictureWordItem(item));
      distractors = shuffleArray(fallbackPool).slice(0, optionsCount - 1);
    }

    const roundOptions = shuffleArray([targetItem, ...distractors]);

    return {
      id: `wpq_q_${idx + 1}_${targetItem.id}`,
      targetItem,
      options: roundOptions,
      correctAnswerId: targetItem.id,
    };
  });
}

