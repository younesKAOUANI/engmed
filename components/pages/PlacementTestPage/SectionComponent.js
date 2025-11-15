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
    const updatedAnswers = { ...sectionAnswers, [currentQuestion]: answer };
    setSectionAnswers(updatedAnswers);
    
    if (currentQuestion < actualQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Pass the updated answers including the current one
      onComplete(updatedAnswers);
      setCurrentQuestion(0); // Reset for next section
      setVideoWatched(false); // Reset for Listening section
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSkip = () => {
    if (currentQuestion < actualQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const progress = ((currentQuestion + 1) / actualQuestions.length) * 100;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-gray-900">
            {section.name} Section
          </h2>
          <span className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {actualQuestions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {section.name === "Listening" && !videoWatched ? (
        <div>
          <p className="text-gray-600 mb-4 text-lg">
            📺 Please watch the following video carefully before answering the Listening section questions:
          </p>
          <div className="mb-6 rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="400"
              src="https://www.youtube.com/embed/S4wWClQhZaA?si=PuIhquvL2QLbQr1y"
              title="Listening Section Audio"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
          </div>
          <button
            onClick={() => setVideoWatched(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors font-semibold"
          >
            ✓ I Have Watched the Video - Start Questions
          </button>
        </div>
      ) : (
        <div>
          <ContextComponent section={section} currentQuestion={currentQuestion} />
          {actualQuestions[currentQuestion] ? (
            <>
              <QuestionComponent
                question={actualQuestions[currentQuestion]}
                onAnswer={handleAnswer}
                selectedAnswer={sectionAnswers[currentQuestion]}
              />
              
              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    currentQuestion === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-500 text-white hover:bg-gray-600'
                  }`}
                >
                  ← Previous
                </button>
                
                <button
                  onClick={handleSkip}
                  disabled={currentQuestion === actualQuestions.length - 1}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    currentQuestion === actualQuestions.length - 1
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-yellow-500 text-white hover:bg-yellow-600'
                  }`}
                >
                  Skip Question →
                </button>
              </div>
            </>
          ) : (
            <p className="text-red-500">Error: No question available</p>
          )}
        </div>
      )}
    </div>
  );
}