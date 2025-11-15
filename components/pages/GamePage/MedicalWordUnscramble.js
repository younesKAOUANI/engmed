// components/pages/GamePage/MedicalWordUnscramble.jsx
import React, { useState, useEffect } from 'react';

export default function MedicalWordUnscramble({ terms, onComplete, levelNumber }) {
  const [inputs, setInputs] = useState(terms.map(() => ''));
  const [solved, setSolved] = useState(terms.map(() => false));
  const [feedback, setFeedback] = useState(terms.map(() => ''));
  const [hints, setHints] = useState(terms.map(() => false));
  const [attempts, setAttempts] = useState(terms.map(() => 0));

  // Reset states when the terms change (i.e., when moving to a new level)
  useEffect(() => {
    setInputs(terms.map(() => ''));
    setSolved(terms.map(() => false));
    setFeedback(terms.map(() => ''));
    setHints(terms.map(() => false));
    setAttempts(terms.map(() => 0));
  }, [terms]);

  // Handle input changes
  const handleInputChange = (index, value) => {
    const newInputs = [...inputs];
    newInputs[index] = value.toUpperCase();
    setInputs(newInputs);
    
    // Clear feedback when user types
    if (feedback[index]) {
      const newFeedback = [...feedback];
      newFeedback[index] = '';
      setFeedback(newFeedback);
    }
  };

  // Check if the input matches the correct word
  const handleCheck = (index) => {
    const newSolved = [...solved];
    const newFeedback = [...feedback];
    const newAttempts = [...attempts];
    
    newAttempts[index] += 1;
    setAttempts(newAttempts);

    if (inputs[index] === terms[index].word) {
      newSolved[index] = true;
      newFeedback[index] = `✓ Correct! (${newAttempts[index]} ${newAttempts[index] === 1 ? 'attempt' : 'attempts'})`;
    } else {
      // Give progressive hints
      if (newAttempts[index] === 1) {
        newFeedback[index] = '✗ Try again!';
      } else if (newAttempts[index] === 2) {
        newFeedback[index] = `✗ Hint: It has ${terms[index].word.length} letters`;
      } else if (newAttempts[index] === 3) {
        newFeedback[index] = `✗ Hint: It starts with "${terms[index].word[0]}"`;
      } else {
        newFeedback[index] = `✗ Keep trying! First 2 letters: "${terms[index].word.substring(0, 2)}"`;
      }
    }

    setSolved(newSolved);
    setFeedback(newFeedback);
  };

  // Show hint for a word
  const handleShowHint = (index) => {
    const newHints = [...hints];
    newHints[index] = true;
    setHints(newHints);
  };

  // Skip word (reveal answer)
  const handleSkip = (index) => {
    const newSolved = [...solved];
    const newInputs = [...inputs];
    const newFeedback = [...feedback];
    
    newSolved[index] = true;
    newInputs[index] = terms[index].word;
    newFeedback[index] = '⊘ Skipped - Answer revealed';
    
    setSolved(newSolved);
    setInputs(newInputs);
    setFeedback(newFeedback);
  };

  const allSolved = solved.every((s) => s);
  const solvedCount = solved.filter((s) => s).length;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Progress Bar */}
      <div className='mb-6 bg-white/20 rounded-full h-3 overflow-hidden'>
        <div 
          className='bg-green-500 h-full transition-all duration-300'
          style={{ width: `${(solvedCount / terms.length) * 100}%` }}
        />
      </div>
      <p className='text-sm mb-6 opacity-80'>
        {solvedCount} of {terms.length} words solved
      </p>

      {terms.map((term, index) => (
        <div
          key={index}
          style={{
            marginBottom: '1.5rem',
            padding: '1.5rem',
            border: solved[index] ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.2)',
            borderRadius: '0.75rem',
            backgroundColor: solved[index] ? 'rgba(209, 250, 229, 0.1)' : 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className='flex justify-between items-start mb-3'>
            <p style={{ marginBottom: '0.5rem' }} className='text-lg md:text-xl text-white font-bold text-left flex-1'>
              {index + 1}. {term.definition}
            </p>
            {solved[index] && (
              <span className='text-green-400 text-2xl ml-2'>✓</span>
            )}
          </div>

          {/* Scrambled letters */}
          <div style={{ marginBottom: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }} className='justify-center'>
            {term.scrambled.split('').map((letter, i) => (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  width: '2.5rem',
                  height: '2.5rem',
                  lineHeight: '2.5rem',
                  textAlign: 'center',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderRadius: '0.375rem',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  fontSize: '1.25rem'
                }}
                className='text-white'
              >
                {letter}
              </span>
            ))}
          </div>

          {/* Hint display */}
          {hints[index] && !solved[index] && (
            <p className='text-yellow-300 text-sm mb-2'>
              💡 Hint: The word starts with "{term.word[0]}" and ends with "{term.word[term.word.length - 1]}"
            </p>
          )}

          {/* Input field */}
          <input
            type="text"
            value={inputs[index]}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !solved[index]) {
                handleCheck(index);
              }
            }}
            disabled={solved[index]}
            style={{
              padding: '0.75rem',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '0.5rem',
              width: '100%',
              backgroundColor: solved[index] ? 'rgba(209, 250, 229, 0.2)' : 'rgba(255,255,255,0.9)',
              fontSize: '1rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
            className='text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder="Type the unscrambled word"
          />

          {/* Action buttons */}
          <div className='flex gap-2 mt-3 flex-wrap'>
            <button
              onClick={() => handleCheck(index)}
              disabled={solved[index] || !inputs[index]}
              style={{
                backgroundColor: solved[index] ? '#9ca3af' : '#3b82f6',
                color: 'white',
                padding: '0.5rem 1.25rem',
                borderRadius: '0.5rem',
                cursor: solved[index] || !inputs[index] ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                opacity: solved[index] || !inputs[index] ? 0.5 : 1,
              }}
            >
              Check Answer
            </button>
            
            {!solved[index] && !hints[index] && (
              <button
                onClick={() => handleShowHint(index)}
                style={{
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                💡 Hint
              </button>
            )}
            
            {!solved[index] && attempts[index] >= 3 && (
              <button
                onClick={() => handleSkip(index)}
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                Skip
              </button>
            )}
          </div>

          {/* Feedback message */}
          {feedback[index] && (
            <p 
              className='mt-2 font-semibold'
              style={{ 
                color: solved[index] ? '#10b981' : '#fbbf24' 
              }}
            >
              {feedback[index]}
            </p>
          )}
        </div>
      ))}

      {/* Show completion message and Next Level button */}
      {allSolved && (
        <div
          style={{
            marginTop: '2rem',
            padding: '2rem',
            backgroundColor: '#d1fae5',
            color: '#065f46',
            borderRadius: '0.75rem',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            🎉 Level {levelNumber} Completed! 🎉
          </p>
          <p className='text-lg mb-4'>
            Great job! You solved all {terms.length} words.
          </p>
          <button
            onClick={onComplete}
            style={{
              marginTop: '0.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '1.125rem',
            }}
            className='hover:bg-blue-600 transition-colors'
          >
            Next Level →
          </button>
        </div>
      )}
    </div>
  );
}