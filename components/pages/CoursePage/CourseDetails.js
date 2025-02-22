"use client";

import Button from '@/components/ui/Button'
import { Star } from 'lucide-react'
import React from 'react'
import { useSession } from "next-auth/react";
import { useState } from "react";
import axios from "axios";


export default function CourseDetails({ courseData, enroll = false }) {
  return (
    <section className="bg-white p-6 shadow-md rounded-md w-full flex flex-col">
      <h1 className="text-3xl font-bold mb-4">{courseData.title}</h1>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <h3 className="font-semibold">Rating</h3>
          <p className="flex items-center text-lg text-yellow-500 gap-2">{courseData.rating} / 5 <Star /></p>
        </div>
        <div>
          <h3 className="font-semibold">Students</h3>
          <p>{courseData.totalStudents}</p>
        </div>
        <div>
          <h3 className="font-semibold">Last Updated</h3>
          <p>{new Date(courseData.updatedAt).toLocaleDateString()}</p>
        </div>
        <div className="col-span-3 mt-6">
          <h2 className="text-2xl font-bold mb-4">About this course</h2>
          <p className="mb-4">{courseData.description}</p>
        </div>
      </div>


      {enroll && <EnrollButton courseData={courseData} />}
    </section>
  )
}

 function EnrollButton(courseData) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEnroll = async () => {
    if (!session?.user?.id) {
      setError("You must be logged in to enroll.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/enrollement", {
        userId: session.user.id, // Pass the logged-in user's ID
        courseId : courseData.courseData.id
      });

      console.log("Enrollment successful:", response.data);
    } catch (err) {
      setError("Failed to enroll. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        onClick={handleEnroll}
        disabled={loading}
        className="bg-primary text-white px-4 py-2 rounded-md hover:scale-95 col-span-3 ml-auto text-lg font-medium"
      >
        {loading ? "Enrolling..." : "Enroll Now"}
      </Button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
