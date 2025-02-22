import Button from '@/components/ui/Button'
import Image from 'next/image'
import React from 'react'

export default function LandingHeader() {
  return (
    <header className='fixed w-full bg-white shadow-md'>
      <div className="text-black container mx-auto p-4 flex justify-between items-center">
        <div className='flex items-center gap-1'>
          <Image src='/logo.png' width={32} height={32} alt='EngMed Logo' />
          <h1 className="text-2xl font-bold">EngMed</h1>
        </div>
        <nav className="flex">
          <a href="#" className="text-lg font-semibold mx-4 hover:text-primary">Featured Courses</a>
          <a href="#" className="text-lg font-semibold mx-4 hover:text-primary">About</a>
          <a href="#" className="text-lg font-semibold mx-4 hover:text-primary">Testimonials</a>
          <a href="#" className="text-lg font-semibold mx-4 hover:text-primary">Contact us</a>
        </nav>
        <JoinUsButton />
      </div>
    </header>
  )
}

function JoinUsButton() {
  return (
    <Button className='font-semibold hover:text-gray-700 hover:shadow-md hover:bg-transparent bg-primary text-white px-4 py-2 rounded-md hover:scale-95'>
      Join Us
    </Button>
  )
}
