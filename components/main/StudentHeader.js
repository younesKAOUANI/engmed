import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { CircleUser } from "lucide-react";

export default function StudentHeader({ joinUs, pathname }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-10">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        {/* Logo and Brand */}
        <Link href={"/"} className="flex items-center gap-2">
          <Image src="/logo.png" width={32} height={32} alt="logo" />
          <p className="text-gray-900 font-bold text-2xl">EngMed</p>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6 text-gray-900 text-sm font-medium">
          <Link
            href="/dashboard"
            className={`hover:text-primary ${pathname === "/dashboard" ? "text-primary" : ""}`}
          >
            Explore
          </Link>
          <Link
            href="/dashboard/courses"
            className={`hover:text-primary ${pathname === "/dashboard/courses" ? "text-primary" : ""}`}
          >
            All Courses
          </Link>
          <Link
            href="/dashboard/lets-speak"
            className={`hover:text-primary ${pathname === "/dashboard/lets-speak" ? "text-primary" : ""}`}
          >
            Let's Speak
          </Link>
        </nav>

        {/* Profile Dropdown */}
        <div className="relative">
          <button onClick={toggleDropdown} className="flex items-center">
          <CircleUser />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-2">
              <Link
                href="/dashboard/enrollements"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Enrollements
              </Link>
              <Link
                href="/dashboard/certifications"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Certifications
              </Link>
              <Link
                href="/dashboard/settings"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Settings
              </Link>
              <button
                onClick={() => signOut()}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}