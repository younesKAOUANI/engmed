import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

export default function CourseCard({ course, enrolled = false }) {
  const { id, title, description, thumbnail, price, rating, totalStudents } = course;

  return (
    <Link href={enrolled ? `/dashboard/courses/${id}` : `/dashboard/courses/view/${id}`}
      className="block w-full bg-white border border-gray-200 rounded-sm shadow-md hover:shadow-lg transition-shadow">
      {/* Thumbnail */}
      <div className="relative w-full h-[200px]">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover rounded-t-sm"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2">
        {/* Title */}
        <h3 className="text-gray-900 font-semibold text-base line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2">{description}</p>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <span className="text-yellow-500 font-semibold">{rating.toFixed(1)}</span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.round(rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="text-gray-500 text-xs">({totalStudents} students)</span>
        </div>

        {/* Price */}
        <p className="text-gray-900 font-bold text-lg">{price} DA</p>
      </div>
    </Link>
  );
}