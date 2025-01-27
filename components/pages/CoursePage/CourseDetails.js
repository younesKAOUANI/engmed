import Button from '@/components/ui/Button'
import { Star } from 'lucide-react'
import React from 'react'

export default function CourseDetails({ courseData, enroll = true }) {
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

<Button className="bg-primary text-white px-4 py-2 rounded-md hover:scale-95 col-span-3 ml-auto text-xl font-bold">Enroll Now</Button>
    </section>

  )
}
