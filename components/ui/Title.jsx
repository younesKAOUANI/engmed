import React from "react";
import { cn } from "@/lib/cn";

export default function Title({ children, className, as: Tag = "h1" }) {
  return (
    <Tag className={cn("display-md text-ink-900", className)}>
      {children}
    </Tag>
  );
}
