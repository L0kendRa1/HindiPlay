# 🎨 HindiPlay (हिंदी बाल मंच) — Interactive Hindi Learning Platform

An educational Hindi learning activity library inspired by the "learn by doing" philosophy of **Toy Theater**, designed specifically for young Hindi learners (ages 5–8) with explicit pedagogical Devanagari learning units, stroke tracing, vector illustrations, and interactive reinforcement games.

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
         (Tasks 1, 2, 3, 4, 5, 6, 7, 8, 9, or 10)
                          ↓
             [ साफ़ करें ] [ गतिविधियाँ ]
```

---

## 🎮 Registered Activities (10 Total)

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
- **Goal**: Connect Hindi words with their visual meanings by reading the word and picking the correct picture from 3 choices.

### 8. **"याद करो और मिलाओ" (Hindi Memory Matching Game)**
- **Categories**: `शब्द (Words)`, `चित्र (Pictures)`
- **Goal**: Reinforce vocabulary memory by flipping cards to match Devanagari word cards with their corresponding illustrated picture cards (`कमल ↔ 🪷`, `मछली ↔ 🐟`, `आम ↔ 🥭`).
- **Difficulty Levels**:
  - **आसान (Easy)**: 4 pairs (8 cards, 2×4 grid)
  - **मध्यम (Medium)**: 6 pairs (12 cards, 3×4 grid)
  - **कठिन (Hard)**: 8 pairs (16 cards, 4×4 grid)

### 9. **"वाक्य बनाओ" (Hindi Sentence Builder)**
- **Categories**: `शब्द (Words)`
- **Goal**: Understand Hindi word order (Subject-Object-Verb) and construct simple, meaningful Hindi sentences by arranging shuffled Devanagari word cards into the correct sequence.
- **Difficulty Levels**:
  - **आसान (Easy)**: 3–4 word sentences (`यह आम है।`, `राम खेलता है।`)
  - **मध्यम (Medium)**: 4–5 word sentences (`राम स्कूल जाता है।`, `सीमा पानी पीती है।`)
  - **कठिन (Hard)**: 5–7 word sentences (`राम रोज स्कूल जाता है।`, `बच्चे मैदान में खेल रहे हैं।`)

### 10. **"कहानी पढ़ो और समझो" (Hindi Reading & Comprehension)**
- **Categories**: `शब्द (Words)`
- **Goal**: Develop Hindi reading fluency and comprehension through engaging child-friendly stories with optional Indian Hindi (`hi-IN`) narration and comprehension questions (`अक्षर → शब्द → वाक्य → कहानी → समझ`).
- **Difficulty Levels**:
  - **आसान (Easy)**: 3–4 short sentences, 2 comprehension questions (`रवि की गेंद`, `सीमा का बगीचा`, `कमल का फूल`, `नटखट बिल्ली`, `सूरज और चिड़िया`)
  - **मध्यम (Medium)**: 5–6 sentences, 3 comprehension questions (`मोहन का नया स्कूल`, `बारिश का दिन`, `मीठा आम का पेड़`, `दादी की कहानी`, `जंगल का नन्हा हाथी`)
  - **कठिन (Hard)**: 7–10 sentences, 4 comprehension questions (`रोहन और नन्हीं गिलहरी`, `मेहनती किसान और फसल`, `सच्चे मित्र और मेला`, `सूरज और ठंडी हवा`, `सुंदर बाग और मधुमक्खी`)
- **Features**: High-contrast large Devanagari typography, full-story Indian Hindi audio narration (`[ 🔊 कहानी सुनो ]` / `[ ⏹ रोकें ]`), comprehension questions testing story recall (who/what/where/why), encouraging feedback, and round summary.

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
│   │   ├── activityRegistry.ts  # Centralized Activity Registry (10 activities & 6 categories)
│   │   ├── vowels.ts            # Vowel dataset (13 Devanagari vowels)
│   │   ├── consonants.ts        # Consonant dataset (33 Devanagari consonants)
│   │   ├── hindiCharacters.ts   # Master character collection & round generator
│   │   ├── pictureWords.ts      # 42-item vocabulary dataset & validation engine
│   │   ├── wordBuilder.ts       # WordBuilder dictionary (2, 3, 4-unit words)
│   │   ├── characterStrokes.ts  # Normalized stroke dataset for representative characters
│   │   ├── matras.ts            # 9 Devanagari matras & starter consonants
│   │   ├── sentences.ts         # Curated Hindi sentence dataset across 3 difficulties (Task 9)
│   │   └── readingStories.ts    # Curated Hindi reading comprehension stories (Task 10)
│   ├── services/
│   │   ├── audioService.ts      # SpeechSynthesis (hi-IN) Indian Hindi prioritization + Web Audio SFX
│   │   ├── strokeEvaluation.ts  # Resampling, Euclidean metrics, and forgiving evaluator
│   │   └── hindiUnitComposer.ts # Pure Devanagari consonant+matra composition engine
│   ├── types/
│   │   ├── activity.ts          # Core platform types
│   │   ├── pictureMatch.ts      # Picture/word quiz types (Tasks 2, 5, 7)
│   │   ├── wordBuilder.ts       # Devanagari unit & dictionary types (Task 3)
│   │   ├── memoryGame.ts        # Memory game types & difficulty configurations (Task 8)
│   │   ├── sentenceBuilder.ts   # Sentence builder types & difficulty configurations (Task 9)
│   │   └── readingComprehension.ts # Reading comprehension types & configurations (Task 10)
│   ├── hooks/
│   │   ├── useLetterQuiz.ts     # Activity 1 state & game loop
│   │   ├── usePictureMatch.ts   # Activity 2 state & game loop
│   │   ├── useWordBuilder.ts    # Activity 3 state & game loop
│   │   ├── useCharacterTracing.ts # Activity 4 state & tracing progression
│   │   ├── usePictureWordQuiz.ts # Activity 5 state & picture-to-word loop
│   │   ├── useMatraLab.ts       # Activity 6 state & discovery sandbox
│   │   ├── useWordPictureQuiz.ts# Activity 7 state & word-to-picture loop
│   │   ├── useMemoryGame.ts     # Activity 8 state & flip card state machine
│   │   ├── useSentenceBuilder.ts# Activity 9 state & sentence construction loop
│   │   └── useReadingComprehension.ts # Activity 10 state & reading comprehension loop
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
│       ├── MemoryCard.tsx           # 3D tactile flip card (Activity 8)
│       ├── MemoryDifficultySelector.tsx # Difficulty selector (Activity 8)
│       ├── MemoryGameActivity.tsx   # Task 8 Memory Game Activity Container
│       ├── SentenceWordCard.tsx     # 3D tactile word card (Activity 9)
│       ├── SentenceConstructionArea.tsx # Sentence construction tray (Activity 9)
│       ├── SentenceDifficultySelector.tsx # Difficulty selector (Activity 9)
│       ├── SentenceBuilderActivity.tsx # Task 9 Sentence Builder Activity Container
│       ├── StoryReader.tsx          # Large typography story reader with audio controls (Activity 10)
│       ├── StoryQuestionCard.tsx    # Multiple choice comprehension question card (Activity 10)
│       ├── StoryDifficultySelector.tsx # Difficulty selector (Activity 10)
│       ├── ReadingComprehensionActivity.tsx # Task 10 Activity Container
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
