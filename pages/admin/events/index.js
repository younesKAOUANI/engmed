"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Button from "../../../components/ui/Button";
import { Plus, Trash2, X } from "lucide-react";

export default function AdminEvents() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({}); // Individual field errors
  const [selectedEvent, setSelectedEvent] = useState(null); // For popup

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/events");
      if (!response.ok) throw new Error("Failed to fetch events");
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError("Failed to load events");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError("");
    setErrors({});
    
    // Validation
    const newErrors = {};
    if (!title || title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters long";
    }
    if (!description || description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters long";
    }
    if (!date) {
      newErrors.date = "Date is required";
    } else {
      // Check if date is in the future
      const selectedDate = new Date(date);
      const now = new Date();
      if (selectedDate < now) {
        newErrors.date = "Event date must be in the future";
      }
    }
    if (!userId) {
      setError("User session not found. Please log in again.");
      return;
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, title, description, date }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add event");
      }
      
      const newEvent = await response.json();
      setEvents([...events, newEvent]);
      setTitle("");
      setDescription("");
      setDate("");
      setError("");
      setErrors({});
    } catch (err) {
      setError(err.message || "Failed to add event");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete event");
      setEvents(events.filter((event) => event.id !== id));
    } catch (err) {
      setError("Failed to delete event");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const closePopup = () => {
    setSelectedEvent(null);
  };

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage Speaking Events</h1>

      <form onSubmit={handleAddEvent} className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Event Title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
              }}
              className={`w-full p-2 border rounded ${errors.title ? 'border-red-500' : ''}`}
              disabled={loading}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>
          <div>
            <textarea
              placeholder="Event Description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: "" }));
              }}
              className={`w-full p-2 border rounded ${errors.description ? 'border-red-500' : ''}`}
              rows={3}
              disabled={loading}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
          <div>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (errors.date) setErrors((prev) => ({ ...prev, date: "" }));
              }}
              className={`w-full p-2 border rounded ${errors.date ? 'border-red-500' : ''}`}
              disabled={loading}
            />
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <Button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400 flex items-center gap-2"
            disabled={loading || !userId}
          >
            <Plus className="w-5 h-5" />
            Add Event
          </Button>
        </div>
      </form>

      {loading ? (
        <p>Loading events...</p>
      ) : events.length === 0 ? (
        <p>No events yet.</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li
              key={event.id}
              className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center cursor-pointer hover:bg-gray-50"
              onClick={() => handleEventClick(event)}
            >
              <div>
                <h2 className="text-xl font-semibold">{event.title}</h2>
                <p className="text-gray-600">{event.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(event.date).toLocaleString()} | Participants: {event.participants.length}
                </p>
              </div>
              <Button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering popup on delete click
                  handleDeleteEvent(event.id);
                }}
                className="text-red-500 hover:text-red-700 bg-transparent"
                disabled={loading}
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      {/* Participants Popup */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{selectedEvent.title} - Participants</h2>
              <Button
                onClick={closePopup}
                className="p-1 bg-transparent hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6 text-gray-700" />
              </Button>
            </div>
            {selectedEvent.participants.length === 0 ? (
              <p className="text-gray-500">No participants yet.</p>
            ) : (
              <ul className="space-y-4">
                {selectedEvent.participants.map((participation) => (
                  <li key={participation.user.id} className="border-b pb-2">
                    <p className="font-semibold">{participation.user.name}</p>
                    <p className="text-gray-600">Email: {participation.user.email}</p>
                    <p className="text-gray-600">
                      Phone: {participation.user.phoneNumber || "Not provided"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}