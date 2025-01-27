import Button from '@/components/ui/Button'
import CustomLink from '@/components/ui/CustomLink'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect } from 'react'

export default function index() {
  const [courses, setCourses] = React.useState([])

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await axios.get('/api/courses')
      setCourses(response.data)
    }
    fetchCourses()
  }, [])

  return (
    <main className='p-4 py-12'>
      <div className='flex justify-end'>
        <CustomLink
          href={'/admin/courses/add'}
          className="font-semibold hover:text-gray-700 hover:shadow-md hover:bg-transparent bg-primary text-white px-4 py-2 rounded-md hover:scale-95"
        >
          Add course
        </CustomLink>
      </div>
      <div className='grid grid-cols-4 gap-4'>
        {courses.map(course => (
          <div key={course.id} className="flex flex-col gap-4 items-center justify-between p-3 my-4 border-2 rounded-md shadow-md bg-white">
            <Image width={400} height={400} src={course.thumbnail} alt={course.title} className='rounded-sm' />
            <div className='w-[98%] text-left px-4'>
              <CustomLink href={`/admin/courses/${course.id}`} className='text-primary font-semibold text-xl hover:text-primary/80'>
                {course.title}
              </CustomLink>
              <p>{course.description}</p>
              <p>{course.price} DA</p>
            </div>
            <div className='flex justify-center gap-4 w-full'>
              <CustomLink href={`/admin/courses/${course.id}`} className='bg-primary text-white px-4 py-2 rounded-md hover:scale-95'>
                View
              </CustomLink>
              <Button onClick={() => console.log('Delete course', course.id)} className='bg-red-500 text-white px-4 py-2 rounded-md hover:scale-95'>Delete</Button>
            </div>
          </div>
        ))}

      </div>
    </main>
  )
}
