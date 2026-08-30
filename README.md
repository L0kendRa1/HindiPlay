# 🎨 हिंदी अक्षर पहचानो (Hindi Character Recognition Toy)

A playful, interactive Hindi character recognition activity inspired by the "learn by doing" philosophy of **Toy Theater**. Designed specifically for young Hindi learners (ages 5–8) to master the complete Devanagari alphabet.

---

## 🌟 What's New in the Refactored Architecture

- **Unified Character Recognition Engine**:
  - Reusable, generic Hindi Character architecture replacing vowel-specific logic.
  - Supports **स्वर (13 Vowels: `अ` to `अः`)** and **व्यंजन (33 Consonants: `क` to `ह`)** across all 5 standard vargas, antahstha, and ushma consonants.
  - Extensible foundation ready for **मात्राएँ (Matras)** and **संयुक्त अक्षर (Conjuncts)** via typed categories without modifying the quiz engine.
- **Dynamic Category Filtering**:
  - Learners can switch seamlessly between **"सभी अक्षर" (All Characters)**, **"स्वर" (Vowels Only)**, and **"व्यंजन" (Consonants Only)**.
- **Intelligent Question Generation**:
  - Selects pedagogically sound distractor options from the matching category.
  - Guarantees zero duplicate options and randomized option positions.
- **Child-Friendly Audio Engine**:
  - Works seamlessly across vowels and consonants via `audioService.playLetterAudio(char)`.
  - Native `hi-IN` SpeechSynthesis + Web Audio acoustic fallback.
  - Cheerful musical chimes on correct answers and gentle retry cues on mistakes.
- **Keyboard & Touch Accessibility**:
  - Shortcuts: `[1]`, `[2]`, `[3]` for selecting cards, `[Space]` / `[R]` for audio replay, `[Enter]` for next question and replay.

---

## 📁 Project Structure

```
hindi/
├── index.html                   # HTML entry with Google Fonts ('Baloo 2' and 'Noto Sans Devanagari')
├── package.json                 # Project dependencies & scripts
├── tailwind.config.js           # Child-friendly color palette & 3D shadows
├── tsconfig.json                # TypeScript strict configuration
├── vite.config.ts               # Vite bundler configuration
└── src/
    ├── main.tsx                 # React DOM mount point
    ├── App.tsx                  # Root layout
    ├── index.css                # Base Tailwind styles & custom scrollbars
    ├── types/
    │   └── activity.ts          # Core generic models: HindiCharacter, CharacterCategory, CategoryFilter, Question, ActivityStats
    ├── data/
    │   ├── vowels.ts            # Complete Devanagari vowels dataset (13 characters)
    │   ├── consonants.ts        # Complete Devanagari consonants dataset (33 characters)
    │   └── hindiCharacters.ts   # Master collection, category query helpers, and intelligent round generator
    ├── services/
    │   └── audioService.ts      # SpeechSynthesis (hi-IN) + Web Audio API synthesizer
    ├── hooks/
    │   └── useLetterQuiz.ts     # Activity game loop, attempts, streak, and scoring
    └── components/
        ├── Header.tsx           # Title, category filter pills ("सभी अक्षर", "स्वर", "व्यंजन"), score & sound toggle
        ├── ProgressBar.tsx      # 10-step progress dots with golden star indicators
        ├── AudioButton.tsx      # Prominent pulsing speaker prompt button
        ├── AnswerCard.tsx       # Big tactile 3D Devanagari character card
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
   Open your browser and navigate to `http://localhost:3000`.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🎹 Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `1` | Select 1st Option |
| `2` | Select 2nd Option |
| `3` | Select 3rd Option |
| `Space` or `R` | Play / Replay Character Sound |
| `Enter` | Proceed to Next Question / Play Again |
