import React from "react";

export default function ResultsComponent({ answers, sections }) {
  const calculateScore = () => {
    let score = 0;
    sections.forEach((section, sectionIndex) => {
      const actualQuestions = section.questions.reduce((acc, item) => {
        if (item.type === "reordering") {
          return [...acc, ...item.questions];
        } else if (item.type !== "text") {
          return [...acc, item];
        }
        return acc;
      }, []);
      const sectionAnswers = answers[sectionIndex] || {};
      actualQuestions.forEach((question, questionIndex) => {
        const userAnswer = sectionAnswers[questionIndex];
        if (question.type === "gapfill") {
          if (userAnswer?.toLowerCase().trim() === question.correct.toLowerCase().trim()) {
            score++;
          }
        } else {
          if (userAnswer === question.correct) {
            score++;
          }
        }
      });
    });
    return score;
  };

  const totalQuestions = sections.reduce(
    (sum, section) =>
      sum +
      section.questions.reduce((acc, item) => {
        if (item.type === "reordering") {
          return acc + item.questions.length;
        } else if (item.type !== "text") {
          return acc + 1;
        }
        return acc;
      }, 0),
    0
  );
  const score = calculateScore();
  const percentage = (score / totalQuestions) * 100;

  const getLevel = () => {
    if (score >= 130) return "C2";
    if (score >= 115) return "C1";
    if (score >= 100) return "B2";
    if (score >= 80) return "B1";
    if (score >= 60) return "A2";
    return "A1";
  };

  const level = getLevel();
  const descriptors = {
    C2: "Can use Medical English with full accuracy, flexibility, and nuance",
    C1: "Can use language fluently, with minor errors in complex contexts",
    B2: "Can interact clearly on medical topics, though with occasional mistakes",
    B1: "Can handle familiar topics and routine medical tasks with some errors",
    A2: "Can understand and use basic expressions in limited professional contexts",
    A1: "Can understand very simple phrases, needs strong support in communication"
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Placement Test Results</h2>
      <p className="text-xl text-gray-700">
        Your Score: {score} / {totalQuestions}
      </p>
      <p className="text-xl text-gray-700 mt-2">
        Your English Level: <span className="font-bold">{level}</span>
      </p>
      <p className="text-gray-600 mt-4">{descriptors[level]}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
      >
        Retake Test
      </button>
    </div>
  );
}