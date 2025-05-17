import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function GlossaryPopup({ isOpen, onClose }) {
  const [glossaryItems, setGlossaryItems] = useState([]);
  const [newWord, setNewWord] = useState("");
  const [newTranslation, setNewTranslation] = useState("");
  const [newExplanation, setNewExplanation] = useState("");
  const { data: session } = useSession();

  const fetchGlossary = async () => {
    if (session?.user?.id) {
      try {
        const response = await axios.get(`/api/glossary?userId=${session.user.id}`);
        setGlossaryItems(response.data);
      } catch (error) {
        console.error("Error fetching glossary:", error);
      }
    }
  };

  const addGlossaryItem = async (e) => {
    e.preventDefault();
    if (session?.user?.id && newWord && newTranslation && newExplanation) {
      try {
        const response = await axios.post("/api/glossary", {
          userId: session.user.id,
          word: newWord,
          translation: newTranslation,
          explanation: newExplanation,
        });
        setGlossaryItems([response.data, ...glossaryItems]);
        setNewWord("");
        setNewTranslation("");
        setNewExplanation("");
      } catch (error) {
        console.error("Error adding glossary item:", error);
      }
    }
  };

  const deleteGlossaryItem = async (id) => {
    try {
      await axios.delete(`/api/glossary/${id}`);
      setGlossaryItems(glossaryItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting glossary item:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchGlossary();
    }
  }, [isOpen, session]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">My Glossary</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
        </div>

        {/* Add New Glossary Item */}
        <form onSubmit={addGlossaryItem} className="mb-6">
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              placeholder="Word"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              className="border rounded-md p-2"
              required
            />
            <input
              type="text"
              placeholder="Translation"
              value={newTranslation}
              onChange={(e) => setNewTranslation(e.target.value)}
              className="border rounded-md p-2"
              required
            />
            <textarea
              placeholder="Explanation"
              value={newExplanation}
              onChange={(e) => setNewExplanation(e.target.value)}
              className="border rounded-md p-2"
              rows={3}
              required
            />
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
            >
              Add Entry
            </button>
          </div>
        </form>

        {/* Glossary List */}
        <div className="space-y-4">
          {glossaryItems.length > 0 ? (
            glossaryItems.map((item) => (
              <div
                key={item.id}
                className="border-b pb-4 flex justify-between items-start"
              >
                <div>
                  <h3 className="text-lg font-semibold">{item.word}</h3>
                  <p className="text-gray-700">
                    <strong>Translation:</strong> {item.translation}
                  </p>
                  <p className="text-gray-600">
                    <strong>Explanation:</strong> {item.explanation}
                  </p>
                </div>
                <button
                  onClick={() => deleteGlossaryItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No glossary entries yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}