import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import axios from "axios";
import { Plus, Eye, Star, Users, Search, BookOpen } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("/api/courses").then(r => setCourses(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Head><title>Courses — Admin · EngMed</title></Head>
      <div className="flex flex-col gap-6 pb-12">

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="heading-lg text-ink-900">Courses</h1>
            <p className="body-sm text-ink-500 mt-0.5">
              {loading ? "…" : `${courses.length} total · ${courses.filter(c => c.published).length} published`}
            </p>
          </div>
          <Button variant="primary" size="md" href="/admin/courses/add">
            <Plus className="w-4 h-4" aria-hidden="true" /> Add course
          </Button>
        </div>

        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-300" aria-hidden="true" />
          <input
            type="search" placeholder="Search courses…" value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 bg-surface border border-ink-300 rounded-sm text-[15px] placeholder:text-ink-300 focus:outline-none focus:border-brand-600 focus:shadow-focus transition-all"
          />
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-16 rounded-md" />)}</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={BookOpen} title="No courses found"
            description={search ? "Try a different search term." : "Add your first course to get started."}
            action={{ label: "Add course", href: "/admin/courses/add" }} />
        ) : (
          <div className="bg-surface border border-ink-100 rounded-md shadow-1 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left" aria-label="Courses">
                <thead>
                  <tr className="border-b border-ink-100 bg-surface2">
                    {["Course", "Price", "Students", "Rating", "Status", ""].map(h => (
                      <th key={h} className="px-5 py-3 eyebrow text-ink-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => (
                    <tr key={c.id} className={`${i < filtered.length - 1 ? "border-b border-ink-100" : ""} hover:bg-surface2 transition-colors`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {c.thumbnail
                            ? <img src={c.thumbnail} alt="" className="w-10 h-10 rounded-sm object-cover shrink-0" />
                            : <div className="w-10 h-10 rounded-sm bg-brand-50 flex items-center justify-center shrink-0"><BookOpen className="w-4 h-4 text-brand-400" /></div>
                          }
                          <div className="min-w-0">
                            <p className="text-[14px] font-medium text-ink-900 truncate max-w-[280px]">{c.title}</p>
                            <p className="body-sm text-ink-500 line-clamp-1 max-w-[280px]">{c.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 mono-sm text-ink-700 whitespace-nowrap">
                        {c.price === 0 ? <Badge variant="success" size="sm">Free</Badge> : `€${c.price.toLocaleString()}`}
                      </td>
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1.5 body-sm text-ink-700">
                          <Users className="w-3.5 h-3.5 text-ink-400" aria-hidden="true" />{c.totalStudents.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1.5 body-sm text-ink-700">
                          <Star className="w-3.5 h-3.5 text-accent-600 fill-accent-600" aria-hidden="true" />{c.rating.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={c.published ? "success" : "outline"} size="sm">
                          {c.published ? "Published" : "Draft"}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <Link href={`/admin/courses/${c.id}`}
                          className="inline-flex items-center gap-1.5 body-sm text-brand-600 font-medium hover:underline"
                          aria-label={`Manage ${c.title}`}>
                          <Eye className="w-3.5 h-3.5" aria-hidden="true" /> Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
