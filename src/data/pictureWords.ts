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
  // --- EXPANDED CONCRETE VOCABULARY (Task 9A) ---
  {
    id: 'pw_sha_sher',
    character: 'श',
    characterId: 'cons_sha_palatal',
    word: 'शेर',
    meaning: 'Lion',
    emoji: '🦁',
    image: '/images/words/sher.svg',
    category: 'consonant',
    hint: 'श से शेर',
  },
  {
    id: 'pw_cha_cheeta',
    character: 'च',
    characterId: 'cons_cha',
    word: 'चीता',
    meaning: 'Cheetah',
    emoji: '🐆',
    image: '/images/words/cheeta.svg',
    category: 'consonant',
    hint: 'च से चीता',
  },
  {
    id: 'pw_ba_bandar',
    character: 'ब',
    characterId: 'cons_ba',
    word: 'बंदर',
    meaning: 'Monkey',
    emoji: '🐒',
    image: '/images/words/bandar.svg',
    category: 'consonant',
    hint: 'ब से बंदर',
  },
  {
    id: 'pw_ga_gaay',
    character: 'ग',
    characterId: 'cons_ga',
    word: 'गाय',
    meaning: 'Cow',
    emoji: '🐄',
    image: '/images/words/gaay.svg',
    category: 'consonant',
    hint: 'ग से गाय',
  },
  {
    id: 'pw_ba_bakri',
    character: 'ब',
    characterId: 'cons_ba',
    word: 'बकरी',
    meaning: 'Goat',
    emoji: '🐐',
    image: '/images/words/bakri.svg',
    category: 'consonant',
    hint: 'ब से बकरी',
  },
  {
    id: 'pw_gha_ghoda',
    character: 'घ',
    characterId: 'cons_gha',
    word: 'घोड़ा',
    meaning: 'Horse',
    emoji: '🐎',
    image: '/images/words/ghoda.svg',
    category: 'consonant',
    hint: 'घ से घोड़ा',
  },
  {
    id: 'pw_ka_kutta',
    character: 'क',
    characterId: 'cons_ka',
    word: 'कुत्ता',
    meaning: 'Dog',
    emoji: '🐕',
    image: '/images/words/kutta.svg',
    category: 'consonant',
    hint: 'क से कुत्ता',
  },
  {
    id: 'pw_ba_billi',
    character: 'ब',
    characterId: 'cons_ba',
    word: 'बिल्ली',
    meaning: 'Cat',
    emoji: '🐈',
    image: '/images/words/billi.svg',
    category: 'consonant',
    hint: 'ब से बिल्ली',
  },
  {
    id: 'pw_oo_oont',
    character: 'ऊ',
    characterId: 'vowel_oo',
    word: 'ऊँट',
    meaning: 'Camel',
    emoji: '🐪',
    image: '/images/words/oont.svg',
    category: 'vowel',
    hint: 'ऊ से ऊँट',
  },
  {
    id: 'pw_cha_chooha',
    character: 'च',
    characterId: 'cons_cha',
    word: 'चूहा',
    meaning: 'Mouse',
    emoji: '🐁',
    image: '/images/words/chooha.svg',
    category: 'consonant',
    hint: 'च से चूहा',
  },
  {
    id: 'pw_ka_kachhua',
    character: 'क',
    characterId: 'cons_ka',
    word: 'कछुआ',
    meaning: 'Turtle',
    emoji: '🐢',
    image: '/images/words/kachhua.svg',
    category: 'consonant',
    hint: 'क से कछुआ',
  },
  {
    id: 'pw_ta_tota',
    character: 'त',
    characterId: 'cons_ta_dental',
    word: 'तोता',
    meaning: 'Parrot',
    emoji: '🦜',
    image: '/images/words/tota.svg',
    category: 'consonant',
    hint: 'त से तोता',
  },
  {
    id: 'pw_ma_mor',
    character: 'म',
    characterId: 'cons_ma',
    word: 'मोर',
    meaning: 'Peacock',
    emoji: '🦚',
    image: '/images/words/mor.svg',
    category: 'consonant',
    hint: 'म से मोर',
  },
  {
    id: 'pw_ka_kauwa',
    character: 'क',
    characterId: 'cons_ka',
    word: 'कौआ',
    meaning: 'Crow',
    emoji: '🐦‍⬛',
    image: '/images/words/kauwa.svg',
    category: 'consonant',
    hint: 'क से कौआ',
  },
  {
    id: 'pw_ka_kabootar',
    character: 'क',
    characterId: 'cons_ka',
    word: 'कबूतर',
    meaning: 'Pigeon',
    emoji: '🐦',
    image: '/images/words/kabootar.svg',
    category: 'consonant',
    hint: 'क से कबूतर',
  },
  {
    id: 'pw_cha_chidiya',
    character: 'च',
    characterId: 'cons_cha',
    word: 'चिड़िया',
    meaning: 'Sparrow',
    emoji: '🐦',
    image: '/images/words/chidiya.svg',
    category: 'consonant',
    hint: 'च से चिड़िया',
  },
  {
    id: 'pw_ha_hans',
    character: 'ह',
    characterId: 'cons_ha',
    word: 'हंस',
    meaning: 'Swan',
    emoji: '🦢',
    image: '/images/words/hans.svg',
    category: 'consonant',
    hint: 'ह से हंस',
  },
  {
    id: 'pw_ka_kela',
    character: 'क',
    characterId: 'cons_ka',
    word: 'केला',
    meaning: 'Banana',
    emoji: '🍌',
    image: '/images/words/kela.svg',
    category: 'consonant',
    hint: 'क से केला',
  },
  {
    id: 'pw_sa_santara',
    character: 'स',
    characterId: 'cons_sa',
    word: 'संतरा',
    meaning: 'Orange',
    emoji: '🍊',
    image: '/images/words/santara.svg',
    category: 'consonant',
    hint: 'स से संतरा',
  },
  {
    id: 'pw_pa_papeeta',
    character: 'प',
    characterId: 'cons_pa',
    word: 'पपीता',
    meaning: 'Papaya',
    emoji: '🍈',
    image: '/images/words/papeeta.svg',
    category: 'consonant',
    hint: 'प से पपीता',
  },
  {
    id: 'pw_a_amrood',
    character: 'अ',
    characterId: 'vowel_a',
    word: 'अमरूद',
    meaning: 'Guava',
    emoji: '🍐',
    image: '/images/words/amrood.svg',
    category: 'vowel',
    hint: 'अ से अमरूद',
  },
  {
    id: 'pw_ma_matar',
    character: 'म',
    characterId: 'cons_ma',
    word: 'मटर',
    meaning: 'Peas',
    emoji: '🫛',
    image: '/images/words/matar.svg',
    category: 'consonant',
    hint: 'म से मटर',
  },
  {
    id: 'pw_ga_gajar',
    character: 'ग',
    characterId: 'cons_ga',
    word: 'गाजर',
    meaning: 'Carrot',
    emoji: '🥕',
    image: '/images/words/gajar.svg',
    category: 'consonant',
    hint: 'ग से गाजर',
  },
  {
    id: 'pw_aa_aaloo',
    character: 'आ',
    characterId: 'vowel_aa',
    word: 'आलू',
    meaning: 'Potato',
    emoji: '🥔',
    image: '/images/words/aaloo.svg',
    category: 'vowel',
    hint: 'आ से आलू',
  },
  {
    id: 'pw_pa_pyaaz',
    character: 'प',
    characterId: 'cons_pa',
    word: 'प्याज',
    meaning: 'Onion',
    emoji: '🧅',
    image: '/images/words/pyaaz.svg',
    category: 'consonant',
    hint: 'प से प्याज',
  },
  {
    id: 'pw_ba_baingan',
    character: 'ब',
    characterId: 'cons_ba',
    word: 'बैंगन',
    meaning: 'Brinjal',
    emoji: '🍆',
    image: '/images/words/baingan.svg',
    category: 'consonant',
    hint: 'ब से बैंगन',
  },
  {
    id: 'pw_ma_mooli',
    character: 'म',
    characterId: 'cons_ma',
    word: 'मूली',
    meaning: 'Radish',
    emoji: '🥗',
    image: '/images/words/mooli.svg',
    category: 'consonant',
    hint: 'म से मूली',
  },
  {
    id: 'pw_ka_car',
    character: 'क',
    characterId: 'cons_ka',
    word: 'कार',
    meaning: 'Car',
    emoji: '🚗',
    image: '/images/words/car.svg',
    category: 'consonant',
    hint: 'क से कार',
  },
  {
    id: 'pw_ba_bus',
    character: 'ब',
    characterId: 'cons_ba',
    word: 'बस',
    meaning: 'Bus',
    emoji: '🚌',
    image: '/images/words/bus.svg',
    category: 'consonant',
    hint: 'ब से बस',
  },
  {
    id: 'pw_na_naav',
    character: 'न',
    characterId: 'cons_na',
    word: 'नाव',
    meaning: 'Boat',
    emoji: '⛵',
    image: '/images/words/naav.svg',
    category: 'consonant',
    hint: 'न से नाव',
  },
  {
    id: 'pw_ra_railgaadi',
    character: 'र',
    characterId: 'cons_ra',
    word: 'रेलगाड़ी',
    meaning: 'Train',
    emoji: '🚂',
    image: '/images/words/railgaadi.svg',
    category: 'consonant',
    hint: 'र से रेलगाड़ी',
  },
  {
    id: 'pw_sa_cycle',
    character: 'स',
    characterId: 'cons_sa',
    word: 'साइकिल',
    meaning: 'Bicycle',
    emoji: '🚲',
    image: '/images/words/cycle.svg',
    category: 'consonant',
    hint: 'स से साइकिल',
  },
  {
    id: 'pw_gha_ghar',
    character: 'घ',
    characterId: 'cons_gha',
    word: 'घर',
    meaning: 'House',
    emoji: '🏠',
    image: '/images/words/ghar.svg',
    category: 'consonant',
    hint: 'घ से घर',
  },
  {
    id: 'pw_da_deepak',
    character: 'द',
    characterId: 'cons_da_dental',
    word: 'दीपक',
    meaning: 'Diya / Lamp',
    emoji: '🪔',
    image: '/images/words/deepak.svg',
    category: 'consonant',
    hint: 'द से दीपक',
  },
  {
    id: 'pw_ta_taala',
    character: 'त',
    characterId: 'cons_ta_dental',
    word: 'ताला',
    meaning: 'Lock',
    emoji: '🔒',
    image: '/images/words/taala.svg',
    category: 'consonant',
    hint: 'त से ताला',
  },
  {
    id: 'pw_cha_chaabi',
    character: 'च',
    characterId: 'cons_cha',
    word: 'चाबी',
    meaning: 'Key',
    emoji: '🔑',
    image: '/images/words/chaabi.svg',
    category: 'consonant',
    hint: 'च से चाबी',
  },
  {
    id: 'pw_ka_kitaab',
    character: 'क',
    characterId: 'cons_ka',
    word: 'किताब',
    meaning: 'Book',
    emoji: '📖',
    image: '/images/words/kitaab.svg',
    category: 'consonant',
    hint: 'क से किताब',
  },
  {
    id: 'pw_ka_kalam',
    character: 'क',
    characterId: 'cons_ka',
    word: 'कलम',
    meaning: 'Pen',
    emoji: '✒️',
    image: '/images/words/kalam.svg',
    category: 'consonant',
    hint: 'क से कलम',
  },
  {
    id: 'pw_sa_sooraj',
    character: 'स',
    characterId: 'cons_sa',
    word: 'सूरज',
    meaning: 'Sun',
    emoji: '☀️',
    image: '/images/words/sooraj.svg',
    category: 'consonant',
    hint: 'स से सूरज',
  },
  {
    id: 'pw_cha_chand',
    character: 'च',
    characterId: 'cons_cha',
    word: 'चाँद',
    meaning: 'Moon',
    emoji: '🌙',
    image: '/images/words/chand.svg',
    category: 'consonant',
    hint: 'च से चाँद',
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
  recentIds?: string[];
}

