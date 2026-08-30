# 🎨 हिंदी सीखो (Hindi Interactive Learning Toys)

A collection of playful, interactive Hindi learning activities inspired by the "learn by doing" philosophy of **Toy Theater**. Designed specifically for young Hindi learners (ages 5–8) with an explicit pedagogical Hindi learning unit model.

---

## 🎮 Activities Included

### 1. **"अक्षर पहचानो" (Letter Recognition)**
- **Goal**: Identify Hindi characters by sound and select the matching Devanagari character from 3 choices.
- **Coverage**: All 13 **स्वर (Vowels)** and 33 **व्यंजन (Consonants)** with dynamic category filters.
- **Feedback**: Multi-attempt retry loop with gentle cues and cheerful chimes.

### 2. **"अक्षर और चित्र मिलाओ" (Letter → Picture/Word Match)**
- **Goal**: Connect target characters with meaningful, illustrated Hindi vocabulary words (e.g. `आ ➔ आम 🥭`, `क ➔ कमल 🪷`, `म ➔ मछली 🐟`).
- **Coverage**: 42 illustrated word cards with spoken associations (*"आ से आम"*).

### 3. **"शब्द बनाओ और खोजो" (Word Building & Discovery)**
- **Goal**: Understand how base consonants and vowel signs (मात्राएँ) combine into explicit learning units to form words (`म + ा ➔ मा`, `मा + ला ➔ माला`).
- **Modes**:
  - **Mode 1: Guided Word Building (`🎯 शब्द बनाओ`)**: The child sees a target picture/clue (e.g. 🥭 `आम` or 📿 `माला`) and taps scrambled unit cards in order to construct the word.
  - **Mode 2: Word Discovery (`🔍 शब्द खोजो — क्या बनेगा?`)**: The child freely combines units from a tray (`[ क ] + [ म ]` ➔ `कम`) to discover recognized words and unlock their meaning and audio.

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
    ├── App.tsx                  # Root component with 3-activity switcher
    ├── index.css                # Base Tailwind styles & custom scrollbars
    ├── types/
    │   ├── activity.ts          # Core character models: HindiCharacter, CharacterCategory, CategoryFilter
    │   ├── pictureMatch.ts      # Models for PictureWordItem, PictureMatchQuestion
    │   └── wordBuilder.ts       # Models for HindiUnit, WordBuilderWord, WordBuilderState
    ├── data/
    │   ├── vowels.ts            # Vowel dataset (13 Devanagari vowels)
    │   ├── consonants.ts        # Consonant dataset (33 Devanagari consonants)
    │   ├── hindiCharacters.ts   # Master character collection & character round generator
    │   ├── pictureWords.ts      # Master picture-word dataset (स्वर + व्यंजन)
    │   └── wordBuilder.ts       # Explicit WordBuilder dictionary (Simple + Matra words)
    ├── services/
    │   └── audioService.ts      # SpeechSynthesis (hi-IN) + Web Audio API synthesizer
    ├── hooks/
    │   ├── useLetterQuiz.ts     # Activity 1 state & game loop
    │   ├── usePictureMatch.ts   # Activity 2 state & game loop
    │   └── useWordBuilder.ts    # Activity 3 state & game loop (Guided + Discovery)
    └── components/
        ├── ActivityNav.tsx          # Minimal top navigation bar between all 3 activities
        ├── Header.tsx               # Title, category filter pills, score & sound toggle
        ├── ProgressBar.tsx          # 10-step progress dots with golden star indicators
        ├── AudioButton.tsx          # Prominent pulsing speaker prompt button
        ├── AnswerCard.tsx           # Big tactile 3D character card (Activity 1)
        ├── ImageWordCard.tsx        # Big tactile 3D picture/word card (Activity 2)
        ├── LearningUnitCard.tsx     # Big tactile 3D unit card with matra decomposition (Activity 3)
        ├── WordConstructionArea.tsx # Slot construction tray with tap-to-undo (Activity 3)
        ├── WordResultCard.tsx       # Solved word reveal card with emoji & audio (Activity 3)
        ├── FeedbackBanner.tsx       # Encouraging visual feedback messages
        ├── RoundSummary.tsx         # Celebratory end-of-round score modal + confetti
        ├── LetterQuizActivity.tsx   # Activity 1 view
        ├── PictureMatchActivity.tsx # Activity 2 view
        └── WordBuilderActivity.tsx  # Activity 3 view
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
| `1`, `2`, `3` | Select 1st, 2nd, or 3rd option / available unit |
| `Space` or `R` | Play / Replay Sound |
| `Enter` | Proceed to Next Question / Check Discovery Word / Play Again |
