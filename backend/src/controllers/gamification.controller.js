const Gamification = require('../models/gamification.model');
const BADGE_DEFINITIONS = require('../data/badges');

/**
 * @desc    Get gamification profile (XP, stars, streaks, badges) for logged-in user
 * @route   GET /api/gamification
 * @access  Private (Authenticated users only)
 */
exports.getGamification = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const gamification = await Gamification.findOne({ user: userId }).select('-__v');

    if (!gamification) {
      // Return clean zero-state for new users who haven't completed activities yet
      return res.status(200).json({
        success: true,
        data: {
          totalXp: 0,
          totalStars: 0,
          currentStreak: 0,
          longestStreak: 0,
          lastActivityDate: null,
          badges: [],
        },
      });
    }

    res.status(200).json({
      success: true,
      data: gamification,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's earned badges and badge catalog
 * @route   GET /api/gamification/badges
 * @access  Private (Authenticated users only)
 */
exports.getBadges = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const gamification = await Gamification.findOne({ user: userId });
    const earnedBadges = gamification ? gamification.badges : [];
    const earnedMap = new Map(earnedBadges.map((b) => [b.id, b.earnedAt]));

    const catalog = BADGE_DEFINITIONS.map((def) => ({
      id: def.id,
      name: def.name,
      description: def.description,
      icon: def.icon,
      isEarned: earnedMap.has(def.id),
      earnedAt: earnedMap.get(def.id) || null,
    }));

    res.status(200).json({
      success: true,
      data: {
        earnedCount: earnedBadges.length,
        totalBadges: BADGE_DEFINITIONS.length,
        badges: catalog,
      },
    });
  } catch (error) {
    next(error);
  }
};
