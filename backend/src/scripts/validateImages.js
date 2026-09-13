/**
 * HindiPlay Image System Validation Script
 *
 * Audits all image-backed words in the HindiPlay content library:
 * - Verifies URL format, presence, and non-emptiness
 * - Verifies image metadata: alt, source, license
 * - Verifies physical existence of image assets in public/images/words/
 * - Flags broken URLs, missing files, or incomplete metadata
 * - Optional: checks MongoDB Atlas directly if --db flag is passed
 *
 * Usage:
 *   node src/scripts/validateImages.js
 *   node src/scripts/validateImages.js --db
 */

const fs = require('fs');
const path = require('path');

const PUBLIC_WORDS_DIR = path.resolve(__dirname, '../../../public/images/words');
const SEED_FILE_PATH = path.resolve(__dirname, '../data/hindi/words.seed.js');

async function validateImages() {
  const isDbMode = process.argv.includes('--db');
  console.log('='.repeat(65));
  console.log('         HindiPlay Image System Audit & Validation');
  console.log('='.repeat(65));
  console.log(`Public Images Directory: ${PUBLIC_WORDS_DIR}`);
  console.log(`Checking physical directory exists: ${fs.existsSync(PUBLIC_WORDS_DIR) ? 'YES' : 'NO'}`);

  let words = [];

  if (isDbMode) {
    console.log('\nMode: MongoDB Database Inspection');
    try {
      require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
      const mongoose = require('mongoose');
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hindiplay');
      const HindiWord = require('../models/hindiWord.model');
      words = await HindiWord.find({}).lean();
      await mongoose.disconnect();
      console.log(`Connected to MongoDB. Loaded ${words.length} words.`);
    } catch (err) {
      console.error('Failed to load words from MongoDB:', err.message);
      process.exit(1);
    }
  } else {
    console.log(`\nMode: Seed Dataset Inspection (${path.basename(SEED_FILE_PATH)})`);
    if (!fs.existsSync(SEED_FILE_PATH)) {
      console.error(`Seed file not found at: ${SEED_FILE_PATH}`);
      process.exit(1);
    }
    words = require(SEED_FILE_PATH);
    console.log(`Loaded ${words.length} words from seed data.`);
  }

  const imageBackedWords = words.filter((w) => w.image && (typeof w.image === 'object' || typeof w.image === 'string'));

  let validCount = 0;
  let invalidCount = 0;
  let missingMetaCount = 0;
  const issues = [];

  console.log(`\nAnalyzing ${imageBackedWords.length} image-backed words...\n`);

  for (const item of imageBackedWords) {
    const wordName = item.word || 'Unknown';
    const imgObj = typeof item.image === 'string' ? { url: item.image } : item.image;
    const url = imgObj?.url;
    const alt = imgObj?.alt;
    const source = imgObj?.source;
    const license = imgObj?.license;

    const itemIssues = [];

    // 1. URL checks
    if (!url || typeof url !== 'string' || !url.trim()) {
      itemIssues.push('Missing or empty image.url');
    } else {
      // Validate format
      if (!url.startsWith('/images/words/') && !url.startsWith('http://') && !url.startsWith('https://')) {
        itemIssues.push(`Invalid URL format (must begin with /images/words/ or http): "${url}"`);
      }

      // Check physical asset for local paths
      if (url.startsWith('/images/words/')) {
        const fileName = path.basename(url);
        const physicalPath = path.join(PUBLIC_WORDS_DIR, fileName);

        if (!fs.existsSync(physicalPath)) {
          itemIssues.push(`Asset file not found on disk: "${fileName}" (expected at ${physicalPath})`);
        } else {
          try {
            const stats = fs.statSync(physicalPath);
            if (stats.size === 0) {
              itemIssues.push(`Asset file is empty (0 bytes): "${fileName}"`);
            }
          } catch (e) {
            itemIssues.push(`Cannot read asset file: ${e.message}`);
          }
        }
      }
    }

    // 2. Metadata checks
    const metaMissing = [];
    if (!alt || typeof alt !== 'string' || !alt.trim()) {
      metaMissing.push('alt');
    }
    if (!source || typeof source !== 'string' || !source.trim()) {
      metaMissing.push('source');
    }
    if (!license || typeof license !== 'string' || !license.trim()) {
      metaMissing.push('license');
    }

    if (metaMissing.length > 0) {
      missingMetaCount++;
      itemIssues.push(`Missing metadata fields: [${metaMissing.join(', ')}]`);
    }

    if (itemIssues.length > 0) {
      invalidCount++;
      issues.push({
        word: wordName,
        url: url || '(none)',
        issues: itemIssues,
      });
    } else {
      validCount++;
    }
  }

  console.log('-'.repeat(65));
  console.log('                      AUDIT SUMMARY');
  console.log('-'.repeat(65));
  console.log(`Total Hindi words inspected : ${words.length}`);
  console.log(`Total image-backed words    : ${imageBackedWords.length}`);
  console.log(`Valid images                : ${validCount}`);
  console.log(`Invalid images              : ${invalidCount}`);
  console.log(`Missing metadata records    : ${missingMetaCount}`);
  console.log('-'.repeat(65));

  if (issues.length > 0) {
    console.log('\n❌ Issues Detected:\n');
    issues.forEach((iss, idx) => {
      console.log(`${idx + 1}. Word: "${iss.word}" | URL: ${iss.url}`);
      iss.issues.forEach((reason) => {
        console.log(`   - ${reason}`);
      });
    });
    console.log('\nAudit status: FAILED (issues found)\n');
    process.exit(1);
  } else {
    console.log('\n✅ All image-backed words have valid, reachable files and complete metadata.\n');
    console.log('Audit status: PASSED\n');
    process.exit(0);
  }
}

validateImages().catch((err) => {
  console.error('Fatal validation error:', err);
  process.exit(1);
});
