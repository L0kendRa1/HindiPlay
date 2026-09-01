# 🎨 HindiPlay (हिंदी बाल मंच) — Interactive Hindi Learning Platform

An educational Hindi learning activity library inspired by the "learn by doing" philosophy of **Toy Theater**, designed specifically for young Hindi learners (ages 5–8) with explicit pedagogical Devanagari learning units, stroke tracing, and dedicated vector image illustration assets.

---

## 🧭 User Flow & Navigation Architecture

HindiPlay uses a structured **Educational Activity Library** flow:

```
                    HindiPlay Home
                          ↓
              Activity Library Grid
         (Category Navigation & Search)
                          ↓
              Choose Activity Card
                          ↓
               Activity Preview Modal
         (Title, Objective, Difficulty)
                          ↓
                   [ शुरू करें ]
                          ↓
               Active Gameplay Screen
         (Task 1, 2, 3, 4, 5, 6, or 7)
                          ↓
             [ साफ़ करें ] [ गतिविधियाँ ]
```

---

## 🎮 Registered Activities (7 Total)

### 1. **"अक्षर पहचानो" (Letter Recognition)**
- **Categories**: `अक्षर (Letters)`
- **Goal**: Identify Hindi characters by sound and select the matching Devanagari character from 3 choices.
- **Coverage**: All 13 **स्वर (Vowels)** and 33 **व्यंजन (Consonants)** with dynamic category filters.

### 2. **"अक्षर और चित्र मिलाओ" (Letter → Picture/Word Match)**
- **Categories**: `अक्षर (Letters)`, `चित्र (Pictures)`
- **Goal**: Connect target characters with meaningful, illustrated Hindi vocabulary words (e.g. `आ ➔ आम 🥭`, `क ➔ कमल 🪷`, `म ➔ मछली 🐟`).
- **Coverage**: 42 illustrated word cards with spoken associations (*"आ से आम"*).

### 3. **"शब्द बनाओ और खोजो" (Word Building & Discovery with Difficulty Selection)**
- **Categories**: `शब्द (Words)`, `मात्राएँ (Matras)`
- **Goal**: Understand how base consonants and vowel signs (मात्राएँ) combine into explicit learning units to form words (`म + ा ➔ मा`, `मा + ला ➔ माला`).
- **Difficulty Selection**: User-selected word length (`2 अक्षर ⭐`, `3 अक्षर ⭐⭐`, `4 अक्षर ⭐⭐⭐`) based on explicit `unitCount`.

### 4. **"अक्षर लिखो" (Guided Character Tracing)**
- **Categories**: `अक्षर (Letters)`, `लिखना (Writing)`
- **Goal**: Teach children how to correctly form Hindi characters through guided stroke-by-stroke tracing.
- **Stroke Architecture**: Normalized Devanagari stroke coordinate geometry (`[0, 1]`) with start badges (①, ②, ③) and directional guides.

### 5. **"चित्र देखकर शब्द पहचानो" (Picture → Word Recognition)**
- **Categories**: `शब्द (Words)`, `चित्र (Pictures)`
- **Goal**: Connect a familiar illustrated object/image with the correct Hindi word from 3 options (e.g. 🥭 ➔ `[ आम ]`, `[ कमल ]`, `[ घर ]`).

### 6. **"मात्रा प्रयोगशाला" (Matra Lab — Interactive Discovery)**
- **Categories**: `अक्षर (Letters)`, `शब्द (Words)`, `मात्राएँ (Matras)`
- **Goal**: Interactive sandbox teaching how consonants and matras combine into new Devanagari learning units (`म + ा = मा`, `क + ि = कि`, `म + ु = मु`).
- **Features**: Direct consonant selection, 9 matras, live combination equation, intact audio, and exploration counter.

### 7. **"शब्द देखकर चित्र चुनो" (Word → Picture Recognition)**
- **Categories**: `शब्द (Words)`, `चित्र (Pictures)`
- **Goal**: Reverses Task 5 by presenting a prominent Hindi word prompt (e.g. `आम`, `कमल`, `माला`, `तरबूज`) with optional audio pronunciation, prompting the learner to recognize the word's visual meaning and select the matching illustrated picture card from 3 options.
- **Features**: 3D tactile vector image cards, keyboard shortcuts (`1`, `2`, `3`), forgiving multi-attempt retry loop, word reveal upon solving, and clean question resets.

---

## 📁 Project Structure