/**
 * Maps a backend Hindi word to a frontend PictureWordItem if valid image data is present.
 */
export function mapBackendWordToPictureWordItem(backendWord: {
  _id?: string;
  word: string;
  meaning?: string;
  category?: string;
  image?: { url: string; alt?: string } | null;
  letters?: string[];
}): PictureWordItem | null {
  if (!backendWord || !backendWord.word || !backendWord.image || !backendWord.image.url) {
    return null;
  }

  // Find existing local item to preserve character mapping/emojis if available
  const existing = HINDI_PICTURE_WORDS.find((item) => item.word === backendWord.word);

  return {
    id: backendWord._id || existing?.id || `pw_dyn_${backendWord.word}`,
    character: existing?.character || (backendWord.letters && backendWord.letters[0]) || backendWord.word[0],
    characterId: existing?.characterId || 'dynamic',
    word: backendWord.word,
    meaning: backendWord.meaning || existing?.meaning || '',
    emoji: existing?.emoji || '🎨',
    image: backendWord.image.url,
    category: existing?.category || 'consonant',
    hint: existing?.hint || `${backendWord.word[0]} से ${backendWord.word}`,
  };
}

/**
 * Generates a full round for Picture-Word matching (Task 2).
 * - Targets a character & its corresponding word.
 * - Selects 2 distractor picture words from the same category where possible.
 * - Guarantees 0 duplicate options and validated image assets.
 * - Respects recentIds to avoid immediate repetition across rounds.
 */
