import React from "react";
import Image from "next/image";

export default function About() {
  return (
    <section id="who-we-are" className="py-24 bg-surface2">
      <div className="max-w-content mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <Image
              src="/services.jpg"
              alt="EngMed team — medical English specialists"
              width={540}
              height={420}
              className="rounded-lg w-full object-cover shadow-3"
            />
          </div>

          {/* Text */}
          <div className="flex flex-col gap-5">
            <span className="eyebrow text-brand-600">Our mission</span>
            <h2 className="display-md text-ink-900">
              Built by Algerians,<br />for Algerians
            </h2>
            <p className="body-lg text-ink-700">
              Hana Boulahrouz — TEFL/TESOL certified, 8 years teaching at the
              University of Constantine — founded EngMed after watching brilliant
              Algerian doctors struggle to publish research and communicate with
              international colleagues.
            </p>
            <p className="body-lg text-ink-700">
              Together with a team of medical and language specialists, she
              designed EngMed around the specific vocabulary, communication
              patterns, and fluency gaps that healthcare professionals in Algeria
              face every day.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-4">
              {[
                { value: "TEFL/TESOL", label: "Certified instructors" },
                { value: "8 years",   label: "Teaching experience" },
                { value: "A1–C2",     label: "Full CEFR range" },
                { value: "Algeria",   label: "Locally grounded" },
              ].map(({ value, label }) => (
                <div key={label} className="bg-surface rounded-sm p-4 border border-ink-100">
                  <p className="heading-sm text-brand-600">{value}</p>
                  <p className="body-sm text-ink-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
