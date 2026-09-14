# HindiPlay Adaptive Learning & Personalized Practice Architecture

## 1. Overview & Pedagogical Objective

The HindiPlay Adaptive Learning engine provides a clean, deterministic, rule-based recommendation system for Hindi learners. It analyzes learner performance across 11 Devanagari activities and guides students toward tailored practice units without requiring complex machine learning frameworks or external AI dependencies.

Key Goals:
- **Appropriate Challenge**: Automatically adjust difficulty (`easy`, `medium`, `hard`) based on recent accuracy.
- **Weak Area Remediation**: Detect specific Hindi skill gaps (e.g., Matras, Letter Tracing, Reading Comprehension) and suggest focused remediation.
- **Zero Friction**: Guest mode remains completely open with zero mandatory login; authenticated learners enjoy persistent personalization.
- **Data Isolation**: All learner data is strictly scoped to the authenticated user's ID (`req.user._id`).

---

## 2. Activity Domain Classification

Each of the 11 HindiPlay activities maps to a core Devanagari learning domain:

| Activity Code | Activity Title | Domain Key | Hindi Domain Name | Default Difficulty |
| :--- | :--- | :--- | :--- | :--- |
| `letter-quiz` | अक्षर पहचानो | `letters` | अक्षर ज्ञान (Letters) | `easy` |
| `picture-match` | अक्षर और चित्र मिलाओ | `pictures` | चित्र मिलान (Pictures) | `easy` |
| `word-builder` | शब्द बनाओ और खोजो | `words` | शब्द निर्माण (Words) | `medium` |
| `matra-lab` | मात्रा प्रयोगशाला | `matras` | मात्राएँ (Matras) | `medium` |
| `tracing` | अक्षर लिखो | `writing` | हस्तलेखन (Tracing) | `easy` |
| `picture-word-quiz` | चित्र देखकर शब्द पहचानो | `pictures` | चित्र-शब्द पठन | `easy` |
| `word-picture-quiz` | शब्द देखकर चित्र चुनो | `pictures` | शब्द-चित्र पहचान | `medium` |
| `memory-match` | याद करो और मिलाओ | `words` | स्मृति खेल | `medium` |
| `sentence-builder` | वाक्य बनाओ | `words` | वाक्य निर्माण | `hard` |
| `reading-comprehension` | कहानी पढ़ो और समझो | `reading` | कहानी पठन व समझ | `hard` |
| `reading-practice` | पढ़कर सुनाओ | `reading` | उच्चारण व वाचन | `medium` |

---

## 3. Performance Profiling & Metrics

The system aggregates the learner's recent history (up to 50 attempts, emphasizing the 10 most recent attempts):

$$\text{Overall Accuracy} = \frac{\sum \text{score}}{\sum \text{total}} \times 100$$

$$\text{Recent Accuracy} = \frac{\sum_{i=1}^{10} \text{score}_i}{\sum_{i=1}^{10} \text{total}_i} \times 100$$

Per-domain accuracy is evaluated for each domain with $\ge 1$ attempt:

$$\text{Domain Accuracy}_d = \frac{\text{score}_d}{\text{total}_d} \times 100$$

---

## 4. Deterministic Difficulty & Persona Rules

| Learner Persona | Historical Criteria | Recommended Difficulty | Reason Code | Hindi Rationale Banner |
| :--- | :--- | :--- | :--- | :--- |
| **Advanced / Master** | Recent Accuracy $\ge 85\%$ and $\ge 3$ attempts | `hard` | `challenge-learner` | *शानदार प्रदर्शन! अब नई चुनौतियों और कठिन शब्दों का अभ्यास करें।* |
| **Intermediate / Proficient** | Recent Accuracy $60\% - 84\%$ | `medium` | `continue-current-level` | *बहुत बढ़िया! अपनी गति बनाए रखें और नए शब्दों का अभ्यास करें।* |
| **Beginner / Needs Support** | Recent Accuracy $< 60\%$ or $\ge 2$ weak areas | `easy` | `reinforce-weak-area` | *बुनियादी अक्षरों और सरल शब्दों के अभ्यास से अपनी पकड़ मजबूत करें।* |
| **New Learner (Cold Start)** | Authenticated user with 0 attempts | `easy` | `new-learner-welcome` | *स्वागत है! अक्षरों और चित्रों से अपनी सीखने की यात्रा शुरू करें।* |
| **Guest User** | Unauthenticated user | `easy` | `guest-starter-pack` | *HindiPlay में आपका स्वागत है! खेल-खेल में हिंदी सीखें।* |

---

## 5. Weak Area Detection & Targeted Remediation

- **Weak Area Trigger**: Any domain with $\text{Domain Accuracy} < 70\%$.
- **Remediation Strategy**:
  1. Rank weak areas by lowest accuracy first.
  2. Prioritize targeted remedial activities:
     - Matras weak $\rightarrow$ `matra-lab`, `word-builder`
     - Letters weak $\rightarrow$ `letter-quiz`, `tracing`
     - Reading weak $\rightarrow$ `reading-comprehension`, `reading-practice`
     - Pictures weak $\rightarrow$ `picture-word-quiz`, `word-picture-quiz`
  3. Display an encouraging contextual insight banner in the UI (e.g. *"मात्राएँ में सुधार के लिए"*).

---

## 6. API Reference

### `GET /api/content/hindi/personalized`
- **Access**: Public / Optional Authentication (attaches user if Bearer token present)
- **Response Format**:
```json
{
  "success": true,
  "data": {
    "learnerLevel": "advanced",
    "recommendedDifficulty": "hard",
    "overallAccuracy": 95.0,
    "recentAccuracy": 95.0,
    "totalAttempts": 8,
    "reason": "challenge-learner",
    "messageHindi": "शानदार प्रदर्शन! अब नई चुनौतियों और कठिन शब्दों का अभ्यास करें।",
    "messageEnglish": "Outstanding performance! Challenge yourself with advanced words and stories.",
    "recommendedActivities": [
      {
        "activityCode": "sentence-builder",
        "title": "वाक्य निर्माण",
        "domain": "words",
        "reason": "challenge-learner",
        "highlightTextHindi": "चुनौतीपूर्ण अभ्यास"
      }
    ],
    "weakAreas": [],
    "strongAreas": [
      {
        "domain": "words",
        "nameHindi": "शब्द निर्माण",
        "accuracy": 95.0,
        "attempts": 8
      }
    ],
    "recommendedWords": [...]
  }
}
```

---

## 7. Automated Test Verification

A dedicated automated test suite is located at `backend/src/scripts/testAdaptiveLearning.js`.
It validates:
1. Guest user fallback defaults
2. New authenticated user cold-start
3. High performer ($\ge 85\%$) difficulty escalation
4. Low performer ($< 60\%$) remediation adjustment
5. Specific weak area detection and activity prioritization
6. Multi-user data isolation
