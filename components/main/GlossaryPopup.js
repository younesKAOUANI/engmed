import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { X, Trash2, Plus, BookOpen } from "lucide-react";
import Button from "@/components/ui/Button";
import Input, { Textarea } from "@/components/ui/Input";

export default function GlossaryPopup({ isOpen, onClose }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ word: "", translation: "", explanation: "" });
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { data: session } = useSession();
  const trapRef = useRef(null);

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  useEffect(() => {
    if (isOpen && session?.user?.id) {
      axios.get(`/api/glossary?userId=${session.user.id}`)
        .then((r) => setItems(r.data))
        .catch(() => {});
    }
  }, [isOpen, session]);

  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!session?.user?.id || !form.word || !form.translation || !form.explanation) return;
    setAdding(true);
    try {
      const res = await axios.post("/api/glossary", { userId: session.user.id, ...form });
      setItems((prev) => [res.data, ...prev]);
      setForm({ word: "", translation: "", explanation: "" });
      setShowForm(false);
    } catch {}
    setAdding(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/glossary/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {}
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end"
      aria-modal="true"
      role="dialog"
      aria-labelledby="glossary-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel — slides from right */}
      <div
        ref={trapRef}
        className="relative z-10 bg-surface h-full w-full max-w-sm shadow-4 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-600" aria-hidden="true" />
            <h2 id="glossary-title" className="heading-sm text-ink-900">My Glossary</h2>
            {items.length > 0 && (
              <span className="mono-sm bg-brand-50 text-brand-700 px-2 py-0.5 rounded-pill">
                {items.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close glossary"
            className="p-1.5 rounded-sm text-ink-500 hover:text-ink-900 hover:bg-surface2 transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Add form toggle */}
        <div className="px-5 py-3 border-b border-ink-100">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowForm((v) => !v)}
            className="w-full"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            {showForm ? "Cancel" : "Add word"}
          </Button>
          {showForm && (
            <form onSubmit={handleAdd} className="mt-3 flex flex-col gap-3">
              <Input label="Word" value={form.word} onChange={set("word")} placeholder="e.g. Myocardial infarction" required />
              <Input label="Translation" value={form.translation} onChange={set("translation")} placeholder="e.g. Crise cardiaque" required />
              <Textarea label="Explanation" value={form.explanation} onChange={set("explanation")} rows={3} placeholder="Brief clinical explanation…" required />
              <Button type="submit" variant="primary" size="sm" loading={adding} className="w-full">
                Save entry
              </Button>
            </form>
          )}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="text-center py-10">
              <BookOpen className="w-8 h-8 text-ink-300 mx-auto mb-3" aria-hidden="true" />
              <p className="body-sm text-ink-500">No entries yet.</p>
              <p className="body-sm text-ink-400 mt-1">Add medical terms you want to remember.</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3" role="list">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="bg-paper border border-ink-100 rounded-sm p-3 flex justify-between items-start gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-ink-900">{item.word}</p>
                    <p className="body-sm text-brand-600 mt-0.5">{item.translation}</p>
                    <p className="body-sm text-ink-500 mt-1 line-clamp-2">{item.explanation}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    aria-label={`Delete "${item.word}"`}
                    className="p-1 text-ink-300 hover:text-danger transition-colors shrink-0 mt-0.5"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
