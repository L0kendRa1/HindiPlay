const mongoose = require('mongoose');
const HindiWord = require('../models/hindiWord.model');

const MAX_SELECTION_COUNT = 30;
const MAX_EXCLUSION_IDS = 100;

// Activities that strictly require words with verified image assets
const PICTURE_REQUIRED_ACTIVITIES = new Set([
  'picture-match',
  'picture-word-quiz',
  'word-picture-quiz',
  'memory-match',
]);

/**
 * Smart, activity-aware selection of Hindi words.
 *
 * Implements an educational preference model:
 * - High Priority: suitable, matching filters, not in exclusion list.
 * - Relaxation: if candidate pool is smaller than requested count (e.g. small category
 *   or many exclusions), relaxed queries ensure requested count is fulfilled without duplicates.
 * - Performance: queries use MongoDB $match and $sample natively.
 *
 * @param {Object} options
 * @param {string} [options.activityId]
 * @param {number} [options.count=5]
 * @param {string} [options.difficulty]
 * @param {string} [options.category]
 * @param {boolean|string} [options.hasImage]
 * @param {string|string[]} [options.exclude] Comma-separated or array of IDs/words to exclude
 * @param {string} [options.userId] Optional authenticated user ID for future personalization
 * @returns {Promise<Array>} Array of unique HindiWord documents
 */
async function selectWords(options = {}) {
  const {
    activityId,
    difficulty,
    category,
    hasImage,
    exclude,
    userId, // available for logging or future per-user heuristics
  } = options;

  const count = Math.min(
    MAX_SELECTION_COUNT,
    Math.max(1, parseInt(options.count, 10) || 5)
  );

  // 1. Determine image requirements
  let imageFilterRequired = false;
  if (hasImage === true || hasImage === 'true') {
    imageFilterRequired = true;
  } else if (activityId && PICTURE_REQUIRED_ACTIVITIES.has(activityId.trim())) {
    imageFilterRequired = true;
  }

  // 2. Process exclusions safely (capped to MAX_EXCLUSION_IDS)
  const excludeIdList = [];
  const excludeWordList = [];

  if (exclude) {
    const rawItems = Array.isArray(exclude)
      ? exclude
      : String(exclude).split(',').map((s) => s.trim()).filter(Boolean);

    for (const item of rawItems.slice(0, MAX_EXCLUSION_IDS)) {
      if (mongoose.Types.ObjectId.isValid(item)) {
        excludeIdList.push(new mongoose.Types.ObjectId(item));
      } else {
        excludeWordList.push(item);
      }
    }
  }

  // 3. Build base match filter
  const baseFilter = { isActive: true };

  if (category && typeof category === 'string' && category.trim()) {
    baseFilter.category = category.trim();
  }

  if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty.toLowerCase())) {
    baseFilter.difficulty = difficulty.toLowerCase();
  }

  if (imageFilterRequired) {
    baseFilter.image = { $ne: null };
  } else if (hasImage === false || hasImage === 'false') {
    baseFilter.image = null;
  }

  // 4. First pass: Select words respecting all filters AND exclusions
  const firstPassFilter = { ...baseFilter };
  const hasExclusions = excludeIdList.length > 0 || excludeWordList.length > 0;

  if (hasExclusions) {
    const conditions = [];
    if (excludeIdList.length > 0) {
      conditions.push({ _id: { $nin: excludeIdList } });
    }
    if (excludeWordList.length > 0) {
      conditions.push({ word: { $nin: excludeWordList } });
    }
    if (conditions.length === 1) {
      Object.assign(firstPassFilter, conditions[0]);
    } else if (conditions.length > 1) {
      firstPassFilter.$and = conditions;
    }
  }

  let selectedWords = await HindiWord.aggregate([
    { $match: firstPassFilter },
    { $sample: { size: count } },
    { $project: { __v: 0 } },
  ]);

  // 5. Second pass (Relaxation):
  // If first pass yielded fewer words than requested and exclusions were applied,
  // query remaining items from the base filter (excluding words already chosen)
  // to achieve educational variety without failing the activity.
  if (selectedWords.length < count && hasExclusions) {
    const needed = count - selectedWords.length;
    const currentWordNames = selectedWords.map((w) => w.word);

    const relaxedFilter = {
      ...baseFilter,
      word: { $nin: currentWordNames },
    };

    const backfillWords = await HindiWord.aggregate([
      { $match: relaxedFilter },
      { $sample: { size: needed } },
      { $project: { __v: 0 } },
    ]);

    selectedWords = selectedWords.concat(backfillWords);
  }

  return selectedWords;
}

module.exports = {
  selectWords,
  PICTURE_REQUIRED_ACTIVITIES,
};
