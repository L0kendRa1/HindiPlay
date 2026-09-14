const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/user.model');
const Progress = require('../models/progress.model');
const adaptiveLearningService = require('../services/adaptiveLearning.service');

async function runTests() {
  console.log('🧪 Starting Task 9C Adaptive Learning Automated Test Suite...\n');

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

  try {
    // -------------------------------------------------------------
    // Test 1: Guest User Recommendations
    // -------------------------------------------------------------
    console.log('--- TEST 1: Guest User Recommendation Fallback ---');
    const guestRec = await adaptiveLearningService.getPersonalizedRecommendations(null);
    assert(guestRec.learnerLevel === 'guest', 'Guest learnerLevel is "guest"');
    assert(guestRec.recommendedDifficulty === 'easy', 'Guest difficulty is "easy"');
    assert(guestRec.reason === 'guest-starter-pack', 'Guest reason is "guest-starter-pack"');
    assert(Array.isArray(guestRec.recommendedActivities) && guestRec.recommendedActivities.length > 0, 'Guest receives recommended activities');
    assert(Array.isArray(guestRec.recommendedWords) && guestRec.recommendedWords.length > 0, 'Guest receives recommended words');

    // -------------------------------------------------------------
    // Test 2: New Authenticated User (0 Attempts)
    // -------------------------------------------------------------
    console.log('\n--- TEST 2: New Authenticated User (0 Attempts) ---');
    const dummyNewUserId = new mongoose.Types.ObjectId();
    const newLearnerRec = await adaptiveLearningService.getPersonalizedRecommendations(dummyNewUserId);
    assert(newLearnerRec.learnerLevel === 'beginner', 'New learner level is "beginner"');
    assert(newLearnerRec.recommendedDifficulty === 'easy', 'New learner difficulty is "easy"');
    assert(newLearnerRec.reason === 'new-learner-welcome', 'New learner reason is "new-learner-welcome"');
    assert(newLearnerRec.totalAttempts === 0, 'New learner totalAttempts is 0');

    // -------------------------------------------------------------
    // Test 3: High Performer Persona
    // -------------------------------------------------------------
    console.log('\n--- TEST 3: High Performer Persona (>=85% Accuracy) ---');
    const highPerformerId = new mongoose.Types.ObjectId();
    // Insert 4 high-accuracy attempts
    await Progress.create([
      { user: highPerformerId, activityId: 'word-builder', score: 10, total: 10, accuracy: 100, attempts: 1, completed: true, subject: 'hindi' },
      { user: highPerformerId, activityId: 'picture-word-quiz', score: 9, total: 10, accuracy: 90, attempts: 1, completed: true, subject: 'hindi' },
      { user: highPerformerId, activityId: 'sentence-builder', score: 10, total: 10, accuracy: 100, attempts: 1, completed: true, subject: 'hindi' },
      { user: highPerformerId, activityId: 'reading-comprehension', score: 9, total: 10, accuracy: 90, attempts: 1, completed: true, subject: 'hindi' },
    ]);

    const highRec = await adaptiveLearningService.getPersonalizedRecommendations(highPerformerId);
    assert(highRec.learnerLevel === 'advanced', 'High performer level is "advanced"');
    assert(highRec.recommendedDifficulty === 'hard', 'High performer difficulty is "hard"');
    assert(highRec.reason === 'challenge-learner', 'High performer reason is "challenge-learner"');
    assert(highRec.overallAccuracy >= 90, 'High performer overallAccuracy is >= 90%');
    assert(highRec.strongAreas.length > 0, 'High performer has identified strong areas');

    // -------------------------------------------------------------
    // Test 4: Low Performer Persona
    // -------------------------------------------------------------
    console.log('\n--- TEST 4: Low Performer Persona (<60% Accuracy) ---');
    const lowPerformerId = new mongoose.Types.ObjectId();
    await Progress.create([
      { user: lowPerformerId, activityId: 'word-builder', score: 2, total: 10, accuracy: 20, attempts: 1, completed: true, subject: 'hindi' },
      { user: lowPerformerId, activityId: 'picture-word-quiz', score: 4, total: 10, accuracy: 40, attempts: 1, completed: true, subject: 'hindi' },
      { user: lowPerformerId, activityId: 'sentence-builder', score: 3, total: 10, accuracy: 30, attempts: 1, completed: true, subject: 'hindi' },
    ]);

    const lowRec = await adaptiveLearningService.getPersonalizedRecommendations(lowPerformerId);
    assert(lowRec.learnerLevel === 'beginner', 'Low performer level is "beginner"');
    assert(lowRec.recommendedDifficulty === 'easy', 'Low performer difficulty is "easy"');
    assert(lowRec.reason === 'reinforce-weak-area', 'Low performer reason is "reinforce-weak-area"');
    assert(lowRec.overallAccuracy < 60, 'Low performer overallAccuracy is < 60%');

    // -------------------------------------------------------------
    // Test 5: Specific Weak Area Detection (Matras)
    // -------------------------------------------------------------
    console.log('\n--- TEST 5: Specific Weak Area Detection (Matras) ---');
    const matraWeakUserId = new mongoose.Types.ObjectId();
    await Progress.create([
      { user: matraWeakUserId, activityId: 'letter-quiz', score: 10, total: 10, accuracy: 100, attempts: 1, completed: true, subject: 'hindi' },
      { user: matraWeakUserId, activityId: 'picture-match', score: 10, total: 10, accuracy: 100, attempts: 1, completed: true, subject: 'hindi' },
      { user: matraWeakUserId, activityId: 'matra-lab', score: 2, total: 10, accuracy: 20, attempts: 1, completed: true, subject: 'hindi' },
    ]);

    const weakRec = await adaptiveLearningService.getPersonalizedRecommendations(matraWeakUserId);
    assert(weakRec.weakAreas.some(w => w.domain === 'matras'), 'Weak area "matras" correctly identified');
    assert(weakRec.recommendedActivities.some(a => a.domain === 'matras' || a.activityCode === 'matra-lab'), 'Matra activity prioritized in recommendations');

    // -------------------------------------------------------------
    // Test 6: Data Isolation Between Users
    // -------------------------------------------------------------
    console.log('\n--- TEST 6: Strict Data Isolation Between Users ---');
    const userA = new mongoose.Types.ObjectId();
    const userB = new mongoose.Types.ObjectId();
    await Progress.create([
      { user: userA, activityId: 'sentence-builder', score: 10, total: 10, accuracy: 100, attempts: 1, completed: true, subject: 'hindi' },
      { user: userA, activityId: 'sentence-builder', score: 10, total: 10, accuracy: 100, attempts: 1, completed: true, subject: 'hindi' },
      { user: userA, activityId: 'sentence-builder', score: 10, total: 10, accuracy: 100, attempts: 1, completed: true, subject: 'hindi' },
      { user: userB, activityId: 'letter-quiz', score: 2, total: 10, accuracy: 20, attempts: 1, completed: true, subject: 'hindi' },
    ]);

    const recA = await adaptiveLearningService.getPersonalizedRecommendations(userA);
    const recB = await adaptiveLearningService.getPersonalizedRecommendations(userB);

    assert(recA.totalAttempts === 3, 'User A has strictly 3 attempts');
    assert(recA.overallAccuracy === 100, 'User A accuracy is 100%');
    assert(recB.totalAttempts === 1, 'User B has strictly 1 attempt');
    assert(recB.overallAccuracy === 20, 'User B accuracy is 20%');

    // Clean up test data
    console.log('\n🧹 Cleaning up test documents...');
    await Progress.deleteMany({
      user: { $in: [highPerformerId, lowPerformerId, matraWeakUserId, userA, userB] }
    });
    console.log('✅ Test documents cleaned.');

  } catch (err) {
    console.error('❌ Exception during test suite:', err);
    failed++;
  } finally {
    await mongoose.disconnect();
    console.log('\n=============================================');
    console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
    console.log('=============================================\n');
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
