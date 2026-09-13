const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const connectDB = require('../config/db');
const HindiLetter = require('../models/hindiLetter.model');
const HindiMatra = require('../models/hindiMatra.model');
const HindiWord = require('../models/hindiWord.model');
const HindiStory = require('../models/hindiStory.model');

const HINDI_LETTERS_SEED = require('./hindi/letters.seed');
const HINDI_MATRAS_SEED = require('./hindi/matras.seed');
const HINDI_WORDS_SEED = require('./hindi/words.seed');
const HINDI_STORIES_SEED = require('./hindi/stories.seed');

/**
 * Pre-validation for all seed datasets before modifying the database.
 * Throws an error immediately if any dataset fails validation.
 */
const validateSeedData = () => {
  console.log('--- Validating Content Seed Data ---');
  const errors = [];

  // 1. Validate Letters
  const letterChars = new Set();
  HINDI_LETTERS_SEED.forEach((letter, i) => {
    if (!letter.character || typeof letter.character !== 'string' || !letter.character.trim()) {
      errors.push(`Letter at index ${i} missing valid character`);
    }
    if (letterChars.has(letter.character)) {
      errors.push(`Duplicate letter character detected: ${letter.character}`);
    }
    letterChars.add(letter.character);

    if (!['स्वर', 'व्यंजन', 'अन्य'].includes(letter.type)) {
      errors.push(`Invalid letter type "${letter.type}" in letter: ${letter.character}`);
    }
  });

  // 2. Validate Matras
  const matraSymbols = new Set();
  HINDI_MATRAS_SEED.forEach((matra, i) => {
    if (!matra.symbol || typeof matra.symbol !== 'string' || !matra.symbol.trim()) {
      errors.push(`Matra at index ${i} missing valid symbol`);
    }
    if (matraSymbols.has(matra.symbol)) {
      errors.push(`Duplicate matra symbol detected: ${matra.symbol}`);
    }
    matraSymbols.add(matra.symbol);
  });

  // 3. Validate Words
  const wordSet = new Set();
  HINDI_WORDS_SEED.forEach((wordObj, i) => {
    if (!wordObj.word || typeof wordObj.word !== 'string' || !wordObj.word.trim()) {
      errors.push(`Word at index ${i} missing valid word string`);
    }
    if (wordSet.has(wordObj.word)) {
      errors.push(`Duplicate word detected: ${wordObj.word}`);
    }
    wordSet.add(wordObj.word);

    if (!['easy', 'medium', 'hard'].includes(wordObj.difficulty)) {
      errors.push(`Invalid difficulty "${wordObj.difficulty}" in word: ${wordObj.word}`);
    }
    if (!wordObj.category || typeof wordObj.category !== 'string' || !wordObj.category.trim()) {
      errors.push(`Missing category in word: ${wordObj.word}`);
    }
    if (!Array.isArray(wordObj.letters) || wordObj.letters.length === 0) {
      errors.push(`Word "${wordObj.word}" must have a non-empty letters array`);
    }
    if (!Array.isArray(wordObj.learningUnits) || wordObj.learningUnits.length === 0) {
      errors.push(`Word "${wordObj.word}" must have a non-empty learningUnits array`);
    }
    if (wordObj.image) {
      if (!wordObj.image.url || typeof wordObj.image.url !== 'string') {
        errors.push(`Invalid image URL format in word: ${wordObj.word}`);
      }
    }
  });

  // 4. Validate Stories
  const storyTitles = new Set();
  HINDI_STORIES_SEED.forEach((story, i) => {
    if (!story.title || typeof story.title !== 'string' || !story.title.trim()) {
      errors.push(`Story at index ${i} missing valid title`);
    }
    if (storyTitles.has(story.title)) {
      errors.push(`Duplicate story title detected: ${story.title}`);
    }
    storyTitles.add(story.title);

    if (!Array.isArray(story.paragraphs) || story.paragraphs.length === 0) {
      errors.push(`Story "${story.title}" must have non-empty paragraphs`);
    }
    if (!Array.isArray(story.questions) || story.questions.length === 0) {
      errors.push(`Story "${story.title}" must have questions`);
    }
    story.questions.forEach((q, qIdx) => {
      if (!q.question || !q.answer || !Array.isArray(q.options) || q.options.length < 2) {
        errors.push(`Malformed question at index ${qIdx} in story "${story.title}"`);
      }
      if (!q.options.includes(q.answer)) {
        errors.push(`Answer "${q.answer}" not present in options for question "${q.question}" in story "${story.title}"`);
      }
    });
  });

  if (errors.length > 0) {
    console.error(`❌ Validation failed with ${errors.length} errors:`);
    errors.slice(0, 10).forEach((err) => console.error(`  - ${err}`));
    if (errors.length > 10) {
      console.error(`  ... and ${errors.length - 10} more errors`);
    }
    throw new Error(`Content validation failed with ${errors.length} errors.`);
  }

  console.log(`✓ All seed datasets passed strict pre-validation.`);
  console.log(`  - Letters: ${HINDI_LETTERS_SEED.length}`);
  console.log(`  - Matras: ${HINDI_MATRAS_SEED.length}`);
  console.log(`  - Words: ${HINDI_WORDS_SEED.length}`);
  console.log(`  - Stories: ${HINDI_STORIES_SEED.length}`);
};

