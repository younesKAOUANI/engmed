import React from "react";

export default function ResultsComponent({ answers, sections, onRestart }) {
  const calculateScore = () => {
    let score = 0;
    let sectionScores = [];
    
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
      let sectionScore = 0;
      
      actualQuestions.forEach((question, questionIndex) => {
        const userAnswer = sectionAnswers[questionIndex];
        if (question.type === "gapfill") {
          if (userAnswer && userAnswer.toLowerCase().trim() === question.correct.toLowerCase().trim()) {
            score++;
            sectionScore++;
          }
        } else {
          if (userAnswer === question.correct) {
            score++;
            sectionScore++;
          }
        }
      });
      
      sectionScores.push({
        name: section.name,
        score: sectionScore,
        total: actualQuestions.length,
        percentage: ((sectionScore / actualQuestions.length) * 100).toFixed(1)
      });
    });
    
    return { totalScore: score, sectionScores };
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
  
  const { totalScore, sectionScores } = calculateScore();
  const percentage = ((totalScore / totalQuestions) * 100).toFixed(1);

  const getLevel = () => {
    if (totalScore >= 130) return "C2";
    if (totalScore >= 115) return "C1";
    if (totalScore >= 100) return "B2";
    if (totalScore >= 80) return "B1";
    if (totalScore >= 60) return "A2";
    return "A1";
  };

  const level = getLevel();
  
  const levelInfo = {
    C2: {
      title: "Proficiency",
      description: "Can use Medical English with full accuracy, flexibility, and nuance in all professional contexts.",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-500"
    },
    C1: {
      title: "Advanced",
      description: "Can use language fluently and spontaneously, with only minor errors in complex medical contexts.",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-500"
    },
    B2: {
      title: "Upper Intermediate",
      description: "Can interact clearly on medical topics and understand complex texts, though with occasional mistakes.",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-500"
    },
    B1: {
      title: "Intermediate",
      description: "Can handle familiar medical topics and routine tasks with some errors but good comprehension.",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-500"
    },
    A2: {
      title: "Elementary",
      description: "Can understand and use basic medical expressions in limited professional contexts.",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-500"
    },
    A1: {
      title: "Beginner",
      description: "Can understand very simple medical phrases but needs strong support in communication.",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-500"
    }
  };

  const currentLevel = levelInfo[level];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            🎉 Test Completed!
          </h2>
          <p className="text-gray-600">Here are your results</p>
        </div>

        {/* Overall Score */}
        <div className={`${currentLevel.bgColor} border-2 ${currentLevel.borderColor} p-6 rounded-lg mb-6`}>
          <div className="text-center">
            <div className="mb-3">
              <span className="text-5xl font-bold text-gray-900">{totalScore}</span>
              <span className="text-2xl text-gray-600"> / {totalQuestions}</span>
            </div>
            <div className="text-lg text-gray-700 mb-2">
              Score: <strong>{percentage}%</strong>
            </div>
            <div className={`text-4xl font-bold ${currentLevel.color} mb-2`}>
              Level {level}
            </div>
            <div className="text-xl font-semibold text-gray-800 mb-2">
              {currentLevel.title}
            </div>
            <p className="text-gray-700 max-w-2xl mx-auto">
              {currentLevel.description}
            </p>
          </div>
        </div>

        {/* Section Breakdown */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Section Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sectionScores.map((section, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-800">{section.name}</h4>
                  <span className="text-sm text-gray-600">
                    {section.score} / {section.total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${section.percentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{section.percentage}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">📚 Recommendations</h3>
          <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
            {level === "A1" || level === "A2" ? (
              <>
                <li>Focus on building basic medical vocabulary</li>
                <li>Practice common grammar structures</li>
                <li>Start with simple medical texts and dialogues</li>
              </>
            ) : level === "B1" || level === "B2" ? (
              <>
                <li>Expand your medical terminology knowledge</li>
                <li>Practice reading medical journals and articles</li>
                <li>Work on complex grammar structures</li>
              </>
            ) : (
              <>
                <li>Continue reading advanced medical literature</li>
                <li>Practice medical presentations and discussions</li>
                <li>Refine your writing skills for research papers</li>
              </>
            )}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onRestart}
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors font-semibold"
          >
            Retake Test
          </button>
          <button
            onClick={() => window.print()}
            className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition-colors font-semibold"
          >
            Print Results
          </button>
        </div>
      </div>
    </div>
  );
}