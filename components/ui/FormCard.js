import { cn } from '@/lib/cn'
import React from 'react'

export default function FormCard({ children, title, gridCols=3, ...props }) {

    return (
        <div className='bg-white shadow-md rounded-md px-4 py-6 w-full' {...props}>
            <h2 className='text-xl font-bold mb-4'>{title}</h2>
            <div className={cn(`grid grid-cols-${gridCols} gap-4`)}  >
                {children}
            </div>
        </div>
    )
}
