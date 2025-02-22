import React, { useState } from "react";
import { CheckCircle, BookOpen, GraduationCap } from "lucide-react"; // Add GraduationCap icon
import QuizModal from "./QuizModal";
import ExamModal from "./ExamModal"; // New component for final exam

export default function CourseSidebar({ sequences, activeSequence, setActiveSequence, onSequenceUpdate, userId, exam, onExamComplete }) {
  const [selectedSequence, setSelectedSequence] = useState(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isExamOpen, setIsExamOpen] = useState(false);

  const handleQuizOpen = (sequence) => {
    setSelectedSequence(sequence);
    setIsQuizOpen(true);
  };

  const handleQuizComplete = (sequenceId, passed) => {
    const updatedSequences = sequences.map((seq) =>
      seq.id === sequenceId ? { ...seq, completed: passed } : seq
    );
    setActiveSequence(updatedSequences.find((seq) => seq.id === activeSequence?.id) || null);
    if (onSequenceUpdate) {
      onSequenceUpdate(updatedSequences);
    }
    setIsQuizOpen(false);
  };

  const handleExamOpen = () => {
    setIsExamOpen(true);
  };

  const allSequencesCompleted = sequences.every((seq) => seq.completed || !seq.quiz); // Check if all sequences with quizzes are completed

  return (
    <aside className="md:w-1/4 bg-white p-4 overflow-y-auto rounded-md shadow-md flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Course Content</h2>
      <ul className="space-y-2 flex-grow">
        {sequences.map((sequence) => (
          <li
            key={sequence.id}
            className={`p-2 rounded cursor-pointer flex items-center justify-between ${
              activeSequence?.id === sequence.id ? "bg-primary/30" : "hover:bg-gray-100"
            }`}
            onClick={() => setActiveSequence(sequence)}
          >
            <div className="flex items-center w-full">
              <span className="flex-1">{sequence.title}</span>
              {sequence.quiz && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuizOpen(sequence);
                  }}
                  className="ml-2 p-1 text-blue-500 hover:text-blue-700"
                  title="Take Quiz"
                >
                  <BookOpen className="w-5 h-5" />
                </button>
              )}
              {sequence.completed && (
                <div className="flex items-center ml-2 text-green-500">
                  <CheckCircle className="w-5 h-5" />
                  <span className="ml-1 text-sm font-medium">Completed</span>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
      {allSequencesCompleted && exam && (
        <button
          onClick={handleExamOpen}
          className="mt-4 w-full bg-green-500 text-white py-2 rounded flex items-center justify-center hover:bg-green-600"
        >
          <GraduationCap className="w-5 h-5 mr-2" />
          Take Final Exam
        </button>
      )}
      {selectedSequence && (
        <QuizModal
          isOpen={isQuizOpen}
          onClose={() => setIsQuizOpen(false)}
          sequence={selectedSequence}
          onComplete={handleQuizComplete}
          userId={userId}
        />
      )}
      {exam && (
        <ExamModal
          isOpen={isExamOpen}
          onClose={() => setIsExamOpen(false)}
          exam={exam}
          userId={userId}
          onComplete={onExamComplete}
        />
      )}
    </aside>
  );
}