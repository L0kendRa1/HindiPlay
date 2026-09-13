const mongoose = require('mongoose');
const HindiWord = require('../models/hindiWord.model');
const HindiLetter = require('../models/hindiLetter.model');
const HindiMatra = require('../models/hindiMatra.model');
const HindiStory = require('../models/hindiStory.model');

const MAX_PAGE_LIMIT = 50;
const MAX_RANDOM_COUNT = 20;

/**
 * @desc    Get paginated and filtered Hindi words
 * @route   GET /api/content/hindi/words
 * @access  Public
 */
exports.getWords = async (req, res, next) => {
  try {
    let {
      page = 1,
      limit = 20,
      category,
      difficulty,
      search,
      tag,
      hasImage,
    } = req.query;

    page = Math.max(1, parseInt(page, 10) || 1);
    limit = Math.min(MAX_PAGE_LIMIT, Math.max(1, parseInt(limit, 10) || 20));

    const filter = { isActive: true };

    if (category) {
      filter.category = category.trim();
    }

    if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty.toLowerCase())) {
      filter.difficulty = difficulty.toLowerCase();
    }

    if (tag) {
      filter.tags = tag.trim();
    }

    if (hasImage === 'true') {
      filter.image = { $ne: null };
    } else if (hasImage === 'false') {
      filter.image = null;
    }

    if (search && search.trim()) {
      const cleanSearch = search.trim();
      filter.$or = [
        { word: { $regex: cleanSearch, $options: 'i' } },
        { normalizedWord: { $regex: cleanSearch, $options: 'i' } },
        { meaning: { $regex: cleanSearch, $options: 'i' } },
        { tags: { $in: [new RegExp(cleanSearch, 'i')] } },
      ];
    }

    const skip = (page - 1) * limit;

    const [words, total] = await Promise.all([
      HindiWord.find(filter)
        .select('-__v')
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      HindiWord.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: words,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get random unique Hindi words for activities
 * @route   GET /api/content/hindi/words/random
 * @access  Public
 */
exports.getRandomWords = async (req, res, next) => {
  try {
    let {
      count = 5,
      category,
      difficulty,
      hasImage,
    } = req.query;

    const safeCount = Math.min(MAX_RANDOM_COUNT, Math.max(1, parseInt(count, 10) || 5));

    const matchFilter = { isActive: true };

    if (category) {
      matchFilter.category = category.trim();
    }

    if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty.toLowerCase())) {
      matchFilter.difficulty = difficulty.toLowerCase();
    }

    if (hasImage === 'true') {
      matchFilter.image = { $ne: null };
    } else if (hasImage === 'false') {
      matchFilter.image = null;
    }

    const words = await HindiWord.aggregate([
      { $match: matchFilter },
      { $sample: { size: safeCount } },
      { $project: { __v: 0 } },
    ]);

    res.status(200).json({
      success: true,
      count: words.length,
      data: words,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single Hindi word by ID
 * @route   GET /api/content/hindi/words/:id
 * @access  Public
 */
exports.getWordById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid word ID format',
      });
    }

    const word = await HindiWord.findOne({ _id: id, isActive: true }).select('-__v');

    if (!word) {
      return res.status(404).json({
        success: false,
        message: 'Word not found',
      });
    }

    res.status(200).json({
      success: true,
      data: word,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all Hindi letters (Swar & Vyanjan)
 * @route   GET /api/content/hindi/letters
 * @access  Public
 */
exports.getLetters = async (req, res, next) => {
  try {
    const { type, difficulty } = req.query;
    const filter = { isActive: true };

    if (type && ['स्वर', 'व्यंजन', 'अन्य'].includes(type.trim())) {
      filter.type = type.trim();
    }

    if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty.toLowerCase())) {
      filter.difficulty = difficulty.toLowerCase();
    }

    const letters = await HindiLetter.find(filter).select('-__v').sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: letters.length,
      data: letters,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all Hindi Matras with examples and combinations
 * @route   GET /api/content/hindi/matras
 * @access  Public
 */
exports.getMatras = async (req, res, next) => {
  try {
    const matras = await HindiMatra.find({ isActive: true }).select('-__v').sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: matras.length,
      data: matras,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Hindi reading stories with pagination & difficulty filtering
 * @route   GET /api/content/hindi/stories
 * @access  Public
 */
exports.getStories = async (req, res, next) => {
  try {
    let {
      page = 1,
      limit = 10,
      difficulty,
    } = req.query;

    page = Math.max(1, parseInt(page, 10) || 1);
    limit = Math.min(20, Math.max(1, parseInt(limit, 10) || 10));

    const filter = { isActive: true };

    if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty.toLowerCase())) {
      filter.difficulty = difficulty.toLowerCase();
    }

    const skip = (page - 1) * limit;

    const [stories, total] = await Promise.all([
      HindiStory.find(filter)
        .select('-__v')
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      HindiStory.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: stories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single story by ID with full questions
 * @route   GET /api/content/hindi/stories/:id
 * @access  Public
 */
exports.getStoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid story ID format',
      });
    }

    const story = await HindiStory.findOne({ _id: id, isActive: true }).select('-__v');

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found',
      });
    }

    res.status(200).json({
      success: true,
      data: story,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get overall Hindi content library statistics
 * @route   GET /api/content/hindi/stats
 * @access  Public
 */
exports.getContentStats = async (req, res, next) => {
  try {
    const [
      words,
      letters,
      matras,
      stories,
      wordsWithImages,
      categories,
      difficultyAggregation,
      categoryAggregation,
    ] = await Promise.all([
      HindiWord.countDocuments({ isActive: true }),
      HindiLetter.countDocuments({ isActive: true }),
      HindiMatra.countDocuments({ isActive: true }),
      HindiStory.countDocuments({ isActive: true }),
      HindiWord.countDocuments({ isActive: true, image: { $ne: null } }),
      HindiWord.distinct('category', { isActive: true }),
      HindiWord.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$difficulty', count: { $sum: 1 } } },
      ]),
      HindiWord.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    const wordsByDifficulty = {
      easy: 0,
      medium: 0,
      hard: 0,
    };
    difficultyAggregation.forEach((item) => {
      if (item._id && wordsByDifficulty[item._id] !== undefined) {
        wordsByDifficulty[item._id] = item.count;
      }
    });

    const wordsByCategory = {};
    categoryAggregation.forEach((item) => {
      if (item._id) {
        wordsByCategory[item._id] = item.count;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        words,
        letters,
        matras,
        stories,
        wordsWithImages,
        categoriesCount: categories.length,
        categories,
        wordsByDifficulty,
        wordsByCategory,
      },
    });
  } catch (error) {
    next(error);
  }
};
