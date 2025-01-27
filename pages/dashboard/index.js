import React from 'react'

export default function index() {
  return (
    <main className='h-[calc(100vh-95px)] py-4 grid grid-cols-2 grid-rows-3 gap-4'>
      <div className='rounded-md shadow-md bg-white row-span-2 flex items-center justify-center'>Graph 1</div>
      <div className='rounded-md shadow-md bg-white row-span-2 flex items-center justify-center'>Graph 2</div>
      <div className='rounded-md shadow-md bg-white flex items-center justify-center'>Some statistics 1</div>
      <div className='rounded-md shadow-md bg-white  flex items-center justify-center'>Some statistics 2</div>
    </main>
  )
}
