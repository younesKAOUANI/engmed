import React from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 bg-paper overflow-hidden">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(var(--ink-900) 1px, transparent 1px), linear-gradient(90deg, var(--ink-900) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden="true"
      />

      <div className="max-w-content mx-auto px-6 w-full py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 items-center">
          {/* Left column */}
          <div className="flex flex-col gap-6">
            <span className="eyebrow text-brand-600 flex items-center gap-2">
              <span className="w-6 h-px bg-brand-600 inline-block" aria-hidden="true" />
              Medical English LMS
            </span>

            <h1 className="display-xl text-ink-900">
              Master Medical<br />
              <em className="text-brand-600 not-italic font-display">English.</em><br />
              Advance Your Career.
            </h1>

            <p className="body-lg text-ink-700 max-w-lg">
              Built for doctors, nurses, and medical students in France who need
              precise English — for clinical practice, research, and international
              collaboration.
            </p>

            {/* Trust strip */}
            <div className="flex items-center gap-3 flex-wrap">
              {["CEFR-Aligned", "Verified Certificates", "Speech Evaluation"].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-700 text-[12px] font-semibold rounded-pill border border-brand-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-600 shrink-0" aria-hidden="true" />
                  {tag}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3 flex-wrap mt-2">
              <Button variant="primary" size="lg" href="/auth/signup">
                Join EngMed — it's free
              </Button>
              <Link
                href="/placement-test"
                className="text-[15px] font-medium text-brand-600 hover:text-brand-700 underline-offset-2 hover:underline transition-colors flex items-center gap-1"
              >
                Take the placement test →
              </Link>
            </div>

            <p className="body-sm text-ink-500">
              Free to start · No credit card · CEFR A1–C2
            </p>
          </div>

          {/* Right column — product mockup */}
          <div className="relative flex justify-center lg:justify-end">
            <div
              className="relative"
              style={{ transform: "perspective(1200px) rotateY(-4deg)" }}
            >
              <Image
                src="/mockup.png"
                alt="EngMed platform screenshot — course viewer showing video lesson and glossary panel"
                width={620}
                height={440}
                priority
                className="rounded-lg w-full max-w-[560px]"
                style={{ boxShadow: "var(--shadow-4), 0 0 0 1px var(--ink-100)" }}
              />
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-16 pt-8 border-t border-ink-100 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "148",    label: "Placement questions" },
            { value: "CEFR",   label: "A1–C2 leveled" },
            { value: "50+",    label: "Game levels" },
            { value: "100%",   label: "Medical domain" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="mono-sm text-brand-600 text-2xl font-semibold">{value}</p>
              <p className="body-sm text-ink-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
