import React from "react";

export default function ContextComponent({ section, currentQuestion }) {
  if (section.name !== "Reading") return null;

  // Flatten all questions to get proper indexing
  const allItems = [];
  let questionCount = 0;
  let contextForQuestion = null;

  for (let i = 0; i < section.questions.length; i++) {
    const item = section.questions[i];
    
    if (item.type === "text") {
      // Store text context
      contextForQuestion = item.text;
      allItems.push({ type: "text", content: item.text });
    } else if (item.type === "reordering") {
      // Store reordering context
      contextForQuestion = {
        type: "reordering",
        sentences: item.sentences
      };
      allItems.push({ type: "reordering", sentences: item.sentences });
      
      // Count questions in reordering
      item.questions.forEach(() => {
        if (questionCount === currentQuestion) {
          return;
        }
        questionCount++;
      });
    } else {
      // Regular question
      if (questionCount === currentQuestion) {
        // Found the current question, use the last stored context
        break;
      }
      questionCount++;
    }
  }

  // Render the context
  if (contextForQuestion) {
    if (typeof contextForQuestion === "string") {
      return (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
          <h3 className="font-semibold text-gray-800 mb-2">Reading Passage:</h3>
          <div className="text-gray-700 whitespace-pre-line leading-relaxed">
            {contextForQuestion}
          </div>
        </div>
      );
    } else if (contextForQuestion.type === "reordering") {
      return (
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-6 rounded">
          <h3 className="font-semibold text-gray-800 mb-2">Reorder these sentences:</h3>
          <div className="text-gray-700 space-y-2">
            {contextForQuestion.sentences.map((sentence, idx) => (
              <p key={idx} className="pl-2">{sentence}</p>
            ))}
          </div>
        </div>
      );
    }
  }

  return null;
}