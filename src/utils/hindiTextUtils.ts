/**
 * Hindi Text Processing and Word Alignment Utilities
 * 
 * IMPORTANT:
 * - Never uses `split("")`, `string.length`, or direct Unicode indexing for Devanagari characters.
 * - Words are tokenized safely on whitespace boundaries after punctuation normalization.
 * - Uses dynamic programming word-level sequence alignment (Wagner-Fischer / Needleman-Wunsch).
 */

export type AlignmentType = 'match' | 'substitution' | 'deletion' | 'insertion';

export interface WordAlignment {
  type: AlignmentType;
  expectedWord?: string;
  recognizedWord?: string;
}

export interface ReadingError {
  type: 'substitution' | 'missing' | 'extra';
  expectedWord?: string;
  recognizedWord?: string;
  message: string;
}

export interface HindiReadingComparison {
  isCorrect: boolean;
  expectedWords: string[];
  recognizedWords: string[];
  alignments: WordAlignment[];
  errors: ReadingError[];
  matchedCount: number;
  totalExpectedCount: number;
  hasSubstitutions: boolean;
  hasMissing: boolean;
  hasExtra: boolean;
}

/**
 * Normalizes Hindi text for comparison.
 * - Normalizes Unicode to NFC (canonical composition).
 * - Removes sentence punctuation (Hindi danda ।, double danda ॥, comma, periods, quotes, etc.).
 * - Collapses multiple spaces into single space and trims.
 * - Does NOT strip or alter any Hindi letters, matras, nuktas, viramas, or conjuncts.
 */
export function normalizeHindiText(text: string): string {
  if (!text) return '';

  return text
    .normalize('NFC')
    // Remove Hindi punctuation and standard sentence punctuation
    .replace(/[।॥,\.?!:;"'“”‘’\(\)\[\]\{\}\/\\—\-_]/g, ' ')
    // Collapse multiple whitespace characters into a single space
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Tokenizes Hindi text into whole word units.
 * Safely splits on whitespace without splitting individual Devanagari characters or matras.
 */
export function tokenizeHindiWords(text: string): string[] {
  const normalized = normalizeHindiText(text);
  if (!normalized) return [];
  return normalized.split(/\s+/).filter(Boolean);
}

/**
 * Computes optimal word-level sequence alignment using dynamic programming.
 * Operations:
 * - MATCH: expected === recognized (cost 0)
 * - SUBSTITUTION: expected !== recognized (cost 1)
 * - DELETION: expected word omitted in recognized (cost 1)
 * - INSERTION: extra word in recognized not in expected (cost 1)
 */
export function alignHindiWords(
  expectedWords: string[],
  recognizedWords: string[]
): WordAlignment[] {
  const n = expectedWords.length;
  const m = recognizedWords.length;

  // dp[i][j] = minimum edit distance between expectedWords[0..i-1] and recognizedWords[0..j-1]
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

  for (let i = 0; i <= n; i++) dp[i][0] = i;
  for (let j = 0; j <= m; j++) dp[0][j] = j;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const exp = expectedWords[i - 1];
      const rec = recognizedWords[j - 1];

      if (exp === rec) {
        dp[i][j] = dp[i - 1][j - 1]; // Match cost 0
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j - 1] + 1, // Substitution
          dp[i - 1][j] + 1,     // Deletion (expected word missing)
          dp[i][j - 1] + 1      // Insertion (extra recognized word)
        );
      }
    }
  }

  // Backtrack to recover optimal alignment
  const alignments: WordAlignment[] = [];
  let i = n;
  let j = m;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0) {
      const exp = expectedWords[i - 1];
      const rec = recognizedWords[j - 1];

      if (exp === rec && dp[i][j] === dp[i - 1][j - 1]) {
        alignments.push({ type: 'match', expectedWord: exp, recognizedWord: rec });
        i--;
        j--;
        continue;
      }

      if (dp[i][j] === dp[i - 1][j - 1] + 1) {
        alignments.push({ type: 'substitution', expectedWord: exp, recognizedWord: rec });
        i--;
        j--;
        continue;
      }
    }

    if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      alignments.push({ type: 'deletion', expectedWord: expectedWords[i - 1] });
      i--;
    } else if (j > 0 && dp[i][j] === dp[i][j - 1] + 1) {
      alignments.push({ type: 'insertion', recognizedWord: recognizedWords[j - 1] });
      j--;
    } else {
      // Fallback safeguard
      if (i > 0 && j > 0) {
        alignments.push({
          type: 'substitution',
          expectedWord: expectedWords[i - 1],
          recognizedWord: recognizedWords[j - 1],
        });
        i--;
        j--;
      } else if (i > 0) {
        alignments.push({ type: 'deletion', expectedWord: expectedWords[i - 1] });
        i--;
      } else if (j > 0) {
        alignments.push({ type: 'insertion', recognizedWord: recognizedWords[j - 1] });
        j--;
      }
    }
  }

  return alignments.reverse();
}

/**
 * Compares expected Hindi reading text with recognized speech text.
 * Returns structured result with alignment, identified errors, and match statistics.
 */
export function compareHindiReading(
  expectedText: string,
  recognizedText: string
): HindiReadingComparison {
  const expectedWords = tokenizeHindiWords(expectedText);
  const recognizedWords = tokenizeHindiWords(recognizedText);

  // If recognition returned no words at all
  if (recognizedWords.length === 0) {
    const errors: ReadingError[] = expectedWords.map((word) => ({
      type: 'missing',
      expectedWord: word,
      message: `छूटा हुआ शब्द: ${word}`,
    }));

    const alignments: WordAlignment[] = expectedWords.map((word) => ({
      type: 'deletion',
      expectedWord: word,
    }));

    return {
      isCorrect: false,
      expectedWords,
      recognizedWords: [],
      alignments,
      errors,
      matchedCount: 0,
      totalExpectedCount: expectedWords.length,
      hasSubstitutions: false,
      hasMissing: expectedWords.length > 0,
      hasExtra: false,
    };
  }

  const alignments = alignHindiWords(expectedWords, recognizedWords);
  const errors: ReadingError[] = [];

  let matchedCount = 0;
  let hasSubstitutions = false;
  let hasMissing = false;
  let hasExtra = false;

  for (const a of alignments) {
    if (a.type === 'match') {
      matchedCount++;
    } else if (a.type === 'substitution') {
      hasSubstitutions = true;
      errors.push({
        type: 'substitution',
        expectedWord: a.expectedWord,
        recognizedWord: a.recognizedWord,
        message: `सही शब्द: ${a.expectedWord}`,
      });
    } else if (a.type === 'deletion') {
      hasMissing = true;
      errors.push({
        type: 'missing',
        expectedWord: a.expectedWord,
        message: `छूटा हुआ शब्द: ${a.expectedWord}`,
      });
    } else if (a.type === 'insertion') {
      hasExtra = true;
      errors.push({
        type: 'extra',
        recognizedWord: a.recognizedWord,
        message: `अतिरिक्त शब्द: ${a.recognizedWord}`,
      });
    }
  }

  // Correctness rule:
  // Must match all expected words without substitutions or missing words.
  // Note: Minor filler word or trailing extra word does not count as correct.
  const isCorrect =
    !hasSubstitutions &&
    !hasMissing &&
    !hasExtra &&
    matchedCount === expectedWords.length &&
    expectedWords.length > 0;

  return {
    isCorrect,
    expectedWords,
    recognizedWords,
    alignments,
    errors,
    matchedCount,
    totalExpectedCount: expectedWords.length,
    hasSubstitutions,
    hasMissing,
    hasExtra,
  };
}
