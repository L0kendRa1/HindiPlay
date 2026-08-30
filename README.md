# 🎨 हिंदी सीखो (Hindi Interactive Learning Toys)

A collection of playful, interactive Hindi learning activities inspired by the "learn by doing" philosophy of **Toy Theater**. Designed specifically for young Hindi learners (ages 5–8).

---

## 🎮 Activities Included

### 1. **"अक्षर पहचानो" (Letter Recognition)**
- **Learning Goal**: Help students identify Hindi characters by sound and select the correct Devanagari character among 3 choices.
- **Scope**: Supports **स्वर (Vowels)** and **व्यंजन (Consonants)** with dynamic category filters.
- **Feedback**: Multi-attempt retry loop with gentle cues and cheerful chimes.

### 2. **"अक्षर और चित्र मिलाओ" (Letter → Picture/Word Match)**
- **Learning Goal**: Connect target characters and sounds with meaningful, illustrated Hindi vocabulary words (e.g. `आ ➔ आम 🥭`, `क ➔ कमल 🪷`, `म ➔ मछली 🐟`).
- **Scope**: Covers vowels and consonants with illustrated picture/word cards.
- **Audio Association**: Automatically speaks character-to-word associations (e.g., *"आ से आम"*).

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
    ├── App.tsx                  # Root component with activity switcher
    ├── index.css                # Base Tailwind styles & custom scrollbars
    ├── types/
    │   ├── activity.ts          # Core character models: HindiCharacter, CharacterCategory, CategoryFilter
    │   └── pictureMatch.ts      # Models for PictureWordItem, PictureMatchQuestion
    ├── data/
    │   ├── vowels.ts            # Vowel dataset (13 Devanagari vowels)
    │   ├── consonants.ts        # Consonant dataset (33 Devanagari consonants)
    │   ├── hindiCharacters.ts   # Master character collection & character round generator
    │   └── pictureWords.ts      # Master picture-word dataset (स्वर + व्यंजन) & generator
    ├── services/
    │   └── audioService.ts      # SpeechSynthesis (hi-IN) + Web Audio API synthesizer
    ├── hooks/
    │   ├── useLetterQuiz.ts     # Activity 1 state & game loop
    │   └── usePictureMatch.ts   # Activity 2 state & game loop
    └── components/
        ├── ActivityNav.tsx      # Minimal top navigation bar between activities
        ├── Header.tsx           # Title, category filter pills, score & sound toggle
        ├── ProgressBar.tsx      # 10-step progress dots with golden star indicators
        ├── AudioButton.tsx      # Prominent pulsing speaker prompt button
        ├── AnswerCard.tsx       # Big tactile 3D character card (Activity 1)
        ├── ImageWordCard.tsx    # Big tactile 3D picture/word card (Activity 2)
        ├── FeedbackBanner.tsx   # Encouraging visual feedback messages
        ├── RoundSummary.tsx     # Celebratory end-of-round score modal + confetti
        ├── LetterQuizActivity.tsx # Activity 1 view
        └── PictureMatchActivity.tsx # Activity 2 view
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
| `1` | Select 1st Option |
| `2` | Select 2nd Option |
| `3` | Select 3rd Option |
| `Space` or `R` | Play / Replay Sound |
| `Enter` | Proceed to Next Question / Play Again |
