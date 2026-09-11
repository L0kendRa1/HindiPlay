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
 * Seed Hindi Content into MongoDB
 */
const seedHindiContent = async () => {
  console.log('=== STARTING HINDI CONTENT SEEDING ===');

  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Seed Letters
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

    // 3. Seed Matras
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

    // 4. Seed Words
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

    // 5. Seed Stories
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
