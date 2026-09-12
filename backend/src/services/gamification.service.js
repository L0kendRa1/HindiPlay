const Gamification = require('../models/gamification.model');
const Progress = require('../models/progress.model');
const BADGE_DEFINITIONS = require('../data/badges');

/**
 * Calculate XP earned based on completion and accuracy.
 * Rules:
 * - Incomplete activity: 0 XP
 * - Completed activity: +10 base XP
 * - 90–100% accuracy: +10 bonus XP (total: 20 XP)
 * - 75–89% accuracy: +5 bonus XP (total: 15 XP)
 * - Below 75% accuracy: +0 bonus XP (total: 10 XP)
 */
function calculateXp(completed, accuracy) {
  if (!completed) return 0;

  const base = 10;
  let bonus = 0;

  if (accuracy >= 90) {
    bonus = 10;
  } else if (accuracy >= 75) {
    bonus = 5;
  }

  return base + bonus;
}

/**
 * Calculate Stars earned based on completion and accuracy.
 * Rules:
 * - Incomplete activity: 0 stars
 * - 90–100% accuracy: 3 stars (⭐⭐⭐)
 * - 70–89% accuracy: 2 stars (⭐⭐)
 * - 50–69% accuracy: 1 star (⭐)
 * - Below 50% accuracy: 0 stars
 */
function calculateStars(completed, accuracy) {
  if (!completed) return 0;

  if (accuracy >= 90) {
    return 3;
  } else if (accuracy >= 70) {
    return 2;
  } else if (accuracy >= 50) {
    return 1;
  }

  return 0;
}

/**
 * Calculate Daily Streak progression based on UTC calendar dates.
 * Rules:
 * - Activity on the same calendar day: Streak remains unchanged (does not increment multiple times per day).
 * - Activity on the consecutive day (dayDiff = 1): Streak increases by 1.
 * - Activity after missed day(s) (dayDiff > 1): Streak resets to 1.
 * - First activity: Streak starts at 1.
 * - Longest streak is preserved and never decreases.
 */
function calculateStreak(currentStreak, longestStreak, lastActivityDate, activityDate) {
  const toUtcDateString = (d) => {
    const dateObj = new Date(d);
    return dateObj.toISOString().split('T')[0];
  };

  const currDateStr = toUtcDateString(activityDate || new Date());

  if (!lastActivityDate) {
    const newStreak = 1;
    return {
      currentStreak: newStreak,
      longestStreak: Math.max(longestStreak || 0, newStreak),
    };
  }

  const lastDateStr = toUtcDateString(lastActivityDate);

  if (currDateStr === lastDateStr) {
    // Completed on the same calendar day — streak remains identical
    return {
      currentStreak: currentStreak || 1,
      longestStreak: Math.max(longestStreak || 0, currentStreak || 1),
    };
  }

  const msPerDay = 1000 * 60 * 60 * 24;
  const lastMs = new Date(lastDateStr).getTime();
  const currMs = new Date(currDateStr).getTime();
  const dayDiff = Math.round((currMs - lastMs) / msPerDay);

  let newStreak = 1;
  if (dayDiff === 1) {
    // Consecutive day
    newStreak = (currentStreak || 0) + 1;
  } else if (dayDiff < 0) {
    // Historical/out of order, preserve current
    newStreak = currentStreak || 1;
  } else {
    // Missed one or more days, reset to 1
    newStreak = 1;
  }

  const newLongest = Math.max(longestStreak || 0, newStreak);

  return {
    currentStreak: newStreak,
    longestStreak: newLongest,
  };
}

/**
 * Evaluate all badge definitions for the user and award any newly qualified badges.
 */
function evaluateBadges(gamification, ctx) {
  const existingBadgeIds = new Set(gamification.badges.map((b) => b.id));
  const newlyEarned = [];

  for (const def of BADGE_DEFINITIONS) {
    if (!existingBadgeIds.has(def.id)) {
      try {
        if (def.evaluate(ctx)) {
          const badgeRecord = {
            id: def.id,
            name: def.name,
            earnedAt: new Date(),
            metadata: {
              description: def.description,
              icon: def.icon,
            },
          };
          gamification.badges.push(badgeRecord);
          existingBadgeIds.add(def.id);
          newlyEarned.push({
            id: def.id,
            name: def.name,
            description: def.description,
            icon: def.icon,
            earnedAt: badgeRecord.earnedAt,
          });
        }
      } catch (err) {
        console.warn(`Badge evaluation notice for [${def.id}]:`, err.message);
      }
    }
  }

  return newlyEarned;
}

/**
 * Process gamification rewards for a progress record.
 * Uses atomic progress claiming to prevent duplicate rewards.
 */
async function processGamificationForProgress(progressDoc) {
  if (!progressDoc || !progressDoc._id) {
    return {
      xpEarned: 0,
      starsEarned: 0,
      currentStreak: 0,
      longestStreak: 0,
      newBadges: [],
    };
  }

  // Idempotency: Atomically claim gamification processing
  const claimedProgress = await Progress.findOneAndUpdate(
    { _id: progressDoc._id, gamificationProcessed: false },
    { gamificationProcessed: true },
    { new: true }
  );

  // If already processed, return 0 rewards without duplicate awarding
  if (!claimedProgress) {
    const existingProfile = await Gamification.findOne({ user: progressDoc.user });
    return {
      xpEarned: 0,
      starsEarned: 0,
      currentStreak: existingProfile ? existingProfile.currentStreak : 0,
      longestStreak: existingProfile ? existingProfile.longestStreak : 0,
      newBadges: [],
      alreadyProcessed: true,
    };
  }

  // Find or create Gamification profile
  let gamification = await Gamification.findOne({ user: progressDoc.user });
  if (!gamification) {
    gamification = new Gamification({
      user: progressDoc.user,
      totalXp: 0,
      totalStars: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      badges: [],
    });
  }

  let xpEarned = 0;
  let starsEarned = 0;

  if (progressDoc.completed) {
    xpEarned = calculateXp(true, progressDoc.accuracy);
    starsEarned = calculateStars(true, progressDoc.accuracy);

    const streakResult = calculateStreak(
      gamification.currentStreak,
      gamification.longestStreak,
      gamification.lastActivityDate,
      progressDoc.createdAt || new Date()
    );

    gamification.totalXp += xpEarned;
    gamification.totalStars += starsEarned;
    gamification.currentStreak = streakResult.currentStreak;
    gamification.longestStreak = streakResult.longestStreak;
    gamification.lastActivityDate = progressDoc.createdAt || new Date();
  }

  // Count total completed activities for badge evaluation
  const completedCount = await Progress.countDocuments({
    user: progressDoc.user,
    completed: true,
  });

  const badgeContext = {
    totalXp: gamification.totalXp,
    totalStars: gamification.totalStars,
    currentStreak: gamification.currentStreak,
    longestStreak: gamification.longestStreak,
    completedCount,
    currentAccuracy: progressDoc.accuracy,
    isCompleted: progressDoc.completed,
  };

  const newBadges = evaluateBadges(gamification, badgeContext);

  await gamification.save();

  return {
    xpEarned,
    starsEarned,
    currentStreak: gamification.currentStreak,
    longestStreak: gamification.longestStreak,
    newBadges,
  };
}

module.exports = {
  calculateXp,
  calculateStars,
  calculateStreak,
  processGamificationForProgress,
};
