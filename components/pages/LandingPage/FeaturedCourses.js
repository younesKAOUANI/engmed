import Button from '@/components/ui/Button'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

export default function FeaturedCourses() {
  const [courses, setCourses] = useState([])

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await fetch('/api/courses')
      const data = await response.json()
      console.log(data)
      setCourses(data)
    }
    fetchCourses()
  }, [])

  return (
    <section className='section'>
      <h2 className='text-center text-bold text-gray-800 text-4xl font-bold'>Featured Courses</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6'>
        {courses?.length > 0 ? 
        [...Array(4)].map((_, i) => (
          <div key={i} className='bg-white p-4 shadow-md rounded-md text-center'>
            <Image src={courses[i % courses.length].thumbnail} className='rounded-md' alt={courses[i % courses.length].title} width={300} height={200} />
            <h3 className='text-xl font-semibold my-2'>{courses[i % courses.length].title}</h3>
            <p className='mb-2'>{courses[i % courses.length].description}</p>
            <Button className='bg-primary text-white px-4 py-2 rounded-md hover:scale-95'>
              View Course
            </Button>
          </div>
        )) 
        : [...Array(4)].map((_, i) => (
          <div key={i} className='bg-white p-4 shadow-md rounded-md text-center'>
            <div className='bg-gray-200 h-48 w-full rounded-md' />
            <div className='h-6 w-1/2 bg-gray-200 rounded-md my-2' />
            <div className='h-6 w-1/3 bg-gray-200 rounded-md my-2' />
            <div className='h-10 w-full bg-gray-200 rounded-md' />
          </div>
        ))}

      </div>
    </section>
  )
}
