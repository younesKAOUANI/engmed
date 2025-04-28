import Image from "next/image";
import React from "react";

export default function Hero() {
  return (
    <section
      className="relative bg-white py-20 !pt-32 text-center"
      data-aos="zoom-in"
    >
      <div className="container mx-auto px-4 relative z-10">
        <h1
          className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Promote Your Medical English and Communicative Skills
        </h1>
        <p
          className="text-lg text-gray-600 mb-6"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          As a doctor, you deserve to communicate clearly with patients and
          colleagues worldwide. EngMed helps you get there—step by step.
        </p>
        <a
          href="/auth/login"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition inline-block"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          Try It Free Today
        </a>
        <p
          className="text-sm text-gray-500 mt-4"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          Join doctors from all over Algeria already improving their English
        </p>
      </div>
      <Image
        src="/mockup.png"
        alt="Hero Image"
        width={1000}
        height={500}
        className="mx-auto mt-8 rounded-lg shadow-[0px_0px_60px_rgba(0,0,0,0.25)]"
        data-aos="fade-up"
        data-aos-delay="500"
      />
    </section>
  );
}