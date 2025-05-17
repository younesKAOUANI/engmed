import { cn } from '@/lib/cn';
import React from 'react';
import Link from 'next/link';

export default function Button({ href, className, children, onClick, ...props }) {
  const baseStyles = cn(
    'flex items-center gap-4 justify-center cursor-pointer w-auto rounded-md transition-all duration-300',
    className
  );

  if (href) {
    return (
      <Link href={href} passHref className={baseStyles} {...props}>
          {children}
      </Link>
    );
  }

  return (
    <button className={baseStyles} onClick={onClick} {...props}>
      {children}
    </button>
  );
}