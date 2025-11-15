import React, { useState, useEffect } from "react";

export default function QuestionComponent({ question, onAnswer, selectedAnswer }) {
  const [selectedOption, setSelectedOption] = useState(selectedAnswer ?? null);
  const [gapFillAnswer, setGapFillAnswer] = useState(selectedAnswer ?? "");

  // Update when navigating back to a previously answered question
  useEffect(() => {
    if (question.type === "gapfill") {
      setGapFillAnswer(selectedAnswer ?? "");
    } else {
      setSelectedOption(selectedAnswer ?? null);
    }
  }, [selectedAnswer, question]);

  if (!question || !question.question) {
    return <p className="text-red-500">Error: Invalid question data</p>;
  }

  const handleSubmit = () => {
    if (question.type === "gapfill") {
      if (gapFillAnswer.trim() === "") {
        alert("Please enter an answer before submitting.");
        return;
      }
      onAnswer(gapFillAnswer.trim());
    } else {
      if (selectedOption === null) {
        alert("Please select an answer before submitting.");
        return;
      }
      onAnswer(selectedOption);
    }
  };

  return (
    <div className="mb-6">
      <p className="text-lg text-gray-800 mb-6 font-medium leading-relaxed">
        {question.question}
      </p>
      
      {question.type === "gapfill" ? (
        <div>
          <input
            type="text"
            value={gapFillAnswer}
            onChange={(e) => setGapFillAnswer(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSubmit();
              }
            }}
            className="border-2 border-gray-300 p-3 rounded-md w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Type your answer here..."
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors font-semibold w-full sm:w-auto"
          >
            Submit Answer →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelectedOption(index)}
              className={`text-left p-4 border-2 rounded-lg w-full transition-all ${
                selectedOption === index
                  ? "bg-blue-50 border-blue-500 shadow-md"
                  : "border-gray-300 hover:bg-gray-50 hover:border-gray-400"
              }`}
            >
              <span className="font-semibold text-blue-600 mr-3">
                {String.fromCharCode(65 + index)}.
              </span>
              <span className="text-gray-800">{option}</span>
            </button>
          ))}
          
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className={`mt-6 px-6 py-3 rounded-md font-semibold w-full sm:w-auto transition-colors ${
              selectedOption === null
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Submit Answer →
          </button>
        </div>
      )}
    </div>
  );
}