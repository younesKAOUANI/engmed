import React from "react";

export default function ContextComponent({ section, currentQuestion }) {
  if (section.name !== "Reading") return null;

  // Find the context for the current question
  const currentQuestionData = section.questions.reduce((acc, item) => {
    if (item.type === "reordering") {
      return [...acc, ...item.questions];
    } else if (item.type !== "text") {
      return [...acc, item];
    }
    return acc;
  }, [])[currentQuestion];

  const questionIndex = section.questions.findIndex((q, i) => {
    if (q.type === "reordering") {
      return q.questions.includes(currentQuestionData);
    }
    return q === currentQuestionData;
  });

  // Get the nearest preceding text or reordering context
  for (let i = questionIndex; i >= 0; i--) {
    if (section.questions[i].type === "text") {
      return (
        <div className="text-gray-600 mb-4 whitespace-pre-line">
          {section.questions[i].text}
        </div>
      );
    }
    if (section.questions[i].type === "reordering") {
      return (
        <div className="text-gray-600 mb-4 whitespace-pre-line">
          Topic: The Role of Vaccines
          <br />
          {section.questions[i].sentences.join("\n")}
        </div>
      );
    }
  }

  return null;
}