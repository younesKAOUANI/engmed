import { cn } from '@/lib/cn'
import Link from 'next/link'
import React from 'react'

export default function CustomLink({ href, children, ...props }) {
    return (
        <Link
            href={href}
            className={cn('flex items-center gap-4 justify-center cursor-pointer w-auto rounded-md transition-all duration-300', props.className)}
            {...props}>
            {children}
        </Link>)
}
