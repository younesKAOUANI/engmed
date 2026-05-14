"use client";
import React, { useState } from "react";
import Image from "next/image";

const services = [
  {
    label: "Specialized Courses",
    title: "Interactive, medically-grounded lessons",
    description:
      "Engage with tailored lessons designed for medical professionals — featuring real clinical scenarios, vocabulary exercises, and structured progression from A1 to C2.",
    image: "/practice.jpg",
  },
  {
    label: "Gamified Learning",
    title: "Flexible and gamified progress",
    description:
      "Enjoy a dynamic learning experience with 50-level word-unscramble games, crossword puzzles, and instant feedback that makes progress feel rewarding, not like homework.",
    image: "/speak.jpg",
  },
  {
    label: "Speaking Practice",
    title: "Real speaking — reviewed by instructors",
    description:
      "Record your spoken answers directly in the browser. Your instructor reviews your audio, scores your pronunciation and fluency, and gives personal feedback within 48 hours.",
    image: "/flexible.jpg",
  },
];

export default function Services() {
  const [active, setActive] = useState(0);

  return (
    <section id="tools" className="py-24 bg-paper">
      <div className="max-w-content mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="eyebrow text-brand-600 mb-3 block">Platform features</span>
          <h2 className="display-md text-ink-900 mb-4">How EngMed helps you succeed</h2>
          <p className="body-lg text-ink-500 max-w-xl mx-auto">
            Whether you're in a clinic or studying for exams, EngMed fits around
            your schedule and clinical reality.
          </p>
        </div>

        {/* Pill tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10" role="tablist" aria-label="Feature tabs">
          {services.map(({ label }, i) => (
            <button
              key={label}
              role="tab"
              aria-selected={active === i}
              aria-controls={`tab-panel-${i}`}
              onClick={() => setActive(i)}
              className={`px-4 py-2 rounded-pill text-[14px] font-semibold transition-all duration-150 border ${
                active === i
                  ? "bg-brand-600 text-white border-brand-600"
                  : "bg-surface text-ink-700 border-ink-200 hover:border-brand-500 hover:text-brand-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content panel */}
        {services.map(({ title, description, image }, i) => (
          <div
            key={i}
            id={`tab-panel-${i}`}
            role="tabpanel"
            hidden={active !== i}
            className="grid md:grid-cols-2 items-center gap-10 bg-surface border border-ink-100 rounded-lg p-8 shadow-1"
          >
            <div className="flex flex-col gap-4">
              <h3 className="heading-lg text-ink-900">{title}</h3>
              <p className="body-lg text-ink-700">{description}</p>
            </div>
            <div className="relative w-full h-64 md:h-80 rounded-md overflow-hidden shadow-2">
              <Image src={image} alt={title} fill className="object-cover" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
