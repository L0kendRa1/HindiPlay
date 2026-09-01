import { SentenceData, SentenceDifficulty, SentenceQuestion, SentenceWordItem } from '../types/sentenceBuilder';
import { shuffleArray } from './hindiCharacters';

export const HINDI_SENTENCES: SentenceData[] = [
  // ==========================================
  // --- EASY (आसान: 3–4 Words) ---
  // ==========================================
  {
    id: 's_easy_1',
    words: ['यह', 'आम', 'है'],
    fullSentence: 'यह आम है।',
    difficulty: 'easy',
    meaning: 'This is a mango.',
    emoji: '🥭',
    hint: "पहला शब्द 'यह' है।",
  },
  {
    id: 's_easy_2',
    words: ['यह', 'घर', 'है'],
    fullSentence: 'यह घर है।',
    difficulty: 'easy',
    meaning: 'This is a house.',
    emoji: '🏠',
    hint: "पहला शब्द 'यह' है।",
  },
  {
    id: 's_easy_3',
    words: ['राम', 'खेलता', 'है'],
    fullSentence: 'राम खेलता है।',
    difficulty: 'easy',
    meaning: 'Ram plays.',
    emoji: '⚽',
    hint: "पहला शब्द 'राम' है।",
  },
  {
    id: 's_easy_4',
    words: ['सीमा', 'हँसती', 'है'],
    fullSentence: 'सीमा हँसती है।',
    difficulty: 'easy',
    meaning: 'Seema smiles/laughs.',
    emoji: '😊',
    hint: "पहला शब्द 'सीमा' है।",
  },
  {
    id: 's_easy_5',
    words: ['सूरज', 'चमकता', 'है'],
    fullSentence: 'सूरज चमकता है।',
    difficulty: 'easy',
    meaning: 'The sun shines.',
    emoji: '☀️',
    hint: "पहला शब्द 'सूरज' है।",
  },
  {
    id: 's_easy_6',
    words: ['कमल', 'सुंदर', 'है'],
    fullSentence: 'कमल सुंदर है।',
    difficulty: 'easy',
    meaning: 'The lotus is beautiful.',
    emoji: '🪷',
    hint: "पहला शब्द 'कमल' है।",
  },
  {
    id: 's_easy_7',
    words: ['मछली', 'तैरती', 'है'],
    fullSentence: 'मछली तैरती है।',
    difficulty: 'easy',
    meaning: 'The fish swims.',
    emoji: '🐟',
    hint: "पहला शब्द 'मछली' है।",
  },
  {
    id: 's_easy_8',
    words: ['पानी', 'ठंडा', 'है'],
    fullSentence: 'पानी ठंडा है।',
    difficulty: 'easy',
    meaning: 'The water is cold.',
    emoji: '💧',
    hint: "पहला शब्द 'पानी' है।",
  },
  {
    id: 's_easy_9',
    words: ['हाथी', 'बड़ा', 'है'],
    fullSentence: 'हाथी बड़ा है।',
    difficulty: 'easy',
    meaning: 'The elephant is big.',
    emoji: '🐘',
    hint: "पहला शब्द 'हाथी' है।",
  },
  {
    id: 's_easy_10',
    words: ['पेड़', 'हरा', 'है'],
    fullSentence: 'पेड़ हरा है।',
    difficulty: 'easy',
    meaning: 'The tree is green.',
    emoji: '🌳',
    hint: "पहला शब्द 'पेड़' है।",
  },

  // ==========================================
  // --- MEDIUM (मध्यम: 4–5 Words) ---
  // ==========================================
  {
    id: 's_med_1',
    words: ['राम', 'स्कूल', 'जाता', 'है'],
    fullSentence: 'राम स्कूल जाता है।',
    difficulty: 'medium',
    meaning: 'Ram goes to school.',
    emoji: '🏫',
    hint: "पहला शब्द 'राम' है।",
  },
  {
    id: 's_med_2',
    words: ['सीमा', 'पानी', 'पीती', 'है'],
    fullSentence: 'सीमा पानी पीती है।',
    difficulty: 'medium',
    meaning: 'Seema drinks water.',
    emoji: '🥛',
    hint: "पहला शब्द 'सीमा' है।",
  },
  {
    id: 's_med_3',
    words: ['बच्चा', 'गेंद', 'खेलता', 'है'],
    fullSentence: 'बच्चा गेंद खेलता है।',
    difficulty: 'medium',
    meaning: 'The child plays with a ball.',
    emoji: '🎾',
    hint: "पहला शब्द 'बच्चा' है।",
  },
  {
    id: 's_med_4',
    words: ['माँ', 'खाना', 'बनाती', 'है'],
    fullSentence: 'माँ खाना बनाती है।',
    difficulty: 'medium',
    meaning: 'Mother cooks food.',
    emoji: '🍲',
    hint: "पहला शब्द 'माँ' है।",
  },
  {
    id: 's_med_5',
    words: ['पक्षी', 'आकाश', 'में', 'उड़ते', 'हैं'],
    fullSentence: 'पक्षी आकाश में उड़ते हैं।',
    difficulty: 'medium',
    meaning: 'Birds fly in the sky.',
    emoji: '🕊️',
    hint: "पहला शब्द 'पक्षी' है।",
  },
  {
    id: 's_med_6',
    words: ['रोहन', 'सेब', 'खाता', 'है'],
    fullSentence: 'रोहन सेब खाता है।',
    difficulty: 'medium',
    meaning: 'Rohan eats an apple.',
    emoji: '🍎',
    hint: "पहला शब्द 'रोहन' है।",
  },
  {
    id: 's_med_7',
    words: ['बिल्ली', 'दूध', 'पीती', 'है'],
    fullSentence: 'बिल्ली दूध पीती है।',
    difficulty: 'medium',
    meaning: 'The cat drinks milk.',
    emoji: '🐱',
    hint: "पहला शब्द 'बिल्ली' है।",
  },
  {
    id: 's_med_8',
    words: ['किसान', 'खेत', 'जोतता', 'है'],
    fullSentence: 'किसान खेत जोतता है।',
    difficulty: 'medium',
    meaning: 'The farmer plows the field.',
    emoji: '🌾',
    hint: "पहला शब्द 'किसान' है।",
  },
  {
    id: 's_med_9',
    words: ['तोता', 'मिर्च', 'खाता', 'है'],
    fullSentence: 'तोता मिर्च खाता है।',
    difficulty: 'medium',
    meaning: 'The parrot eats a chilly.',
    emoji: '🦜',
    hint: "पहला शब्द 'तोता' है।",
  },
  {
    id: 's_med_10',
    words: ['हम', 'सब', 'पढ़ते', 'हैं'],
    fullSentence: 'हम सब पढ़ते हैं।',
    difficulty: 'medium',
    meaning: 'We all study.',
    emoji: '📚',
    hint: "पहला शब्द 'हम' है।",
  },

  // ==========================================
  // --- HARD (कठिन: 5–7 Words) ---
  // ==========================================
  {
    id: 's_hard_1',
    words: ['राम', 'रोज', 'स्कूल', 'जाता', 'है'],
    fullSentence: 'राम रोज स्कूल जाता है।',
    difficulty: 'hard',
    meaning: 'Ram goes to school every day.',
    emoji: '🎒',
    hint: "पहला शब्द 'राम' है।",
  },
  {
    id: 's_hard_2',
    words: ['सीमा', 'बगीचे', 'में', 'खेलती', 'है'],
    fullSentence: 'सीमा बगीचे में खेलती है।',
    difficulty: 'hard',
    meaning: 'Seema plays in the garden.',
    emoji: '🌸',
    hint: "पहला शब्द 'सीमा' है।",
  },
  {
    id: 's_hard_3',
    words: ['बच्चे', 'मैदान', 'में', 'खेल', 'रहे', 'हैं'],
    fullSentence: 'बच्चे मैदान में खेल रहे हैं।',
    difficulty: 'hard',
    meaning: 'Children are playing in the playground.',
    emoji: '⚽',
    hint: "पहला शब्द 'बच्चे' है।",
  },
  {
    id: 's_hard_4',
    words: ['मोहन', 'सुबह', 'जल्दी', 'उठता', 'है'],
    fullSentence: 'मोहन सुबह जल्दी उठता है।',
    difficulty: 'hard',
    meaning: 'Mohan wakes up early in the morning.',
    emoji: '🌅',
    hint: "पहला शब्द 'मोहन' है।",
  },
  {
    id: 's_hard_5',
    words: ['मोर', 'बारिश', 'में', 'नाचता', 'है'],
    fullSentence: 'मोर बारिश में नाचता है।',
    difficulty: 'hard',
    meaning: 'The peacock dances in the rain.',
    emoji: '🦚',
    hint: "पहला शब्द 'मोर' है।",
  },
  {
    id: 's_hard_6',
    words: ['हम', 'सब', 'मिलकर', 'खेलते', 'हैं'],
    fullSentence: 'हम सब मिलकर खेलते हैं।',
    difficulty: 'hard',
    meaning: 'We all play together.',
    emoji: '🤝',
    hint: "पहला शब्द 'हम' है।",
  },
  {
    id: 's_hard_7',
    words: ['गाय', 'हमें', 'मीठा', 'दूध', 'देती', 'है'],
    fullSentence: 'गाय हमें मीठा दूध देती है।',
    difficulty: 'hard',
    meaning: 'The cow gives us sweet milk.',
    emoji: '🐄',
    hint: "पहला शब्द 'गाय' है।",
  },
  {
    id: 's_hard_8',
    words: ['पेड़ों', 'से', 'हमें', 'फल', 'मिलते', 'हैं'],
    fullSentence: 'पेड़ों से हमें फल मिलते हैं।',
    difficulty: 'hard',
    meaning: 'We get fruits from trees.',
    emoji: '🍎',
    hint: "पहला शब्द 'पेड़ों' है।",
  },
  {
    id: 's_hard_9',
    words: ['सूर्य', 'पूर्व', 'दिशा', 'से', 'निकलता', 'है'],
    fullSentence: 'सूर्य पूर्व दिशा से निकलता है।',
    difficulty: 'hard',
    meaning: 'The sun rises from the east.',
    emoji: '🌞',
    hint: "पहला शब्द 'सूर्य' है।",
  },
  {
    id: 's_hard_10',
    words: ['दीदी', 'कहानी', 'की', 'किताब', 'पढ़ती', 'है'],
    fullSentence: 'दीदी कहानी की किताब पढ़ती है।',
    difficulty: 'hard',
    meaning: 'Sister reads a storybook.',
    emoji: '📖',
    hint: "पहला शब्द 'दीदी' है।",
  },
];

