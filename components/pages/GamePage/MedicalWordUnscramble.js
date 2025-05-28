// components/pages/GamePage/MedicalWordUnscramble.jsx
import React, { useState, useEffect } from 'react';

export default function MedicalWordUnscramble({ terms, onComplete }) {
  const [inputs, setInputs] = useState(terms.map(() => ''));
  const [solved, setSolved] = useState(terms.map(() => false));
  const [feedback, setFeedback] = useState(terms.map(() => ''));

  // Reset states when the terms change (i.e., when moving to a new level)
  useEffect(() => {
    setInputs(terms.map(() => ''));
    setSolved(terms.map(() => false));
    setFeedback(terms.map(() => ''));
  }, [terms]);

  // Handle input changes
  const handleInputChange = (index, value) => {
    const newInputs = [...inputs];
    newInputs[index] = value.toUpperCase();
    setInputs(newInputs);
  };

  // Check if the input matches the correct word
  const handleCheck = (index) => {
    const newSolved = [...solved];
    const newFeedback = [...feedback];

    if (inputs[index] === terms[index].word) {
      newSolved[index] = true;
      newFeedback[index] = 'Correct!';
    } else {
      newFeedback[index] = 'Try again!';
    }

    setSolved(newSolved);
    setFeedback(newFeedback);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      {terms.map((term, index) => (
        <div
          key={index}
          style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            border: '1px solid #ccc',
            borderRadius: '0.5rem',
          }}
        >
          <p style={{ marginBottom: '0.5rem' }}>{term.definition}</p>
          <p style={{ marginBottom: '0.5rem', fontFamily: 'monospace' }}>
            Scrambled: {term.scrambled}
          </p>
          <input
            type="text"
            value={inputs[index]}
            onChange={(e) => handleInputChange(index, e.target.value)}
            disabled={solved[index]}
            style={{
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '0.25rem',
              width: '100%',
              backgroundColor: solved[index] ? '#d1fae5' : 'white',
            }}
          />
          <button
            onClick={() => handleCheck(index)}
            disabled={solved[index]}
            style={{
              marginTop: '0.5rem',
              backgroundColor: solved[index] ? '#9ca3af' : '#3b82f6',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              cursor: solved[index] ? 'not-allowed' : 'pointer',
            }}
          >
            Check
          </button>
          <p style={{ color: solved[index] ? '#065f46' : '#dc2626' }}>
            {feedback[index]}
          </p>
        </div>
      ))}

      {/* Show completion message and Next Level button */}
      {solved.every((s) => s) && (
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: '#d1fae5',
            color: '#065f46',
            borderRadius: '0.5rem',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '1.25rem', fontWeight: '600' }}>
            Level Completed!
          </p>
          <button
            onClick={onComplete}
            style={{
              marginTop: '0.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              cursor: 'pointer',
            }}
          >
            Next Level
          </button>
        </div>
      )}
    </div>
  );
}