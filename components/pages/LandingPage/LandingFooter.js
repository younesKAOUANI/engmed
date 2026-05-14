import React from "react";
import Link from "next/link";

const columns = [
  {
    title: "Platform",
    links: [
      { label: "Explore Courses", href: "/dashboard/courses" },
      { label: "Placement Test", href: "/placement-test" },
      { label: "Mini Games",     href: "/game" },
      { label: "Let's Speak",   href: "/dashboard/lets-speak" },
      { label: "Book a Session", href: "/dashboard/online-meetings" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "University Courses", href: "/dashboard/university-courses" },
      { label: "Certifications",     href: "/dashboard/certifications" },
      { label: "Speech Practice",    href: "/dashboard/lets-speak" },
      { label: "CEFR Levels",        href: "/placement-test" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About EngMed",   href: "/#who-we-are" },
      { label: "Contact",        href: "/#contact" },
      { label: "GitHub",         href: "https://github.com/younesKAOUANI/engmed" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Use",   href: "#" },
      { label: "License (MIT)",  href: "#" },
    ],
  },
];

export default function LandingFooter() {
  return (
    <footer className="bg-surface border-t border-ink-100">
      <div className="max-w-content mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2" aria-label="EngMed home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="" className="w-8 h-8" aria-hidden="true" />
              <span className="font-display text-[22px] italic text-ink-900">EngMed</span>
            </Link>
            <p className="body-sm text-ink-500">
              Medical English for doctors, nurses, and healthcare students in France.
              CEFR-aligned, certificate-issuing, speech-evaluated.
            </p>
            <a
              href="https://github.com/younesKAOUANI/engmed"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 body-sm text-brand-600 hover:underline"
            >
              View source on GitHub →
            </a>
          </div>

          {/* Nav columns */}
          {columns.map(({ title, links }) => (
            <div key={title}>
              <p className="eyebrow text-ink-500 mb-4">{title}</p>
              <ul className="flex flex-col gap-2">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="body-sm text-ink-700 hover:text-brand-600 transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-ink-100 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="body-sm text-ink-500">© 2026 EngMed. All rights reserved.</p>
          <p className="body-sm text-ink-500">
            Built with Next.js · Prisma · MongoDB · Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
