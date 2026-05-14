import React from "react";
import { cn } from "@/lib/cn";

function Card({ children, className, interactive = false, ...props }) {
  return (
    <div
      className={cn(
        "bg-surface border border-ink-100 rounded-md p-6 shadow-1",
        interactive && "transition-all duration-220 hover:-translate-y-0.5 hover:shadow-3 hover:border-ink-300 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ children, className, ...props }) {
  return (
    <div className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  );
}

function CardTitle({ children, className, as: Tag = "h3", ...props }) {
  return (
    <Tag className={cn("heading-sm text-ink-900", className)} {...props}>
      {children}
    </Tag>
  );
}

function CardMeta({ children, className, ...props }) {
  return (
    <p className={cn("body-sm text-ink-500 mt-1", className)} {...props}>
      {children}
    </p>
  );
}

function CardBody({ children, className, ...props }) {
  return (
    <div className={cn("text-ink-700 body-base", className)} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ children, className, ...props }) {
  return (
    <div className={cn("mt-4 pt-4 border-t border-ink-100 flex items-center gap-3", className)} {...props}>
      {children}
    </div>
  );
}

function CardMedia({ src, alt, className, ...props }) {
  return (
    <div className={cn("rounded-t-md overflow-hidden -mx-6 -mt-6 mb-5", className)} {...props}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="w-full h-48 object-cover" />
    </div>
  );
}

function CardSkeleton({ className, ...props }) {
  return (
    <div className={cn("bg-surface border border-ink-100 rounded-md p-6 shadow-1", className)} {...props}>
      <div className="skeleton h-48 rounded-sm -mx-0 mb-4" />
      <div className="skeleton h-5 rounded w-3/4 mb-2" />
      <div className="skeleton h-4 rounded w-1/2 mb-4" />
      <div className="skeleton h-8 rounded w-full" />
    </div>
  );
}

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Meta = CardMeta;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Media = CardMedia;
Card.Skeleton = CardSkeleton;

export { Card };
export default Card;
