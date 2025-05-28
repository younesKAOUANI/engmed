import React, { useState } from "react";
import QuestionComponent from "./QuestionComponent";
import ContextComponent from "./ContextComponent";

export default function SectionComponent({ section, sectionIndex, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [sectionAnswers, setSectionAnswers] = useState({});
  const [videoWatched, setVideoWatched] = useState(false);

  // Flatten questions, handling reordering questions
  const actualQuestions = section.questions.reduce((acc, item) => {
    if (item.type === "reordering") {
      return [...acc, ...item.questions];
    } else if (item.type !== "text") {
      return [...acc, item];
    }
    return acc;
  }, []);

  const handleAnswer = (answer) => {
    setSectionAnswers((prev) => ({ ...prev, [currentQuestion]: answer }));
    if (currentQuestion < actualQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onComplete(sectionAnswers);
      setCurrentQuestion(0); // Reset for next section
      setVideoWatched(false); // Reset for Listening section
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {section.name} - Question {currentQuestion + 1} of {actualQuestions.length}
      </h2>
      {section.name === "Listening" && !videoWatched ? (
        <div>
          <p className="text-gray-600 mb-4">
            Please watch the following video before answering the Listening section questions:
          </p>
          <div className="mb-4">
            <iframe
              width="100%"
              height="315"
              src="https://www.youtube.com/embed/S4wWClQhZaA?si=PuIhquvL2QLbQr1y"
              title="Listening Section Audio"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <button
            onClick={() => setVideoWatched(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            I Have Watched the Video
          </button>
        </div>
      ) : (
        <div>
          <ContextComponent section={section} currentQuestion={currentQuestion} />
          {actualQuestions[currentQuestion] ? (
            <QuestionComponent
              question={actualQuestions[currentQuestion]}
              onAnswer={handleAnswer}
            />
          ) : (
            <p className="text-red-500">Error: No question available</p>
          )}
        </div>
      )}
    </div>
  );
}