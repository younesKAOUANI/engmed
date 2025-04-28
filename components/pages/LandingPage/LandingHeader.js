import Button from "@/components/ui/Button";
import Image from "next/image";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function LandingHeader() {
  const { data: session, status } = useSession();
  const router = useRouter();

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
          <a
            href="#who-we-are"
            className="text-lg font-semibold hover:text-blue-300"
          >
            About Us
          </a>
          <a href="#tools" className="text-lg font-semibold hover:text-blue-300">
            How It Works
          </a>
          <a href="#proof" className="text-lg font-semibold hover:text-blue-300">
            Success Stories
          </a>
          <a href="#start" className="text-lg font-semibold hover:text-blue-300">
            Get Started
          </a>
        </nav>
        <JoinUsButton session={session} status={status} router={router} />
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
      className="font-semibold hover:text-gray-700 hover:shadow-md hover:bg-transparent bg-blue-600 text-white px-4 py-2 rounded-md hover:scale-95"
      disabled={status === "loading"}
      href={href}
    >
      {status === "loading" ? "Loading..." : buttonText}
    </Button>
  );
}