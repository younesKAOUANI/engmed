import Image from 'next/image'
import React from 'react'

export default function Hero() {
  return (
    <section className="bg-primary/50">
      <div className='section'>
        <div className="flex flex-row justify-between gap-4 ">
          <div className="text-black rounded-md p-6 flex flex-col justify-center ">
            <h1 className="text-4xl font-bold mb-4">Professional Medical English <br></br> for Everyone</h1>
            <p className="text-lg mb-4">Learn anything from anywhere</p>
            <button className="bg-primary text-white px-4 py-2 rounded-md hover:scale-95 self-start">Get Started</button>
          </div>
          <Image src='/hero.png' width={500} height={500} alt='Hero Image' />
        </div>
      </div>
    </section>
  )
}