```
hindi/
├── index.html                   # HTML entry with Google Fonts ('Baloo 2' and 'Noto Sans Devanagari')
├── package.json                 # Project dependencies & scripts
├── public/
│   └── images/
│       └── words/               # 42 validated vector SVG vocabulary illustrations
├── src/
│   ├── App.tsx                  # Root state machine (Library -> Preview -> Gameplay)
│   ├── data/
│   │   ├── activityRegistry.ts  # Centralized Activity Registry (7 activities & 6 categories)
│   │   ├── vowels.ts            # Vowel dataset (13 Devanagari vowels)
│   │   ├── consonants.ts        # Consonant dataset (33 Devanagari consonants)
│   │   ├── hindiCharacters.ts   # Master character collection & round generator
│   │   ├── pictureWords.ts      # 42-item vocabulary dataset & validation engine
│   │   ├── wordBuilder.ts       # WordBuilder dictionary (2, 3, 4-unit words)
│   │   ├── characterStrokes.ts  # Normalized stroke dataset for representative characters
│   │   └── matras.ts            # 9 Devanagari matras & starter consonants
│   ├── services/
│   │   ├── audioService.ts      # SpeechSynthesis (hi-IN) + Web Audio API synthesizer
│   │   ├── strokeEvaluation.ts  # Resampling, Euclidean metrics, and forgiving evaluator
│   │   └── hindiUnitComposer.ts # Pure Devanagari consonant+matra composition engine
│   ├── hooks/
│   │   ├── useLetterQuiz.ts     # Activity 1 state & game loop
│   │   ├── usePictureMatch.ts   # Activity 2 state & game loop
│   │   ├── useWordBuilder.ts    # Activity 3 state & game loop
│   │   ├── useCharacterTracing.ts # Activity 4 state & tracing progression
│   │   ├── usePictureWordQuiz.ts # Activity 5 state & picture-to-word loop
│   │   ├── useMatraLab.ts       # Activity 6 state & discovery sandbox
│   │   └── useWordPictureQuiz.ts# Activity 7 state & word-to-picture loop
│   └── components/
│       ├── ActivityLibrary.tsx      # Activity Library Home with Categories & Search
│       ├── ActivityCard.tsx         # Large 3D Tactile Activity Card
│       ├── ActivityPreviewModal.tsx # Activity Preview Screen with "शुरू करें" CTA
│       ├── PictureImage.tsx         # Robust image renderer with fallback handling
│       ├── Header.tsx               # Title, score, streak, category filters, and home button
│       ├── ProgressBar.tsx          # 10-step progress dots with golden star indicators
│       ├── AudioButton.tsx          # Prominent speaker prompt button
│       ├── AnswerCard.tsx           # 3D character card (Activity 1)
│       ├── ImageWordCard.tsx        # 3D picture/word card (Activity 2)
│       ├── LearningUnitCard.tsx     # 3D unit card with matra decomposition (Activity 3)
│       ├── WordConstructionArea.tsx # Construction tray with tap-to-undo (Activity 3)
│       ├── WordResultCard.tsx       # Revealed word card with emoji & audio (Activity 3)
│       ├── WordLengthSelector.tsx   # Difficulty selector for word length (Activity 3)
│       ├── TracingCanvas.tsx        # Responsive SVG drawing surface & guides (Activity 4)
│       ├── StrokeGuideBar.tsx       # Stroke step indicator (①, ②, ③) (Activity 4)
│       ├── WordOptionCard.tsx       # 3D Devanagari word choice card (Activity 5)
│       ├── PicturePromptCard.tsx    # Illustrated picture prompt card with audio (Activity 5)
│       ├── WordPromptCard.tsx       # Large Devanagari word prompt card (Activity 7)
│       ├── PictureOptionCard.tsx    # 3D picture choice card with vector illustration (Activity 7)
│       ├── WordPictureQuizActivity.tsx # Task 7 Word-to-Picture Quiz Activity Container
│       ├── ConsonantSelector.tsx    # Tactile consonant buttons (Activity 6)
│       ├── MatraSelector.tsx        # 2-row grid of matra buttons with vowel badges (Activity 6)
│       ├── MatraResultCard.tsx      # Live Devanagari syllable display & equation (Activity 6)
│       ├── MatraLabActivity.tsx     # Task 6 Matra Lab Activity Container
│       ├── FeedbackBanner.tsx       # Encouraging visual feedback messages
│       └── RoundSummary.tsx         # Celebratory end-of-round score modal + confetti
```

---

## 🚀 Running the Project Locally

```bash
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.
