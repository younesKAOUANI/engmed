// pages/game/index.js
import MedicalWordUnscramble from '@/components/pages/GamePage/MedicalWordUnscramble';
import LandingHeader from '@/components/pages/LandingPage/LandingHeader';
import React, { useState, useEffect } from 'react';
import { gameLevels, getDifficultyInfo } from '@/data/gameLevels';

export default function GamePage() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  // Load progress from localStorage
  useEffect(() => {
    const savedLevel = localStorage.getItem('medicalGameLevel');
    const savedCompleted = localStorage.getItem('medicalGameCompleted');
    const savedScore = localStorage.getItem('medicalGameScore');
    
    if (savedLevel) setCurrentLevel(parseInt(savedLevel));
    if (savedCompleted) setCompletedLevels(JSON.parse(savedCompleted));
    if (savedScore) setTotalScore(parseInt(savedScore));
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('medicalGameLevel', currentLevel.toString());
    localStorage.setItem('medicalGameCompleted', JSON.stringify(completedLevels));
    localStorage.setItem('medicalGameScore', totalScore.toString());
  }, [currentLevel, completedLevels, totalScore]);

  const handleLevelComplete = () => {
    // Mark level as completed
    if (!completedLevels.includes(currentLevel)) {
      setCompletedLevels([...completedLevels, currentLevel]);
      setTotalScore(totalScore + (currentLevel + 1) * 10); // Score increases with level
    }

    if (currentLevel < gameLevels.length - 1) {
      setCurrentLevel(currentLevel + 1);
    } else {
      setGameCompleted(true);
    }
  };

  const handleLevelSelect = (levelIndex) => {
    setCurrentLevel(levelIndex);
    setShowLevelSelect(false);
    setGameCompleted(false);
  };

  const handleRestart = () => {
    if (window.confirm('Are you sure you want to restart? This will reset all your progress.')) {
      localStorage.removeItem('medicalGameLevel');
      localStorage.removeItem('medicalGameCompleted');
      localStorage.removeItem('medicalGameScore');
      setCurrentLevel(0);
      setCompletedLevels([]);
      setTotalScore(0);
      setGameCompleted(false);
    }
  };

  const difficultyInfo = getDifficultyInfo(currentLevel);
  const progressPercentage = ((completedLevels.length / gameLevels.length) * 100).toFixed(1);

  return (
    <div className='text-center min-h-screen' style={{
      backgroundImage: 'url("/game-bg.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <LandingHeader/>
      <div className='text-white backdrop-blur-sm rounded-md max-w-4xl px-4 mx-auto h-full pb-12'>
 
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }} className='pt-32 p-8'>
          Medical English Game
        </h1>

        {/* Game Stats */}
        <div className='flex justify-center gap-4 mb-6 flex-wrap'>
          <div className='bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg'>
            <p className='text-sm opacity-80'>Total Score</p>
            <p className='text-xl font-bold'>{totalScore}</p>
          </div>
          <div className='bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg'>
            <p className='text-sm opacity-80'>Completed</p>
            <p className='text-xl font-bold'>{completedLevels.length}/{gameLevels.length}</p>
          </div>
          <div className='bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg'>
            <p className='text-sm opacity-80'>Progress</p>
            <p className='text-xl font-bold'>{progressPercentage}%</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex justify-center gap-3 mb-6'>
          <button
            onClick={() => setShowLevelSelect(!showLevelSelect)}
            className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors'
          >
            {showLevelSelect ? 'Hide Levels' : 'Select Level'}
          </button>
          <button
            onClick={handleRestart}
            className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors'
          >
            Restart Game
          </button>
        </div>

        {/* Level Selection Grid */}
        {showLevelSelect && (
          <div className='bg-white/10 backdrop-blur-md rounded-lg p-6 mb-6'>
            <h3 className='text-xl font-semibold mb-4'>Select a Level</h3>
            <div className='grid grid-cols-5 sm:grid-cols-10 gap-2'>
              {gameLevels.map((_, index) => {
                const levelDifficulty = getDifficultyInfo(index);
                const isCompleted = completedLevels.includes(index);
                const isCurrent = index === currentLevel;
                
                return (
                  <button
                    key={index}
                    onClick={() => handleLevelSelect(index)}
                    className={`
                      p-3 rounded-lg font-bold transition-all
                      ${isCurrent ? 'ring-2 ring-yellow-400' : ''}
                      ${isCompleted ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}
                    `}
                    style={{
                      backgroundColor: isCompleted ? '#10b981' : levelDifficulty.color,
                      opacity: isCompleted ? 1 : 0.7
                    }}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
            <div className='mt-4 flex justify-center gap-4 flex-wrap text-sm'>
              <span className='flex items-center gap-2'>
                <span className='w-4 h-4 rounded' style={{ backgroundColor: '#10b981' }}></span>
                Beginner (1-10)
              </span>
              <span className='flex items-center gap-2'>
                <span className='w-4 h-4 rounded' style={{ backgroundColor: '#3b82f6' }}></span>
                Easy (11-20)
              </span>
              <span className='flex items-center gap-2'>
                <span className='w-4 h-4 rounded' style={{ backgroundColor: '#f59e0b' }}></span>
                Intermediate (21-30)
              </span>
              <span className='flex items-center gap-2'>
                <span className='w-4 h-4 rounded' style={{ backgroundColor: '#ef4444' }}></span>
                Advanced (31-40)
              </span>
              <span className='flex items-center gap-2'>
                <span className='w-4 h-4 rounded' style={{ backgroundColor: '#8b5cf6' }}></span>
                Expert (41-50)
              </span>
            </div>
          </div>
        )}

        {gameCompleted ? (
          <div
            style={{
              marginTop: '1.5rem',
              padding: '2rem',
              backgroundColor: '#d1fae5',
              color: '#065f46',
              borderRadius: '0.5rem',
            }}
          >
            <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '1rem' }}>
              🎉 Congratulations! 🎉
            </h2>
            <p className='text-lg mb-2'>You've completed all 50 levels!</p>
            <p className='text-xl font-bold mb-4'>Final Score: {totalScore} points</p>
            <p>You're now a master of medical English terminology!</p>
            <button
              onClick={() => setShowLevelSelect(true)}
              className='mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors'
            >
              Review Levels
            </button>
          </div>
        ) : (
          <div>
            <div className='flex items-center justify-center gap-3 mb-4'>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600' }}>
                Level {currentLevel + 1}
              </h3>
              <span 
                className='px-3 py-1 rounded-full text-sm font-semibold'
                style={{ backgroundColor: difficultyInfo.color }}
              >
                {difficultyInfo.label}
              </span>
            </div>
            
            <MedicalWordUnscramble
              terms={gameLevels[currentLevel]}
              onComplete={handleLevelComplete}
              levelNumber={currentLevel + 1}
            />
          </div>
        )}
      </div>
    </div>
  );
}