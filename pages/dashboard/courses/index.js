import React, { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import { Search, BookOpen } from "lucide-react";
import CourseCard, { CourseCardSkeleton } from "@/components/ui/Cards/CourseCard";
import EmptyState from "@/components/ui/EmptyState";

export default function AllCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("/api/courses").then((r) => {
      setCourses(r.data);
      setIsLoading(false);
    });
  }, []);

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Head><title>All Courses — EngMed</title></Head>
      <div className="flex flex-col gap-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="heading-lg text-ink-900">All Courses</h1>
            <p className="body-sm text-ink-500 mt-1">
              {isLoading ? "…" : `${courses.length} courses available`}
            </p>
          </div>
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-300" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search courses…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-3 bg-surface border border-ink-300 rounded-sm text-[15px] text-ink-900 placeholder:text-ink-300 focus:outline-none focus:border-brand-600 focus:shadow-focus transition-all"
              aria-label="Search courses"
            />
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <CourseCardSkeleton key={i} />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title={search ? "No courses match your search" : "No courses yet"}
            description={search ? `Try a different search term.` : "Check back soon — new courses are added regularly."}
            action={search ? { label: "Clear search", onClick: () => setSearch("") } : undefined}
          />
        )}
      </div>
    </>
  );
}
