import React, { useState } from "react";
import Title from "@/components/ui/Title";
import Button from "@/components/ui/Button";

export default function PlacementTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [level, setLevel] = useState(null);

  // 40 multiple-choice questions
  const questions = [
    // A1 Level (Questions 1-5)
    {
      question: "What ___ your name?",
      options: ["is", "are", "am", "be"],
      correct: "is",
    },
    {
      question: "I ___ a student.",
      options: ["am", "is", "are", "be"],
      correct: "am",
    },
    {
      question: "This is ___ book.",
      options: ["a", "an", "the", "some"],
      correct: "a",
    },
    {
      question: "How many ___ are there?",
      options: ["cat", "cats", "cat’s", "cats’"],
      correct: "cats",
    },
    {
      question: "Where ___ you from?",
      options: ["is", "are", "am", "be"],
      correct: "are",
    },
    // A2 Level (Questions 6-10)
    {
      question: "She ___ to school every day.",
      options: ["go", "goes", "going", "gone"],
      correct: "goes",
    },
    {
      question: "I don’t like ___ coffee.",
      options: ["drink", "drinking", "to drink", "drinks"],
      correct: "drinking",
    },
    {
      question: "What time ___ the movie start?",
      options: ["do", "does", "is", "are"],
      correct: "does",
    },
    {
      question: "He is ___ than his brother.",
      options: ["tall", "taller", "tallest", "more tall"],
      correct: "taller",
    },
    {
      question: "Yesterday, I ___ to the park.",
      options: ["go", "went", "gone", "going"],
      correct: "went",
    },
    // B1 Level (Questions 11-20)
    {
      question: "If I ___ you, I would study more.",
      options: ["am", "was", "were", "be"],
      correct: "were",
    },
    {
      question: "She ___ her homework yet.",
      options: ["hasn’t finished", "didn’t finish", "doesn’t finish", "finish"],
      correct: "hasn’t finished",
    },
    {
      question: "The book ___ I read was amazing.",
      options: ["who", "which", "whose", "where"],
      correct: "which",
    },
    {
      question: "He asked me ___ I was going.",
      options: ["where", "when", "why", "who"],
      correct: "where",
    },
    {
      question: "They ___ in London since 2010.",
      options: ["live", "lived", "have lived", "are living"],
      correct: "have lived",
    },
    {
      question: "This is the ___ movie I’ve ever seen.",
      options: ["best", "better", "good", "most good"],
      correct: "best",
    },
    {
      question: "I wish I ___ more time to study.",
      options: ["have", "had", "has", "having"],
      correct: "had",
    },
    {
      question: "The teacher told us ___ quiet.",
      options: ["be", "to be", "being", "been"],
      correct: "to be",
    },
    {
      question: "Choose the correct word: I’m ___ in learning English.",
      options: ["interesting", "interested", "interest", "interests"],
      correct: "interested",
    },
    {
      question: "What does ‘huge’ mean?",
      options: ["Small", "Big", "Fast", "Slow"],
      correct: "Big",
    },
    // B2 Level (Questions 21-30)
    {
      question: "By the time we arrived, the movie ___.",
      options: ["starts", "started", "had started", "has started"],
      correct: "had started",
    },
    {
      question: "I’d rather you ___ me the truth.",
      options: ["tell", "told", "tells", "telling"],
      correct: "told",
    },
    {
      question: "The meeting was ___ due to bad weather.",
      options: ["cancelled", "cancel", "cancelling", "cancels"],
      correct: "cancelled",
    },
    {
      question: "She’s not used to ___ in a big city.",
      options: ["live", "living", "lived", "lives"],
      correct: "living",
    },
    {
      question: "Choose the correct idiom: It’s raining ___.",
      options: ["cats and dogs", "birds and bees", "fish and chips", "salt and pepper"],
      correct: "cats and dogs",
    },
    {
      question: "What does ‘reluctant’ mean?",
      options: ["Eager", "Unwilling", "Excited", "Confident"],
      correct: "Unwilling",
    },
    {
      question: "He ___ have forgotten his lines; he practiced so much!",
      options: ["mustn’t", "can’t", "shouldn’t", "won’t"],
      correct: "can’t",
    },
    {
      question: "The report needs ___ by tomorrow.",
      options: ["to finish", "finishing", "finished", "be finished"],
      correct: "finishing",
    },
    {
      question: "Choose the correct word: Her speech was very ___.",
      options: ["inspiring", "inspired", "inspire", "inspiration"],
      correct: "inspiring",
    },
    {
      question: "What is a synonym for ‘quickly’?",
      options: ["Slowly", "Rapidly", "Carefully", "Loudly"],
      correct: "Rapidly",
    },
    // C1 Level (Questions 31-35)
    {
      question: "Had I known about the delay, I ___ earlier.",
      options: ["would leave", "would have left", "will leave", "had left"],
      correct: "would have left",
    },
    {
      question: "The decision was made ___ careful consideration.",
      options: ["after", "before", "during", "without"],
      correct: "after",
    },
    {
      question: "She’s ___ to take on the new project.",
      options: ["keen", "eager", "reluctant", "both a and b"],
      correct: "both a and b",
    },
    {
      question: "What does ‘mitigate’ mean?",
      options: ["Worsen", "Reduce", "Ignore", "Increase"],
      correct: "Reduce",
    },
    {
      question: "The lecture was so ___ that I lost interest.",
      options: ["tedious", "fascinating", "engaging", "lively"],
      correct: "tedious",
    },
    // C2 Level (Questions 36-40)
    {
      question: "His argument was utterly ___; it convinced everyone.",
      options: ["flawed", "compelling", "baseless", "irrelevant"],
      correct: "compelling",
    },
    {
      question: "Choose the correct phrase: The issue is ___.",
      options: ["fraught with difficulties", "devoid of merit", "ripe with opportunity", "lacking in substance"],
      correct: "fraught with difficulties",
    },
    {
      question: "What does ‘ephemeral’ mean?",
      options: ["Lasting", "Temporary", "Permanent", "Eternal"],
      correct: "Temporary",
    },
    {
      question: "Her speech was ___ with subtle humor.",
      options: ["laden", "devoid", "bereft", "scarce"],
      correct: "laden",
    },
    {
      question: "Choose the correct word: His decision was ___ criticized.",
      options: ["harshly", "scarcely", "barely", "mildly"],
      correct: "harshly",
    },
  ];

  const handleAnswer = (option) => {
    setAnswers({ ...answers, [currentQuestion]: option });
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correct) {
        correctAnswers++;
      }
    });
    const scorePercentage = (correctAnswers / questions.length) * 100;
    setScore(correctAnswers);

    // Determine CEFR level based on score
    if (scorePercentage <= 20) {
      setLevel("A1");
    } else if (scorePercentage <= 40) {
      setLevel("A2");
    } else if (scorePercentage <= 60) {
      setLevel("B1");
    } else if (scorePercentage <= 80) {
      setLevel("B2");
    } else if (scorePercentage <= 95) {
      setLevel("C1");
    } else {
      setLevel("C2");
    }
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setScore(null);
    setLevel(null);
  };

  if (score !== null) {
    return (
      <main className="py-8 px-4 max-w-7xl mx-auto">
        <Title>Placement Test Results</Title>
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-900">
            Your Score: {score} / {questions.length}
          </p>
          <p className="text-xl text-gray-700 mt-2">
            Your English Level: <span className="font-bold">{level}</span>
          </p>
          <p className="text-gray-600 mt-4">
            {level === "A1" && "Beginner: You are starting your English journey. Focus on basic vocabulary and grammar."}
            {level === "A2" && "Elementary: You can handle simple conversations and basic texts."}
            {level === "B1" && "Intermediate: You can communicate in familiar situations and understand main ideas."}
            {level === "B2" && "Upper-Intermediate: You can discuss a range of topics and understand complex texts."}
            {level === "C1" && "Advanced: You can use English fluently in most professional and academic contexts."}
            {level === "C2" && "Proficient: You have near-native fluency and can handle any situation in English."}
          </p>
          <Button
            onClick={resetTest}
            className="mt-6 bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark mx-auto"
          >
            Retake Test
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="py-8 px-4 max-w-7xl mx-auto">
      <Title>English Placement Test</Title>
      <p className="text-gray-600 mb-6">
        Answer the following questions to determine your English proficiency level.
      </p>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Question {currentQuestion + 1} of {questions.length}
        </h2>
        <p className="text-gray-700 mb-4">{questions[currentQuestion].question}</p>
        <div className="grid grid-cols-1 gap-2">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className="text-left p-3 border rounded-md hover:bg-gray-100"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}