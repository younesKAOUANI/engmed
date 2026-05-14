"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ChevronDown, Gamepad2, ClipboardList, Home, BookOpen, Info, X, Menu } from "lucide-react";
import Button from "@/components/ui/Button";

const navLinks = [
  { href: "/#challenges", label: "Your Needs" },
  { href: "/#tools",      label: "How It Works" },
  { href: "/#who-we-are", label: "About" },
];

export default function LandingHeader() {
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [gamesOpen, setGamesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dashHref = status === "authenticated"
    ? (session?.user?.role === "ADMIN" ? "/admin" : "/dashboard")
    : "/auth/login";
  const dashLabel = status === "authenticated"
    ? (session?.user?.role === "ADMIN" ? "Admin Panel" : "My Learning")
    : "Join EngMed →";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-paper border-b border-ink-100 shadow-1"
          : "bg-paper/80 backdrop-blur-md"
      }`}
    >
      <div className="max-w-content mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="EngMed home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" className="w-8 h-8" aria-hidden="true" />
          <span className="font-display text-[22px] italic text-ink-900 leading-none">EngMed</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="px-3 py-1.5 rounded-sm text-[15px] font-medium text-ink-700 hover:text-ink-900 hover:bg-surface2 transition-colors duration-150"
            >
              {label}
            </a>
          ))}
          {/* Games dropdown */}
          <div className="relative">
            <button
              onClick={() => setGamesOpen((v) => !v)}
              aria-expanded={gamesOpen}
              aria-haspopup="true"
              className="flex items-center gap-1 px-3 py-1.5 rounded-sm text-[15px] font-medium text-ink-700 hover:text-ink-900 hover:bg-surface2 transition-colors duration-150"
            >
              Mini Games
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${gamesOpen ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
            {gamesOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-44 bg-surface border border-ink-100 rounded-md shadow-3 py-1 z-50">
                <Link href="/game" onClick={() => setGamesOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-[14px] text-ink-700 hover:bg-brand-50 hover:text-brand-700 transition-colors">
                  <Gamepad2 className="w-4 h-4" aria-hidden="true" /> Word Unscramble
                </Link>
                <Link href="/game/crosswords" onClick={() => setGamesOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-[14px] text-ink-700 hover:bg-brand-50 hover:text-brand-700 transition-colors">
                  <ClipboardList className="w-4 h-4" aria-hidden="true" /> Crosswords
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Right CTAs */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/placement-test"
            className="px-3 py-1.5 text-[15px] font-medium text-brand-600 hover:text-brand-700 hover:underline underline-offset-2 transition-colors"
          >
            Free placement test
          </Link>
          <Button variant="primary" size="md" href={dashHref} disabled={status === "loading"}>
            {status === "loading" ? "…" : dashLabel}
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="md:hidden p-1.5 rounded-sm text-ink-700 hover:bg-surface2 transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-paper border-t border-ink-100 px-6 py-4 flex flex-col gap-2">
          {navLinks.map(({ href, label }) => (
            <a key={href} href={href} onClick={() => setMobileOpen(false)}
              className="py-2 text-[15px] font-medium text-ink-700 border-b border-ink-100">
              {label}
            </a>
          ))}
          <Link href="/game" onClick={() => setMobileOpen(false)}
            className="py-2 text-[15px] font-medium text-ink-700 border-b border-ink-100">
            Word Unscramble
          </Link>
          <Link href="/game/crosswords" onClick={() => setMobileOpen(false)}
            className="py-2 text-[15px] font-medium text-ink-700 border-b border-ink-100">
            Crosswords
          </Link>
          <Link href="/placement-test" onClick={() => setMobileOpen(false)}
            className="py-2 text-[15px] text-brand-600 font-medium">
            Free Placement Test
          </Link>
          <Button variant="primary" size="md" href={dashHref} className="mt-2 w-full">
            {dashLabel}
          </Button>
        </div>
      )}
    </header>
  );
}
