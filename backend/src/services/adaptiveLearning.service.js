const Progress = require('../models/progress.model');
const { selectWords } = require('./contentSelection.service');

// Activity domain classification & metadata
const ACTIVITY_DOMAIN_MAP = {
  'letter-quiz': { domain: 'letters', skillName: 'अक्षर पहचान', defaultDifficulty: 'easy' },
  'picture-match': { domain: 'pictures', skillName: 'चित्र मिलान', defaultDifficulty: 'easy' },
  'word-builder': { domain: 'words', skillName: 'शब्द निर्माण', defaultDifficulty: 'medium' },
  'matra-lab': { domain: 'matras', skillName: 'मात्रा अभ्यास', defaultDifficulty: 'medium' },
  'tracing': { domain: 'writing', skillName: 'अक्षर लेखन', defaultDifficulty: 'easy' },
  'picture-word-quiz': { domain: 'pictures', skillName: 'चित्र-शब्द पठन', defaultDifficulty: 'easy' },
  'word-picture-quiz': { domain: 'pictures', skillName: 'शब्द-चित्र पहचान', defaultDifficulty: 'medium' },
  'memory-match': { domain: 'words', skillName: 'स्मृति खेल', defaultDifficulty: 'medium' },
  'sentence-builder': { domain: 'words', skillName: 'वाक्य निर्माण', defaultDifficulty: 'hard' },
  'reading-comprehension': { domain: 'reading', skillName: 'कहानी पठन व समझ', defaultDifficulty: 'hard' },
  'reading-practice': { domain: 'reading', skillName: 'उच्चारण व वाचन', defaultDifficulty: 'medium' },
};

const DOMAIN_NAMES_HINDI = {
  letters: 'अक्षर ज्ञान',
  matras: 'मात्राएँ',
  words: 'शब्द निर्माण',
  pictures: 'चित्र मिलान',
  reading: 'कहानी व वाचन',
  writing: 'हस्तलेखन',
};

const DOMAIN_ACTIVITY_PRIORITIES = {
  letters: ['letter-quiz', 'tracing', 'picture-match'],
  matras: ['matra-lab', 'word-builder', 'word-picture-quiz'],
  words: ['word-builder', 'sentence-builder', 'memory-match'],
  pictures: ['picture-word-quiz', 'word-picture-quiz', 'picture-match'],
  reading: ['reading-comprehension', 'reading-practice', 'sentence-builder'],
  writing: ['tracing', 'letter-quiz', 'word-builder'],
};

/**
 * Generate default starter recommendations for guest users.
 */
async function getGuestRecommendations() {
  const starterWords = await selectWords({ difficulty: 'easy', count: 5 });

  return {
    learnerLevel: 'guest',
    recommendedDifficulty: 'easy',
    overallAccuracy: 0,
    totalAttempts: 0,
    reason: 'guest-starter-pack',
    messageHindi: 'HindiPlay में आपका स्वागत है! खेल-खेल में हिंदी सीखें।',
    messageEnglish: 'Welcome to HindiPlay! Start learning Hindi through fun activities.',
    recommendedActivities: [
      { activityCode: 'letter-quiz', title: 'अक्षर पहचानो', domain: 'letters', reason: 'starter', highlightTextHindi: 'शुरुआती अभ्यास' },
      { activityCode: 'picture-match', title: 'अक्षर और चित्र मिलाओ', domain: 'pictures', reason: 'starter', highlightTextHindi: 'शुरुआती अभ्यास' },
      { activityCode: 'word-builder', title: 'शब्द बनाओ और खोजो', domain: 'words', reason: 'starter', highlightTextHindi: 'शुरुआती अभ्यास' },
    ],
    weakAreas: [],
    strongAreas: [],
    recommendedWords: starterWords,
  };
}

/**
 * Generate starter recommendations for new authenticated learners with 0 attempts.
 */
