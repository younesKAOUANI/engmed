import React from "react";
import { cn } from "@/lib/cn";

const variantClasses = {
  default:  "bg-ink-100 text-ink-700",
  brand:    "bg-brand-50 text-brand-700",
  accent:   "bg-accent-100 text-accent-600",
  success:  "bg-successBg text-success",
  warning:  "bg-warningBg text-warning",
  danger:   "bg-dangerBg text-danger",
  outline:  "bg-transparent text-ink-700 border border-ink-300",
};

const sizeClasses = {
  sm: "text-[11px] px-2 py-0.5 rounded-xs",
  md: "text-[12px] px-2.5 py-1 rounded-xs",
};

export default function Badge({ children, variant = "default", size = "md", className, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium leading-none",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
