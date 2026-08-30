# 🎨 हिंदी अक्षर पहचानो (Hindi Interactive Learning Toy)

A playful, interactive Hindi vowel recognition activity inspired by the "learn by doing" philosophy of **Toy Theater**. Designed specifically for young Hindi learners (ages 5–8).

---

## 🌟 Features

- **Activity: "अक्षर पहचानो" (Letter Recognition)**:
  - Covers all 10 primary Devanagari vowels: **अ, आ, इ, ई, उ, ऊ, ए, ऐ, ओ, औ**
  - Audio prompt button with speech synthesis & acoustic tone fallbacks
  - 3 large, colorful, tactile 3D-styled letter cards per question
  - Gentle, non-punishing feedback loop for mistakes ("फिर से कोशिश करो 😊")
  - Celebratory audio chimes, star rewards, and confetti upon completion
  - Progress tracking (10 questions per round, score counter, streak tracker)
- **Accessibility & Child-Friendly Controls**:
  - Full keyboard support: `[1]`, `[2]`, `[3]` for selecting cards, `[Space]` / `[R]` for audio, `[Enter]` for next question / replay
  - Touch-optimized large buttons for tablets and mobile devices
  - Clean Devanagari typography using **Baloo 2** and **Noto Sans Devanagari**
- **Modular & Extensible Architecture**:
  - Independent audio layer (`audioService`) allowing zero-friction drop-in of prerecorded audio files
  - Isolated question generation & data models in `src/data/` and `src/types/`
  - Fully decoupled UI components in `src/components/`

---

## 📁 Project Structure

```
hindi/
├── index.html                   # HTML entry point with Baloo 2 font imports
├── package.json                 # Project dependencies & scripts
├── tailwind.config.js           # Child-friendly color palette & 3D shadows
├── tsconfig.json                # TypeScript strict configuration
├── vite.config.ts               # Vite bundler configuration
└── src/
    ├── main.tsx                 # React DOM mount point
    ├── App.tsx                  # Root component
    ├── index.css                # Base Tailwind styles & custom scrollbars
    ├── types/
    │   └── activity.ts          # Type definitions for letter, question, stats, feedback
    ├── data/
    │   └── vowels.ts            # Question bank & round generator for 10 Hindi vowels
    ├── services/
    │   └── audioService.ts      # SpeechSynthesis (hi-IN) + Web Audio API synthesizer
    ├── hooks/
    │   └── useLetterQuiz.ts     # Activity game loop, attempts, streak, and scoring
    └── components/
        ├── Header.tsx           # Title, sound mute toggle, and star score
        ├── ProgressBar.tsx      # 10-step progress dots with golden star indicators
        ├── AudioButton.tsx      # Prominent pulsing speaker prompt button
        ├── AnswerCard.tsx       # Big tactile 3D Devanagari letter card
        ├── FeedbackBanner.tsx   # Encouraging visual feedback messages
        ├── RoundSummary.tsx     # Celebratory end-of-round score modal + confetti
        └── LetterQuizActivity.tsx # Main activity container coordinating components
```

---

## 🚀 Running the Project Locally

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Steps

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open the application**:
   Open your browser and navigate to `http://localhost:3000` (or the URL shown in your terminal).

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

---

## 🎹 Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `1` | Select 1st Option |
| `2` | Select 2nd Option |
| `3` | Select 3rd Option |
| `Space` or `R` | Play / Replay Letter Sound |
| `Enter` | Proceed to Next Question / Play Again |

---

## 🔮 Next Steps for Platform Expansion

1. **Consonants Activity ("व्यंजन पहचानो")**: Expand the question bank to include Devanagari consonants (क to ज्ञ) with progressive difficulty tiers.
2. **Prerecorded Studio Audio**: Drop high-definition native speaker audio recordings into `src/data/` utilizing the existing `playLetterAudio` interface.
3. **Letter Tracing ("अक्षर लिखो")**: Interactive canvas activity allowing children to trace letters with visual stroke guides.
4. **Word Matching ("चित्र और शब्द")**: Matching vowel sounds with illustrated objects (e.g., अ ➔ अनार, आ ➔ आम).
5. **Activity Selection Hub**: A colorful toy-box menu allowing young learners to choose between different mini-games.
