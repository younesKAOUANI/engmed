import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import axios from "axios"
import { Loader2, Star } from "lucide-react"
import VideoPlayer from "@/components/pages/CoursePage/VideoPlayer";
import CourseSidebar from "@/components/pages/CoursePage/CourseSidebar";
import CourseDetails from "@/components/pages/CoursePage/CourseDetails";

export default function CourseViewer() {
  const router = useRouter();
  const { id } = router.query;

  const [isLoading, setIsLoading] = useState(true);
  const [courseData, setCourseData] = useState([]);
  const [activeSequence, setActiveSequence] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!id) return; setIsLoading(true);

      try {
        const response = await axios.get(`/api/courses/${id}`);
        setCourseData(response.data);
        setActiveSequence(response.data.sequences[0]);

      } catch (err) {
        setError('Failed to fetch course data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  if (!courseData) {
    return <div className="text-center">No course data available.</div>
  }

  return (
    <main className="flex flex-col min-h-screen bg-gray-100 mt-4">

      <main className="flex-grow flex flex-col gap-4 md:flex-row">
        <VideoPlayer activeSequence={activeSequence} />
        <CourseSidebar
          sequences={courseData.sequences}
          activeSequence={activeSequence}
          setActiveSequence={setActiveSequence}
        />
      </main>
      <CourseDetails courseData={courseData}/>
    </main>
  )
}

