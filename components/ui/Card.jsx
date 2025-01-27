import { cn } from '@/utils/cn';
import React from 'react'




export const Card = ({icon, ...props}) => {
    return (
      <div className={cn("bg-white p-3 rounded-md shadow", props.className)} {...props}>
       {props.children}
      </div>
    );
  };