/**
 * Seed Hindi Content into MongoDB
 * Non-destructive: preserves all users, progress records, and gamification data.
 */
const seedHindiContent = async () => {
  console.log('=== STARTING HINDI CONTENT SEEDING ===');

  try {
    // 1. Run Pre-validation
    validateSeedData();

    // 2. Connect to MongoDB
    await connectDB();

    // 3. Seed Letters (deterministic upsert)
    console.log('\n--- Seeding Hindi Letters ---');
    let lettersCount = 0;
    for (const letterData of HINDI_LETTERS_SEED) {
      await HindiLetter.findOneAndUpdate(
        { character: letterData.character },
        letterData,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      lettersCount++;
    }
    console.log(`✓ Seeded ${lettersCount} Hindi letters (Swar, Vyanjan & Special)`);

    // 4. Seed Matras (deterministic upsert)
    console.log('\n--- Seeding Hindi Matras ---');
    let matrasCount = 0;
    for (const matraData of HINDI_MATRAS_SEED) {
      await HindiMatra.findOneAndUpdate(
        { symbol: matraData.symbol },
        matraData,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      matrasCount++;
    }
    console.log(`✓ Seeded ${matrasCount} Hindi matras with combinations`);

    // 5. Seed Words (deterministic upsert)
    console.log('\n--- Seeding Hindi Words ---');
    let wordsCount = 0;
    for (const wordData of HINDI_WORDS_SEED) {
      await HindiWord.findOneAndUpdate(
        { word: wordData.word },
        wordData,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      wordsCount++;
    }
    console.log(`✓ Seeded ${wordsCount} curated Hindi words with explicit learning units`);

    // 6. Seed Stories (deterministic upsert)
    console.log('\n--- Seeding Hindi Stories ---');
    let storiesCount = 0;
    for (const storyData of HINDI_STORIES_SEED) {
      await HindiStory.findOneAndUpdate(
        { title: storyData.title },
        storyData,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      storiesCount++;
    }
    console.log(`✓ Seeded ${storiesCount} Hindi stories across all 3 difficulties`);

    console.log('\n========================================');
    console.log('🌟 HINDI CONTENT SEEDED SUCCESSFULLY! 🌟');
    console.log(`Summary: ${lettersCount} letters, ${matrasCount} matras, ${wordsCount} words, ${storiesCount} stories`);
    console.log('========================================');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed.');
    if (require.main === module) {
      process.exit(process.exitCode || 0);
    }
  }
};

// Execute if run directly from CLI
if (require.main === module) {
  seedHindiContent();
}

module.exports = seedHindiContent;
