import { cn } from '@/lib/cn'
import React from 'react'

export default function Button({...props}) {
  return (
    <button className={cn('flex items-center gap-4 justify-center cursor-pointer w-auto rounded-md transition-all duration-300', props.className)} onClick={props.onClick} {...props}>
      {props.children}
    </button>
  )
}
