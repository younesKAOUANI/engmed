import CustomLink from '@/components/ui/CustomLink';
import Title from '@/components/ui/Title';
import axios from 'axios';
import { set } from 'date-fns';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

export default function index() {
    const [isLoading, setIsLoading] = useState(true);
    const [courses, setCourses] = React.useState([])

    useEffect(() => {
        const fetchCourses = async () => {
            const response = await axios.get('/api/courses')
            setCourses(response.data)
            setIsLoading(false);
        }
        fetchCourses()
    }, [])

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <main>
            <Title>
                Watch our latest courses!
            </Title>
            <div className='grid grid-cols-4 gap-4'>
                {courses.map(course => (
                    <div key={course.id} className="flex flex-col gap-4 items-center justify-between p-3 my-4 border-2 rounded-md shadow-md bg-white">
                        <Image width={400} height={400} src={course.thumbnail} alt={course.title} className='rounded-sm' />
                        <div className='w-[98%] text-left px-4'>
                            <p  className='text-primary font-semibold text-xl hover:text-primary/80'>
                                {course.title}
                            </p>
                            <p>{course.description}</p>
                            <p>{course.price} DA</p>
                        </div>
                        <div className='flex justify-center gap-4 w-full'>
                            <CustomLink href={`/dashboard/courses/view/${course.id}`} className='bg-primary text-white px-4 py-2 rounded-md hover:scale-95'>
                                View More
                            </CustomLink>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    )
}
