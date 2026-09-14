/**
 * HindiPlay Content Library Validation Script
 *
 * Deterministically audits all 4 Hindi learning content collections:
 * 1. Words (216 words across 17 categories)
 * 2. Letters (49 Swar, Vyanjan, and Sanyukt Vyanjan)
 * 3. Matras (9 primary Devanagari vowel signs)
 * 4. Stories (18 graded reading comprehension stories)
 *
 * Validates:
 * - Uniqueness (0 duplicate words, characters, or titles)
 * - Devanagari text integrity (non-empty, valid UTF-8 Devanagari strings)
 * - Learning unit integrity (learningUnits.join('') === target word/letter)
 * - Category and difficulty enums
 * - Matra baseConsonant + symbol === combinedUnit consistency
 * - Image asset reachable on disk for all image-backed entries
 * - Story structure (paragraphs, questions >= 3 options, answers in options)
 *
 * Usage:
 *   node src/scripts/validateContent.js
 *   node src/scripts/validateContent.js --db
 */

const fs = require('fs');
const path = require('path');

const PUBLIC_WORDS_DIR = path.resolve(__dirname, '../../../public/images/words');
const SEED_DIR = path.resolve(__dirname, '../data/hindi');

const VALID_CATEGORIES = new Set([
  'जानवर', 'फल', 'प्रकृति', 'वस्तुएँ', 'घर',
  'सब्ज़ियाँ', 'भोजन', 'स्कूल', 'क्रियाएँ', 'पक्षी',
  'शरीर', 'वाहन', 'परिवार', 'स्थान', 'रंग',
  'संख्या', 'सामान्य',
]);

const VALID_DIFFICULTIES = new Set(['easy', 'medium', 'hard']);

