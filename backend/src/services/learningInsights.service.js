const Progress = require('../models/progress.model');
const Gamification = require('../models/gamification.model');
const { getPersonalizedRecommendations, ACTIVITY_DOMAIN_MAP, DOMAIN_NAMES_HINDI } = require('./adaptiveLearning.service');

const MIN_ATTEMPTS_FOR_CONFIDENCE = 2;
const STRONG_THRESHOLD_PERCENT = 80;
const WEAK_THRESHOLD_PERCENT = 70;

/**
 * Generate comprehensive learning insights for an authenticated user.
 *
 * @param {string|mongoose.Types.ObjectId} userId
 * @returns {Promise<Object>} Learning insights summary
 */
async function getLearningInsights(userId) {
  if (!userId) {
    throw new Error('User ID is required for learning insights');
  }

  // 1. Fetch user's progress records and gamification profile in parallel
  const [records, gamification, adaptiveRec] = await Promise.all([
    Progress.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean(),
    Gamification.findOne({ user: userId }).lean(),
    getPersonalizedRecommendations(userId),
  ]);

  // Handle new learner empty state gracefully
  if (!records || records.length === 0) {
    return {
      hasData: false,
      overview: {
        totalActivitiesCompleted: 0,
        totalAttempts: 0,
        totalQuestions: 0,
        totalCorrect: 0,
        overallAccuracy: 0,
        totalTimeSpentSeconds: 0,
        currentStreak: gamification?.currentStreak || 0,
        longestStreak: gamification?.longestStreak || 0,
        totalXp: gamification?.totalXp || 0,
        totalStars: gamification?.totalStars || 0,
        badgesEarnedCount: gamification?.badges?.length || 0,
      },
      activityPerformance: [],
      strengths: [],
      weaknesses: [],
      needsMoreData: [],
      recentProgressTrend: [],
      focusRecommendations: adaptiveRec,
      emptyStateMessageHindi: 'अभी कोई अभ्यास पूरा नहीं हुआ है। पहला अभ्यास शुरू करें!',
    };
  }

  // 2. Aggregate overall metrics
  let totalScore = 0;
  let totalQuestions = 0;
  let totalTimeSpentSeconds = 0;
  let totalActivitiesCompleted = 0;

  // Group by activityId for activity-level performance
  const activityMap = new Map();
  // Group by domain for domain-level mastery
  const domainMap = new Map();

  for (const record of records) {
    totalScore += record.score || 0;
    totalQuestions += record.total || 0;
    totalTimeSpentSeconds += record.timeSpentSeconds || 0;
    if (record.completed) {
      totalActivitiesCompleted += 1;
    }

    // Activity aggregation
    const actId = record.activityId;
    if (!activityMap.has(actId)) {
      activityMap.set(actId, {
        activityId: actId,
        attempts: 0,
        completedCount: 0,
        totalScore: 0,
        totalQuestions: 0,
        bestScore: 0,
        mostRecentScore: record.score || 0,
        mostRecentTotal: record.total || 0,
        mostRecentAccuracy: record.accuracy || 0,
        lastAttemptAt: record.createdAt,
        domain: ACTIVITY_DOMAIN_MAP[actId]?.domain || 'words',
        skillName: ACTIVITY_DOMAIN_MAP[actId]?.skillName || actId,
      });
    }

    const actData = activityMap.get(actId);
    actData.attempts += 1;
    actData.totalScore += record.score || 0;
    actData.totalQuestions += record.total || 0;
    if (record.completed) actData.completedCount += 1;
    if (record.score > actData.bestScore) actData.bestScore = record.score;

    // Domain aggregation
    const domainKey = ACTIVITY_DOMAIN_MAP[actId]?.domain || 'words';
    if (!domainMap.has(domainKey)) {
      domainMap.set(domainKey, {
        domain: domainKey,
        nameHindi: DOMAIN_NAMES_HINDI[domainKey] || domainKey,
        attempts: 0,
        totalScore: 0,
        totalQuestions: 0,
      });
    }

    const dData = domainMap.get(domainKey);
    dData.attempts += 1;
    dData.totalScore += record.score || 0;
    dData.totalQuestions += record.total || 0;
  }

  const overallAccuracy =
    totalQuestions > 0 ? Math.round(((totalScore / totalQuestions) * 100) * 10) / 10 : 0;

  // 3. Format activity performance list
  const activityPerformance = Array.from(activityMap.values()).map((act) => {
    const avgAcc =
      act.totalQuestions > 0
        ? Math.round(((act.totalScore / act.totalQuestions) * 100) * 10) / 10
        : 0;
    return {
      activityId: act.activityId,
      skillName: act.skillName,
      domain: act.domain,
      attempts: act.attempts,
      completedCount: act.completedCount,
      bestScore: act.bestScore,
      mostRecentScore: act.mostRecentScore,
      mostRecentTotal: act.mostRecentTotal,
      mostRecentAccuracy: act.mostRecentAccuracy,
      averageAccuracy: avgAcc,
      lastAttemptAt: act.lastAttemptAt,
      status:
        avgAcc >= STRONG_THRESHOLD_PERCENT && act.attempts >= MIN_ATTEMPTS_FOR_CONFIDENCE
          ? 'strong'
          : avgAcc < WEAK_THRESHOLD_PERCENT && act.attempts >= MIN_ATTEMPTS_FOR_CONFIDENCE
          ? 'needs-practice'
          : 'in-progress',
    };
  });

  // Sort activity performance by most recent attempt first
  activityPerformance.sort(
    (a, b) => new Date(b.lastAttemptAt).getTime() - new Date(a.lastAttemptAt).getTime()
  );

  // 4. Identify Strengths, Weaknesses, and Emerging Areas
  const strengths = [];
  const weaknesses = [];
  const needsMoreData = [];

  for (const domain of domainMap.values()) {
    const acc =
      domain.totalQuestions > 0
        ? Math.round(((domain.totalScore / domain.totalQuestions) * 100) * 10) / 10
        : 0;

    const domainItem = {
      domain: domain.domain,
      nameHindi: domain.nameHindi,
      accuracy: acc,
      attempts: domain.attempts,
    };

    if (domain.attempts < MIN_ATTEMPTS_FOR_CONFIDENCE) {
      needsMoreData.push({
        ...domainItem,
        statusTextHindi: 'और अभ्यास की आवश्यकता',
      });
    } else if (acc >= STRONG_THRESHOLD_PERCENT) {
      strengths.push({
        ...domainItem,
        statusTextHindi: 'मज़बूत पकड़ (Mastered)',
      });
    } else if (acc < WEAK_THRESHOLD_PERCENT) {
      weaknesses.push({
        ...domainItem,
        statusTextHindi: 'अभ्यास की ज़रूरत (Needs Practice)',
      });
    }
  }

  // Sort strengths highest first, weaknesses lowest first
  strengths.sort((a, b) => b.accuracy - a.accuracy);
  weaknesses.sort((a, b) => a.accuracy - b.accuracy);

  // 5. Recent Progress Trend (Last 10 attempts chronologically ordered for visual charting)
  const recentProgressTrend = records.slice(0, 10).reverse().map((rec, index) => {
    const actMeta = ACTIVITY_DOMAIN_MAP[rec.activityId];
    return {
      sessionIndex: index + 1,
      activityId: rec.activityId,
      skillName: actMeta?.skillName || rec.activityId,
      score: rec.score,
      total: rec.total,
      accuracy: rec.accuracy,
      completed: rec.completed,
      timeSpentSeconds: rec.timeSpentSeconds || 0,
      timestamp: rec.createdAt,
    };
  });

  return {
    hasData: true,
    overview: {
      totalActivitiesCompleted,
      totalAttempts: records.length,
      totalQuestions,
      totalCorrect: totalScore,
      overallAccuracy,
      totalTimeSpentSeconds,
      currentStreak: gamification?.currentStreak || 0,
      longestStreak: gamification?.longestStreak || 0,
      totalXp: gamification?.totalXp || 0,
      totalStars: gamification?.totalStars || 0,
      badgesEarnedCount: gamification?.badges?.length || 0,
    },
    activityPerformance,
    strengths,
    weaknesses,
    needsMoreData,
    recentProgressTrend,
    focusRecommendations: adaptiveRec,
  };
}

module.exports = {
  getLearningInsights,
  MIN_ATTEMPTS_FOR_CONFIDENCE,
  STRONG_THRESHOLD_PERCENT,
  WEAK_THRESHOLD_PERCENT,
};
