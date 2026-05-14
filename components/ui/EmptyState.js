import React from "react";
import { cn } from "@/lib/cn";
import Button from "./Button";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}) {
  return (
    <div className={cn("flex flex-col items-center text-center py-12 max-w-[360px] mx-auto", className)}>
      {Icon && (
        <div className="w-24 h-24 rounded-full bg-brand-50 flex items-center justify-center mb-6">
          <Icon className="w-12 h-12 text-brand-500" aria-hidden="true" />
        </div>
      )}
      <h3 className="heading-md text-ink-900 mb-2">{title}</h3>
      {description && <p className="body-sm text-ink-500">{description}</p>}
      {action && (
        <Button
          variant="secondary"
          size="md"
          onClick={action.onClick}
          href={action.href}
          className="mt-6"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
