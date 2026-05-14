import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { BookOpen, Trophy, FlameIcon, GraduationCap, ArrowRight, ChevronRight, BookMarked } from "lucide-react";
import CourseCard, { CourseCardSkeleton } from "@/components/ui/Cards/CourseCard";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";

export default function ExplorePage() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get("/api/courses"),
      session?.user?.id ? axios.get("/api/enrollement") : Promise.resolve({ data: { enrollments: [] } }),
    ]).then(([coursesRes, enrollRes]) => {
      setCourses(coursesRes.data);
      setEnrollments(enrollRes.data.enrollments || []);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, [session]);

  const popularCourses = [...courses]
    .sort((a, b) => b.totalStudents - a.totalStudents)
    .slice(0, 4);

  const topRatedCourses = [...courses]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  const enrolledCourseIds = new Set(enrollments.map((e) => e.courseId));

  return (
    <>
      <Head><title>Explore — EngMed</title></Head>
      <div className="flex flex-col gap-12 pb-12">

        {/* Stats row */}
        {session && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: enrollments.length.toString(), label: "Enrolled courses", icon: BookMarked },
              { value: "B1", label: "CEFR level", icon: GraduationCap },
              { value: "0", label: "Glossary words", icon: BookOpen },
              { value: "1", label: "Day streak", icon: FlameIcon },
            ].map(({ value, label, icon: Icon }) => (
              <div key={label} className="bg-surface border border-ink-100 rounded-md p-5 shadow-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="mono-sm text-brand-600 text-2xl font-semibold">{value}</p>
                    <p className="body-sm text-ink-500 mt-1">{label}</p>
                  </div>
                  <div className="w-9 h-9 rounded-sm bg-brand-50 flex items-center justify-center shrink-0">
                    <Icon className="w-4.5 h-4.5 text-brand-600" aria-hidden="true" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Continue learning */}
        {enrollments.length > 0 ? (
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="heading-md text-ink-900">Continue learning</h2>
              <Link href="/dashboard/enrollements" className="body-sm text-brand-600 hover:underline flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="bg-surface border border-ink-100 rounded-md p-5 shadow-1 flex items-center gap-5">
              <div className="flex-1 min-w-0">
                <p className="eyebrow text-brand-600 mb-1">In progress</p>
                <h3 className="heading-sm text-ink-900 truncate">Your enrolled courses</h3>
                <div className="mt-3 h-2 bg-ink-100 rounded-pill overflow-hidden">
                  <div className="h-full bg-brand-600 rounded-pill w-[40%]" />
                </div>
                <p className="body-sm text-ink-500 mt-1.5">40% complete</p>
              </div>
              <Button variant="primary" size="md" href="/dashboard/enrollements">
                Resume <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Button>
            </div>
          </section>
        ) : (
          <section className="bg-brand-50 border border-brand-200 rounded-md p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <p className="eyebrow text-brand-600 mb-1">Get started</p>
              <h3 className="heading-sm text-ink-900">Find your CEFR level first</h3>
              <p className="body-sm text-ink-500 mt-1">
                Take the free 15-minute placement test to get personalized course recommendations.
              </p>
            </div>
            <Button variant="primary" size="md" href="/placement-test">
              Take placement test
            </Button>
          </section>
        )}

        {/* Popular courses */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="heading-md text-ink-900">Most popular</h2>
              <p className="body-sm text-ink-500 mt-0.5">Courses other medical professionals love</p>
            </div>
            <Link href="/dashboard/courses" className="body-sm text-brand-600 hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((i) => <CourseCardSkeleton key={i} />)}
            </div>
          ) : popularCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {popularCourses.map((course) => (
                <CourseCard key={course.id} course={course} enrolled={enrolledCourseIds.has(course.id)} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={BookOpen}
              title="No courses yet"
              description="Check back soon — new courses are being added."
            />
          )}
        </section>

        {/* Top rated */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="heading-md text-ink-900">Top rated</h2>
              <p className="body-sm text-ink-500 mt-0.5">Highest reviewed by learners</p>
            </div>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((i) => <CourseCardSkeleton key={i} />)}
            </div>
          ) : topRatedCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {topRatedCourses.map((course) => (
                <CourseCard key={course.id} course={course} enrolled={enrolledCourseIds.has(course.id)} />
              ))}
            </div>
          ) : null}
        </section>

        {/* CTA */}
        <section className="text-center">
          <Button variant="secondary" size="lg" href="/dashboard/courses">
            Browse all courses →
          </Button>
        </section>
      </div>
    </>
  );
}
