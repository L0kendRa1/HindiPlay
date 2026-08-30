import { WordBuilderWord, HindiUnit, WordBuilderQuestion, WordLengthOption } from '../types/wordBuilder';
import { shuffleArray } from './hindiCharacters';

export const WORD_BUILDER_DICTIONARY: WordBuilderWord[] = [
  // ==========================================
  // --- 2-UNIT WORDS (2 अक्षर वाले शब्द) ---
  // ==========================================
  {
    id: 'wb_aam',
    word: 'आम',
    category: 'simple',
    unitCount: 2,
    meaning: 'एक मीठा और रसीला फल',
    emoji: '🥭',
    image: '/images/aam.png',
    units: [
      { id: 'u_aam_1', base: 'आ', display: 'आ', type: 'vowel-unit' },
      { id: 'u_aam_2', base: 'म', display: 'म', type: 'base' },
    ],
  },
  {
    id: 'wb_kam',
    word: 'कम',
    category: 'simple',
    unitCount: 2,
    meaning: 'थोड़ा या कम मात्रा में',
    emoji: '🤏',
    units: [
      { id: 'u_kam_1', base: 'क', display: 'क', type: 'base' },
      { id: 'u_kam_2', base: 'म', display: 'म', type: 'base' },
    ],
  },
  {
    id: 'wb_jal',
    word: 'जल',
    category: 'simple',
    unitCount: 2,
    meaning: 'पीने का पानी',
    emoji: '💧',
    units: [
      { id: 'u_jal_1', base: 'ज', display: 'ज', type: 'base' },
      { id: 'u_jal_2', base: 'ल', display: 'ल', type: 'base' },
    ],
  },
  {
    id: 'wb_ghar',
    word: 'घर',
    category: 'simple',
    unitCount: 2,
    meaning: 'रहने का सुंदर मकान',
    emoji: '🏠',
    units: [
      { id: 'u_ghar_1', base: 'घ', display: 'घ', type: 'base' },
      { id: 'u_ghar_2', base: 'र', display: 'र', type: 'base' },
    ],
  },
  {
    id: 'wb_phal',
    word: 'फल',
    category: 'simple',
    unitCount: 2,
    meaning: 'स्वादिष्ट और पौष्टिक फल',
    emoji: '🍎',
    units: [
      { id: 'u_phal_1', base: 'फ', display: 'फ', type: 'base' },
      { id: 'u_phal_2', base: 'ल', display: 'ल', type: 'base' },
    ],
  },
  {
    id: 'wb_nal',
    word: 'नल',
    category: 'simple',
    unitCount: 2,
    meaning: 'पानी आने का नल',
    emoji: '🚰',
    units: [
      { id: 'u_nal_1', base: 'न', display: 'न', type: 'base' },
      { id: 'u_nal_2', base: 'ल', display: 'ल', type: 'base' },
    ],
  },
  {
    id: 'wb_bus',
    word: 'बस',
    category: 'simple',
    unitCount: 2,
    meaning: 'सवारी करने वाली बड़ी गाड़ी',
    emoji: '🚌',
    units: [
      { id: 'u_bus_1', base: 'ब', display: 'ब', type: 'base' },
      { id: 'u_bus_2', base: 'स', display: 'स', type: 'base' },
    ],
  },
  {
    id: 'wb_rath',
    word: 'रथ',
    category: 'simple',
    unitCount: 2,
    meaning: 'घोड़ों से चलने वाली गाड़ी',
    emoji: '🏎️',
    units: [
      { id: 'u_rath_1', base: 'र', display: 'र', type: 'base' },
      { id: 'u_rath_2', base: 'थ', display: 'थ', type: 'base' },
    ],
  },
  {
    id: 'wb_mala',
    word: 'माला',
    category: 'matra',
    unitCount: 2,
    meaning: 'गले में पहनने वाली फूलों या मोतियों की माला',
    emoji: '📿',
    units: [
      { id: 'u_mala_1', base: 'म', matra: 'ा', display: 'मा', type: 'consonant-matra', hint: 'म + ा' },
      { id: 'u_mala_2', base: 'ल', matra: 'ा', display: 'ला', type: 'consonant-matra', hint: 'ल + ा' },
    ],
  },
  {
    id: 'wb_car',
    word: 'कार',
    category: 'matra',
    unitCount: 2,
    meaning: 'सड़क पर चलने वाली चार पहियों की गाड़ी',
    emoji: '🚗',
    units: [
      { id: 'u_car_1', base: 'क', matra: 'ा', display: 'का', type: 'consonant-matra', hint: 'क + ा' },
      { id: 'u_car_2', base: 'र', display: 'र', type: 'base' },
    ],
  },
  {
    id: 'wb_hathi',
    word: 'हाथी',
    category: 'matra',
    unitCount: 2,
    meaning: 'लंबी सूंड वाला विशाल जानवर',
    emoji: '🐘',
    units: [
      { id: 'u_hathi_1', base: 'ह', matra: 'ा', display: 'हा', type: 'consonant-matra', hint: 'ह + ा' },
      { id: 'u_hathi_2', base: 'थ', matra: 'ी', display: 'थी', type: 'consonant-matra', hint: 'थ + ी' },
    ],
  },
  {
    id: 'wb_seb',
    word: 'सेब',
    category: 'matra',
    unitCount: 2,
    meaning: 'लाल और मीठा स्वादिष्ट फल',
    emoji: '🍎',
    units: [
      { id: 'u_seb_1', base: 'स', matra: 'े', display: 'से', type: 'consonant-matra', hint: 'स + े' },
      { id: 'u_seb_2', base: 'ब', display: 'ब', type: 'base' },
    ],
  },
  {
    id: 'wb_taala',
    word: 'ताला',
    category: 'matra',
    unitCount: 2,
    meaning: 'दरवाजे की सुरक्षा के लिए ताला',
    emoji: '🔒',
    units: [
      { id: 'u_taala_1', base: 'त', matra: 'ा', display: 'ता', type: 'consonant-matra', hint: 'त + ा' },
      { id: 'u_taala_2', base: 'ल', matra: 'ा', display: 'ला', type: 'consonant-matra', hint: 'ल + ा' },
    ],
  },
  {
    id: 'wb_paudha',
    word: 'पौधा',
    category: 'matra',
    unitCount: 2,
    meaning: 'गमले में उगने वाला छोटा हरा पौधा',
    emoji: '🪴',
    units: [
      { id: 'u_paudha_1', base: 'प', matra: 'ौ', display: 'पौ', type: 'consonant-matra', hint: 'प + ौ' },
      { id: 'u_paudha_2', base: 'ध', matra: 'ा', display: 'धा', type: 'consonant-matra', hint: 'ध + ा' },
    ],
  },

  // ==========================================
  // --- 3-UNIT WORDS (3 अक्षर वाले शब्द) ---
  // ==========================================
  {
    id: 'wb_kamal',
    word: 'कमल',
    category: 'simple',
    unitCount: 3,
    meaning: 'हमारा राष्ट्रीय फूल',
    emoji: '🪷',
    units: [
      { id: 'u_kamal_1', base: 'क', display: 'क', type: 'base' },
      { id: 'u_kamal_2', base: 'म', display: 'म', type: 'base' },
      { id: 'u_kamal_3', base: 'ल', display: 'ल', type: 'base' },
    ],
  },
  {
    id: 'wb_matar',
    word: 'मटर',
    category: 'simple',
    unitCount: 3,
    meaning: 'हरे मीठे दानेदार मटर',
    emoji: '🫛',
    units: [
      { id: 'u_matar_1', base: 'म', display: 'म', type: 'base' },
      { id: 'u_matar_2', base: 'ट', display: 'ट', type: 'base' },
      { id: 'u_matar_3', base: 'र', display: 'र', type: 'base' },
    ],
  },
  {
    id: 'wb_nayan',
    word: 'नयन',
    category: 'simple',
    unitCount: 3,
    meaning: 'देखने वाली आँखें (नेत्र)',
    emoji: '👁️',
    units: [
      { id: 'u_nayan_1', base: 'न', display: 'न', type: 'base' },
      { id: 'u_nayan_2', base: 'य', display: 'य', type: 'base' },
      { id: 'u_nayan_3', base: 'न', display: 'न', type: 'base' },
    ],
  },
  {
    id: 'wb_button',
    word: 'बटन',
    category: 'simple',
    unitCount: 3,
    meaning: 'कमीज में लगाने वाला बटन',
    emoji: '🔘',
    units: [
      { id: 'u_btn_1', base: 'ब', display: 'ब', type: 'base' },
      { id: 'u_btn_2', base: 'ट', display: 'ट', type: 'base' },
      { id: 'u_btn_3', base: 'न', display: 'न', type: 'base' },
    ],
  },
  {
    id: 'wb_mahal',
    word: 'महल',
    category: 'simple',
    unitCount: 3,
    meaning: 'राजा का भव्य सुंदर महल',
    emoji: '🏰',
    units: [
      { id: 'u_mhl_1', base: 'म', display: 'म', type: 'base' },
      { id: 'u_mhl_2', base: 'ह', display: 'ह', type: 'base' },
      { id: 'u_mhl_3', base: 'ल', display: 'ल', type: 'base' },
    ],
  },
  {
    id: 'wb_sadak',
    word: 'सड़क',
    category: 'simple',
    unitCount: 3,
    meaning: 'वाहनों के चलने का रास्ता',
    emoji: '🛣️',
    units: [
      { id: 'u_sdk_1', base: 'स', display: 'स', type: 'base' },
      { id: 'u_sdk_2', base: 'ड़', display: 'ड़', type: 'base' },
      { id: 'u_sdk_3', base: 'क', display: 'क', type: 'base' },
    ],
  },
  {
    id: 'wb_gulaab',
    word: 'गुलाब',
    category: 'matra',
    unitCount: 3,
    meaning: 'खुशबूदार लाल गुलाब का फूल',
    emoji: '🌹',
    units: [
      { id: 'u_gulaab_1', base: 'ग', matra: 'ु', display: 'गु', type: 'consonant-matra', hint: 'ग + ु' },
      { id: 'u_gulaab_2', base: 'ल', matra: 'ा', display: 'ला', type: 'consonant-matra', hint: 'ल + ा' },
      { id: 'u_gulaab_3', base: 'ब', display: 'ब', type: 'base' },
    ],
  },
  {
    id: 'wb_sooraj',
    word: 'सूरज',
    category: 'matra',
    unitCount: 3,
    meaning: 'सुबह रोशनी देने वाला चमकता सूरज',
    emoji: '☀️',
    units: [
      { id: 'u_sooraj_1', base: 'स', matra: 'ू', display: 'सू', type: 'consonant-matra', hint: 'स + ू' },
      { id: 'u_sooraj_2', base: 'र', display: 'र', type: 'base' },
      { id: 'u_sooraj_3', base: 'ज', display: 'ज', type: 'base' },
    ],
  },
  {
    id: 'wb_titli',
    word: 'तितली',
    category: 'matra',
    unitCount: 3,
    meaning: 'फूलों पर उड़ने वाली सुंदर रंग-बिरंगी तितली',
    emoji: '🦋',
    units: [
      { id: 'u_titli_1', base: 'त', matra: 'ि', display: 'ति', type: 'consonant-matra', hint: 'त + ि' },
      { id: 'u_titli_2', base: 'त', display: 'त', type: 'base' },
      { id: 'u_titli_3', base: 'ल', matra: 'ी', display: 'ली', type: 'consonant-matra', hint: 'ल + ी' },
    ],
  },
  {
    id: 'wb_kitaab',
    word: 'किताब',
    category: 'matra',
    unitCount: 3,
    meaning: 'ज्ञान और कहानियों की पुस्तक',
    emoji: '📖',
    units: [
      { id: 'u_kitaab_1', base: 'क', matra: 'ि', display: 'कि', type: 'consonant-matra', hint: 'क + ि' },
      { id: 'u_kitaab_2', base: 'त', matra: 'ा', display: 'ता', type: 'consonant-matra', hint: 'त + ा' },
      { id: 'u_kitaab_3', base: 'ब', display: 'ब', type: 'base' },
    ],
  },

  // ==========================================
  // --- 4-UNIT WORDS (4 अक्षर वाले शब्द) ---
  // ==========================================
  {
    id: 'wb_achkan',
    word: 'अचकन',
    category: 'simple',
    unitCount: 4,
    meaning: 'लंबा पारंपरिक कुरता या कोट',
    emoji: '🧥',
    units: [
      { id: 'u_ach_1', base: 'अ', display: 'अ', type: 'vowel-unit' },
      { id: 'u_ach_2', base: 'च', display: 'च', type: 'base' },
      { id: 'u_ach_3', base: 'क', display: 'क', type: 'base' },
      { id: 'u_ach_4', base: 'न', display: 'न', type: 'base' },
    ],
  },
  {
    id: 'wb_sharbat',
    word: 'शरबत',
    category: 'simple',
    unitCount: 4,
    meaning: 'मीठा और ठंडा स्वादिष्ट पेय',
    emoji: '🍹',
    units: [
      { id: 'u_shb_1', base: 'श', display: 'श', type: 'base' },
      { id: 'u_shb_2', base: 'र', display: 'र', type: 'base' },
      { id: 'u_shb_3', base: 'ब', display: 'ब', type: 'base' },
      { id: 'u_shb_4', base: 'त', display: 'त', type: 'base' },
    ],
  },
  {
    id: 'wb_bargad',
    word: 'बरगद',
    category: 'simple',
    unitCount: 4,
    meaning: 'हमारा राष्ट्रीय विशाल वटवृक्ष',
    emoji: '🌳',
    units: [
      { id: 'u_bgd_1', base: 'ब', display: 'ब', type: 'base' },
      { id: 'u_bgd_2', base: 'र', display: 'र', type: 'base' },
      { id: 'u_bgd_3', base: 'ग', display: 'ग', type: 'base' },
      { id: 'u_bgd_4', base: 'द', display: 'द', type: 'base' },
    ],
  },
  {
    id: 'wb_tarbooj',
    word: 'तरबूज',
    category: 'matra',
    unitCount: 4,
    meaning: 'गर्मियों का मीठा लाल तरबूज',
    emoji: '🍉',
    units: [
      { id: 'u_trb_1', base: 'त', display: 'त', type: 'base' },
      { id: 'u_trb_2', base: 'र', display: 'र', type: 'base' },
      { id: 'u_trb_3', base: 'ब', matra: 'ू', display: 'बू', type: 'consonant-matra', hint: 'ब + ू' },
      { id: 'u_trb_4', base: 'ज', display: 'ज', type: 'base' },
    ],
  },
  {
    id: 'wb_pathshala',
    word: 'पाठशाला',
    category: 'matra',
    unitCount: 4,
    meaning: 'विद्या और ज्ञान का विद्यालय',
    emoji: '🏫',
    units: [
      { id: 'u_psh_1', base: 'प', matra: 'ा', display: 'पा', type: 'consonant-matra', hint: 'प + ा' },
      { id: 'u_psh_2', base: 'ठ', display: 'ठ', type: 'base' },
      { id: 'u_psh_3', base: 'श', matra: 'ा', display: 'शा', type: 'consonant-matra', hint: 'श + ा' },
      { id: 'u_psh_4', base: 'ल', matra: 'ा', display: 'ला', type: 'consonant-matra', hint: 'ल + ा' },
    ],
  },
  {
    id: 'wb_upvan',
    word: 'उपवन',
    category: 'simple',
    unitCount: 4,
    meaning: 'फूलों और पेड़ों का सुंदर बगीचा',
    emoji: '🏡',
    units: [
      { id: 'u_upv_1', base: 'उ', display: 'उ', type: 'vowel-unit' },
      { id: 'u_upv_2', base: 'प', display: 'प', type: 'base' },
      { id: 'u_upv_3', base: 'व', display: 'व', type: 'base' },
      { id: 'u_upv_4', base: 'न', display: 'न', type: 'base' },
    ],
  },
];

