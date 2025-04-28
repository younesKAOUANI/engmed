import React, { useState } from "react";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setStatus("Message sent successfully!");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("Failed to send message.");
      }
    } catch (error) {
      setStatus("Failed to send message.");
    }
  };

  return (
    <section
      id="start"
      className="relative py-16 text-center"
      style={{
        backgroundImage: "url('/images/hero-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      data-aos="fade-up"
    >
      <div className="absolute inset-0 bg-primary/80"></div>
      <div className="container mx-auto px-4 relative z-10 text-white">
        <h2
          className="text-3xl font-bold mb-6"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Ready to Improve Your English?
        </h2>
        <p
          className="mb-8 max-w-2xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          Sign up in seconds and start learning with EngMed—designed for doctors
          like you. Try it free and see the difference.
        </p>
        <a
          href="/auth/login"
          className="bg-white text-primary px-6 py-3 rounded-lg hover:bg-gray-100 transition inline-block"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          Sign Up Free
        </a>
        <p
          className="text-sm mt-4"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          No payment needed to start
        </p>
        <div className="mt-12 flex flex-col lg:flex-row gap-8 items-start justify-center h-full">
          <form
            onSubmit={handleSubmit}
            className="w-full lg:w-1/2 bg-white rounded-lg p-6 text-left flex flex-col gap-6 text-gray-800 shadow-lg h-[500px]"
            data-aos="fade-right"
            data-aos-delay="500"
          >
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <textarea
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              rows={5}
            ></textarea>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              Contact Us
            </button>
            {status && <p className="text-sm mt-2">{status}</p>}
          </form>
          <div
            className="w-full lg:w-1/2 h-[500px] rounded-lg overflow-hidden shadow-lg"
            data-aos="fade-left"
            data-aos-delay="600"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3192.0117258084643!2d3.058756!3d36.753769!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fa43d3bd4fb45%3A0x94df4b3a10f970d0!2sAlgiers%2C%20Algeria!5e0!3m2!1sen!2sdz!4v1713099999999!5m2!1sen!2sdz"
              width="100%"
              height="100%"
              loading="lazy"
              allowFullScreen
              className="border-0"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}