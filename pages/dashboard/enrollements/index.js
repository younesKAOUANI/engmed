import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { useState } from "react";
import CourseCard from "@/components/ui/Cards/CourseCard";

const prisma = new PrismaClient();

export default function Enrollments({ enrollments }) {
  const [data, setData] = useState(enrollments.map(enrollment => enrollment.course));

  console.log(data)
  return (
    <div className="">
      <div className="grid grid-cols-4 gap-4">
        {data.length === 0 ? (
          <p className="text-gray-500 text-lg ml-2 mt-6 col-span-4">You are not enrolled in any courses yet.</p>
        ) : (
          data.map((course) => (
            <CourseCard key={course.id} course={course} enrolled={true} />
          ))
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session || !session.user?.id) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: session.user.id },
      include: { course: true },
    });

    return {
      props: { enrollments: JSON.parse(JSON.stringify(enrollments)) },
    };
  } catch (error) {
    console.error("Failed to fetch enrollments:", error);
    return { props: { enrollments: [] } };
  }
}
