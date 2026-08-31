# 🎨 HindiPlay (हिंदी बाल मंच) — Interactive Hindi Learning Platform

An educational Hindi learning activity library inspired by the "learn by doing" philosophy of **Toy Theater**, designed specifically for young Hindi learners (ages 5–8) with an explicit pedagogical Devanagari learning unit, stroke tracing, and dedicated vector image illustration assets.

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
           (Task 1, 2, 3, 4, or 5)
                          ↓
                 Round Completion
                          ↓
             [ फिर से खेलें ] [ गतिविधियाँ ]
```

---

## 🖼️ Picture-Word Vector Assets & Visual Quality

All 42 vocabulary items in `src/data/pictureWords.ts` have dedicated, high-contrast, child-friendly vector SVG illustrations located in `public/images/words/`:
- **Vowels (12)**: `anar.svg` (अनार), `aam.svg` (आम), `imli.svg` (इमली), `eekh.svg` (ईख), `ullu.svg` (उल्लू), `oon.svg` (ऊन), `rishi.svg` (ऋषि), `ek.svg` (एक), `ainak.svg` (ऐनक), `okhli.svg` (ओखली), `aurat.svg` (औरत), `angoor.svg` (अंगूर).
- **Consonants (30)**: `kamal.svg` (कमल), `khargosh.svg` (खरगोश), `gamla.svg` (गमला), `ghadi.svg` (घड़ी), `chammach.svg` (चम्मच), `chhata.svg` (छाता), `jahaj.svg` (जहाज), `jhanda.svg` (झंडा), `tamatar.svg` (टमाटर), `thappa.svg` (ठप्पा), `damru.svg` (डमरू), `dhakkan.svg` (ढक्कन), `tarbooj.svg` (तरबूज), `thali.svg` (थाली), `darwaja.svg` (दरवाजा), `dhanush.svg` (धनुष), `nal.svg` (नल), `patang.svg` (पतंग), `phal.svg` (फल), `battakh.svg` (बत्तख), `bhalu.svg` (भालू), `machhli.svg` (मछली), `yagya.svg` (यज्ञ), `rath.svg` (रथ), `lattu.svg` (लट्टू), `vriksh.svg` (वृक्ष), `shaljam.svg` (शलजम), `shatkon.svg` (षट्कोण), `seb.svg` (सेब), `hathi.svg` (हाथी).

### Visual Rendering Architecture:
- `<PictureImage />` component with `object-fit: contain`, instant skeleton placeholders, error boundary, and graceful emoji fallback (`🖼️`). Empty rectangular boxes are **never** shown.
- `validatePictureWordItem()` ensures broken items are filtered out before generating playable rounds.

---

## 🎮 Registered Activities

### 1. **"अक्षर पहचानो" (Letter Recognition)**
- **Categories**: `अक्षर (Letters)`
- **Goal**: Identify Hindi characters by sound and select the matching Devanagari character from 3 choices.
- **Coverage**: All 13 **स्वर (Vowels)** and 33 **व्यंजन (Consonants)** with dynamic category filters.

### 2. **"अक्षर और चित्र मिलाओ" (Letter → Picture/Word Match)**
- **Categories**: `अक्षर (Letters)`, `चित्र (Pictures)`
- **Goal**: Connect target characters with meaningful, illustrated Hindi vocabulary words (e.g. `आ ➔ आम 🥭`, `क ➔ कमल 🪷`, `म ➔ मछली 🐟`).
- **Coverage**: 42 illustrated word cards with spoken associations (*"आ से आम"*).

### 3. **"शब्द बनाओ और खोजो" (Word Building & Discovery with Difficulty Selection)**
- **Categories**: `शब्द (Words)`
- **Goal**: Understand how base consonants and vowel signs (मात्राएँ) combine into explicit learning units to form words (`म + ा ➔ मा`, `मा + ला ➔ माला`).
- **Difficulty Selection**: User-selected word length (`2 अक्षर ⭐`, `3 अक्षर ⭐⭐`, `4 अक्षर ⭐⭐⭐`) based on explicit `unitCount`.

### 4. **"अक्षर लिखो" (Guided Character Tracing)**
- **Categories**: `अक्षर (Letters)`, `लिखना (Writing)`
- **Goal**: Teach children how to correctly form Hindi characters through guided stroke-by-stroke tracing.
- **Stroke Architecture**: Normalized Devanagari stroke coordinate geometry (`[0, 1]`) with start badges (①, ②, ③) and directional guides.

### 5. **"चित्र देखकर शब्द पहचानो" (Picture-to-Word Recognition)**
- **Categories**: `शब्द (Words)`, `चित्र (Pictures)`
- **Goal**: Connect a familiar illustrated object/image with the correct Hindi word from 3 options (e.g. 🥭 ➔ `[ आम ]`, `[ कमल ]`, `[ घर ]`).

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
│   │   ├── activityRegistry.ts  # Centralized Activity Registry & Category Filter
│   │   ├── vowels.ts            # Vowel dataset (13 Devanagari vowels)
│   │   ├── consonants.ts        # Consonant dataset (33 Devanagari consonants)
│   │   ├── hindiCharacters.ts   # Master character collection & round generator
│   │   ├── pictureWords.ts      # 42-item vocabulary dataset & validation engine
│   │   ├── wordBuilder.ts       # WordBuilder dictionary (2, 3, 4-unit words)
│   │   └── characterStrokes.ts  # Normalized stroke dataset for representative characters
│   ├── services/
│   │   ├── audioService.ts      # SpeechSynthesis (hi-IN) + Web Audio API synthesizer
│   │   └── strokeEvaluation.ts  # Resampling, Euclidean metrics, and forgiving evaluator
│   ├── hooks/
│   │   ├── useLetterQuiz.ts     # Activity 1 state & game loop
│   │   ├── usePictureMatch.ts   # Activity 2 state & game loop
│   │   ├── useWordBuilder.ts    # Activity 3 state & game loop
│   │   ├── useCharacterTracing.ts # Activity 4 state & tracing progression
│   │   └── usePictureWordQuiz.ts # Activity 5 state & picture-word quiz loop
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
