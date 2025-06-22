// pages/game.js
import MedicalWordUnscramble from '@/components/pages/GamePage/MedicalWordUnscramble';
import LandingHeader from '@/components/pages/LandingPage/LandingHeader';
import React, { useState } from 'react';

const levels = [
  // Level 1: Basic Anatomy
  [
    { definition: 'The organ that pumps blood', word: 'HEART', scrambled: 'EATHR' },
    { definition: 'The tube carrying blood to the heart', word: 'VEIN', scrambled: 'NIVE' },
    { definition: 'The bones forming the skeleton', word: 'BONES', scrambled: 'SENOB' },
  ],
  // Level 2: Common Conditions
  [
    { definition: 'A common skin condition', word: 'ECZEMA', scrambled: 'AMEZEC' },
    { definition: 'High blood sugar condition', word: 'DIABETES', scrambled: 'TIDEBASE' },
    { definition: 'Difficulty breathing condition', word: 'ASTHMA', scrambled: 'HAMSTA' },
  ],
  // Add more levels as needed...
];

export default function GamePage() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);

  const handleLevelComplete = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1);
    } else {
      setGameCompleted(true);
    }
  };

  return (
    <div className='text-center min-h-screen' style={{
      backgroundImage: 'url("/game-bg.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <LandingHeader/>
      <div className='text-white backdrop-blur-sm rounded-md max-w-xl px-4 mx-auto h-full'>
 
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }} className='pt-32 p-8'>
        Medical English Game
      </h1>
      {gameCompleted ? (
        <div
        style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#d1fae5',
          color: '#065f46',
          borderRadius: '0.5rem',
        }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Congratulations!</h2>
          <p>You've completed all levels. Great job mastering medical English!</p>
        </div>
      ) : (
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            Level {currentLevel + 1}
          </h3>
          <MedicalWordUnscramble
            terms={levels[currentLevel]}
            onComplete={handleLevelComplete}
            />
        </div>
      )}
      </div>
    </div>
  );
}