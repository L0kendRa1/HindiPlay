import { HindiCharacter } from '../types/activity';
import { ALL_HINDI_CHARACTERS } from './hindiCharacters';

export interface MatraDefinition {
  id: string;          // e.g. 'matra_aa'
  symbol: string;      // Dependent vowel sign (e.g. 'ा', 'ि', 'ी', 'ु', 'ू', 'े', 'ै', 'ो', 'ौ')
  name: string;        // e.g. 'आ की मात्रा'
  vowel: string;       // Associated independent vowel (e.g. 'आ')
  vowelCharId: string; // e.g. 'vowel_aa'
  position: 'right' | 'left' | 'top' | 'bottom';
  description: string; // Pedagogical description
  exampleWords: string[];
}

/**
 * The 9 standard primary Devanagari dependent vowel signs (मात्राएँ).
 */
export const HINDI_MATRAS: MatraDefinition[] = [
  {
    id: 'matra_aa',
    symbol: 'ा',
    name: 'आ की मात्रा',
    vowel: 'आ',
    vowelCharId: 'vowel_aa',
    position: 'right',
    description: 'अक्षर के दाईं ओर खड़ी डंडी (मा, का, ना)',
    exampleWords: ['माला', 'कार', 'नाम'],
  },
  {
    id: 'matra_i',
    symbol: 'ि',
    name: 'इ की मात्रा',
    vowel: 'इ',
    vowelCharId: 'vowel_i',
    position: 'left',
    description: 'अक्षर के बाईं ओर ऊपर से घूमती हुई (मि, कि, दि)',
    exampleWords: ['दिन', 'किला', 'मित्र'],
  },
  {
    id: 'matra_ee',
    symbol: 'ी',
    name: 'ई की मात्रा',
    vowel: 'ई',
    vowelCharId: 'vowel_ee',
    position: 'right',
    description: 'अक्षर के दाईं ओर ऊपर से घूमती हुई (मी, की, नी)',
    exampleWords: ['कील', 'मीठा', 'पानी'],
  },
  {
    id: 'matra_u',
    symbol: 'ु',
    name: 'उ की मात्रा',
    vowel: 'उ',
    vowelCharId: 'vowel_u',
    position: 'bottom',
    description: 'अक्षर के नीचे बाईं ओर मुड़ती हुई (मु, कु, गु)',
    exampleWords: ['पुल', 'मुख', 'गुलाब'],
  },
  {
    id: 'matra_oo',
    symbol: 'ू',
    name: 'ऊ की मात्रा',
    vowel: 'ऊ',
    vowelCharId: 'vowel_oo',
    position: 'bottom',
    description: 'अक्षर के नीचे दाईं ओर मुड़ती हुई (मू, कू, लू)',
    exampleWords: ['फूल', 'दूध', 'भालू'],
  },
  {
    id: 'matra_e',
    symbol: 'े',
    name: 'ए की मात्रा',
    vowel: 'ए',
    vowelCharId: 'vowel_e',
    position: 'top',
    description: 'अक्षर के ऊपर एक तिरछी मात्रा (मे, के, ने)',
    exampleWords: ['सेब', 'मेला', 'रेल'],
  },
  {
    id: 'matra_ai',
    symbol: 'ै',
    name: 'ऐ की मात्रा',
    vowel: 'ऐ',
    vowelCharId: 'vowel_ai',
    position: 'top',
    description: 'अक्षर के ऊपर दो तिरछी मात्राएँ (मै, कै, पै)',
    exampleWords: ['पैर', 'बैल', 'मैदान'],
  },
  {
    id: 'matra_o',
    symbol: 'ो',
    name: 'ओ की मात्रा',
    vowel: 'ओ',
    vowelCharId: 'vowel_o',
    position: 'right',
    description: 'खड़ी डंडी के ऊपर एक मात्रा (मो, को, तो)',
    exampleWords: ['मोर', 'तोता', 'बोतल'],
  },
  {
    id: 'matra_au',
    symbol: 'ौ',
    name: 'औ की मात्रा',
    vowel: 'औ',
    vowelCharId: 'vowel_au',
    position: 'right',
    description: 'खड़ी डंडी के ऊपर दो मात्राएँ (मौ, कौ, नौ)',
    exampleWords: ['पौधा', 'नौका', 'कौआ'],
  },
];

/**
 * Curated starter set of Hindi consonants for Matra Lab exploration.
 * Drawn directly from ALL_HINDI_CHARACTERS.
 */
export const STARTER_MATRA_CONSONANTS: HindiCharacter[] = [
  'क', 'म', 'ग', 'न', 'ल', 'ब', 'स', 'र', 'त', 'प'
].map((char) => {
  const found = ALL_HINDI_CHARACTERS.find((c) => c.char === char);
  return found || { id: `cons_${char}`, char, name: char, category: 'consonant' };
});