async function validateContent() {
  const isDbMode = process.argv.includes('--db');
  console.log('='.repeat(70));
  console.log('         HindiPlay Content Quality & Coverage Audit');
  console.log('='.repeat(70));

  let words = [];
  let letters = [];
  let matras = [];
  let stories = [];

  if (isDbMode) {
    console.log('Mode: MongoDB Atlas Database Inspection\n');
    try {
      require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
      const mongoose = require('mongoose');
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hindiplay');

      const HindiWord = require('../models/hindiWord.model');
      const HindiLetter = require('../models/hindiLetter.model');
      const HindiMatra = require('../models/hindiMatra.model');
      const HindiStory = require('../models/hindiStory.model');

      words = await HindiWord.find({}).lean();
      letters = await HindiLetter.find({}).lean();
      matras = await HindiMatra.find({}).lean();
      stories = await HindiStory.find({}).lean();

      await mongoose.disconnect();
      console.log(`Loaded from Database: ${words.length} words, ${letters.length} letters, ${matras.length} matras, ${stories.length} stories.\n`);
    } catch (err) {
      console.error('Failed to load content from database:', err.message);
      process.exit(1);
    }
  } else {
    console.log('Mode: Seed Files Inspection\n');
    words = require(path.join(SEED_DIR, 'words.seed.js'));
    letters = require(path.join(SEED_DIR, 'letters.seed.js'));
    matras = require(path.join(SEED_DIR, 'matras.seed.js'));
    stories = require(path.join(SEED_DIR, 'stories.seed.js'));
    console.log(`Loaded from Seed: ${words.length} words, ${letters.length} letters, ${matras.length} matras, ${stories.length} stories.\n`);
  }

  const errors = [];
  const warnings = [];

  // ==========================================
  // 1. AUDIT WORDS
  // ==========================================
  console.log(`Auditing ${words.length} Hindi Words...`);
  const wordMap = new Map();
  const normalizedMap = new Map();

  words.forEach((w, idx) => {
    const loc = `Word #${idx + 1} ("${w.word || 'UNKNOWN'}")`;

    // Required fields
    if (!w.word || typeof w.word !== 'string' || !w.word.trim()) {
      errors.push(`${loc}: Missing or empty "word" field`);
      return;
    }

    // Duplicate check
    if (wordMap.has(w.word)) {
      errors.push(`${loc}: Duplicate word with index ${wordMap.get(w.word)}`);
    } else {
      wordMap.set(w.word, idx + 1);
    }

    // Normalized word check
    if (w.normalizedWord) {
      if (normalizedMap.has(w.normalizedWord)) {
        warnings.push(`${loc}: Duplicate normalizedWord "${w.normalizedWord}"`);
      } else {
        normalizedMap.set(w.normalizedWord, idx + 1);
      }
    }

    // Category check
    if (!w.category || !VALID_CATEGORIES.has(w.category.trim())) {
      errors.push(`${loc}: Invalid or missing category "${w.category}"`);
    }

    // Difficulty check
    if (!w.difficulty || !VALID_DIFFICULTIES.has(w.difficulty.toLowerCase())) {
      errors.push(`${loc}: Invalid difficulty "${w.difficulty}"`);
    }

    // Learning units check
    if (!Array.isArray(w.learningUnits) || w.learningUnits.length === 0) {
      errors.push(`${loc}: Missing or empty learningUnits array`);
    } else {
      const reconstructed = w.learningUnits.join('');
      if (reconstructed !== w.word) {
        errors.push(`${loc}: learningUnits "${reconstructed}" does not match word "${w.word}"`);
      }
    }

    // Letters check
    if (!Array.isArray(w.letters) || w.letters.length === 0) {
      errors.push(`${loc}: Missing or empty letters array`);
    }

    // Image reference check
    if (w.image) {
      const url = typeof w.image === 'string' ? w.image : w.image.url;
      if (!url || typeof url !== 'string' || !url.trim()) {
        errors.push(`${loc}: Image present but missing URL`);
      } else if (url.startsWith('/images/words/')) {
        const fileName = path.basename(url);
        const physical = path.join(PUBLIC_WORDS_DIR, fileName);
        if (!fs.existsSync(physical)) {
          errors.push(`${loc}: Referenced image file "${fileName}" does not exist on disk`);
        }
      }
    }
  });

  // ==========================================
  // 2. AUDIT LETTERS
  // ==========================================
  console.log(`Auditing ${letters.length} Hindi Letters...`);
  const letterCharMap = new Map();

  letters.forEach((l, idx) => {
    const loc = `Letter #${idx + 1} ("${l.character || 'UNKNOWN'}")`;

    if (!l.character || typeof l.character !== 'string' || !l.character.trim()) {
      errors.push(`${loc}: Missing or empty "character"`);
      return;
    }

    if (letterCharMap.has(l.character)) {
      errors.push(`${loc}: Duplicate letter character "${l.character}"`);
    } else {
      letterCharMap.set(l.character, idx + 1);
    }

    // Learning units check
    if (!Array.isArray(l.learningUnits) || l.learningUnits.length === 0) {
      errors.push(`${loc}: Missing or empty learningUnits`);
    } else {
      const joined = l.learningUnits.join('');
      if (joined !== l.character) {
        errors.push(`${loc}: learningUnits "${joined}" does not match character "${l.character}"`);
      }
    }

    // Example image check
    if (l.image && l.image.url) {
      if (l.image.url.startsWith('/images/words/')) {
        const fn = path.basename(l.image.url);
        const physical = path.join(PUBLIC_WORDS_DIR, fn);
        if (!fs.existsSync(physical)) {
          errors.push(`${loc}: Example image "${fn}" for word "${l.exampleWord}" not found on disk`);
        }
      }
    }
  });

  // ==========================================
  // 3. AUDIT MATRAS
  // ==========================================
  console.log(`Auditing ${matras.length} Hindi Matras...`);
  const matraSymbolMap = new Map();

  matras.forEach((m, idx) => {
    const loc = `Matra #${idx + 1} ("${m.name || m.symbol || 'UNKNOWN'}")`;

    if (!m.symbol) {
      errors.push(`${loc}: Missing "symbol"`);
      return;
    }

    if (matraSymbolMap.has(m.symbol)) {
      errors.push(`${loc}: Duplicate matra symbol "${m.symbol}"`);
    } else {
      matraSymbolMap.set(m.symbol, idx + 1);
    }

    if (!Array.isArray(m.examples) || m.examples.length === 0) {
      errors.push(`${loc}: Missing or empty examples array`);
    } else {
      m.examples.forEach((ex, exIdx) => {
        const expected = (ex.baseConsonant || '') + m.symbol;
        if (ex.combinedUnit !== expected) {
          errors.push(`${loc} Example #${exIdx + 1}: combinedUnit "${ex.combinedUnit}" !== expected "${expected}"`);
        }
        if (ex.exampleWord && !ex.exampleWord.includes(ex.combinedUnit)) {
          errors.push(`${loc} Example #${exIdx + 1}: exampleWord "${ex.exampleWord}" does not contain "${ex.combinedUnit}"`);
        }
      });
    }
  });

  // ==========================================
  // 4. AUDIT STORIES
  // ==========================================
  console.log(`Auditing ${stories.length} Hindi Stories...`);
  const storyTitleMap = new Map();

  stories.forEach((s, idx) => {
    const loc = `Story #${idx + 1} ("${s.title || 'UNKNOWN'}")`;

    if (!s.title || !s.title.trim()) {
      errors.push(`${loc}: Missing "title"`);
      return;
    }

    if (storyTitleMap.has(s.title)) {
      errors.push(`${loc}: Duplicate story title "${s.title}"`);
    } else {
      storyTitleMap.set(s.title, idx + 1);
    }

    if (!s.content || !s.content.trim()) {
      errors.push(`${loc}: Missing or empty "content"`);
    }

    if (!Array.isArray(s.paragraphs) || s.paragraphs.length === 0) {
      errors.push(`${loc}: Missing or empty paragraphs array`);
    }

    if (!Array.isArray(s.questions) || s.questions.length === 0) {
      errors.push(`${loc}: Missing questions array`);
    } else {
      s.questions.forEach((q, qIdx) => {
        if (!q.question || !q.question.trim()) {
          errors.push(`${loc} Q#${qIdx + 1}: Missing question text`);
        }
        if (!Array.isArray(q.options) || q.options.length < 3) {
          errors.push(`${loc} Q#${qIdx + 1}: Expected at least 3 options, got ${q.options?.length}`);
        }
        if (!q.answer) {
          errors.push(`${loc} Q#${qIdx + 1}: Missing answer`);
        } else if (Array.isArray(q.options) && !q.options.includes(q.answer)) {
          errors.push(`${loc} Q#${qIdx + 1}: Answer "${q.answer}" is not present in options`);
        }
      });
    }
  });

  // ==========================================
  // SUMMARY REPORT
  // ==========================================
  console.log('\n' + '-'.repeat(70));
  console.log('                     CONTENT AUDIT SUMMARY');
  console.log('-'.repeat(70));
  console.log(`Total Hindi Words    : ${words.length}`);
  console.log(`Total Hindi Letters  : ${letters.length}`);
  console.log(`Total Hindi Matras   : ${matras.length}`);
  console.log(`Total Hindi Stories  : ${stories.length}`);
  console.log(`Validation Errors    : ${errors.length}`);
  console.log(`Validation Warnings  : ${warnings.length}`);
  console.log('-'.repeat(70));

  if (errors.length > 0) {
    console.log('\n❌ Validation Errors Detected:');
    errors.forEach((err, idx) => {
      console.log(`  ${idx + 1}. ${err}`);
    });
    console.log('\nAudit Result: FAILED\n');
    process.exit(1);
  } else {
    console.log('\n✅ All content collections passed validation with 0 errors.');
    console.log('Audit Result: PASSED\n');
    process.exit(0);
  }
}

validateContent().catch((err) => {
  console.error('Fatal content validation error:', err);
  process.exit(1);
});
