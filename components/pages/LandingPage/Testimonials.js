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
    <section className="bg-white">
      <div className="section">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          What Our Clients Say
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 shadow-lg rounded-lg flex flex-col justify-between"
            >
              <p className="text-gray-600 mb-4">{testimonial.text}</p>
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={`Client ${index + 1}`}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {testimonial.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
