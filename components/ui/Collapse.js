import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/cn";

export const Collapse = ({ title, className, headerClassName, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("bg-surface border border-ink-100 rounded-md shadow-1 overflow-hidden", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          "flex w-full items-center justify-between px-5 py-4 text-left font-semibold text-ink-900 hover:bg-surface2 transition-colors",
          headerClassName
        )}
      >
        {title}
        {open
          ? <ChevronUp className="w-4 h-4 text-ink-500 shrink-0" aria-hidden="true" />
          : <ChevronDown className="w-4 h-4 text-ink-500 shrink-0" aria-hidden="true" />
        }
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-ink-100">
          {children}
        </div>
      )}
    </div>
  );
};
