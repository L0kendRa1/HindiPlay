const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const Progress = require('../models/progress.model');
const Gamification = require('../models/gamification.model');
const learningInsightsService = require('../services/learningInsights.service');

async function runTests() {
  console.log('🧪 Starting Task 10 Learning Insights Automated Test Suite...\n');

  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('❌ Error: MONGO_URI missing in environment');
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log('✅ Connected to MongoDB Atlas for testing.\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  const createdUserIds = [];

  try {
    // -------------------------------------------------------------
    // Test A: New learner with zero progress
    // -------------------------------------------------------------
    console.log('--- TEST A: New learner with zero progress ---');
    const newUserId = new mongoose.Types.ObjectId();
    createdUserIds.push(newUserId);
    const newInsights = await learningInsightsService.getLearningInsights(newUserId);
    assert(newInsights.hasData === false, 'hasData is false for new learner');
    assert(newInsights.overview.totalAttempts === 0, 'totalAttempts is 0');
    assert(newInsights.overview.overallAccuracy === 0, 'overallAccuracy is 0');
    assert(newInsights.activityPerformance.length === 0, 'activityPerformance is empty array');
    assert(typeof newInsights.emptyStateMessageHindi === 'string', 'has friendly Hindi empty state message');

    // -------------------------------------------------------------
    // Test B: Learner with one completed activity
    // -------------------------------------------------------------
    console.log('\n--- TEST B: Learner with one completed activity ---');
    const singleUserId = new mongoose.Types.ObjectId();
    createdUserIds.push(singleUserId);
    await Progress.create({
      user: singleUserId,
      activityId: 'letter-quiz',
      score: 8,
      total: 10,
      accuracy: 80,
      attempts: 1,
      completed: true,
      timeSpentSeconds: 45,
      subject: 'hindi',
    });
    const singleInsights = await learningInsightsService.getLearningInsights(singleUserId);
    assert(singleInsights.hasData === true, 'hasData is true');
    assert(singleInsights.overview.totalActivitiesCompleted === 1, '1 activity completed');
    assert(singleInsights.overview.totalAttempts === 1, '1 attempt recorded');
    assert(singleInsights.overview.overallAccuracy === 80, 'accuracy is 80%');
    assert(singleInsights.activityPerformance.length === 1, 'activityPerformance has 1 item');
    assert(singleInsights.needsMoreData.length > 0, 'Single attempt placed in needsMoreData (confidence threshold)');

    // -------------------------------------------------------------
    // Test C: Learner with multiple activities
    // -------------------------------------------------------------
    console.log('\n--- TEST C: Learner with multiple activities ---');
    const multiUserId = new mongoose.Types.ObjectId();
    createdUserIds.push(multiUserId);
    await Progress.create([
      { user: multiUserId, activityId: 'letter-quiz', score: 9, total: 10, accuracy: 90, attempts: 1, completed: true, subject: 'hindi' },
      { user: multiUserId, activityId: 'picture-match', score: 10, total: 10, accuracy: 100, attempts: 1, completed: true, subject: 'hindi' },
      { user: multiUserId, activityId: 'word-builder', score: 8, total: 10, accuracy: 80, attempts: 1, completed: true, subject: 'hindi' },
    ]);
    const multiInsights = await learningInsightsService.getLearningInsights(multiUserId);
    assert(multiInsights.overview.totalAttempts === 3, '3 total attempts across activities');
    assert(multiInsights.activityPerformance.length === 3, '3 activities present in performance breakdown');

    // -------------------------------------------------------------
    // Test D: Learner with repeated attempts on same activity
    // -------------------------------------------------------------
    console.log('\n--- TEST D: Learner with repeated attempts ---');
    const repeatUserId = new mongoose.Types.ObjectId();
    createdUserIds.push(repeatUserId);
    const tNow = Date.now();
    await Progress.create([
      { user: repeatUserId, activityId: 'word-builder', score: 5, total: 10, accuracy: 50, attempts: 1, completed: false, subject: 'hindi', createdAt: new Date(tNow - 2000) },
      { user: repeatUserId, activityId: 'word-builder', score: 7, total: 10, accuracy: 70, attempts: 1, completed: true, subject: 'hindi', createdAt: new Date(tNow - 1000) },
      { user: repeatUserId, activityId: 'word-builder', score: 10, total: 10, accuracy: 100, attempts: 1, completed: true, subject: 'hindi', createdAt: new Date(tNow) },
    ]);
    const repeatInsights = await learningInsightsService.getLearningInsights(repeatUserId);
    const wbPerf = repeatInsights.activityPerformance.find(a => a.activityId === 'word-builder');
    assert(wbPerf && wbPerf.attempts === 3, 'word-builder aggregated 3 attempts');
    assert(wbPerf.completedCount === 2, 'word-builder aggregated 2 completions');
    assert(wbPerf.bestScore === 10, 'bestScore is 10');
    assert(wbPerf.mostRecentScore === 10, 'mostRecentScore is latest (10)');

    // -------------------------------------------------------------
    // Test E: Learner with weak activity (needs reinforcement)
    // -------------------------------------------------------------
    console.log('\n--- TEST E: Learner with weak activity (>=2 attempts, <70% accuracy) ---');
    const weakUserId = new mongoose.Types.ObjectId();
    createdUserIds.push(weakUserId);
    await Progress.create([
      { user: weakUserId, activityId: 'matra-lab', score: 3, total: 10, accuracy: 30, attempts: 1, completed: true, subject: 'hindi' },
      { user: weakUserId, activityId: 'matra-lab', score: 4, total: 10, accuracy: 40, attempts: 1, completed: true, subject: 'hindi' },
    ]);
    const weakInsights = await learningInsightsService.getLearningInsights(weakUserId);
    assert(weakInsights.weaknesses.some(w => w.domain === 'matras'), 'Matras domain correctly identified in weaknesses');

    // -------------------------------------------------------------
    // Test F: Learner with strong activity (>=2 attempts, >=80% accuracy)
    // -------------------------------------------------------------
    console.log('\n--- TEST F: Learner with strong activity (>=2 attempts, >=80% accuracy) ---');
    const strongUserId = new mongoose.Types.ObjectId();
    createdUserIds.push(strongUserId);
    await Progress.create([
      { user: strongUserId, activityId: 'letter-quiz', score: 10, total: 10, accuracy: 100, attempts: 1, completed: true, subject: 'hindi' },
      { user: strongUserId, activityId: 'letter-quiz', score: 9, total: 10, accuracy: 90, attempts: 1, completed: true, subject: 'hindi' },
    ]);
    const strongInsights = await learningInsightsService.getLearningInsights(strongUserId);
    assert(strongInsights.strengths.some(s => s.domain === 'letters'), 'Letters domain correctly identified in strengths');

    // -------------------------------------------------------------
    // Test G: Learner with streak/gamification data
    // -------------------------------------------------------------
    console.log('\n--- TEST G: Learner with streak and gamification data ---');
    const gamifyUserId = new mongoose.Types.ObjectId();
    createdUserIds.push(gamifyUserId);
    await Gamification.create({
      user: gamifyUserId,
      totalXp: 450,
      totalStars: 28,
      currentStreak: 5,
      longestStreak: 7,
      badges: [{ id: 'streak_3', name: '3-दिन की लय', earnedAt: new Date() }],
    });
    await Progress.create({
      user: gamifyUserId,
      activityId: 'tracing',
      score: 10,
      total: 10,
      accuracy: 100,
      attempts: 1,
      completed: true,
      subject: 'hindi',
    });
    const gamifyInsights = await learningInsightsService.getLearningInsights(gamifyUserId);
    assert(gamifyInsights.overview.totalXp === 450, 'totalXp matches gamification document (450)');
    assert(gamifyInsights.overview.totalStars === 28, 'totalStars matches (28)');
    assert(gamifyInsights.overview.currentStreak === 5, 'currentStreak is 5');
    assert(gamifyInsights.overview.longestStreak === 7, 'longestStreak is 7');
    assert(gamifyInsights.overview.badgesEarnedCount === 1, 'badgesEarnedCount is 1');

    // -------------------------------------------------------------
    // Test H: Data isolation between two users
    // -------------------------------------------------------------
    console.log('\n--- TEST H: Data isolation between two users ---');
    const user1 = new mongoose.Types.ObjectId();
    const user2 = new mongoose.Types.ObjectId();
    createdUserIds.push(user1, user2);

    await Progress.create([
      { user: user1, activityId: 'sentence-builder', score: 10, total: 10, accuracy: 100, attempts: 1, completed: true, subject: 'hindi' },
      { user: user1, activityId: 'sentence-builder', score: 10, total: 10, accuracy: 100, attempts: 1, completed: true, subject: 'hindi' },
      { user: user2, activityId: 'picture-match', score: 4, total: 10, accuracy: 40, attempts: 1, completed: true, subject: 'hindi' },
    ]);

    const ins1 = await learningInsightsService.getLearningInsights(user1);
    const ins2 = await learningInsightsService.getLearningInsights(user2);

    assert(ins1.overview.totalAttempts === 2, 'User 1 only sees their 2 attempts');
    assert(ins1.overview.overallAccuracy === 100, 'User 1 accuracy is 100%');
    assert(ins2.overview.totalAttempts === 1, 'User 2 only sees their 1 attempt');
    assert(ins2.overview.overallAccuracy === 40, 'User 2 accuracy is 40%');

    // -------------------------------------------------------------
    // Test I: Guest / Missing user ID validation
    // -------------------------------------------------------------
    console.log('\n--- TEST I: Guest / Missing user ID validation ---');
    let guestThrew = false;
    try {
      await learningInsightsService.getLearningInsights(null);
    } catch (e) {
      guestThrew = true;
    }
    assert(guestThrew, 'getLearningInsights correctly throws when userId is missing');

    // -------------------------------------------------------------
    // Test J: Existing personalized recommendations integration
    // -------------------------------------------------------------
    console.log('\n--- TEST J: Personalized recommendations integration ---');
    assert(multiInsights.focusRecommendations !== undefined, 'focusRecommendations payload is attached');
    assert(Array.isArray(multiInsights.focusRecommendations.recommendedActivities), 'recommendedActivities list is present');
    assert(typeof multiInsights.focusRecommendations.messageHindi === 'string', 'messageHindi is present in focusRecommendations');

    // Clean up test data
    console.log('\n🧹 Cleaning up test documents...');
    await Progress.deleteMany({ user: { $in: createdUserIds } });
    await Gamification.deleteMany({ user: { $in: createdUserIds } });
    console.log('✅ Test documents cleaned.');

  } catch (err) {
    console.error('❌ Exception during test suite:', err);
    failed++;
  } finally {
    await mongoose.disconnect();
    console.log('\n=============================================');
    console.log(`Insights Test Results: ${passed} Passed, ${failed} Failed`);
    console.log('=============================================\n');
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
