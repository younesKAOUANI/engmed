import Link from 'next/link';
import React from 'react';
import { FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";
import { LiaFacebookSquare } from "react-icons/lia";
import { TbBrandLinkedin } from "react-icons/tb";

export default function LandingFooter() {
  return (
    <footer className="bg-white">
      <div className="section py-8 text-center text-gray-700">
        <div className="rounded-md px-4">
          <h2 className="text-2xl font-semibold text-primary-600">Stay Connected</h2>
          <p className="text-gray-500 mt-2">Follow us on social media for updates</p>
          <div className="flex justify-center mt-4 space-x-4">
            <Link href="#" className="text-primary text-5xl hover:text-4xl">
              <FaInstagram />
            </Link>
            <Link href="#" className="text-primary text-5xl hover:text-4xl">
              <FaFacebook />
            </Link>
            <Link href="#" className="text-primary text-5xl hover:text-4xl">
              <FaLinkedin />
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-500">© 2025 EngMed. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
