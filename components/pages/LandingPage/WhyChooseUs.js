import React from "react";
import { Handshake, ChartColumnBig, Clock, Volume2 } from "lucide-react";
import Button from "@/components/ui/Button";

const challenges = [
  {
    title: "Patient Communication",
    description: "Struggling to explain diagnoses or treatments clearly to international patients or colleagues.",
    icon: Handshake,
    accent: "#1B9AA0",
  },
  {
    title: "Professional Growth",
    description: "Missing out on conferences, research papers, or global opportunities due to language gaps.",
    icon: ChartColumnBig,
    accent: "#C58A2A",
  },
  {
    title: "Time Pressure",
    description: "Balancing busy hospital shifts with learning English feels overwhelming.",
    icon: Clock,
    accent: "#B42318",
  },
  {
    title: "Confidence in Speaking",
    description: "Feeling nervous or hesitant when speaking English with peers or during presentations.",
    icon: Volume2,
    accent: "#147651",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="challenges" className="py-24 bg-surface">
      <div className="max-w-content mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="eyebrow text-brand-600 mb-3 block">Sound familiar?</span>
          <h2 className="display-md text-ink-900 mb-4">
            Challenges every medical professional faces
          </h2>
          <p className="body-lg text-ink-500 max-w-2xl mx-auto">
            Every day you're saving lives — but English can feel like a hurdle.
            EngMed is built around what the medical community actually needs.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {challenges.map(({ title, description, icon: Icon, accent }) => (
            <div
              key={title}
              className="bg-paper border border-ink-100 rounded-md p-6 flex flex-col gap-4 hover:-translate-y-0.5 hover:shadow-2 transition-all duration-220"
            >
              {/* Accent top rule + icon */}
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-sm flex items-center justify-center shrink-0"
                  style={{ backgroundColor: accent + "18" }}
                >
                  <Icon className="w-5 h-5" style={{ color: accent }} aria-hidden="true" />
                </div>
              </div>
              <div
                className="h-1 w-8 rounded-pill"
                style={{ backgroundColor: accent }}
                aria-hidden="true"
              />
              <h3 className="heading-sm text-ink-900">{title}</h3>
              <p className="body-sm text-ink-500 flex-1">{description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <p className="body-sm text-ink-500 mb-4">
            Just 15 minutes a day with EngMed can make a measurable difference in weeks.
          </p>
          <Button variant="primary" size="lg" href="/auth/signup">
            Start overcoming these challenges
          </Button>
        </div>
      </div>
    </section>
  );
}
