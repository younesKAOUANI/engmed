import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import {
  BookOpen, ChevronDown, User, LogOut, Settings,
  Award, BookMarked, Mic, GraduationCap
} from "lucide-react";
import GlossaryPopup from "./GlossaryPopup";

const navLinks = [
  { href: "/dashboard", label: "Explore" },
  { href: "/dashboard/courses", label: "Courses" },
  { href: "/dashboard/university-courses", label: "University" },
  { href: "/dashboard/online-meetings", label: "Book a Session" },
  { href: "/dashboard/lets-speak", label: "Let's Speak" },
];

function Avatar({ name }) {
  const initials = (name || "?")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-[12px] font-semibold shrink-0"
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

export default function StudentHeader() {
  const { pathname } = useRouter();
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-220 ${
          scrolled
            ? "bg-surface border-b border-ink-100 shadow-1"
            : "bg-surface border-b border-ink-100"
        }`}
      >
        <div className="max-w-content mx-auto px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="EngMed home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="" className="w-7 h-7" aria-hidden="true" />
            <span className="font-display text-[22px] italic text-ink-900 leading-none">EngMed</span>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`px-3 py-1.5 rounded-sm text-[15px] font-medium transition-colors duration-150 ${
                    active
                      ? "text-brand-600 bg-brand-50"
                      : "text-ink-700 hover:text-ink-900 hover:bg-surface2"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsGlossaryOpen(true)}
              aria-label="Open glossary"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-ink-700 hover:text-ink-900 hover:bg-surface2 rounded-sm transition-colors duration-150 body-sm font-medium"
            >
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              Glossary
            </button>

            {/* Avatar dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen((v) => !v)}
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                aria-label="Account menu"
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-sm hover:bg-surface2 transition-colors duration-150"
              >
                <Avatar name={session?.user?.name} />
                <ChevronDown
                  className={`w-3.5 h-3.5 text-ink-500 transition-transform duration-150 ${isDropdownOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>

              {isDropdownOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-1.5 w-52 bg-surface border border-ink-100 rounded-md shadow-3 py-1 z-50"
                >
                  <div className="px-3 py-2 border-b border-ink-100 mb-1">
                    <p className="text-[13px] font-semibold text-ink-900 truncate">{session?.user?.name}</p>
                    <p className="text-[11px] text-ink-500 truncate">{session?.user?.email}</p>
                  </div>
                  {[
                    { href: "/placement-test", label: "Free English Test", icon: <GraduationCap className="w-4 h-4" /> },
                    { href: "/dashboard/enrollements", label: "My Enrollments", icon: <BookMarked className="w-4 h-4" /> },
                    { href: "/dashboard/certifications", label: "Certificates", icon: <Award className="w-4 h-4" /> },
                    { href: "/dashboard/lets-speak", label: "Let's Speak", icon: <Mic className="w-4 h-4" /> },
                    { href: "/dashboard/settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
                  ].map(({ href, label, icon }) => (
                    <Link
                      key={href}
                      href={href}
                      role="menuitem"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-[14px] text-ink-700 hover:bg-brand-50 hover:text-brand-700 transition-colors duration-100"
                    >
                      <span className="text-ink-400">{icon}</span>
                      {label}
                    </Link>
                  ))}
                  <div className="border-t border-ink-100 mt-1 pt-1">
                    <button
                      role="menuitem"
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex items-center gap-2.5 w-full px-3 py-2 text-[14px] text-danger hover:bg-dangerBg transition-colors duration-100"
                    >
                      <LogOut className="w-4 h-4" aria-hidden="true" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <GlossaryPopup isOpen={isGlossaryOpen} onClose={() => setIsGlossaryOpen(false)} />
    </>
  );
}
