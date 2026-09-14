# HindiPlay — Content Quality, Progression & Architecture Guide

This document outlines the pedagogical principles, data structures, linguistic validation rules, and tooling for HindiPlay's educational content library.

---

## 1. Content Library Overview

HindiPlay maintains a MongoDB Atlas-backed, offline-resilient content library containing:

| Collection | Count | Description |
|---|---|---|
| **Hindi Words** | **216** | Concrete, age-appropriate vocabulary across 17 categories |
| **Image-Backed Words** | **82** | 100% verified original vector SVGs (< 1.6 KB each) |
| **Hindi Letters** | **49** | 13 Swar (स्वर), 33 Vyanjan (व्यंजन), 3 Sanyukt Vyanjan (संयुक्त व्यंजन) |
| **Hindi Matras** | **9** | Primary Devanagari dependent vowel signs (मात्राएँ) |
| **Hindi Stories** | **18** | Graded reading comprehension passages (Easy, Medium, Hard) |

---

## 2. Difficulty Progression Philosophy

Difficulty in HindiPlay is assigned based on **phonetic complexity, grapheme composition, and linguistic familiarity**, not merely character length:

### Easy (159 words / 73.6%)
- Foundational 2 to 3-letter words with no matras or simple primary matras (`ा, ि, ी, ु, ू, े, ो`).
- Immediate concrete nouns common in a child's everyday environment.
- Examples: `कमल`, `नल`, `घर`, `फल`, `आम`, `सेब`, `केला`, `तोता`, `कार`, `बस`.

### Medium (50 words / 23.1%)
- 3 to 4-letter words containing diphthongs (`ै, औ`), conjunct nasals (Anusvara `ं`, Chandrabindu `ँ`), and geminates/softer conjuncts.
- Multi-syllabic vocabulary expanding nature, food, and animals.
- Examples: `अंगूर`, `खरगोश`, `तरबूज`, `बिल्ली`, `कुत्ता`, `लहसुन`, `गिलहरी`, `कछुआ`.

### Hard (7 words / 3.2%)
- Advanced Devanagari conjunct ligatures (संयुक्ताक्षर) and formal vocabulary.
- Teaches virama/halant combinations and loanword spellings.
- Examples: `शिक्षक`, `प्रार्थना`, `ट्रक`, `हेलीकॉप्टर`, `स्वतंत्र`, `षट्कोण`, `प्याज`.

---

## 3. Educational Category Architecture

Vocabulary is structured into **17 cohesive, child-friendly categories**:

1. **जानवर (Animals - 18 words)**: `हाथी`, `शेर`, `भालू`, `गाय`, `घोड़ा`, etc.
2. **फल (Fruits - 17 words)**: `आम`, `सेब`, `केला`, `अनार`, `अंगूर`, etc.
3. **प्रकृति (Nature - 16 words)**: `सूरज`, `चाँद`, `तारा`, `वृक्ष`, `कमल`, etc.
4. **वस्तुएँ (Objects & Toys - 16 words)**: `पतंग`, `लट्टू`, `डमरू`, `धनुष`, `ताला`, etc.
5. **घर (Home & Household - 15 words)**: `घर`, `घड़ी`, `दरवाजा`, `थाली`, `दीपक`, etc.
6. **सब्ज़ियाँ (Vegetables - 15 words)**: `टमाटर`, `गाजर`, `आलू`, `मटर`, `बैंगन`, etc.
7. **भोजन (Food & Drink - 15 words)**: `रोटी`, `दूध`, `चावल`, `मक्खन`, `खीर`, etc.
8. **स्कूल (School & Learning - 14 words)**: `किताब`, `कलम`, `बस्ता`, `पेंसिल`, etc.
9. **क्रियाएँ (Actions & Verbs - 12 words)**: `हँसना`, `रोना`, `दौड़ना`, `पढ़ना`, etc.
10. **पक्षी (Birds - 12 words)**: `तोता`, `मोर`, `कौआ`, `कबूतर`, `चिड़िया`, etc.
11. **शरीर (Body Parts - 12 words)**: `आँख`, `कान`, `नाक`, `हाथ`, `पैर`, etc.
12. **वाहन (Vehicles - 12 words)**: `कार`, `बस`, `नाव`, `रेलगाड़ी`, `साइकिल`, etc.
13. **परिवार (Family & People - 12 words)**: `माता`, `पिता`, `भाई`, `बहन`, `औरत`, etc.
14. **स्थान (Places - 10 words)**: `गाँव`, `शहर`, `बाजार`, `पार्क`, `नदी`, etc.
15. **रंग (Colors - 10 words)**: `लाल`, `नीला`, `पीला`, `हरा`, `काला`, etc.
16. **संख्या (Numbers - 6 words)**: `एक`, `दो`, `तीन`, `चार`, `पाँच`, `दस`.
17. **सामान्य (General - 4 words)**: `यज्ञ`, `षट्कोण`, etc.

---

## 4. Hindi Learning-Unit Rules

Devanagari script combines consonants, vowel diacritics (matras), virama/halant marks, and conjunct forms. Naive JavaScript string operations like `word.split("")` or `word[i]` break Unicode grapheme clusters and disconnect matras from their host consonants.

### Linguistic Invariants:
1. **Host Consonant Binding**: A matra cannot stand alone; it is always fused with its base consonant into a learning unit (e.g., `क + ो = को`).
2. **Reconstruction Invariant**: For every word record, `learningUnits.join('') === word` must evaluate strictly to `true`.
3. **Compound Consonants**: Half-consonants joined with virama (`्`) remain connected to form valid aksharas (e.g., `ब + न् + द + र = ब-न्-द-र` or `ब-न्दर`).

---

## 5. Image Asset Guidelines

All illustrated content adheres to strict pedagogical and licensing requirements:
- **Format**: Vector SVG with `viewBox="0 0 100 100"` (< 1.6 KB per asset).
- **Style**: Centered, child-friendly, colorful silhouettes with clear outlines.
- **Cognitive Clarity**: Zero distracting background clutter, zero embedded text, and zero watermarks.
- **Licensing**: 100% original project assets (`source: "HindiPlay Vector Assets"`, `license: "Original HindiPlay asset"`).
- **Resilience**: If an image fails to load, activities render graceful emoji fallbacks without breaking gameplay.

---

## 6. Developer Validation Tooling

Two deterministic audit scripts guard repository integrity:

```bash
# 1. Audit content integrity (words, letters, matras, stories)
npm run validate:content

# 2. Audit image existence, URL format, and metadata
npm run validate:images

# 3. Optional: Audit live MongoDB Atlas database directly
node src/scripts/validateContent.js --db
node src/scripts/validateImages.js --db
```
