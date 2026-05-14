import React from "react";
import { cn } from "@/lib/cn";

export default function Input({
  label,
  helper,
  error,
  required,
  id,
  className,
  inputClassName,
  type = "text",
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  const helperId = error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="eyebrow text-ink-700"
        >
          {label}
          {required && (
            <span className="text-danger ml-1" aria-hidden="true">*</span>
          )}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        required={required}
        aria-required={required}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={helperId}
        className={cn(
          "h-10 px-3 w-full bg-surface border border-ink-300 rounded-sm text-ink-900 text-[15px]",
          "placeholder:text-ink-300 transition-all duration-150",
          "focus:outline-none focus:border-brand-600 focus:shadow-focus",
          error && "border-danger focus:border-danger focus:shadow-none",
          inputClassName
        )}
        {...props}
      />
      {(error || helper) && (
        <p
          id={helperId}
          role={error ? "alert" : undefined}
          className={cn("body-sm", error ? "text-danger" : "text-ink-500")}
        >
          {error || helper}
        </p>
      )}
    </div>
  );
}

export function Textarea({ label, helper, error, required, id, className, ...props }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  const helperId = error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={inputId} className="eyebrow text-ink-700">
          {label}
          {required && <span className="text-danger ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <textarea
        id={inputId}
        required={required}
        aria-required={required}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={helperId}
        className={cn(
          "px-3 py-2.5 w-full bg-surface border border-ink-300 rounded-sm text-ink-900 text-[15px]",
          "placeholder:text-ink-300 transition-all duration-150 resize-none",
          "focus:outline-none focus:border-brand-600 focus:shadow-focus",
          error && "border-danger",
          className
        )}
        {...props}
      />
      {(error || helper) && (
        <p id={helperId} role={error ? "alert" : undefined}
          className={cn("body-sm", error ? "text-danger" : "text-ink-500")}>
          {error || helper}
        </p>
      )}
    </div>
  );
}
