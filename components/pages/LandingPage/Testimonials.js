import Image from 'next/image';
import React from 'react';

export default function Testimonials() {
  // Array of testimonials
  const testimonials = [
    {
      text: "This service has completely exceeded my expectations. Their professionalism and attention to detail are unmatched.",
      name: "John Doe",
      title: "CEO, Example Corp",
      image: "https://placehold.co/50",
    },
    {
      text: "I can't recommend them enough! The quality and efficiency of their work are truly top-notch.",
      name: "Jane Smith",
      title: "Founder, Startup Inc.",
      image: "https://placehold.co/50",
    },
    {
      text: "Amazing experience! They delivered everything on time and with exceptional quality.",
      name: "Alice Brown",
      title: "Manager, Business Co.",
      image: "https://placehold.co/50",
    },
  ];

  return (
<section id="proof" className="py-16 relative bg-gray-100" data-aos="fade-up">
  <div className="absolute inset-y-0 left-0 w-1/2 hidden md:block">
    <Image
      src="/hero-bg.jpg"
      alt="Successful doctor"
      layout="fill"
      objectFit="cover"
      className="opacity-20"
    />
  </div>
  <div className="container mx-auto px-4 text-center relative z-10">
    <h2 className="text-3xl font-bold text-gray-800 mb-6" data-aos="fade-up" data-aos-delay="100">
      Doctors Like You, Succeeding
    </h2>
    <p className="text-gray-600 mb-8 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
      Hear from doctors who’ve used EngMed...
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        className="p-6 bg-white rounded-lg shadow"
        data-aos="fade-up"
        data-aos-delay="300"
      >
        <p className="text-gray-600 italic">“EngMed helped me explain treatments...”</p>
        <p className="mt-4 font-semibold">Dr. Karim, Algiers</p>
      </div>
      <div
        className="p-6 bg-white rounded-lg shadow"
        data-aos="fade-up"
        data-aos-delay="400"
      >
        <p className="text-gray-600 italic">“I presented my research in English...”</p>
        <p className="mt-4 font-semibold">Dr. Fatima, Oran</p>
      </div>
      <div
        className="p-6 bg-white rounded-lg shadow"
        data-aos="fade-up"
        data-aos-delay="500"
      >
        <p className="text-gray-600 italic">“It fits my schedule perfectly...”</p>
        <p className="mt-4 font-semibold">Dr. Youssef, Constantine</p>
      </div>
    </div>
    <p className="text-gray-600 mt-6 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="600">
      Clear English builds trust with patients...
    </p>
    <a
      href="/auth/login"
      className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg..."
      data-aos="fade-up"
      data-aos-delay="700"
    >
      Join Them Today
    </a>
  </div>
</section>
  );
}
