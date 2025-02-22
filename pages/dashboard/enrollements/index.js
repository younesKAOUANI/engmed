import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { useState } from "react";
import Link from "next/link";
import CustomLink from "@/components/ui/CustomLink";
import Image from "next/image";

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
          data.map(course => (
            <div key={course.id} className="flex flex-col gap-4 items-center justify-between p-3 my-4 border-2 rounded-md shadow-md bg-white">
              <Image width={400} height={400} src={course.thumbnail} alt={course.title} className='rounded-sm' />
              <div className='w-[98%] text-left px-4'>
                <p className='text-primary font-semibold text-xl hover:text-primary/80'>
                  {course.title}
                </p>
                <p>{course.description}</p>
                <p>{course.price} DA</p>
              </div>
              <div className='flex justify-center gap-4 w-full'>
                <CustomLink href={`/dashboard/courses/${course.id}`} className='bg-primary text-white px-4 py-2 rounded-md hover:scale-95'>
                  View More
                </CustomLink>
              </div>
            </div>
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
