# HindiPlay Learning Insights & Analytics Architecture

## 1. Overview & Objective

The **Teacher/Parent Learning Insights Dashboard** provides a clear, actionable, and privacy-first analytical overview of a student's learning progress in HindiPlay.

It utilizes the learner's existing progress records, gamification metrics, and deterministic adaptive-learning data without introducing third-party analytics trackers, heavy graphing libraries, or complex machine learning models.

---

## 2. Key Insights Features

1. **Learning Overview**: High-level metrics for completed activities, overall accuracy, total practice time, active/longest streaks, XP, stars, and earned badges.
2. **Recent Performance Trend Chart**: A lightweight, dependency-free CSS/SVG visual chart depicting accuracy trends across the last 10 practice sessions.
3. **Strengths & Weakness Analysis**: Domain-level classification of mastered skills versus areas needing reinforcement with minimum data thresholds.
4. **Activity Breakdown**: Detailed attempts, completion counts, best scores, recent scores, and average accuracy for each played activity.
5. **Targeted Recommendations ("अभी किस पर ध्यान दें?")**: Integrated actionables directly driven by the deterministic adaptive-learning engine.

---

## 3. Data Sources & Aggregation Formulas

### Overview Metrics
$$\text{Overall Accuracy} = \frac{\sum \text{score}}{\sum \text{total}} \times 100$$
$$\text{Total Practice Time} = \sum \text{timeSpentSeconds}$$
$$\text{Completed Activities} = \sum [\text{completed} = \text{true}]$$

### Domain & Skill Grouping
Activities map to 6 Hindi learning domains:
- `letters`: अक्षर ज्ञान (Letter Quiz, Tracing, etc.)
- `matras`: मात्राएँ (Matra Lab, Word Builder)
- `words`: शब्द निर्माण (Word Builder, Memory Match, Sentence Builder)
- `pictures`: चित्र मिलान (Picture Match, Picture-Word Quiz, Word-Picture Quiz)
- `reading`: कहानी व वाचन (Reading Comprehension, Reading Practice)
- `writing`: हस्तलेखन (Character Tracing)

$$\text{Domain Accuracy}_d = \frac{\sum_{r \in d} \text{score}_r}{\sum_{r \in d} \text{total}_r} \times 100$$

---

## 4. Deterministic Thresholds

To prevent false signals or claiming a student is weak based on a single attempt, the system enforces a confidence threshold:

| Category | Attempt Threshold | Accuracy Threshold | Pedagogical Status |
| :--- | :--- | :--- | :--- |
| **मज़बूत क्षेत्र (Strengths)** | $\ge 2$ attempts | $\text{Accuracy} \ge 80\%$ | Mastered domain |
| **अभ्यास की ज़रूरत (Weaknesses)** | $\ge 2$ attempts | $\text{Accuracy} < 70\%$ | Focus area for reinforcement |
| **कम अभ्यास (Emerging)** | $< 2$ attempts | Any | Needs additional sessions to establish trend |

---

## 5. API Reference

### `GET /api/progress/insights`
- **Access**: Private (Authenticated learners only via Bearer JWT)
- **Controller**: `progressController.getLearningInsights`
- **Response Schema**:
```json
{
  "success": true,
  "data": {
    "hasData": true,
    "overview": {
      "totalActivitiesCompleted": 8,
      "totalAttempts": 12,
      "totalQuestions": 120,
      "totalCorrect": 108,
      "overallAccuracy": 90.0,
      "totalTimeSpentSeconds": 540,
      "currentStreak": 3,
      "longestStreak": 5,
      "totalXp": 350,
      "totalStars": 24,
      "badgesEarnedCount": 3
    },
    "activityPerformance": [
      {
        "activityId": "word-builder",
        "skillName": "शब्द निर्माण",
        "domain": "words",
        "attempts": 4,
        "completedCount": 4,
        "bestScore": 10,
        "mostRecentScore": 10,
        "mostRecentTotal": 10,
        "mostRecentAccuracy": 100,
        "averageAccuracy": 95.0,
        "lastAttemptAt": "2026-09-14T10:00:00.000Z",
        "status": "strong"
      }
    ],
    "strengths": [
      {
        "domain": "words",
        "nameHindi": "शब्द निर्माण",
        "accuracy": 95.0,
        "attempts": 4,
        "statusTextHindi": "मज़बूत पकड़ (Mastered)"
      }
    ],
    "weaknesses": [],
    "needsMoreData": [],
    "recentProgressTrend": [
      {
        "sessionIndex": 1,
        "activityId": "word-builder",
        "skillName": "शब्द निर्माण",
        "score": 10,
        "total": 10,
        "accuracy": 100,
        "completed": true,
        "timeSpentSeconds": 45,
        "timestamp": "2026-09-14T10:00:00.000Z"
      }
    ],
    "focusRecommendations": { ... }
  }
}
```

---

## 6. Privacy & Security Guarantees

- **Strict User Scoping**: All database queries strictly filter by `req.user._id`.
- **No Sensitive Leakage**: Passwords, tokens, internal IDs, and other learners' records are never exposed.
- **Guest Protection**: Unauthenticated requests are rejected or presented with an informative login invitation screen.

---

## 7. Automated Verification

The automated test suite (`npm run test:insights`) tests 10 validation scenarios:
1. **Test A**: New learner with zero progress (safe empty states, zero NaN/errors).
2. **Test B**: Learner with 1 completed activity (confidence threshold check).
3. **Test C**: Learner with multiple activities across domains.
4. **Test D**: Learner with repeated attempts on same activity.
5. **Test E**: Learner with weak activity ($<70\%$ accuracy, $\ge 2$ attempts).
6. **Test F**: Learner with strong activity ($\ge 80\%$ accuracy, $\ge 2$ attempts).
7. **Test G**: Learner with gamification & streak data.
8. **Test H**: Multi-user data isolation.
9. **Test I**: Guest access validation.
10. **Test J**: Integrated adaptive recommendations.
