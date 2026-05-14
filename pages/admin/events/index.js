import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { Plus, Trash2, X, Calendar, Users } from "lucide-react";
import Button from "@/components/ui/Button";
import Input, { Textarea } from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";

export default function AdminEvents() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", date: "" });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const set = (f) => (e) => {
    setForm(p => ({ ...p, [f]: e.target.value }));
    setErrors(p => ({ ...p, [f]: "" }));
  };

  useEffect(() => {
    fetch("/api/events")
      .then(r => r.json())
      .then(setEvents)
      .catch(() => setGlobalError("Failed to load events"))
      .finally(() => setFetching(false));
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.title || form.title.trim().length < 3) errs.title = "At least 3 characters.";
    if (!form.description || form.description.trim().length < 10) errs.description = "At least 10 characters.";
    if (!form.date) errs.date = "Date is required.";
    else if (new Date(form.date) < new Date()) errs.date = "Must be a future date.";
    return errs;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true);
    setGlobalError("");
    try {
      const r = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...form }),
      });
      if (!r.ok) throw new Error((await r.json()).error || "Failed");
      const ev = await r.json();
      setEvents(prev => [ev, ...prev]);
      setForm({ title: "", description: "", date: "" });
      setShowForm(false);
    } catch (err) {
      setGlobalError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Delete this event?")) return;
    try {
      await fetch(`/api/events/${id}`, { method: "DELETE" });
      setEvents(prev => prev.filter(ev => ev.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch {
      setGlobalError("Failed to delete event.");
    }
  };

  return (
    <>
      <Head><title>Events — Admin · EngMed</title></Head>
      <div className="flex flex-col gap-6 pb-12">

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="heading-lg text-ink-900">Speaking Events</h1>
            <p className="body-sm text-ink-500 mt-0.5">
              {fetching ? "…" : `${events.length} event${events.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <Button variant="primary" size="md" onClick={() => setShowForm(v => !v)}>
            <Plus className="w-4 h-4" aria-hidden="true" />
            {showForm ? "Cancel" : "Create event"}
          </Button>
        </div>

        {/* Create form */}
        {showForm && (
          <form onSubmit={handleAdd} className="bg-surface border border-ink-100 rounded-md p-6 shadow-1 flex flex-col gap-4">
            <h2 className="heading-sm text-ink-900">New speaking event</h2>
            <Input label="Title" value={form.title} onChange={set("title")} error={errors.title} placeholder="e.g. Weekly Speaking Circle" required />
            <Textarea label="Description" value={form.description} onChange={set("description")} error={errors.description} rows={3} placeholder="What will participants practise?" required />
            <Input label="Date & time" type="datetime-local" value={form.date} onChange={set("date")} error={errors.date} required />
            {globalError && <p className="body-sm text-danger" role="alert">{globalError}</p>}
            <div className="flex gap-3">
              <Button type="submit" variant="primary" size="md" loading={loading}>Create event</Button>
              <Button type="button" variant="ghost" size="md" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        )}

        {globalError && !showForm && <p className="body-sm text-danger" role="alert">{globalError}</p>}

        {/* Events list */}
        {fetching ? (
          <div className="flex flex-col gap-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-20 rounded-md" />)}</div>
        ) : events.length === 0 ? (
          <EmptyState icon={Calendar} title="No events yet" description="Create your first speaking event for students." action={{ label: "Create event", onClick: () => setShowForm(true) }} />
        ) : (
          <div className="flex flex-col gap-3">
            {events.map(ev => {
              const isPast = new Date(ev.date) < new Date();
              return (
                <div
                  key={ev.id}
                  onClick={() => setSelected(ev)}
                  className="bg-surface border border-ink-100 rounded-md p-5 shadow-1 flex items-start gap-4 cursor-pointer hover:-translate-y-px hover:shadow-2 hover:border-ink-300 transition-all duration-150"
                >
                  <div className="w-10 h-10 rounded-sm bg-brand-50 flex items-center justify-center shrink-0 mt-0.5">
                    <Calendar className="w-5 h-5 text-brand-600" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 flex-wrap">
                      <p className="text-[15px] font-semibold text-ink-900">{ev.title}</p>
                      {isPast
                        ? <Badge variant="outline" size="sm">Past</Badge>
                        : <Badge variant="success" size="sm">Upcoming</Badge>}
                    </div>
                    <p className="body-sm text-ink-500 mt-0.5 line-clamp-1">{ev.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="mono-sm text-ink-500">
                        {new Date(ev.date).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <span className="flex items-center gap-1 body-sm text-ink-500">
                        <Users className="w-3.5 h-3.5" aria-hidden="true" /> {ev.participants?.length ?? 0} joined
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(ev.id, e)}
                    aria-label={`Delete ${ev.title}`}
                    className="p-1.5 rounded-sm text-ink-300 hover:text-danger hover:bg-dangerBg transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Participants drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" aria-modal="true" role="dialog" aria-labelledby="event-detail-title">
          <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm" onClick={() => setSelected(null)} aria-hidden="true" />
          <div className="relative bg-surface rounded-t-lg sm:rounded-lg w-full max-w-md shadow-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-ink-100 shrink-0">
              <div>
                <h2 id="event-detail-title" className="heading-sm text-ink-900">{selected.title}</h2>
                <p className="body-sm text-ink-500 mt-0.5">
                  {new Date(selected.date).toLocaleString("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <button onClick={() => setSelected(null)} aria-label="Close" className="p-1.5 rounded-sm text-ink-400 hover:text-ink-900 hover:bg-surface2 transition-colors">
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <div className="px-6 py-4 overflow-y-auto">
              <p className="body-sm text-ink-500 mb-4">{selected.description}</p>
              <p className="eyebrow text-ink-500 mb-3">
                Participants ({selected.participants?.length ?? 0})
              </p>
              {!selected.participants?.length ? (
                <p className="body-sm text-ink-400">No participants yet.</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {selected.participants.map(p => (
                    <li key={p.user?.id} className="flex items-center gap-3 py-2 border-b border-ink-100 last:border-0">
                      <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-[11px] font-semibold shrink-0">
                        {(p.user?.name || "?").split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[14px] font-medium text-ink-900 truncate">{p.user?.name}</p>
                        <p className="body-sm text-ink-500 truncate">{p.user?.email}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