export function generatePictureMatchRound(options: PictureMatchRoundOptions = {}): PictureMatchQuestion[] {
  const { count = 10, optionsCount = 3, categoryFilter = 'all', recentIds = [] } = options;

  const candidatePool = getPictureWordsByCategory(categoryFilter);
  if (candidatePool.length === 0) {
    return [];
  }

  // Educational variety: prefer items not in recentIds first
  const recentSet = new Set(recentIds);
  const freshCandidates = candidatePool.filter((item) => !recentSet.has(item.id) && !recentSet.has(item.word));
  const candidateOrder = freshCandidates.length >= count
    ? shuffleArray(freshCandidates)
    : [...shuffleArray(freshCandidates), ...shuffleArray(candidatePool.filter((item) => recentSet.has(item.id) || recentSet.has(item.word)))];

  const selectedTargets = candidateOrder.slice(0, Math.min(count, candidateOrder.length));

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
  const { count = 10, optionsCount = 3, categoryFilter = 'all', recentIds = [] } = options;

  const candidatePool = getPictureWordsByCategory(categoryFilter);
  if (candidatePool.length === 0) {
    return [];
  }

  const recentSet = new Set(recentIds);
  const freshCandidates = candidatePool.filter((item) => !recentSet.has(item.id) && !recentSet.has(item.word));
  const candidateOrder = freshCandidates.length >= count
    ? shuffleArray(freshCandidates)
    : [...shuffleArray(freshCandidates), ...shuffleArray(candidatePool.filter((item) => recentSet.has(item.id) || recentSet.has(item.word)))];

  const selectedTargets = candidateOrder.slice(0, Math.min(count, candidateOrder.length));

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
 * - Respects recentIds to avoid immediate repetition across rounds.
 */
export function generateWordPictureQuizRound(options: PictureMatchRoundOptions = {}): WordPictureQuizQuestion[] {
  const { count = 10, optionsCount = 3, categoryFilter = 'all', recentIds = [] } = options;

  const candidatePool = getPictureWordsByCategory(categoryFilter);
  if (candidatePool.length === 0) {
    return [];
  }

  const recentSet = new Set(recentIds);
  const freshCandidates = candidatePool.filter((item) => !recentSet.has(item.id) && !recentSet.has(item.word));
  const candidateOrder = freshCandidates.length >= count
    ? shuffleArray(freshCandidates)
    : [...shuffleArray(freshCandidates), ...shuffleArray(candidatePool.filter((item) => recentSet.has(item.id) || recentSet.has(item.word)))];

  const selectedTargets = candidateOrder.slice(0, Math.min(count, candidateOrder.length));

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

