# Data Directory

This folder contains data files for various features of the EngMed platform.

## Files

### 1. `gameLevels.js`
Medical English Word Unscramble game data with 50 progressive difficulty levels.

### 2. `universityCourses.js`
Translated medical courses from French to English for university students.

### 3. `teachers.js`
Available teachers/instructors for online meeting bookings.

---

## Game Data - Medical English Word Unscramble

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

---

## Teachers Data - Online Meeting System

### `teachers.js`

Contains information about available instructors for one-on-one sessions.

#### Available Teachers (6 instructors):
- Dr. Sarah Johnson - Medical English Specialist
- Prof. Michael Chen - Clinical English Instructor
- Dr. Emma Williams - Healthcare Communication Expert
- Dr. Ahmed Khalil - Medical English Coach
- Dr. Lisa Martin - Clinical English Trainer
- Prof. David Brown - Medical Communication Professor

#### Each Teacher Profile Includes:
- Name and title
- Areas of expertise (e.g., Medical Terminology, Clinical Communication)
- Languages spoken
- Availability schedule
- Rating and total sessions completed
- Biography

#### Meeting Configuration:
- **Durations**: 30 min, 1 hour, 1.5 hours, 2 hours
- **Topics**: Medical Terminology, Clinical Communication, Patient Interaction, Medical Writing, Pronunciation Practice, IELTS/TOEFL Preparation, Interview Preparation, Research Presentation, Academic English, General Consultation, Other
- **Time Slots**: Available from 9:00 AM to 7:30 PM in 30-minute intervals

#### Helper Functions:
- `getTeacherById(id)`: Returns teacher by ID
- `getTeachersByExpertise(expertise)`: Filters teachers by expertise area

---

## University Courses Data

### `universityCourses.js`

Contains translated medical courses from French curriculum to English for different study years and academic years.
