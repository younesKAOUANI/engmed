import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, Mic, Square } from "lucide-react";

export default function SpeechQuizModal({ isOpen, onClose, sequence, onComplete, userId }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const questions = sequence?.speechQuiz?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (isOpen) {
      console.log("SpeechQuizModal - sequence:", sequence);
      console.log("SpeechQuizModal - questions:", questions);
      setCurrentQuestionIndex(0);
      setAudioBlob(null);
      setIsRecording(false);
      setError(null);
    }
  }, [isOpen, sequence]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(blob);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      setError("Failed to access microphone");
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const handleSubmit = async () => {
    if (!audioBlob) {
      setError("Please record an answer before submitting");
      return;
    }

    if (!currentQuestion) {
      setError("No question available to submit");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "response.webm");
      formData.append("userId", userId);
      formData.append("speechQuizId", sequence.speechQuiz.id);
      formData.append("questionId", currentQuestion.id);

      const response = await axios.post("/api/user-speech-quizzes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setAudioBlob(null);
        setIsRecording(false);
      } else {
        onComplete(sequence.id, false); // Mark as pending (not passed yet)
        onClose();
      }
    } catch (err) {
      setError("Failed to submit speech quiz");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !sequence?.speechQuiz) return null;

  if (!currentQuestion) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-lg w-full">
          <h2 className="text-xl font-semibold mb-4">Speech Quiz: {sequence.speechQuiz.title}</h2>
          <p className="text-red-500 mb-4">No questions available for this speech quiz.</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4">Speech Quiz: {sequence.speechQuiz.title}</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <p className="text-lg font-medium">Prompt {currentQuestionIndex + 1}:</p>
          <p className="text-gray-700">{currentQuestion.content}</p>
        </div>
        <div className="flex justify-center mb-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-2 rounded-full ${isRecording ? "bg-red-500" : "bg-blue-500"} text-white`}
            disabled={isSubmitting}
          >
            {isRecording ? <Square className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
        </div>
        {audioBlob && (
          <div className="mb-4">
            <audio controls src={URL.createObjectURL(audioBlob)} className="w-full" />
          </div>
        )}
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={isSubmitting || !audioBlob}
          >
            {currentQuestionIndex < questions.length - 1 ? "Next" : "Submit"}
          </button>
        </div>
        {isSubmitting && (
          <div className="flex justify-center mt-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}