import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, BookOpen, Users, Calendar,
  Mic, Settings, LogOut
} from "lucide-react";

const navItems = [
  { href: "/admin",               label: "Dashboard",     icon: LayoutDashboard },
  { href: "/admin/courses",       label: "Courses",       icon: BookOpen },
  { href: "/admin/users",         label: "Users",         icon: Users },
  { href: "/admin/events",        label: "Events",        icon: Calendar },
  { href: "/admin/speech-quizzes",label: "Speech Quizzes",icon: Mic },
  { href: "/admin/settings",      label: "Settings",      icon: Settings },
];

export default function AdminSidebar() {
  const { pathname } = useRouter();

  return (
    <aside className="fixed top-0 left-0 h-full w-60 bg-surface border-r border-ink-100 flex flex-col z-40">
      {/* Header */}
      <div className="px-5 py-5 border-b border-ink-100 bg-surface2">
        <Link href="/admin" className="flex items-center gap-2" aria-label="EngMed Admin">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" className="w-7 h-7" aria-hidden="true" />
          <div>
            <span className="font-display text-[20px] italic text-ink-900 leading-none">EngMed</span>
            <p className="eyebrow text-ink-500 mt-0.5">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto" aria-label="Admin navigation">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-sm mb-0.5 text-[14px] font-medium transition-colors duration-150 group ${
                active
                  ? "bg-brand-50 text-brand-700 border-l-[3px] border-brand-600 pl-[calc(0.75rem-3px)]"
                  : "text-ink-700 hover:bg-surface2 hover:text-ink-900 border-l-[3px] border-transparent pl-[calc(0.75rem-3px)]"
              }`}
            >
              <Icon className="w-[18px] h-[18px] shrink-0" aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="p-3 border-t border-ink-100">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-sm text-[14px] font-medium text-danger hover:bg-dangerBg transition-colors duration-150"
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" aria-hidden="true" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
