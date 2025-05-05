import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Title from "@/components/ui/Title";
import CourseCard from "@/components/ui/Cards/CourseCard";

export default function ExplorePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await axios.get("/api/courses");
      setCourses(response.data);
      setIsLoading(false);
    };
    fetchCourses();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Filter and sort courses for sections
  const popularCourses = courses
    .filter((course) => course.totalStudents >= 0)
    .sort((a, b) => b.totalStudents - a.totalStudents)
    .slice(0, 4); // Top 4 by student count

  const highlyRatedCourses = courses
    .filter((course) => course.rating >= 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4); // Top 4 by rating

  return (
    <main className="py-8 px-4 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="mb-12">
        <Title>Explore Our Courses</Title>
        <p className="text-black text-lg mt-2">
          Discover the best courses to advance your skills in medical English and more!
        </p>
      </section>

      {/* Popular Courses Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Most Popular Courses</h2>
        {popularCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No popular courses available yet.</p>
        )}
      </section>

      {/* Highly Rated Courses Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Top-Rated Courses</h2>
        {highlyRatedCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {highlyRatedCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No top-rated courses available yet.</p>
        )}
      </section>
      <section className="mt-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Want to See More?</h2>
        <a
          href="/dashboard/courses"
          className="inline-block bg-primary text-white px-6 py-3 rounded-md font-semibold hover:bg-primary/80 transition-colors"
        >
          View All Courses
        </a>
      </section>
    </main>
  );
}