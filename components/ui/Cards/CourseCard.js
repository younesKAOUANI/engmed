import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";

export default function CourseCard({ course, enrolled = false }) {
  const { id, title, description, thumbnail, price, rating, totalStudents } = course;
  const href = enrolled ? `/dashboard/courses/${id}` : `/dashboard/courses/view/${id}`;

  return (
    <div className="group bg-surface border border-ink-100 rounded-md shadow-1 overflow-hidden transition-all duration-220 hover:-translate-y-0.5 hover:shadow-3 hover:border-ink-300 flex flex-col">
      {/* Thumbnail */}
      <div className="relative w-full h-48 overflow-hidden bg-surface2">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover transition-transform duration-220 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-brand-50">
            <span className="eyebrow text-brand-500">EngMed</span>
          </div>
        )}
        {price === 0 && (
          <span className="absolute top-3 left-3 bg-brand-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded-pill">
            Free
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-2 flex-1">
        <h3 className="heading-sm text-ink-900 line-clamp-2 group-hover:text-brand-600 transition-colors">
          {title}
        </h3>
        <p className="body-sm text-ink-500 line-clamp-2 flex-1">{description}</p>

        {/* Rating row */}
        <div className="flex items-center gap-2 mt-1">
          <span className="mono-sm text-ink-900">{rating.toFixed(1)}</span>
          <Star className="w-3.5 h-3.5 text-accent-600 fill-accent-600" aria-hidden="true" />
          <span className="body-sm text-ink-500">
            · {totalStudents.toLocaleString()} learners
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mt-2 pt-3 border-t border-ink-100">
          {price === 0 ? (
            <span className="text-success font-semibold text-[13px]">Free</span>
          ) : (
            <span className="mono-sm text-ink-900">€{price.toLocaleString()}</span>
          )}
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-brand-600 body-sm font-medium hover:gap-2 transition-all duration-150"
            aria-label={`${enrolled ? "Continue" : "View"} course: ${title}`}
          >
            {enrolled ? "Continue" : "View"}
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function CourseCardSkeleton() {
  return (
    <div className="bg-surface border border-ink-100 rounded-md shadow-1 overflow-hidden">
      <div className="skeleton h-48 w-full" />
      <div className="p-5 flex flex-col gap-3">
        <div className="skeleton h-5 rounded w-3/4" />
        <div className="skeleton h-4 rounded w-full" />
        <div className="skeleton h-4 rounded w-2/3" />
        <div className="skeleton h-8 rounded w-full mt-1" />
      </div>
    </div>
  );
}