async function getNewLearnerRecommendations() {
  const starterWords = await selectWords({ difficulty: 'easy', count: 5 });

  return {
    learnerLevel: 'beginner',
    recommendedDifficulty: 'easy',
    overallAccuracy: 0,
    totalAttempts: 0,
    reason: 'new-learner-welcome',
    messageHindi: 'स्वागत है! अक्षरों और चित्रों से अपनी सीखने की यात्रा शुरू करें।',
    messageEnglish: 'Welcome! Begin your learning journey with letters and pictures.',
    recommendedActivities: [
      { activityCode: 'letter-quiz', title: 'अक्षर पहचानो', domain: 'letters', reason: 'foundational', highlightTextHindi: 'बुनियादी अभ्यास' },
      { activityCode: 'picture-match', title: 'अक्षर और चित्र मिलाओ', domain: 'pictures', reason: 'foundational', highlightTextHindi: 'बुनियादी अभ्यास' },
      { activityCode: 'tracing', title: 'अक्षर लिखो', domain: 'writing', reason: 'foundational', highlightTextHindi: 'बुनियादी अभ्यास' },
    ],
    weakAreas: [],
    strongAreas: [],
    recommendedWords: starterWords,
  };
}

/**
 * Evaluate an authenticated learner's progress history and generate deterministic recommendations.
 *
 * @param {string|mongoose.Types.ObjectId} userId
 * @returns {Promise<Object>} Personalized recommendation profile
 */