/**
 * Creates shuffled SentenceWordItem array guaranteeing it does not start in solved order.
 */
function createShuffledWordItems(sentence: SentenceData): SentenceWordItem[] {
  const baseItems: SentenceWordItem[] = sentence.words.map((w, idx) => ({
    id: `sw_${sentence.id}_${idx}_${w}`,
    text: w,
    originalIndex: idx,
  }));

  // If sentence has 2 or more words, ensure shuffled order is not already the correct order
  let shuffled = shuffleArray(baseItems);
  if (baseItems.length > 2) {
    let attempts = 0;
    while (attempts < 5 && shuffled.every((item, i) => item.originalIndex === i)) {
      shuffled = shuffleArray(baseItems);
      attempts++;
    }
  }

  return shuffled;
}

/**
 * Generates a full 10-question round of sentences for the given difficulty.
 */
export function generateSentenceBuilderRound(
  difficulty: SentenceDifficulty = 'easy',
  count = 10
): SentenceQuestion[] {
  const pool = HINDI_SENTENCES.filter((s) => s.difficulty === difficulty);
  const shuffledPool = shuffleArray(pool);
  const selectedSentences = shuffledPool.slice(0, Math.min(count, shuffledPool.length));

  return selectedSentences.map((sentence, qIdx) => ({
    id: `sb_q_${qIdx + 1}_${sentence.id}`,
    sentence,
    shuffledWords: createShuffledWordItems(sentence),
  }));
}
