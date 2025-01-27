import React from "react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/cn";

export default function Input({ label, value, error, className, inputClassName, ...props }) {
  return (
    <div className={className}>
      <input
        className={cn(
          "w-full p-2 border rounded-md focus:border-primary ",
          error ? "border-action-red" : "border-gray-300",
          inputClassName
        )}
        placeholder={label}
        value={value}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}