/**
 * Returns the list of available word lengths (difficulties) present in the dataset.
 */
export function getAvailableWordLengths(): WordLengthOption[] {
  const countsMap = new Map<number, WordBuilderWord[]>();

  for (const word of WORD_BUILDER_DICTIONARY) {
    const list = countsMap.get(word.unitCount) || [];
    list.push(word);
    countsMap.set(word.unitCount, list);
  }

  const sortedCounts = Array.from(countsMap.keys()).sort((a, b) => a - b);

  return sortedCounts.map((unitCount) => {
    const words = countsMap.get(unitCount) || [];
    return {
      unitCount,
      label: `${unitCount} अक्षर`,
      stars: Math.min(unitCount - 1, 3),
      examples: words.slice(0, 3).map((w) => w.word),
      wordCount: words.length,
    };
  });
}

/**
 * Curated pool of units for Discovery Mode
 */
export const DISCOVERY_TRAY_UNITS: HindiUnit[] = [
  { id: 'disc_k', base: 'क', display: 'क', type: 'base' },
  { id: 'disc_m', base: 'म', display: 'म', type: 'base' },
  { id: 'disc_l', base: 'ल', display: 'ल', type: 'base' },
  { id: 'disc_j', base: 'ज', display: 'ज', type: 'base' },
  { id: 'disc_gh', base: 'घ', display: 'घ', type: 'base' },
  { id: 'disc_r', base: 'र', display: 'र', type: 'base' },
  { id: 'disc_ph', base: 'फ', display: 'फ', type: 'base' },
  { id: 'disc_n', base: 'न', display: 'न', type: 'base' },
  { id: 'disc_b', base: 'ब', display: 'ब', type: 'base' },
  { id: 'disc_s', base: 'स', display: 'स', type: 'base' },
  { id: 'disc_aa', base: 'आ', display: 'आ', type: 'vowel-unit' },
  { id: 'disc_ma_aa', base: 'म', matra: 'ा', display: 'मा', type: 'consonant-matra', hint: 'म + ा' },
  { id: 'disc_la_aa', base: 'ल', matra: 'ा', display: 'ला', type: 'consonant-matra', hint: 'ल + ा' },
  { id: 'disc_ka_aa', base: 'क', matra: 'ा', display: 'का', type: 'consonant-matra', hint: 'क + ा' },
  { id: 'disc_ta_aa', base: 'त', matra: 'ा', display: 'ता', type: 'consonant-matra', hint: 'त + ा' },
  { id: 'disc_ha_aa', base: 'ह', matra: 'ा', display: 'हा', type: 'consonant-matra', hint: 'ह + ा' },
  { id: 'disc_thi_ee', base: 'थ', matra: 'ी', display: 'थी', type: 'consonant-matra', hint: 'थ + ी' },
  { id: 'disc_se_e', base: 'स', matra: 'े', display: 'से', type: 'consonant-matra', hint: 'स + े' },
];

