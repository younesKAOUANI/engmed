"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { UserPlus } from "lucide-react";
import Button from "@/components/ui/Button";

export default function LetsSpeak() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id; // Use session for userId, no role check here
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleParticipate = async (eventId) => {
    if (!userId) {
      setError("Please log in to participate");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/events/participate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, eventId }),
      });
      if (!response.ok) throw new Error("Failed to join event");
      await fetchEvents(); // Refresh events
    } catch (err) {
      setError("Failed to join event");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl text-white font-bold mb-6">Let's Speak Events</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading ? (
        <p>Loading events...</p>
      ) : events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => {
            const hasJoined = userId && event.participants.some((p) => p.userId === userId);
            return (
              <li
                key={event.id}
                className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
              >
                <div>
                  <h2 className="text-xl font-semibold">{event.title}</h2>
                  <p className="text-gray-600">{event.description}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(event.date).toLocaleString()} | Participants: {event.participants.length}
                  </p>
                </div>
                <Button
                  onClick={() => handleParticipate(event.id)}
                  className={`py-2 px-4 rounded ${hasJoined ? "bg-gray-400" : "bg-green-500 text-white hover:bg-green-600"}`}
                  disabled={loading || hasJoined || !userId}
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  {hasJoined ? "Joined" : "Join"}
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}