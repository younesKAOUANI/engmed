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
  const [formErrors, setFormErrors] = useState({}); // Field-level errors

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
    // Clear error for this field
    if (formErrors[submissionId]?.[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [submissionId]: { ...prev[submissionId], [field]: "" },
      }));
    }
  };

  const handleSubmit = async (submissionId) => {
    const { score, notes, passed } = formData[submissionId] || {};
    
    // Validation
    const errors = {};
    if (score === undefined || score === "" || isNaN(score)) {
      errors.score = "Score is required and must be a number";
    } else if (parseInt(score) < 0 || parseInt(score) > 100) {
      errors.score = "Score must be between 0 and 100";
    }
    if (passed === undefined || passed === "") {
      errors.passed = "Please select Pass or Fail";
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors((prev) => ({ ...prev, [submissionId]: errors }));
      return;
    }
    
    try {
      const response = await axios.put("/api/admin/speech-quizzes", {
        id: submissionId,
        score: parseInt(score),
        notes: notes || "",
        passed: passed === "true",
      });
      setSubmissions((prev) => prev.filter((sub) => sub.id !== submissionId));
      setFormData((prev) => {
        const newFormData = { ...prev };
        delete newFormData[submissionId];
        return newFormData;
      });
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[submissionId];
        return newErrors;
      });
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to score submission";
      setFormErrors((prev) => ({
        ...prev,
        [submissionId]: { submit: errorMessage },
      }));
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
                <div>
                  <input
                    type="number"
                    placeholder="Score (0-100)"
                    value={formData[submission.id]?.score || ""}
                    onChange={(e) => handleInputChange(submission.id, "score", e.target.value)}
                    className={`border p-2 rounded w-full ${
                      formErrors[submission.id]?.score ? "border-red-500" : ""
                    }`}
                    min="0"
                    max="100"
                  />
                  {formErrors[submission.id]?.score && (
                    <p className="text-red-500 text-sm mt-1">{formErrors[submission.id].score}</p>
                  )}
                </div>
                <div>
                  <textarea
                    placeholder="Notes (optional)"
                    value={formData[submission.id]?.notes || ""}
                    onChange={(e) => handleInputChange(submission.id, "notes", e.target.value)}
                    className="border p-2 rounded w-full"
                    rows={3}
                  />
                </div>
                <div>
                  <select
                    value={formData[submission.id]?.passed || ""}
                    onChange={(e) => handleInputChange(submission.id, "passed", e.target.value)}
                    className={`border p-2 rounded w-full ${
                      formErrors[submission.id]?.passed ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">Select Pass/Fail</option>
                    <option value="true">Pass</option>
                    <option value="false">Fail</option>
                  </select>
                  {formErrors[submission.id]?.passed && (
                    <p className="text-red-500 text-sm mt-1">{formErrors[submission.id].passed}</p>
                  )}
                </div>
                {formErrors[submission.id]?.submit && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {formErrors[submission.id].submit}
                  </div>
                )}
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