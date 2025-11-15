import LandingHeader from "@/components/pages/LandingPage/LandingHeader";
import { grammarQuestions, listeningQuestions, readingQuestions, vocabularyQuestions } from "@/components/pages/PlacementTestPage/Data";
import ResultsComponent from "@/components/pages/PlacementTestPage/ResultsComponent";
import SectionComponent from "@/components/pages/PlacementTestPage/SectionComponent";
import React, { useState } from "react";

export default function PlacementTest() {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [testStarted, setTestStarted] = useState(false);

  const sections = [
    { name: "Grammar", questions: grammarQuestions },
    { name: "Vocabulary", questions: vocabularyQuestions },
    { name: "Reading", questions: readingQuestions },
    { name: "Listening", questions: listeningQuestions }
  ];

  const handleSectionComplete = (sectionAnswers) => {
    setAnswers((prev) => ({ ...prev, [currentSection]: sectionAnswers }));
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleStartTest = () => {
    setTestStarted(true);
  };

  const handleRestart = () => {
    setCurrentSection(0);
    setAnswers({});
    setShowResults(false);
    setTestStarted(false);
  };

  const overallProgress = ((currentSection) / sections.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader />
      <main className="py-8 pt-32 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Medical English Placement Test
          </h1>
          <p className="text-gray-600 text-lg">
            Assess your medical English proficiency level (A1 - C2)
          </p>
        </div>

        {!testStarted && !showResults ? (
          <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Welcome to the Placement Test
            </h2>
            <div className="space-y-4 text-gray-700 mb-6">
              <p>
                This comprehensive test will evaluate your medical English skills across four key areas:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Grammar</strong> - 50 questions testing your understanding of English grammar in medical contexts</li>
                <li><strong>Vocabulary</strong> - 50 questions assessing medical terminology and word usage</li>
                <li><strong>Reading</strong> - 30 questions evaluating comprehension of medical texts</li>
                <li><strong>Listening</strong> - 18 questions based on a medical consultation video</li>
              </ul>
              <p className="mt-4 text-sm text-gray-600">
                <strong>Total Questions:</strong> 148 questions<br />
                <strong>Estimated Time:</strong> 60-90 minutes<br />
                <strong>Format:</strong> Multiple choice and gap-fill questions
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                <p className="text-sm">
                  <strong>Note:</strong> Once you start, you cannot pause the test. Make sure you have enough time to complete it in one sitting.
                </p>
              </div>
            </div>
            <button
              onClick={handleStartTest}
              className="w-full bg-blue-500 text-white px-6 py-4 rounded-md hover:bg-blue-600 transition-colors text-lg font-semibold"
            >
              Start Placement Test
            </button>
          </div>
        ) : !showResults ? (
          <>
            {/* Overall Progress */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold text-gray-700">Overall Test Progress</h3>
                <span className="text-sm text-gray-600">
                  Section {currentSection + 1} of {sections.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${overallProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                {sections.map((section, idx) => (
                  <span
                    key={idx}
                    className={`${
                      idx < currentSection
                        ? "text-green-600 font-semibold"
                        : idx === currentSection
                        ? "text-blue-600 font-semibold"
                        : ""
                    }`}
                  >
                    {section.name}
                  </span>
                ))}
              </div>
            </div>

            <SectionComponent
              section={sections[currentSection]}
              sectionIndex={currentSection}
              onComplete={handleSectionComplete}
            />
          </>
        ) : (
          <ResultsComponent answers={answers} sections={sections} onRestart={handleRestart} />
        )}
      </main>
    </div>
  );
}