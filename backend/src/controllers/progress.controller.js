const Progress = require('../models/progress.model');
const gamificationService = require('../services/gamification.service');

const MAX_PAGE_LIMIT = 50;

/**
 * @desc    Save a new learning activity attempt/result and award gamification rewards
 * @route   POST /api/progress
 * @access  Private (Authenticated users only)
 */
exports.createProgress = async (req, res, next) => {
  try {
    const {
      activityId,
      score,
      total,
      attempts = 1,
      completed = false,
      timeSpentSeconds = 0,
      subject = 'hindi',
      metadata = {},
    } = req.body;

    // 1. Validate activityId
    if (!activityId || typeof activityId !== 'string' || !activityId.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Activity ID is required and must be a non-empty string',
      });
    }

    // 2. Validate score and total existence & numeric types
    if (score === undefined || score === null || typeof score !== 'number' || !Number.isFinite(score)) {
      return res.status(400).json({
        success: false,
        message: 'Score is required and must be a valid finite number',
      });
    }

    if (total === undefined || total === null || typeof total !== 'number' || !Number.isFinite(total)) {
      return res.status(400).json({
        success: false,
        message: 'Total is required and must be a valid finite number',
      });
    }

    // 3. Validate numerical constraints
    if (total <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Total questions must be greater than 0',
      });
    }

    if (score < 0) {
      return res.status(400).json({
        success: false,
        message: 'Score cannot be negative',
      });
    }

    if (score > total) {
      return res.status(400).json({
        success: false,
        message: 'Score cannot be greater than total questions',
      });
    }

    // 4. Validate attempts count
    if (typeof attempts !== 'number' || !Number.isFinite(attempts) || attempts < 1) {
      return res.status(400).json({
        success: false,
        message: 'Attempts must be a number greater than or equal to 1',
      });
    }

    // 5. Validate timeSpentSeconds
    if (
      typeof timeSpentSeconds !== 'number' ||
      !Number.isFinite(timeSpentSeconds) ||
      timeSpentSeconds < 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'timeSpentSeconds must be a number greater than or equal to 0',
      });
    }

    // 6. Validate completed
    if (typeof completed !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'completed must be a boolean value (true or false)',
      });
    }

    // 7. Security: Calculate accuracy on backend (ignore any frontend-supplied accuracy)
    const calculatedAccuracy = Math.round(((score / total) * 100) * 100) / 100;

    // 8. Create progress document (owner determined strictly from req.user._id)
    const progress = await Progress.create({
      user: req.user._id,
      activityId: activityId.trim(),
      subject: subject ? String(subject).trim().toLowerCase() : 'hindi',
      score,
      total,
      accuracy: calculatedAccuracy,
      attempts,
      completed,
      timeSpentSeconds,
      metadata: typeof metadata === 'object' && metadata !== null ? metadata : {},
      gamificationProcessed: false,
    });

    // 9. Automatically process gamification rewards (XP, stars, streak, badges)
    const rewards = await gamificationService.processGamificationForProgress(progress);

    const progressObj = progress.toJSON ? progress.toJSON() : progress.toObject();

    // Return unified payload preserving backward compatibility and new rewards summary
    res.status(201).json({
      success: true,
      message: 'Progress saved successfully',
      data: {
        ...progressObj,
        progress: progressObj,
        rewards: {
          xpEarned: rewards.xpEarned,
          starsEarned: rewards.starsEarned,
          currentStreak: rewards.currentStreak,
          longestStreak: rewards.longestStreak,
          newBadges: rewards.newBadges,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get paginated progress history for the authenticated user
 * @route   GET /api/progress
 * @access  Private
 */
exports.getProgress = async (req, res, next) => {
  try {
    let { page = 1, limit = 20, activityId, subject } = req.query;

    page = Math.max(1, parseInt(page, 10) || 1);
    limit = Math.min(MAX_PAGE_LIMIT, Math.max(1, parseInt(limit, 10) || 20));

    // Security: Filter strictly for logged-in user
    const filter = { user: req.user._id };

    if (activityId && typeof activityId === 'string' && activityId.trim()) {
      filter.activityId = activityId.trim();
    }

    if (subject && typeof subject === 'string' && subject.trim()) {
      filter.subject = subject.trim().toLowerCase();
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Progress.find(filter)
        .select('-__v')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Progress.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get progress records for a specific activity
 * @route   GET /api/progress/:activityId
 * @access  Private
 */
exports.getActivityProgress = async (req, res, next) => {
  try {
    const { activityId } = req.params;
    let { page = 1, limit = 20 } = req.query;

    page = Math.max(1, parseInt(page, 10) || 1);
    limit = Math.min(MAX_PAGE_LIMIT, Math.max(1, parseInt(limit, 10) || 20));

    // Security: Filter strictly for logged-in user and specified activityId
    const filter = {
      user: req.user._id,
      activityId: activityId.trim(),
    };

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Progress.find(filter)
        .select('-__v')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Progress.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get overall learning progress statistics for the authenticated user
 * @route   GET /api/progress/stats
 * @access  Private
 */
exports.getProgressStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Aggregate overall metrics for the authenticated user
    const statsAggregation = await Progress.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          totalActivitiesCompleted: {
            $sum: { $cond: [{ $eq: ['$completed', true] }, 1, 0] },
          },
          totalQuestions: { $sum: '$total' },
          totalCorrect: { $sum: '$score' },
          totalTimeSpentSeconds: { $sum: '$timeSpentSeconds' },
          bestScore: { $max: '$score' },
          uniqueActivities: { $addToSet: '$activityId' },
        },
      },
    ]);

    // Aggregate breakdown per activity
    const activityBreakdown = await Progress.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$activityId',
          attempts: { $sum: 1 },
          bestScore: { $max: '$score' },
          totalScore: { $sum: '$score' },
          totalQuestions: { $sum: '$total' },
          avgAccuracy: { $avg: '$accuracy' },
          lastAttemptAt: { $max: '$createdAt' },
        },
      },
      {
        $project: {
          _id: 0,
          activityId: '$_id',
          attempts: 1,
          bestScore: 1,
          averageAccuracy: { $round: ['$avgAccuracy', 2] },
          lastAttemptAt: 1,
        },
      },
      { $sort: { lastAttemptAt: -1 } },
    ]);

    const stats = statsAggregation[0] || {
      totalAttempts: 0,
      totalActivitiesCompleted: 0,
      totalQuestions: 0,
      totalCorrect: 0,
      totalTimeSpentSeconds: 0,
      bestScore: 0,
      uniqueActivities: [],
    };

    const overallAccuracy =
      stats.totalQuestions > 0
        ? Math.round(((stats.totalCorrect / stats.totalQuestions) * 100) * 100) / 100
        : 0;

    const averageScore =
      stats.totalAttempts > 0
        ? Math.round(((stats.totalCorrect / stats.totalAttempts)) * 100) / 100
        : 0;

    res.status(200).json({
      success: true,
      data: {
        totalActivitiesCompleted: stats.totalActivitiesCompleted,
        totalAttempts: stats.totalAttempts,
        totalQuestions: stats.totalQuestions,
        totalCorrect: stats.totalCorrect,
        overallAccuracy,
        totalTimeSpentSeconds: stats.totalTimeSpentSeconds,
        averageScore,
        bestScore: stats.bestScore,
        activityCount: stats.uniqueActivities.length,
        activityBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get comprehensive learning insights dashboard data for authenticated user
 * @route   GET /api/progress/insights
 * @access  Private (Authenticated users only)
 */
exports.getLearningInsights = async (req, res, next) => {
  try {
    const learningInsightsService = require('../services/learningInsights.service');
    const userId = req.user._id;

    const insights = await learningInsightsService.getLearningInsights(userId);

    res.status(200).json({
      success: true,
      data: insights,
    });
  } catch (error) {
    next(error);
  }
};