/**
 * Searches the dictionary to find if a sequence of Hindi units matches a known word.
 */
export function findWordByUnitSequence(units: HindiUnit[], unitCountFilter?: number): WordBuilderWord | null {
  if (units.length === 0) return null;
  const constructedDisplay = units.map((u) => u.display).join('');

  return (
    WORD_BUILDER_DICTIONARY.find((item) => {
      if (unitCountFilter !== undefined && item.unitCount !== unitCountFilter) {
        return false;
      }
      const itemDisplay = item.units.map((u) => u.display).join('');
      return itemDisplay === constructedDisplay || item.word === constructedDisplay;
    }) || null
  );
}

export interface WordRoundOptions {
  count?: number;
  category?: 'all' | 'simple' | 'matra';
  unitCount?: number; // Explicit filter by pedagogical unit length (2, 3, 4)
}

/**
 * Generates a full round of Guided Word Builder questions.
 * - Strictly filters by unitCount if specified.
 * - Shuffles the units so the child must tap them in the proper sequence.
 */
export function generateWordBuilderRound(options: WordRoundOptions = {}): WordBuilderQuestion[] {
  const { count = 10, category = 'all', unitCount } = options;

  let pool = WORD_BUILDER_DICTIONARY;

  // Filter strictly by pedagogical unitCount if specified
  if (unitCount !== undefined) {
    pool = pool.filter((w) => w.unitCount === unitCount);
  }

  // Filter by category if specified
  if (category !== 'all') {
    pool = pool.filter((w) => w.category === category);
  }

  if (pool.length === 0) {
    return [];
  }

  // Select target words from the pool
  let selectedWords: WordBuilderWord[] = [];
  if (pool.length >= count) {
    selectedWords = shuffleArray(pool).slice(0, count);
  } else {
    // If pool has fewer words than count, shuffle pool and repeat without adjacent duplicates
    const shuffled = shuffleArray(pool);
    while (selectedWords.length < count) {
      for (const w of shuffled) {
        if (selectedWords.length >= count) break;
        selectedWords.push(w);
      }
    }
  }

  return selectedWords.map((targetWord, idx) => {
    // Scramble the units so child has to order them
    let shuffledUnits = shuffleArray(targetWord.units);

    // If unit count > 1 and accidentally shuffled into correct order, swap first two
    if (
      shuffledUnits.length > 1 &&
      shuffledUnits.every((u, i) => u.id === targetWord.units[i].id)
    ) {
      shuffledUnits = [shuffledUnits[1], shuffledUnits[0], ...shuffledUnits.slice(2)];
    }

    return {
      id: `wb_q_${idx + 1}_${targetWord.id}_${idx}`,
      targetWord,
      availableUnits: shuffledUnits,
    };
  });
}
