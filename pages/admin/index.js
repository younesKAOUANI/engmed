import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import axios from "axios";
import {
  Users, BookOpen, Award, Mic, Calendar,
  GraduationCap, ChevronRight, AlertCircle,
} from "lucide-react";
import Badge from "@/components/ui/Badge";

/* ─── helpers ─────────────────────────────────────────────────────────────── */
function Stat({ label, value, sub, icon: Icon, accent = false, href }) {
  const card = (
    <div className={`bg-surface border rounded-md p-5 shadow-1 flex items-start justify-between gap-4
      ${href ? "hover:-translate-y-px hover:shadow-2 transition-all duration-150 cursor-pointer" : ""}
      ${accent ? "border-brand-200 bg-brand-50" : "border-ink-100"}`}>
      <div>
        <p className="eyebrow text-ink-500 mb-1.5">{label}</p>
        <p className="font-semibold text-ink-900" style={{ fontSize: 28, lineHeight: 1 }}>
          {value ?? "—"}
        </p>
        {sub && <p className="body-sm text-ink-400 mt-1">{sub}</p>}
      </div>
      <div className={`w-10 h-10 rounded-sm flex items-center justify-center shrink-0
        ${accent ? "bg-brand-100" : "bg-surface2"}`}>
        <Icon className={`w-5 h-5 ${accent ? "text-brand-600" : "text-ink-400"}`} aria-hidden="true" />
      </div>
    </div>
  );
  return href ? <Link href={href}>{card}</Link> : card;
}

function Avatar({ name }) {
  const initials = (name || "?").split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-[11px] font-semibold shrink-0" aria-hidden="true">
      {initials}
    </div>
  );
}

const ROLE_BADGE = { ADMIN: "danger", INSTRUCTOR: "brand", STUDENT: "default" };

