import React, { useState, useEffect } from "react";
import { X, Award, AlertCircle } from "lucide-react"; // Add AlertCircle for fail message

export default function ExamModal({ isOpen, onClose, exam, userId, onComplete }) {
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [hasPassed, setHasPassed] = useState(false);
  const [hasFailed, setHasFailed] = useState(false); // New state for failure
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && exam && userId) {
      const checkExamStatus = async () => {
        setLoading(true);
        try {
          const response = await fetch("/api/user-exams/check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, examId: exam.id }),
          });
          const data = await response.json();
          if (data.passed) {
            setHasPassed(true);
            onComplete(true);
          }
        } catch (error) {
          console.error("Failed to check exam status:", error);
        }
        setLoading(false);
      };
      checkExamStatus();
    }
  }, [isOpen, exam, userId, onComplete]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setHasFailed(false); // Reset failure state
    let score = 0;
    exam.questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) score += q.points;
    });
    const totalPoints = exam.questions.reduce((sum, q) => sum + q.points, 0);
    const passed = (score / totalPoints) * 100 >= (exam.passingScore || 70);

    try {
      const response = await fetch("/api/user-exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          examId: exam.id,
          score,
          passed,
        }),
      });

      if (response.ok) {
        setHasPassed(passed);
        setHasFailed(!passed); // Set failure state if not passed
        onComplete(passed);
      } else {
        console.error("Failed to submit exam:", await response.json());
      }
    } catch (error) {
      console.error("Failed to submit exam:", error);
    }
    setSubmitting(false);
  };

  if (!isOpen || !exam) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{exam.title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <p>Loading exam status...</p>
        ) : hasPassed ? (
          <div className="text-center">
            <Award className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-green-600">Congratulations!</p>
            <p>You have passed the final exam and earned your certificate.</p>
          </div>
        ) : hasFailed ? (
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-red-600">Exam Failed</p>
            <p>
              Your score did not meet the passing threshold of {exam.passingScore || 70}%. Please try again.
            </p>
            <button
              onClick={() => setHasFailed(false)} // Allow retry
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Retry Exam
            </button>
          </div>
        ) : exam.questions.length === 0 ? (
          <p>No questions available.</p>
        ) : (
          <div className="space-y-4">
            {exam.questions.map((question) => (
              <div key={question.id} className="border-b pb-4">
                <p className="font-medium">{question.content}</p>
                <div className="mt-2 space-y-2">
                  {question.answers.map((answer) => (
                    <label key={answer} className="flex items-center">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={answer}
                        checked={answers[question.id] === answer}
                        onChange={() => handleAnswerChange(question.id, answer)}
                        className="mr-2"
                      />
                      {answer}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button
              onClick={handleSubmit}
              disabled={submitting || !userId}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {submitting ? "Submitting..." : "Submit Exam"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}