import React, { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";

export default function QuizModal({ isOpen, onClose, sequence, onComplete }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasPassed, setHasPassed] = useState(false);
  const [resultMessage, setResultMessage] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  const { data: session } = useSession();
  const userId = session?.user?.id;

  // Fisher-Yates shuffle
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    if (isOpen && sequence?.quiz && userId && !resultMessage) { // Only fetch if no result yet
      const fetchQuizData = async () => {
        console.log("Opening quiz modal for sequence:", sequence.id, "Quiz ID:", sequence.quiz.id);
        setLoading(true);
        setHasPassed(false);
        setResultMessage(null);
        setAnswers({});
        setTimeLeft(300);

        try {
          const quizResponse = await fetch(`/api/quizzes/${sequence.quiz.id}`);
          if (!quizResponse.ok) throw new Error("Failed to fetch quiz");
          const quizData = await quizResponse.json();
          console.log("Quiz data received:", quizData);

          const shuffledQuestions = shuffleArray(quizData.questions || []);
          console.log("Shuffled questions:", shuffledQuestions);
          setQuestions(shuffledQuestions);

          const userQuizResponse = await fetch(`/api/user-quizzes/check`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, quizId: sequence.quiz.id }),
          });
          if (!userQuizResponse.ok) throw new Error("Failed to check quiz status");
          const userQuizData = await userQuizResponse.json();
          console.log("Quiz status check:", userQuizData);
          if (userQuizData.passed) {
            setHasPassed(true);
            setResultMessage("You have already passed this quiz.");
            onComplete(sequence.id, true);
          }
        } catch (error) {
          console.error("Error fetching quiz data:", error);
          setResultMessage("Error loading quiz");
        } finally {
          setLoading(false);
        }
      };
      fetchQuizData();
    }
  }, [isOpen, sequence, userId, onComplete, resultMessage]); // Added resultMessage to prevent reset

  useEffect(() => {
    if (!isOpen || !timeLeft || resultMessage) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setAnswers({});
          setResultMessage("Time’s up! You can retry or close the quiz.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft, resultMessage]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    console.log("Answer selected:", { questionId, answer });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setResultMessage(null);
    console.log("Submitting quiz with answers:", answers);

    let score = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) score += q.points;
    });
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
    const passed = (score / totalPoints) * 100 >= 70;

    try {
      const response = await fetch("/api/user-quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          quizId: sequence.quiz.id,
          score,
          passed,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit quiz");

      const message = passed
        ? "Quiz Passed! You can close the quiz."
        : "Quiz Failed! You can retry or close the quiz.";
      setResultMessage(message);
      setHasPassed(passed);
      onComplete(sequence.id, passed);
      console.log("Quiz submission result:", { passed, score, totalPoints, message });
    } catch (error) {
      console.error("Failed to submit quiz:", error);
      setResultMessage("Error submitting quiz");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!isOpen || !sequence?.quiz) return null;

  console.log("Rendering QuizModal with state:", {
    loading,
    hasPassed,
    resultMessage,
    questionsCount: questions.length,
    answers,
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{sequence.quiz.title}</h3>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Time Left: {formatTime(timeLeft)}</span>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {loading ? (
          <p>Loading quiz...</p>
        ) : resultMessage ? (
          <div className="text-center">
            {hasPassed ? (
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            ) : (
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            )}
            <p className={`text-lg font-medium ${hasPassed ? "text-green-600" : "text-red-600"}`}>
              {resultMessage}
            </p>
            <button
              onClick={onClose}
              className="mt-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Close
            </button>
            {!hasPassed && (
              <button
                onClick={() => {
                  setAnswers({});
                  setResultMessage(null);
                  setTimeLeft(300);
                  setQuestions(shuffleArray(questions));
                  console.log("Retrying quiz, reshuffled questions:", questions);
                }}
                className="mt-2 mx-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Retry
              </button>
            )}
          </div>
        ) : questions.length === 0 ? (
          <p>No questions available.</p>
        ) : hasPassed ? (
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-green-600">Quiz Passed!</p>
            <p>You have already completed this quiz successfully.</p>
            <button
              onClick={onClose}
              className="mt-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question) => (
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
                        disabled={submitting}
                      />
                      {answer}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {submitting ? "Submitting..." : "Submit Quiz"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}