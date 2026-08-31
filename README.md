# 🎨 हिंदी सीखो (Hindi Interactive Learning Toys)

A collection of playful, interactive Hindi learning activities inspired by the "learn by doing" philosophy of **Toy Theater**. Designed specifically for young Hindi learners (ages 5–8) with an explicit pedagogical Hindi learning unit and stroke tracing model.

---

## 🎮 Activities Included

### 1. **"अक्षर पहचानो" (Letter Recognition)**
- **Goal**: Identify Hindi characters by sound and select the matching Devanagari character from 3 choices.
- **Coverage**: All 13 **स्वर (Vowels)** and 33 **व्यंजन (Consonants)** with dynamic category filters.
- **Feedback**: Multi-attempt retry loop with gentle cues and cheerful chimes.

### 2. **"अक्षर और चित्र मिलाओ" (Letter → Picture/Word Match)**
- **Goal**: Connect target characters with meaningful, illustrated Hindi vocabulary words (e.g. `आ ➔ आम 🥭`, `क ➔ कमल 🪷`, `म ➔ मछली 🐟`).
- **Coverage**: 42 illustrated word cards with spoken associations (*"आ से आम"*).

### 3. **"शब्द बनाओ और खोजो" (Word Building & Discovery with Difficulty Selection)**
- **Goal**: Understand how base consonants and vowel signs (मात्राएँ) combine into explicit learning units to form words (`म + ा ➔ मा`, `मा + ला ➔ माला`).
- **Difficulty Selection**: User-selected word length (`2 अक्षर ⭐`, `3 अक्षर ⭐⭐`, `4 अक्षर ⭐⭐⭐`) based on explicit `unitCount` (not naive `word.length`).
- **Modes**:
  - **Mode 1: Guided Word Building (`🎯 शब्द बनाओ`)**: The child sees a target picture/clue and taps scrambled unit cards in order to construct the word.
  - **Mode 2: Word Discovery (`🔍 शब्द खोजो — क्या बनेगा?`)**: The child freely combines units from a tray (`[ क ] + [ म ]` ➔ `कम`) to discover recognized words.

### 4. **"अक्षर लिखो" (Guided Character Tracing)**
- **Goal**: Teach children how to correctly form Hindi characters through guided stroke-by-stroke tracing.
- **Stroke Architecture**: Normalized Devanagari stroke coordinate geometry (`[0, 1]`) with start badges (①, ②, ③) and directional guides.
- **Input**: Unified Pointer Events (`pointerdown`, `pointermove`, `pointerup`, `pointercancel`) supporting touch, stylus, and mouse.
- **Evaluation**: Forgiving path distance & anchor evaluation designed for 5–8 year olds.

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
    ├── main.tsx                 # React mount point
    ├── App.tsx                  # Root component with 4-activity switcher
    ├── index.css                # Base Tailwind styles & custom scrollbars
    ├── types/
    │   ├── activity.ts          # Core character models: HindiCharacter, CategoryFilter
    │   ├── pictureMatch.ts      # Models for PictureWordItem, PictureMatchQuestion
    │   ├── wordBuilder.ts       # Models for HindiUnit, WordBuilderWord, WordLengthOption
    │   └── tracing.ts           # Models for Point2D, StrokeData, CharacterTracingData
    ├── data/
    │   ├── vowels.ts            # Vowel dataset (13 Devanagari vowels)
    │   ├── consonants.ts        # Consonant dataset (33 Devanagari consonants)
    │   ├── hindiCharacters.ts   # Master character collection & round generator
    │   ├── pictureWords.ts      # Master picture-word dataset (42 items)
    │   ├── wordBuilder.ts       # WordBuilder dictionary (2, 3, 4-unit words)
    │   └── characterStrokes.ts  # Normalized stroke dataset for representative characters
    ├── services/
    │   ├── audioService.ts      # SpeechSynthesis (hi-IN) + Web Audio API synthesizer
    │   └── strokeEvaluation.ts  # Resampling, Euclidean metrics, and forgiving evaluator
    ├── hooks/
    │   ├── useLetterQuiz.ts     # Activity 1 state & game loop
    │   ├── usePictureMatch.ts   # Activity 2 state & game loop
    │   ├── useWordBuilder.ts    # Activity 3 state & game loop
    │   └── useCharacterTracing.ts # Activity 4 state & tracing progression
    └── components/
        ├── ActivityNav.tsx          # Minimal top navigation bar across all 4 activities
        ├── Header.tsx               # Title, score, streak, and sound toggle
        ├── ProgressBar.tsx          # 10-step progress dots with golden star indicators
        ├── AudioButton.tsx          # Prominent speaker prompt button
        ├── AnswerCard.tsx           # 3D character card (Activity 1)
        ├── ImageWordCard.tsx        # 3D picture/word card (Activity 2)
        ├── LearningUnitCard.tsx     # 3D unit card with matra decomposition (Activity 3)
        ├── WordConstructionArea.tsx # Construction tray with tap-to-undo (Activity 3)
        ├── WordResultCard.tsx       # Revealed word card with emoji & audio (Activity 3)
        ├── WordLengthSelector.tsx   # Difficulty selector for word length (Activity 3)
        ├── TracingCanvas.tsx        # Responsive SVG drawing surface & guides (Activity 4)
        ├── StrokeGuideBar.tsx       # Stroke step indicator (①, ②, ③) (Activity 4)
        ├── FeedbackBanner.tsx       # Encouraging visual feedback messages
        ├── RoundSummary.tsx         # Celebratory end-of-round score modal + confetti
        ├── LetterQuizActivity.tsx   # Activity 1 view
        ├── PictureMatchActivity.tsx # Activity 2 view
        ├── WordBuilderActivity.tsx  # Activity 3 view
        └── CharacterTracingActivity.tsx # Activity 4 view
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
   Open `http://localhost:3000` in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🎹 Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `1`, `2`, `3`, `4` | Select options / difficulties / jump to characters |
| `Space` or `R` | Play / Replay Audio Pronunciation |
| `C` | Clear Current Drawing Attempt (Activity 4) |
| `Enter` | Proceed to Next Question / Character |
