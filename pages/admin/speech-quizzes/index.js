import React, { useState, useEffect } from "react";
import Head from "next/head";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Mic, CheckCircle, XCircle, ChevronDown } from "lucide-react";
import Button from "@/components/ui/Button";
import Input, { Textarea } from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";

export default function SpeechQuizReview() {
  const { data: session } = useSession();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState({});
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (session?.user?.role !== "ADMIN") return;
    axios.get("/api/admin/speech-quizzes")
      .then(r => {
        const data = Array.isArray(r.data) ? r.data : r.data.submissions || [];
        setSubmissions(data);
      })
      .catch(() => setError("Failed to fetch submissions"))
      .finally(() => setLoading(false));
  }, [session]);

  const setField = (id, field, val) => {
    setFormData(p => ({ ...p, [id]: { ...p[id], [field]: val } }));
    setFormErrors(p => ({ ...p, [id]: { ...p[id], [field]: "" } }));
  };

  const handleScore = async (id) => {
    const { score, notes, passed } = formData[id] || {};
    const errs = {};
    if (score === undefined || score === "" || isNaN(score)) errs.score = "Required (0–100).";
    else if (+score < 0 || +score > 100) errs.score = "Must be 0–100.";
    if (passed === undefined || passed === "") errs.passed = "Select pass or fail.";
    if (Object.keys(errs).length) return setFormErrors(p => ({ ...p, [id]: errs }));

    setSubmitting(p => ({ ...p, [id]: true }));
    try {
      await axios.put("/api/admin/speech-quizzes", { id, score: +score, notes: notes || "", passed: passed === "true" });
      setSubmissions(p => p.filter(s => s.id !== id));
      if (expanded === id) setExpanded(null);
    } catch (err) {
      setFormErrors(p => ({ ...p, [id]: { submit: err.response?.data?.error || "Failed to submit." } }));
    } finally {
      setSubmitting(p => ({ ...p, [id]: false }));
    }
  };

  if (!session || session.user.role !== "ADMIN") return <p className="text-danger">Access denied.</p>;

  return (
    <>
      <Head><title>Speech Quiz Reviews — Admin · EngMed</title></Head>
      <div className="flex flex-col gap-6 pb-12">

        <div>
          <h1 className="heading-lg text-ink-900">Speech Quiz Reviews</h1>
          <p className="body-sm text-ink-500 mt-0.5">
            {loading ? "…" : submissions.length === 0 ? "All caught up." : `${submissions.length} submission${submissions.length !== 1 ? "s" : ""} awaiting review`}
          </p>
        </div>

        {error && <p className="body-sm text-danger" role="alert">{error}</p>}

        {loading ? (
          <div className="flex flex-col gap-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-28 rounded-md" />)}</div>
        ) : submissions.length === 0 ? (
          <EmptyState
            icon={Mic}
            title="No pending submissions"
            description="All speech quiz submissions have been reviewed."
          />
        ) : (
          <div className="flex flex-col gap-4">
            {submissions.map(sub => {
              const isOpen = expanded === sub.id;
              const fd = formData[sub.id] || {};
              const fe = formErrors[sub.id] || {};
              return (
                <div key={sub.id} className="bg-surface border border-ink-100 rounded-md shadow-1 overflow-hidden">
                  {/* Row header */}
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : sub.id)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-surface2 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                      <Mic className="w-4 h-4 text-brand-600" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-ink-900 truncate">
                        {sub.user?.name ?? "Unknown"} — {sub.speechQuiz?.title ?? "Unknown quiz"}
                      </p>
                      <p className="body-sm text-ink-500 line-clamp-1">{sub.question?.content ?? "—"}</p>
                    </div>
                    <Badge variant="warning" size="sm">Pending</Badge>
                    <ChevronDown className={`w-4 h-4 text-ink-400 transition-transform duration-150 shrink-0 ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                  </button>

                  {/* Expanded panel */}
                  {isOpen && (
                    <div className="border-t border-ink-100 px-5 py-5 flex flex-col gap-5">
                      {/* Meta */}
                      <div className="grid sm:grid-cols-3 gap-3">
                        {[
                          { label: "Student", value: sub.user?.name },
                          { label: "Email", value: sub.user?.email },
                          { label: "Submitted", value: new Date(sub.attemptedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) },
                        ].map(({ label, value }) => (
                          <div key={label} className="bg-surface2 rounded-sm p-3">
                            <p className="eyebrow text-ink-500 mb-0.5">{label}</p>
                            <p className="body-sm text-ink-900 font-medium truncate">{value ?? "—"}</p>
                          </div>
                        ))}
                      </div>

                      {/* Prompt */}
                      <div className="bg-brand-50 border border-brand-200 rounded-sm p-4">
                        <p className="eyebrow text-brand-600 mb-1">Speaking prompt</p>
                        <p className="body-lg text-ink-900">{sub.question?.content ?? "—"}</p>
                      </div>

                      {/* Audio */}
                      <div>
                        <p className="eyebrow text-ink-500 mb-2">Student recording</p>
                        <audio
                          controls
                          src={sub.audioUrl}
                          className="w-full h-10 rounded-sm"
                          aria-label="Student audio submission"
                        />
                      </div>

                      {/* Scoring form */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Input
                          label="Score (0–100)"
                          type="number"
                          min="0" max="100"
                          value={fd.score ?? ""}
                          onChange={e => setField(sub.id, "score", e.target.value)}
                          error={fe.score}
                          placeholder="e.g. 78"
                          required
                        />
                        <div className="flex flex-col gap-1.5">
                          <label className="eyebrow text-ink-700">
                            Result <span className="text-danger" aria-hidden="true">*</span>
                          </label>
                          <div className="flex gap-2 h-10">
                            {[{ val: "true", label: "Pass", icon: CheckCircle, color: "success" }, { val: "false", label: "Fail", icon: XCircle, color: "danger" }].map(({ val, label, icon: Icon, color }) => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => setField(sub.id, "passed", val)}
                                className={`flex-1 flex items-center justify-center gap-2 rounded-sm border text-[14px] font-medium transition-all duration-150 ${
                                  fd.passed === val
                                    ? val === "true" ? "border-success bg-successBg text-success" : "border-danger bg-dangerBg text-danger"
                                    : "border-ink-200 text-ink-500 hover:border-ink-400"
                                }`}
                                aria-pressed={fd.passed === val}
                              >
                                <Icon className="w-4 h-4" aria-hidden="true" /> {label}
                              </button>
                            ))}
                          </div>
                          {fe.passed && <p className="body-sm text-danger">{fe.passed}</p>}
                        </div>
                      </div>

                      <Textarea
                        label="Feedback notes (optional)"
                        value={fd.notes ?? ""}
                        onChange={e => setField(sub.id, "notes", e.target.value)}
                        rows={3}
                        placeholder="Pronunciation tips, areas to improve…"
                      />

                      {fe.submit && <p className="body-sm text-danger" role="alert">{fe.submit}</p>}

                      <Button
                        variant="primary" size="md"
                        loading={submitting[sub.id]}
                        onClick={() => handleScore(sub.id)}
                        className="self-start"
                      >
                        Submit review
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
