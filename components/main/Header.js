"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Button from "../ui/Button";
import { Plus, X, Book } from "lucide-react";

export default function Header({ joinUs, pathname }) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [glossary, setGlossary] = useState([]);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [word, setWord] = useState("");
  const [translation, setTranslation] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getPageTitle = (pathname) => ({
    "/admin": "Admin Dashboard",
    "/admin/courses": "Manage Courses",
    "/admin/courses/add": "New Course",
    "/admin/settings": "Settings",
    "/admin/profile": "Profile",
    "/": "Dashboard",
    "/dashboard/courses": "Courses",
    "/dashboard/enrollements": "Your Enrollements",
    "/dashboard/settings": "Settings",
    "/dashboard/profile": "Profile",
  }[pathname] || "Dashboard");

  const title = getPageTitle(pathname);
  const isAdminRoute = pathname.startsWith("/admin");

  // Fetch glossary entries using vanilla fetch
  useEffect(() => {
    const fetchGlossary = async () => {
      if (!userId || isAdminRoute) return;
      setLoading(true);
      try {
        const response = await fetch(`/api/glossary?userId=${userId}`);
        if (!response.ok) throw new Error("Failed to fetch glossary");
        const data = await response.json();
        setGlossary(data);
      } catch (err) {
        setError("Failed to load glossary");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGlossary();
  }, [userId, isAdminRoute]);

  // Add a new glossary entry
  const handleAddEntry = async (e) => {
    e.preventDefault();
    if (!word || !translation || !explanation) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/glossary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, word, translation, explanation }),
      });
      if (!response.ok) throw new Error("Failed to add glossary entry");
      const newEntry = await response.json();
      setGlossary([...glossary, newEntry]);
      setWord("");
      setTranslation("");
      setExplanation("");
      setError("");
    } catch (err) {
      setError("Failed to add glossary entry");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Remove a glossary entry
  const handleRemoveEntry = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/glossary/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to remove glossary entry");
      setGlossary(glossary.filter((entry) => entry.id !== id));
    } catch (err) {
      setError("Failed to remove glossary entry");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md">
      <h1 className="font-bold uppercase text-2xl text-gray-800">{title}</h1>
      {userId && !isAdminRoute && (
        <div className="relative">
          <Button
            onClick={() => setIsGlossaryOpen(!isGlossaryOpen)}
            className="p-2  px-4 bg-primary hover:bg-white hover:text-primary group hover:scale-95 transition-colors font-medium text-white uppercase"
            title="Toggle Glossary"
          >
            <Book className="text-xl text-white group-hover:text-primary" /> Glossary
          </Button>

          {isGlossaryOpen && (
            <div className="absolute top-12 right-0 w-96 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Your Glossary</h2>
              </div>
              <div className="p-4">
                {/* Add Entry Form */}
                <form onSubmit={handleAddEntry} className="space-y-3 mb-4">
                  <input
                    type="text"
                    placeholder="Word"
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    className="w-full p-2 border rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                  <input
                    type="text"
                    placeholder="Translation"
                    value={translation}
                    onChange={(e) => setTranslation(e.target.value)}
                    className="w-full p-2 border rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                  <textarea
                    placeholder="Explanation"
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    className="w-full p-2 border rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    disabled={loading}
                  />
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <Button
                    type="submit"
                    className="w-full bg-primary text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 flex items-center justify-center gap-2 transition-colors"
                    disabled={loading}
                  >
                    <Plus className="w-5 h-5" />
                    Add
                  </Button>
                </form>

                {/* Glossary List */}
                {loading ? (
                  <p className="text-gray-500">Loading glossary...</p>
                ) : glossary.length === 0 ? (
                  <p className="text-gray-500">No entries yet. Add some words!</p>
                ) : (
                  <ul className="space-y-3 max-h-48 overflow-y-auto">
                    {glossary.map((entry) => (
                      <li
                        key={entry.id}
                        className="flex justify-between items-start bg-gray-50 p-2 rounded-md"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{entry.word}</p>
                          <p className="text-sm text-gray-600">Translation: {entry.translation}</p>
                          <p className="text-xs text-gray-500">{entry.explanation}</p>
                        </div>
                        <Button
                          onClick={() => handleRemoveEntry(entry.id)}
                          className="p-1 bg-transparent hover:bg-red-100 rounded-full transition-colors"
                          disabled={loading}
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}