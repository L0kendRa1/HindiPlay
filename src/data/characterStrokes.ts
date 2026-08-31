import { CharacterTracingData } from '../types/tracing';

/**
 * PROTOTYPE STROKE DATA FOR HINDI CHARACTER TRACING
 *
 * NOTE: Stroke paths are represented in normalized [0, 1] coordinate space.
 * (0, 0) is top-left, (1, 1) is bottom-right.
 * These stroke paths follow standard Devanagari pedagogical stroke order:
 * Primary curves/stems first, followed by stabilizing stems and the Shirorekha (top bar).
 */
export const CHARACTER_STROKES_DATA: CharacterTracingData[] = [
  // ==========================================
  // --- 1. क (Ka) ---
  // ==========================================
  {
    id: 'trace_ka',
    character: 'क',
    transliteration: 'ka',
    category: 'consonant',
    meaning: 'क से कमल',
    emoji: '🪷',
    strokes: [
      {
        id: 'ka_s1',
        order: 1,
        name: 'सीधी खड़ी रेखा (Vertical Stem)',
        directionHint: 'top-to-bottom',
        points: [
          { x: 0.50, y: 0.22 },
          { x: 0.50, y: 0.40 },
          { x: 0.50, y: 0.60 },
          { x: 0.50, y: 0.85 },
        ],
      },
      {
        id: 'ka_s2',
        order: 2,
        name: 'बायाँ गोल लूप (Left Oval Loop)',
        directionHint: 'counter-clockwise',
        points: [
          { x: 0.50, y: 0.38 },
          { x: 0.38, y: 0.36 },
          { x: 0.24, y: 0.42 },
          { x: 0.22, y: 0.54 },
          { x: 0.28, y: 0.64 },
          { x: 0.40, y: 0.66 },
          { x: 0.50, y: 0.58 },
        ],
      },
      {
        id: 'ka_s3',
        order: 3,
        name: 'दायाँ खुला वक्र (Right Hook Curve)',
        directionHint: 'curve-down',
        points: [
          { x: 0.50, y: 0.42 },
          { x: 0.64, y: 0.40 },
          { x: 0.76, y: 0.48 },
          { x: 0.78, y: 0.62 },
          { x: 0.70, y: 0.75 },
          { x: 0.62, y: 0.80 },
        ],
      },
      {
        id: 'ka_s4',
        order: 4,
        name: 'शिरोरेखा (Top Bar)',
        directionHint: 'left-to-right',
        points: [
          { x: 0.15, y: 0.22 },
          { x: 0.40, y: 0.22 },
          { x: 0.65, y: 0.22 },
          { x: 0.85, y: 0.22 },
        ],
      },
    ],
  },

  // ==========================================
  // --- 2. ग (Ga) ---
  // ==========================================
  {
    id: 'trace_ga',
    character: 'ग',
    transliteration: 'ga',
    category: 'consonant',
    meaning: 'ग से गमला',
    emoji: '🪴',
    strokes: [
      {
        id: 'ga_s1',
        order: 1,
        name: 'बायाँ मुड़ा हुआ डंडा (Left Hooked Stem)',
        directionHint: 'down-and-loop',
        points: [
          { x: 0.38, y: 0.22 },
          { x: 0.38, y: 0.45 },
          { x: 0.38, y: 0.66 },
          { x: 0.32, y: 0.74 },
          { x: 0.24, y: 0.72 },
          { x: 0.22, y: 0.64 },
          { x: 0.38, y: 0.64 },
        ],
      },
      {
        id: 'ga_s2',
        order: 2,
        name: 'दायाँ सीधा डंडा (Right Vertical Stem)',
        directionHint: 'top-to-bottom',
        points: [
          { x: 0.68, y: 0.22 },
          { x: 0.68, y: 0.45 },
          { x: 0.68, y: 0.65 },
          { x: 0.68, y: 0.85 },
        ],
      },
      {
        id: 'ga_s3',
        order: 3,
        name: 'शिरोरेखा (Top Bar)',
        directionHint: 'left-to-right',
        points: [
          { x: 0.15, y: 0.22 },
          { x: 0.45, y: 0.22 },
          { x: 0.75, y: 0.22 },
          { x: 0.85, y: 0.22 },
        ],
      },
    ],
  },

  // ==========================================
  // --- 3. म (Ma) ---
  // ==========================================
  {
    id: 'trace_ma',
    character: 'म',
    transliteration: 'ma',
    category: 'consonant',
    meaning: 'म से मछली',
    emoji: '🐟',
    strokes: [
      {
        id: 'ma_s1',
        order: 1,
        name: 'बायाँ डंडा व लूप (Left Stem, Loop & Link)',
        directionHint: 'down-loop-right',
        points: [
          { x: 0.32, y: 0.22 },
          { x: 0.32, y: 0.48 },
          { x: 0.32, y: 0.66 },
          { x: 0.25, y: 0.74 },
          { x: 0.20, y: 0.68 },
          { x: 0.28, y: 0.60 },
          { x: 0.50, y: 0.60 },
          { x: 0.70, y: 0.60 },
        ],
      },
      {
        id: 'ma_s2',
        order: 2,
        name: 'दायाँ सीधा डंडा (Right Vertical Stem)',
        directionHint: 'top-to-bottom',
        points: [
          { x: 0.70, y: 0.22 },
          { x: 0.70, y: 0.45 },
          { x: 0.70, y: 0.65 },
          { x: 0.70, y: 0.85 },
        ],
      },
      {
        id: 'ma_s3',
        order: 3,
        name: 'शिरोरेखा (Top Bar)',
        directionHint: 'left-to-right',
        points: [
          { x: 0.15, y: 0.22 },
          { x: 0.45, y: 0.22 },
          { x: 0.70, y: 0.22 },
          { x: 0.85, y: 0.22 },
        ],
      },
    ],
  },

  // ==========================================
  // --- 4. अ (A) ---
  // ==========================================
  {
    id: 'trace_a',
    character: 'अ',
    transliteration: 'a',
    category: 'vowel',
    meaning: 'अ से अनार',
    emoji: '🍎',
    strokes: [
      {
        id: 'a_s1',
        order: 1,
        name: 'ऊपरी वक्र (Upper Curve)',
        directionHint: 'curve-right-down',
        points: [
          { x: 0.28, y: 0.28 },
          { x: 0.42, y: 0.24 },
          { x: 0.50, y: 0.32 },
          { x: 0.45, y: 0.42 },
          { x: 0.36, y: 0.46 },
        ],
      },
      {
        id: 'a_s2',
        order: 2,
        name: 'निचला वक्र (Lower Curve)',
        directionHint: 'curve-right-and-up',
        points: [
          { x: 0.36, y: 0.46 },
          { x: 0.52, y: 0.52 },
          { x: 0.54, y: 0.68 },
          { x: 0.42, y: 0.78 },
          { x: 0.28, y: 0.76 },
        ],
      },
      {
        id: 'a_s3',
        order: 3,
        name: 'मध्य क्षैतिज रेखा (Middle Connector)',
        directionHint: 'left-to-right',
        points: [
          { x: 0.36, y: 0.46 },
          { x: 0.52, y: 0.46 },
          { x: 0.68, y: 0.46 },
        ],
      },
      {
        id: 'a_s4',
        order: 4,
        name: 'दायाँ सीधा डंडा (Right Vertical Stem)',
        directionHint: 'top-to-bottom',
        points: [
          { x: 0.68, y: 0.22 },
          { x: 0.68, y: 0.45 },
          { x: 0.68, y: 0.65 },
          { x: 0.68, y: 0.85 },
        ],
      },
      {
        id: 'a_s5',
        order: 5,
        name: 'शिरोरेखा (Top Bar over stem)',
        directionHint: 'left-to-right',
        points: [
          { x: 0.52, y: 0.22 },
          { x: 0.68, y: 0.22 },
          { x: 0.84, y: 0.22 },
        ],
      },
    ],
  },

  // ==========================================
  // --- 5. आ (Aa) ---
  // ==========================================
  {
    id: 'trace_aa',
    character: 'आ',
    transliteration: 'aa',
    category: 'vowel',
    meaning: 'आ से आम',
    emoji: '🥭',
    strokes: [
      {
        id: 'aa_s1',
        order: 1,
        name: 'ऊपरी वक्र (Upper Curve)',
        directionHint: 'curve-right-down',
        points: [
          { x: 0.22, y: 0.28 },
          { x: 0.36, y: 0.24 },
          { x: 0.44, y: 0.32 },
          { x: 0.40, y: 0.42 },
          { x: 0.30, y: 0.46 },
        ],
      },
      {
        id: 'aa_s2',
        order: 2,
        name: 'निचला वक्र (Lower Curve)',
        directionHint: 'curve-right-and-up',
        points: [
          { x: 0.30, y: 0.46 },
          { x: 0.46, y: 0.52 },
          { x: 0.48, y: 0.68 },
          { x: 0.38, y: 0.78 },
          { x: 0.24, y: 0.76 },
        ],
      },
      {
        id: 'aa_s3',
        order: 3,
        name: 'मध्य क्षैतिज रेखा (Middle Connector)',
        directionHint: 'left-to-right',
        points: [
          { x: 0.30, y: 0.46 },
          { x: 0.44, y: 0.46 },
          { x: 0.58, y: 0.46 },
        ],
      },
      {
        id: 'aa_s4',
        order: 4,
        name: 'पहला सीधा डंडा (First Vertical Stem)',
        directionHint: 'top-to-bottom',
        points: [
          { x: 0.58, y: 0.22 },
          { x: 0.58, y: 0.45 },
          { x: 0.58, y: 0.65 },
          { x: 0.58, y: 0.85 },
        ],
      },
      {
        id: 'aa_s5',
        order: 5,
        name: 'दूसरा सीधा डंडा (Second Vertical Stem)',
        directionHint: 'top-to-bottom',
        points: [
          { x: 0.78, y: 0.22 },
          { x: 0.78, y: 0.45 },
          { x: 0.78, y: 0.65 },
          { x: 0.78, y: 0.85 },
        ],
      },
      {
        id: 'aa_s6',
        order: 6,
        name: 'शिरोरेखा (Top Bar)',
        directionHint: 'left-to-right',
        points: [
          { x: 0.45, y: 0.22 },
          { x: 0.65, y: 0.22 },
          { x: 0.88, y: 0.22 },
        ],
      },
    ],
  },

  // ==========================================
  // --- 6. इ (I) ---
  // ==========================================
  {
    id: 'trace_i',
    character: 'इ',
    transliteration: 'i',
    category: 'vowel',
    meaning: 'इ से इमली',
    emoji: '🟤',
    strokes: [
      {
        id: 'i_s1',
        order: 1,
        name: 'ऊपरी छोटा डंडा (Top Small Stem)',
        directionHint: 'top-to-bottom',
        points: [
          { x: 0.50, y: 0.22 },
          { x: 0.50, y: 0.32 },
        ],
      },
      {
        id: 'i_s2',
        order: 2,
        name: 'ऊपरी बायाँ वक्र (Upper Left S-Curve)',
        directionHint: 'curve-left-to-right',
        points: [
          { x: 0.50, y: 0.32 },
          { x: 0.34, y: 0.36 },
          { x: 0.32, y: 0.48 },
          { x: 0.45, y: 0.54 },
        ],
      },
      {
        id: 'i_s3',
        order: 3,
        name: 'निचला दायाँ वक्र व पूंछ (Lower Curve & Tail Loop)',
        directionHint: 'curve-right-loop-tail',
        points: [
          { x: 0.45, y: 0.54 },
          { x: 0.65, y: 0.58 },
          { x: 0.66, y: 0.70 },
          { x: 0.52, y: 0.76 },
          { x: 0.38, y: 0.72 },
          { x: 0.30, y: 0.86 },
        ],
      },
      {
        id: 'i_s4',
        order: 4,
        name: 'शिरोरेखा (Top Bar)',
        directionHint: 'left-to-right',
        points: [
          { x: 0.20, y: 0.22 },
          { x: 0.50, y: 0.22 },
          { x: 0.80, y: 0.22 },
        ],
      },
    ],
  },
];
