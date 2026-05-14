import React from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

const variantClasses = {
  primary:   "bg-brand-600 text-white border-transparent hover:bg-brand-700",
  secondary: "bg-surface text-ink-900 border border-ink-300 hover:border-ink-900 hover:bg-surface2",
  ghost:     "bg-transparent text-ink-700 border-transparent hover:bg-surface2",
  accent:    "bg-accent-600 text-white border-transparent hover:opacity-90",
  danger:    "bg-danger text-white border-transparent hover:opacity-90",
  link:      "bg-transparent text-brand-600 border-transparent underline-offset-2 hover:underline h-auto px-0 py-0",
};

const sizeClasses = {
  sm: "h-8  px-3 text-[13px] font-medium rounded-sm  gap-1.5",
  md: "h-10 px-4 text-[15px] font-medium rounded-sm  gap-2",
  lg: "h-12 px-5 text-[17px] font-semibold rounded-md gap-2",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
  href,
  onClick,
  type = "button",
  "aria-label": ariaLabel,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center border select-none transition-all duration-150 ease-out focus-visible:shadow-focus";
  const lift = !disabled && !loading
    ? "hover:-translate-y-px hover:shadow-2 active:translate-y-0 active:shadow-1 active:scale-[0.98]"
    : "";
  const dis = disabled || loading ? "opacity-45 cursor-not-allowed pointer-events-none" : "cursor-pointer";

  const classes = cn(base, variantClasses[variant], sizeClasses[size], lift, dis, className);

  if (href && !disabled && !loading) {
    return (
      <Link href={href} className={classes} aria-label={ariaLabel} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-label={ariaLabel}
      className={classes}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
