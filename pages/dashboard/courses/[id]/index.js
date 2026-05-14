import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import VideoPlayer from "@/components/pages/CoursePage/VideoPlayer";
import CourseSidebar from "@/components/pages/CoursePage/CourseSidebar";
import CourseDetails from "@/components/pages/CoursePage/CourseDetails";

export default function CourseViewer() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const router = useRouter();
  const { id } = router.query;

  const [isLoading, setIsLoading] = useState(true);
  const [courseData, setCourseData] = useState(null);
  const [activeSequence, setActiveSequence] = useState(null);
  const [error, setError] = useState(null);
  const [certificateEarned, setCertificateEarned] = useState(false);

  
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!id || !userId) return;
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/courses/${id}`, {
          params: { userId },
        });
        const data = response.data;
        const enrichedSequences = data.sequences.map((sequence) => ({
          ...sequence,
          completed:
            sequence.quiz?.userQuizzes?.[0]?.passed ||
            false ||
            sequence.speechQuiz?.userSpeechQuizzes?.[0]?.passed ||
            false,
        }));
        setCourseData({ ...data, sequences: enrichedSequences });
        setActiveSequence(enrichedSequences[0] || null);

        // Check if exam is already passed
        if (data.exam) {
          const examResponse = await axios.post("/api/user-exams/check", {
            userId,
            examId: data.exam.id,
          });
          if (examResponse.data.passed) {
            setCertificateEarned(true);
          }
        }
      } catch (err) {
        setError("Failed to fetch course data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourseData();
  }, [id, userId]);

  const handleSequenceUpdate = (updatedSequences) => {
    setCourseData((prev) => ({ ...prev, sequences: updatedSequences }));
    setActiveSequence(
      updatedSequences.find((seq) => seq.id === activeSequence?.id) || null
    );
  };

  const handleExamComplete = async (passed) => {
    if (passed && !certificateEarned) {
      setCertificateEarned(true);
      try {
        await axios.post("/api/certificates", {
          userId,
          courseId: id,
          issuedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Failed to save certificate:", err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!courseData) {
    return <div className="text-center">No course data available.</div>;
  }

  return (
    <main className="flex flex-col min-h-screen bg-gray-100 mt-4">
      <div className="flex-grow flex flex-col gap-4 md:flex-row mb-4">
        <Tabs
          defaultValue={activeSequence?.videoUrl ? "video" : "pdf"}
          className="w-full"
        >
          <TabsList>
            {activeSequence?.video.link && (
              <TabsTrigger value="video">Video</TabsTrigger>
            )}
            {activeSequence?.file.url && (
              <TabsTrigger value="pdf">PDF</TabsTrigger>
            )}
          </TabsList>
          {activeSequence?.video.link && (
            <TabsContent value="video">
              <VideoPlayer activeSequence={activeSequence} />
            </TabsContent>
          )}
          {activeSequence?.file.url && (
            <TabsContent value="pdf">
              <PDFViewer pdfUrl={activeSequence.file.url} />
            </TabsContent>
          )}
        </Tabs>
        <CourseSidebar
          sequences={courseData.sequences}
          activeSequence={activeSequence}
          setActiveSequence={setActiveSequence}
          onSequenceUpdate={handleSequenceUpdate}
          userId={userId}
          exam={courseData.exam}
          onExamComplete={handleExamComplete}
        />
      </div>
      <CourseDetails courseData={courseData} enroll={false} />
      {certificateEarned && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded shadow-lg">
          <p>
            Congratulations! You’ve earned a certificate for {courseData.title}!
          </p>
        </div>
      )}
    </main>
  );
}

const Tabs = ({ defaultValue, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <div className="w-full">
      {React.Children.toArray(children)
        .filter((child) => React.isValidElement(child))
        .map((child) =>
          child.type === TabsList
            ? React.cloneElement(child, { setActiveTab, activeTab })
            : child.type === TabsContent
            ? React.cloneElement(child, { activeTab })
            : child
        )}
    </div>
  );
};

const TabsList = ({ children, setActiveTab, activeTab }) => (
  <div className="flex border-b border-gray-200">
    {React.Children.toArray(children)
      .filter((child) => React.isValidElement(child))
      .map((child) => React.cloneElement(child, { setActiveTab, activeTab }))}
  </div>
);

const TabsTrigger = ({ value, children, setActiveTab, activeTab }) => (
  <button
    className={`px-4 py-2 text-sm font-medium ${
      activeTab === value
        ? "border-b-2 border-blue-500 text-blue-500"
        : "text-gray-500 hover:text-gray-700"
    }`}
    onClick={() => setActiveTab(value)}
  >
    {children}
  </button>
);

const TabsContent = ({ value, children, activeTab }) =>
  activeTab === value ? <div className="mt-4">{children}</div> : null;

// Custom PDFViewer Component
const PDFViewer = ({ pdfUrl }) => (
  <iframe
    src={pdfUrl}
    className="w-full h-[600px] border-0"
    allow="autoplay"
    title="PDF Viewer"
  ></iframe>
);  