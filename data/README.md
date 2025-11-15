# Game Data - Medical English Word Unscramble

This folder contains the game level data for the Medical English Word Unscramble game.

## Structure

### `gameLevels.js`

Contains 50 levels of medical terminology with progressive difficulty:

#### Difficulty Levels:
- **Beginner (Levels 1-10)**: Basic anatomy terms (3-5 letters)
  - Examples: HEART, VEIN, BONES, BRAIN, BLOOD
  
- **Easy (Levels 11-20)**: Common body parts (6-8 letters)
  - Examples: FINGER, STOMACH, KIDNEY, TRACHEA
  
- **Intermediate (Levels 21-30)**: Medical conditions & procedures
  - Examples: HYPERTENSION, DIABETES, ARTHRITIS, PNEUMONIA
  
- **Advanced (Levels 31-40)**: Complex medical terms
  - Examples: PATHOGENESIS, ANAPHYLAXIS, METASTASIS
  
- **Expert (Levels 41-50)**: Specialized medical terminology
  - Examples: ENDOCARDITIS, ENCEPHALITIS, IMMUNOLOGY

## Features

### Auto-Scrambling
Each word is automatically scrambled when the game loads to ensure variety.

### Helper Functions
- `scrambleWord(word)`: Randomly scrambles the letters of a word
- `createTerm(definition, word)`: Creates a term object with auto-scrambled word
- `getDifficultyInfo(levelIndex)`: Returns difficulty information for a level

## Adding New Levels

To add new levels, follow this pattern:

```javascript
[
  createTerm('Definition of medical term', 'ANSWER'),
  createTerm('Another definition', 'ANOTHER'),
  createTerm('Third definition', 'WORD'),
]
```

## Scoring System

- Each level awards points based on: `(level number) × 10`
- Level 1 = 10 points
- Level 25 = 250 points
- Level 50 = 500 points
- Maximum possible score: 12,750 points

## Progress Tracking

The game automatically saves:
- Current level
- Completed levels
- Total score

All data is stored in localStorage for persistence across sessions.
