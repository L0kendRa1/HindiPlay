import { HindiUnit } from '../types/wordBuilder';
import { MatraDefinition, HINDI_MATRAS } from '../data/matras';

/**
 * Combines a base Hindi consonant and a dependent vowel sign (matra)
 * into a single, valid, pedagogical HindiUnit.
 * 
 * Rules:
 * - When matra is null/empty: returns the base consonant (अ-कार रूप).
 * - Standard matras combine as base + matra symbol (e.g. म + ा ➔ मा, क + ि ➔ कि).
 * - Devanagari ligatures (like र + ु ➔ रु, र + ू ➔ रू) are naturally supported.
 * - Zero Unicode string splitting: always treats result as a single Hindi learning unit.
 */
export function combineCharacterWithMatra(
  baseChar: string,
  matra: MatraDefinition | string | null
): HindiUnit {
  const base = (baseChar || '').trim();
  if (!base) {
    return {
      id: 'unit_empty',
      base: '',
      display: '',
      type: 'base',
      hint: '',
    };
  }

  // Resolve matra object if a string symbol was passed
  let matraObj: MatraDefinition | null = null;
  let matraSymbol = '';

  if (typeof matra === 'string') {
    matraObj = HINDI_MATRAS.find((m) => m.symbol === matra || m.id === matra) || null;
    matraSymbol = matraObj ? matraObj.symbol : matra;
  } else if (matra && typeof matra === 'object') {
    matraObj = matra;
    matraSymbol = matra.symbol;
  }

  if (!matraSymbol) {
    // Pure base consonant
    return {
      id: `unit_${base}_base`,
      base: base,
      display: base,
      type: 'base',
      hint: `${base} (बिना मात्रा / मूल अक्षर)`,
    };
  }

  // Compose Devanagari glyph
  const display = `${base}${matraSymbol}`;
  const matraName = matraObj ? matraObj.name : `मात्रा (${matraSymbol})`;
  const vowelName = matraObj ? matraObj.vowel : '';

  return {
    id: `unit_${base}_${matraObj ? matraObj.id : matraSymbol}`,
    base: base,
    matra: matraSymbol,
    display: display,
    type: 'consonant-matra',
    hint: `${base} + ${matraSymbol} = ${display} (${matraName}${vowelName ? ` - ${vowelName}` : ''})`,
  };
}

/**
 * Checks if a given display string matches a combined unit
 */
export function isMatchingHindiUnit(unit: HindiUnit, expectedDisplay: string): boolean {
  return unit.display === expectedDisplay;
}