async function getPersonalizedRecommendations(userId) {
  if (!userId) {
    return getGuestRecommendations();
  }

  // 1. Fetch user's recent progress records (up to 50 most recent attempts)
  const records = await Progress.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  if (!records || records.length === 0) {
    return getNewLearnerRecommendations();
  }

  const totalAttempts = records.length;
  let totalScore = 0;
  let totalQuestions = 0;

  // Aggregate stats per domain
  const domainStats = {
    letters: { domain: 'letters', attempts: 0, score: 0, total: 0 },
    matras: { domain: 'matras', attempts: 0, score: 0, total: 0 },
    words: { domain: 'words', attempts: 0, score: 0, total: 0 },
    pictures: { domain: 'pictures', attempts: 0, score: 0, total: 0 },
    reading: { domain: 'reading', attempts: 0, score: 0, total: 0 },
    writing: { domain: 'writing', attempts: 0, score: 0, total: 0 },
  };

  // Recent 10 attempts for current performance momentum
  const recentRecords = records.slice(0, 10);
  let recentScore = 0;
  let recentQuestions = 0;

  for (const record of records) {
    totalScore += record.score || 0;
    totalQuestions += record.total || 0;

    const activityMeta = ACTIVITY_DOMAIN_MAP[record.activityId];
    const domainKey = activityMeta ? activityMeta.domain : 'words';

    if (domainStats[domainKey]) {
      domainStats[domainKey].attempts += 1;
      domainStats[domainKey].score += record.score || 0;
      domainStats[domainKey].total += record.total || 0;
    }
  }

  for (const record of recentRecords) {
    recentScore += record.score || 0;
    recentQuestions += record.total || 0;
  }

  const overallAccuracy =
    totalQuestions > 0 ? Math.round(((totalScore / totalQuestions) * 100) * 10) / 10 : 0;
  const recentAccuracy =
    recentQuestions > 0 ? Math.round(((recentScore / recentQuestions) * 100) * 10) / 10 : overallAccuracy;

  // 2. Identify weak and strong domain areas
  const weakAreas = [];
  const strongAreas = [];

  for (const [domainKey, stats] of Object.entries(domainStats)) {
    if (stats.attempts > 0 && stats.total > 0) {
      const accuracy = Math.round(((stats.score / stats.total) * 100) * 10) / 10;
      const domainInfo = {
        domain: domainKey,
        nameHindi: DOMAIN_NAMES_HINDI[domainKey] || domainKey,
        accuracy,
        attempts: stats.attempts,
      };

      if (accuracy < 70) {
        weakAreas.push(domainInfo);
      } else if (accuracy >= 85 && stats.attempts >= 2) {
        strongAreas.push(domainInfo);
      }
    }
  }

  // Sort weak areas lowest accuracy first
  weakAreas.sort((a, b) => a.accuracy - b.accuracy);
  // Sort strong areas highest accuracy first
  strongAreas.sort((a, b) => b.accuracy - a.accuracy);

  // 3. Determine recommended difficulty & learner level
  let learnerLevel = 'intermediate';
  let recommendedDifficulty = 'medium';
  let reason = 'continue-current-level';
  let messageHindi = 'बहुत बढ़िया! अपनी गति बनाए रखें और नए शब्दों का अभ्यास करें।';
  let messageEnglish = 'Great progress! Keep up your momentum and practice new vocabulary.';

  if (recentAccuracy >= 85 && totalAttempts >= 3) {
    learnerLevel = 'advanced';
    recommendedDifficulty = 'hard';
    reason = 'challenge-learner';
    messageHindi = 'शानदार प्रदर्शन! अब नई चुनौतियों और कठिन शब्दों का अभ्यास करें।';
    messageEnglish = 'Outstanding performance! Challenge yourself with advanced words and stories.';
  } else if (recentAccuracy < 60 || weakAreas.length >= 2) {
    learnerLevel = 'beginner';
    recommendedDifficulty = 'easy';
    reason = 'reinforce-weak-area';
    messageHindi = 'बुनियादी अक्षरों और सरल शब्दों के अभ्यास से अपनी पकड़ मजबूत करें।';
    messageEnglish = 'Strengthen your foundation with basic letters and simple words.';
  }

  // 4. Select recommended activities
  const chosenActivityCodes = new Set();
  const recommendedActivities = [];

  // Prioritize activities for the weakest domain if present
  if (weakAreas.length > 0) {
    const primaryWeakDomain = weakAreas[0].domain;
    const candidates = DOMAIN_ACTIVITY_PRIORITIES[primaryWeakDomain] || [];
    for (const code of candidates) {
      if (!chosenActivityCodes.has(code) && recommendedActivities.length < 3) {
        chosenActivityCodes.add(code);
        const meta = ACTIVITY_DOMAIN_MAP[code];
        recommendedActivities.push({
          activityCode: code,
          title: meta ? meta.skillName : code,
          domain: primaryWeakDomain,
          reason: 'reinforce-weak-area',
          highlightTextHindi: (DOMAIN_NAMES_HINDI[primaryWeakDomain] || primaryWeakDomain) + ' में सुधार के लिए',
        });
      }
    }
  }

  // Fill remaining recommendation slots based on overall difficulty / level
  const generalPool =
    recommendedDifficulty === 'hard'
      ? ['sentence-builder', 'reading-comprehension', 'reading-practice', 'memory-match']
      : recommendedDifficulty === 'medium'
      ? ['word-builder', 'matra-lab', 'word-picture-quiz', 'picture-word-quiz']
      : ['letter-quiz', 'picture-match', 'tracing', 'picture-word-quiz'];

  for (const code of generalPool) {
    if (!chosenActivityCodes.has(code) && recommendedActivities.length < 3) {
      chosenActivityCodes.add(code);
      const meta = ACTIVITY_DOMAIN_MAP[code];
      recommendedActivities.push({
        activityCode: code,
        title: meta ? meta.skillName : code,
        domain: meta ? meta.domain : 'words',
        reason: reason,
        highlightTextHindi:
          reason === 'challenge-learner'
            ? 'चुनौतीपूर्ण अभ्यास'
            : reason === 'reinforce-weak-area'
            ? 'सरल अभ्यास'
            : 'सुझाया गया अभ्यास',
      });
    }
  }

  // 5. Select recommended words tailored to learner difficulty
  const recommendedWords = await selectWords({
    difficulty: recommendedDifficulty,
    count: 5,
  });

  return {
    learnerLevel,
    recommendedDifficulty,
    overallAccuracy,
    recentAccuracy,
    totalAttempts,
    reason,
    messageHindi,
    messageEnglish,
    recommendedActivities,
    weakAreas,
    strongAreas,
    recommendedWords,
  };
}

module.exports = {
  getPersonalizedRecommendations,
  getGuestRecommendations,
  getNewLearnerRecommendations,
  ACTIVITY_DOMAIN_MAP,
  DOMAIN_NAMES_HINDI,
};
