import React, { useState } from 'react';
import { studyYears, courseYears, getCoursesByFilters } from '@/data/universityCourses';
import { BookOpen, Download, Calendar, Clock, User, Filter } from 'lucide-react';
import Title from '@/components/ui/Title';

export default function UniversityCoursesPage() {
  const [selectedStudyYear, setSelectedStudyYear] = useState(1);
  const [selectedCourseYear, setSelectedCourseYear] = useState('2024-2025');
  const [showFilters, setShowFilters] = useState(true);

  const courses = getCoursesByFilters(selectedStudyYear, selectedCourseYear);

  const handleDownload = (course) => {
    // In a real app, this would trigger an actual download
    alert(`Downloading: ${course.title}\nThis is a placeholder. Actual download would be implemented with the backend.`);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-8">
        <Title>University Medical Courses</Title>
        <p className="text-gray-600 text-center max-w-3xl mx-auto mt-2">
          Access translated medical courses from French to English. Browse by study year and academic year to find the resources you need.
        </p>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="lg:w-80 space-y-4">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden w-full bg-white p-4 rounded-lg shadow flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <span className="flex items-center gap-2 font-semibold text-gray-800">
                <Filter className="w-5 h-5 text-primary" />
                Filters
              </span>
              <span className="text-sm text-gray-500">
                {showFilters ? '▲' : '▼'}
              </span>
            </button>

            {/* Filters */}
            <div className={`space-y-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              {/* Study Year Filter */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Study Year
                </h3>
                <div className="space-y-2">
                  {studyYears.map((year) => (
                    <button
                      key={year.id}
                      onClick={() => setSelectedStudyYear(year.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        selectedStudyYear === year.id
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{year.label}</span>
                        {selectedStudyYear === year.id && (
                          <span className="text-xs bg-white/20 px-2 py-1 rounded">
                            Selected
                          </span>
                        )}
                      </div>
                      <span className="text-xs opacity-80">{year.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Academic Year Filter */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                  <Calendar className="w-5 h-5 text-primary" />
                  Academic Year
                </h3>
                <div className="space-y-2">
                  {courseYears.map((year) => (
                    <button
                      key={year.id}
                      onClick={() => setSelectedCourseYear(year.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        selectedCourseYear === year.id
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{year.label}</span>
                        {selectedCourseYear === year.id && (
                          <span className="text-xs bg-white/20 px-2 py-1 rounded">
                            Selected
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">💡 Tip:</span> All courses are translated from French medical curriculum to help you understand complex medical concepts in English.
                </p>
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {studyYears.find(y => y.id === selectedStudyYear)?.name} - {courseYears.find(y => y.id === selectedCourseYear)?.label}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {courses.length} {courses.length === 1 ? 'course' : 'courses'} available
                  </p>
                </div>
              </div>
            </div>

            {/* Courses List */}
            {courses.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    {/* Course Header with Thumbnail */}
                    <div className="h-32 bg-gradient-to-r from-primary to-teal-400 relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/10"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-white/70" />
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="bg-white/90 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                          {course.semester}
                        </span>
                      </div>
                    </div>

                    {/* Course Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-500 italic mb-3">
                        {course.titleFr}
                      </p>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {course.description}
                      </p>

                      {/* Course Meta Info */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="w-4 h-4 text-primary" />
                          <span>{course.instructor}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4 text-primary" />
                          <span>{course.duration}</span>
                        </div>
                      </div>

                      {/* Topics Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {course.topics.slice(0, 3).map((topic, index) => (
                          <span
                            key={index}
                            className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium"
                          >
                            {topic}
                          </span>
                        ))}
                        {course.topics.length > 3 && (
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                            +{course.topics.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Translation Badge */}
                      <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
                        <span className="bg-green-50 text-green-700 px-2 py-1 rounded font-medium">
                          Translated from {course.translatedFrom}
                        </span>
                      </div>

                      {/* Download Button */}
                      <button
                        onClick={() => handleDownload(course)}
                        className="w-full bg-primary hover:bg-teal-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
                      >
                        <Download className="w-5 h-5" />
                        Download Course
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No Courses Available
                </h3>
                <p className="text-gray-600">
                  No courses found for the selected study year and academic year combination.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Try selecting a different year or check back later for updates.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
