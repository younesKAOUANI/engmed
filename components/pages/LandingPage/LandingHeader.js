import Button from "@/components/ui/Button";
import Image from "next/image";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function LandingHeader() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [gamesDropdownOpen, setGamesDropdownOpen] = React.useState(false);
  
  const toggleGamesDropdown = () => {
    setGamesDropdownOpen(!gamesDropdownOpen);
  };

  return (
    <header
      className="fixed z-50 w-full bg-white/40 backdrop-blur-md shadow-md"
      data-aos="fade-down"
    >
      <div className="text-black container mx-auto p-4 flex justify-between items-center">
        <div
          className="flex items-center gap-1"
          data-aos="fade-right"
          data-aos-delay="100"
        >
          <Image src="/logo.png" width={48} height={48} alt="EngMed Logo" />
          <span className="text-xl font-bold">EngMed</span>
        </div>
        <nav
          className="hidden md:flex space-x-6"
          data-aos="fade-left"
          data-aos-delay="200"
        >
          <a href="#" className="text-lg font-semibold hover:text-blue-300">
            Home
          </a>
          <a
            href="#challenges"
            className="text-lg font-semibold hover:text-blue-300"
          >
            Your Needs
          </a>
          <a href="#tools" className="text-lg font-semibold hover:text-blue-300">
            How It Works
          </a>
          <a
            href="#who-we-are"
            className="text-lg font-semibold hover:text-blue-300"
          >
            About
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={toggleGamesDropdown}
              className="font-semibold hover:text-gray-700 hover:shadow-md hover:bg-primary bg-blue-600 text-white px-4 py-2 rounded-md hover:scale-95 flex items-center"
            >
              Mini Games
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 ml-1 transition-transform ${gamesDropdownOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {gamesDropdownOpen && (
              <div className="absolute bg-white shadow-md rounded-md top-12 right-0 w-40 z-50">
                <Link href="/game" className="block px-4 py-2 hover:bg-blue-100 text-gray-800 rounded-t-md">
                  Wordscapes
                </Link>
                <Link href="/game/crosswords" className="block px-4 py-2 hover:bg-blue-100 text-gray-800 rounded-b-md">
                  Crosswords
                </Link>
              </div>
            )}
          </div>
          <Link href="/placement-test" 
                className="font-semibold hover:text-gray-700 hover:shadow-md hover:bg-primary bg-blue-600 text-white px-4 py-2 rounded-md hover:scale-95">
            Free English Test
          </Link>
          <JoinUsButton session={session} status={status} router={router} />
        </div>
      </div>
    </header>
  );
}

function JoinUsButton({ session, status, router }) {
  let href = "/auth/login";
  let buttonText = "Join Us";

  if (status === "authenticated") {
    href = "/dashboard";
    buttonText = session.user.role === "STUDENT" ? "Your Learning" : "Admin Panel";
  }

  return (
    <Button
      className="font-semibold hover:text-gray-700 hover:shadow-md hover:bg-primary bg-blue-600 text-white px-4 py-2 rounded-md hover:scale-95"
      disabled={status === "loading"}
      href={href}
    >
      {status === "loading" ? "Loading..." : buttonText}
    </Button>
  );
}