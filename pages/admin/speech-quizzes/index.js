import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

export default function SpeechQuizReview() {
  const { data: session } = useSession();
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (session?.user?.role !== "ADMIN") return;
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get("/api/admin/speech-quizzes");
        console.log("Response data:", response.data);
        const data = Array.isArray(response.data) ? response.data : response.data.submissions || [];
        setSubmissions(data);
      } catch (err) {
        setError("Failed to fetch submissions");
        console.error("Fetch error:", err.response?.status, err.response?.data || err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubmissions();
  }, [session]);

  const handleInputChange = (submissionId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [submissionId]: { ...prev[submissionId], [field]: value },
    }));
  };

  const handleSubmit = async (submissionId) => {
    const { score, notes, passed } = formData[submissionId] || {};
    if (score === undefined || passed === undefined) {
      alert("Please provide score and pass status");
      return;
    }
    try {
      const response = await axios.put("/api/admin/speech-quizzes", {
        id: submissionId,
        score: parseInt(score),
        notes,
        passed: passed === "true",
      });
      setSubmissions((prev) => prev.filter((sub) => sub.id !== submissionId));
      setFormData((prev) => {
        const newFormData = { ...prev };
        delete newFormData[submissionId];
        return newFormData;
      });
      alert("Submission scored successfully");
    } catch (err) {
      alert("Failed to score submission");
      console.error(err);
    }
  };

  if (!session || session.user.role !== "ADMIN") {
    return <div className="text-center text-red-500">Access denied. Admins only.</div>;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <main className="py-6 px-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Speech Quiz Submissions</h1>
      {submissions.length === 0 ? (
        <p className="text-gray-500">No pending submissions</p>
      ) : (
        <ul className="space-y-4">
          {submissions.map((submission) => (
            <li key={submission.id} className="border p-4 rounded shadow">
              <p>
                <strong>User:</strong> {submission.user?.name || "Unknown"} (
                {submission.user?.email || "Unknown"})
              </p>
              <p>
                <strong>Quiz:</strong> {submission.speechQuiz?.title || "Unknown"}
              </p>
              <p>
                <strong>Prompt:</strong> {submission.question?.content || "Unknown"}
              </p>
              <div className="my-2">
                <audio controls src={submission.audioUrl} className="w-full" />
              </div>
              <div className="grid gap-2">
                <input
                  type="number"
                  placeholder="Score (0-100)"
                  value={formData[submission.id]?.score || ""}
                  onChange={(e) => handleInputChange(submission.id, "score", e.target.value)}
                  className="border p-2 rounded"
                />
                <textarea
                  placeholder="Notes"
                  value={formData[submission.id]?.notes || ""}
                  onChange={(e) => handleInputChange(submission.id, "notes", e.target.value)}
                  className="border p-2 rounded"
                />
                <select
                  value={formData[submission.id]?.passed || ""}
                  onChange={(e) => handleInputChange(submission.id, "passed", e.target.value)}
                  className="border p-2 rounded"
                >
                  <option value="">Select Pass/Fail</option>
                  <option value="true">Pass</option>
                  <option value="false">Fail</option>
                </select>
                <button
                  onClick={() => handleSubmit(submission.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Submit Review
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}