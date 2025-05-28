import React, { useState } from "react";

export default function QuestionComponent({ question, onAnswer }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [gapFillAnswer, setGapFillAnswer] = useState("");

  if (!question || !question.question) {
    return <p className="text-red-500">Error: Invalid question data</p>;
  }

  const handleSubmit = () => {
    if (question.type === "gapfill") {
      onAnswer(gapFillAnswer);
      setGapFillAnswer("");
    } else {
      onAnswer(selectedOption);
      setSelectedOption(null);
    }
  };

  return (
    <div>
      <p className="text-gray-700 mb-4">{question.question}</p>
      {question.type === "gapfill" ? (
        <div>
          <input
            type="text"
            value={gapFillAnswer}
            onChange={(e) => setGapFillAnswer(e.target.value)}
            className="border p-2 rounded-md w-full mb-4"
            placeholder="Type your answer"
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedOption(index);
                handleSubmit();
              }}
              className={`text-left p-3 border rounded-md hover:bg-gray-100 ${
                selectedOption === index ? "bg-gray-200" : ""
              }`}
            >
              {`${String.fromCharCode(97 + index)}) ${option}`}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}