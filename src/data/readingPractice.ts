/**
 * Reading Practice content for "पढ़कर सुनाओ" activity.
 * Structured dataset of Hindi words and sentences for speech recognition practice.
 */

export type ReadingPracticeType = 'word' | 'sentence';
export type ReadingPracticeDifficulty = 'easy' | 'medium' | 'hard';

export interface ReadingPracticeItem {
  id: string;
  text: string;
  type: ReadingPracticeType;
  difficulty: ReadingPracticeDifficulty;
  hint?: string;
}

export const READING_PRACTICE_ITEMS: ReadingPracticeItem[] = [
  // === Easy Words ===
  { id: 'rp_w01', text: 'आम', type: 'word', difficulty: 'easy', hint: 'एक मीठा फल' },
  { id: 'rp_w02', text: 'घर', type: 'word', difficulty: 'easy', hint: 'जहाँ हम रहते हैं' },
  { id: 'rp_w03', text: 'कमल', type: 'word', difficulty: 'easy', hint: 'पानी में खिलने वाला फूल' },
  { id: 'rp_w04', text: 'माला', type: 'word', difficulty: 'easy', hint: 'फूलों से बनी' },
  { id: 'rp_w05', text: 'नल', type: 'word', difficulty: 'easy', hint: 'पानी आता है' },
  { id: 'rp_w06', text: 'दूध', type: 'word', difficulty: 'easy', hint: 'सफ़ेद रंग का पेय' },
  { id: 'rp_w07', text: 'हाथी', type: 'word', difficulty: 'medium', hint: 'बड़ा जानवर' },
  { id: 'rp_w08', text: 'किताब', type: 'word', difficulty: 'medium', hint: 'पढ़ने के लिए' },
  { id: 'rp_w09', text: 'चिड़िया', type: 'word', difficulty: 'medium', hint: 'आसमान में उड़ती है' },
  { id: 'rp_w10', text: 'विद्यालय', type: 'word', difficulty: 'hard', hint: 'पढ़ाई का स्थान' },

  // === Easy Sentences ===
  { id: 'rp_s01', text: 'राम आम खाता है।', type: 'sentence', difficulty: 'easy' },
  { id: 'rp_s02', text: 'सीमा घर जाती है।', type: 'sentence', difficulty: 'easy' },
  { id: 'rp_s03', text: 'मोनू खेल रहा है।', type: 'sentence', difficulty: 'easy' },

  // === Medium Sentences ===
  { id: 'rp_s04', text: 'यह एक लाल फूल है।', type: 'sentence', difficulty: 'medium' },
  { id: 'rp_s05', text: 'हाथी जंगल में रहता है।', type: 'sentence', difficulty: 'medium' },
  { id: 'rp_s06', text: 'रवि किताब पढ़ता है।', type: 'sentence', difficulty: 'medium' },

  // === Hard Sentences ===
  { id: 'rp_s07', text: 'बच्चे बगीचे में खेल रहे हैं।', type: 'sentence', difficulty: 'hard' },
  { id: 'rp_s08', text: 'मेरी माँ बहुत अच्छा खाना बनाती हैं।', type: 'sentence', difficulty: 'hard' },
];

/**
 * Get reading practice items filtered by type and/or difficulty.
 */
export function getReadingPracticeItems(
  difficulty?: ReadingPracticeDifficulty,
  type?: ReadingPracticeType
): ReadingPracticeItem[] {
  let items = READING_PRACTICE_ITEMS;
  if (difficulty) {
    items = items.filter((item) => item.difficulty === difficulty);
  }
  if (type) {
    items = items.filter((item) => item.type === type);
  }
  return items;
}
