import React from "react"
import { CheckCircle } from "lucide-react"

export default function CourseSidebar({ sequences, activeSequence, setActiveSequence }) {
  return (
    <aside className="md:w-1/4 bg-white p-4 overflow-y-auto rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4">Course Content</h2>
      <ul className="space-y-2">
        {sequences.map((sequence) => (
          <li
            key={sequence.id}
            className={`p-2 rounded cursor-pointer flex items-center justify-between ${
              activeSequence?.id === sequence.id ? "bg-primary/30" : "hover:bg-gray-100"
            }`}
            onClick={() => setActiveSequence(sequence)}
          >
            <span>{sequence.title}</span>
            {sequence.completed && <CheckCircle className="w-5 h-5 text-green-500" />}
          </li>
        ))}
      </ul>
    </aside>
  )
}