/* ─── page ────────────────────────────────────────────────────────────────── */
export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/admin/stats")
      .then(r => setStats(r.data))
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <>
      <Head><title>Admin Dashboard — EngMed</title></Head>
      <div className="flex flex-col gap-8 pb-12">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="eyebrow text-brand-600 mb-1">{greeting}</p>
            <h1 className="heading-lg text-ink-900">Platform Overview</h1>
            <p className="body-sm text-ink-500 mt-0.5">
              {now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          {stats?.pendingSpeeches > 0 && (
            <Link
              href="/admin/speech-quizzes"
              className="flex items-center gap-2 px-3 py-2 bg-warningBg border border-warning/30 rounded-sm body-sm text-warning font-medium hover:opacity-90 transition-opacity"
            >
              <AlertCircle className="w-4 h-4" aria-hidden="true" />
              {stats.pendingSpeeches} speech {stats.pendingSpeeches === 1 ? "submission" : "submissions"} pending review
            </Link>
          )}
        </div>

        {/* KPIs */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <div key={i} className="skeleton h-28 rounded-md" />)}
          </div>
        ) : stats && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Stat label="Total users"    value={stats.users.total}           sub={`${stats.users.students} students`}      icon={Users}         href="/admin/users"         accent />
              <Stat label="Courses"        value={stats.courses.total}         sub={`${stats.courses.published} published`}  icon={BookOpen}      href="/admin/courses" />
              <Stat label="Enrollments"    value={stats.enrollments}           sub="all time"                                icon={GraduationCap} />
              <Stat label="Certificates"   value={stats.certificates}          sub="issued"                                  icon={Award} />
              <Stat label="Pending reviews" value={stats.pendingSpeeches}      sub="speech submissions"                      icon={Mic}           href="/admin/speech-quizzes"  accent={stats.pendingSpeeches > 0} />
              <Stat label="Events"         value={stats.events}                sub="speaking sessions"                       icon={Calendar}      href="/admin/events" />
              <Stat label="Draft courses"  value={stats.courses.draft}         sub="not published"                           icon={BookOpen}      href="/admin/courses" />
              <Stat label="Instructors"    value={stats.users.instructors}     sub="& admins"                                icon={Users}         href="/admin/users" />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent sign-ups */}
              <section className="bg-surface border border-ink-100 rounded-md shadow-1 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100">
                  <h2 className="heading-sm text-ink-900">Recent sign-ups</h2>
                  <Link href="/admin/users" className="body-sm text-brand-600 hover:underline flex items-center gap-1">
                    View all <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
                <ul>
                  {stats.recentUsers.map((u, i) => (
                    <li key={u.id} className={`flex items-center gap-3 px-5 py-3 ${i < stats.recentUsers.length - 1 ? "border-b border-ink-100" : ""}`}>
                      <Avatar name={u.name} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-medium text-ink-900 truncate">{u.name}</p>
                        <p className="body-sm text-ink-500 truncate">{u.email}</p>
                      </div>
                      <Badge variant={ROLE_BADGE[u.role] || "default"} size="sm">
                        {u.role.toLowerCase()}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Top courses */}
              <section className="bg-surface border border-ink-100 rounded-md shadow-1 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100">
                  <h2 className="heading-sm text-ink-900">Top courses by learners</h2>
                  <Link href="/admin/courses" className="body-sm text-brand-600 hover:underline flex items-center gap-1">
                    Manage <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
                <ul>
                  {stats.topCourses.map((c, i) => (
                    <li key={c.id} className={`flex items-center gap-3 px-5 py-3 ${i < stats.topCourses.length - 1 ? "border-b border-ink-100" : ""}`}>
                      <span className="mono-sm text-ink-300 w-5 text-center shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <Link href={`/admin/courses/${c.id}`} className="text-[14px] font-medium text-ink-900 hover:text-brand-600 truncate block transition-colors">
                          {c.title}
                        </Link>
                        <p className="body-sm text-ink-500">{c.totalStudents.toLocaleString()} learners · ★ {c.rating.toFixed(1)}</p>
                      </div>
                      <span className="mono-sm text-ink-500 shrink-0">
                        {c.price === 0 ? "Free" : `${c.price.toLocaleString()} DA`}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Recent enrollments table */}
              <section className="bg-surface border border-ink-100 rounded-md shadow-1 overflow-hidden lg:col-span-2">
                <div className="px-5 py-4 border-b border-ink-100">
                  <h2 className="heading-sm text-ink-900">Recent enrollments</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left" aria-label="Recent enrollments">
                    <thead>
                      <tr className="border-b border-ink-100 bg-surface2">
                        {["Student", "Course", "Date"].map(h => (
                          <th key={h} className="px-5 py-2.5 eyebrow text-ink-500">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentEnrollments.map((e, i) => (
                        <tr key={e.id} className={`${i < stats.recentEnrollments.length - 1 ? "border-b border-ink-100" : ""} hover:bg-surface2 transition-colors`}>
                          <td className="px-5 py-3">
                            <p className="text-[14px] font-medium text-ink-900">{e.user.name}</p>
                            <p className="body-sm text-ink-500">{e.user.email}</p>
                          </td>
                          <td className="px-5 py-3 text-[14px] text-ink-700">{e.course.title}</td>
                          <td className="px-5 py-3 mono-sm text-ink-500">
                            {new Date(e.enrolledAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* Quick actions */}
            <section>
              <h2 className="heading-sm text-ink-900 mb-4">Quick actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Add a course",          href: "/admin/courses/add",    icon: BookOpen  },
                  { label: "Manage users",           href: "/admin/users",          icon: Users     },
                  { label: "Create speaking event",  href: "/admin/events",         icon: Calendar  },
                  { label: "Review speech quizzes",  href: "/admin/speech-quizzes", icon: Mic       },
                ].map(({ label, href, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3 p-4 bg-surface border border-ink-100 rounded-md shadow-1 hover:-translate-y-px hover:shadow-2 hover:border-brand-200 transition-all duration-150 group"
                  >
                    <div className="w-9 h-9 rounded-sm bg-brand-50 flex items-center justify-center shrink-0 group-hover:bg-brand-100 transition-colors">
                      <Icon className="w-[18px] h-[18px] text-brand-600" aria-hidden="true" />
                    </div>
                    <span className="text-[14px] font-medium text-ink-700 group-hover:text-brand-700 transition-colors">{label}</span>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
}
