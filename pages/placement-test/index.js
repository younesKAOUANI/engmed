import LandingHeader from "@/components/pages/LandingPage/LandingHeader";
import { grammarQuestions, listeningQuestions, readingQuestions, vocabularyQuestions } from "@/components/pages/PlacementTestPage/Data";
import ResultsComponent from "@/components/pages/PlacementTestPage/ResultsComponent";
import SectionComponent from "@/components/pages/PlacementTestPage/SectionComponent";
import React, { useState } from "react";

export default function PlacementTest() {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

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

  return (
    <div>
      <LandingHeader />
    <main className="py-8 pt-32 px-4 max-w-7xl mx-auto">

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Medical English Placement Test</h1>
      {!showResults ? (
        <SectionComponent
          section={sections[currentSection]}
          sectionIndex={currentSection}
          onComplete={handleSectionComplete}
          />
        ) : (
          <ResultsComponent answers={answers} sections={sections} />
        )}
    </main>
        </div>
  );
}