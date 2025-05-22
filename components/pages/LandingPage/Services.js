"use client";

import Image from "next/image";
import { useState } from "react";

const services = [
    {
        title: "Interactive, specialized courses",
        description:
            "Engage with tailored lessons designed for medical professionals, featuring real-world scenarios and interactive activities.",
        image: "/practice.jpg",
    },
    {
        title: "Flexible and gamified learning",
        description:
            "Enjoy a dynamic learning experience with game-like challenges and instant feedback, making progress fun and motivating using a technology based approach.",
        image: "/speak.jpg",
    },
    {
        title: "Real speaking practice",
        description:
            "Build your confidence by practicing real conversations and medical dialogues, anytime and anywhere, to fit your busy schedule.",
        image: "/flexible.jpg",
    },
];


export default function Services() {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <section
            id="tools"
            className="py-20 relative text-gray-800"
            style={{
                backgroundImage: "url('/whychooseus.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center 30%",
            }}
            data-aos="fade-up"
        >
            <div className="absolute inset-0 bg-gray-100/80"></div>
            <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">
                <div className="text-center mb-12">
                    <h2
                        className="text-4xl font-bold mb-4"
                        data-aos="fade-up"
                        data-aos-delay="100"
                    >
                        How EngMed Helps You Succeed
                    </h2>
                    <p
                        className="text-lg text-gray-700 max-w-2xl mx-auto"
                        data-aos="fade-up"
                        data-aos-delay="200"
                    >
                        EngMed fits into your life as a doctor or a student. Whether you’re in a clinic or
                        a hospital, our platform makes English practical and achievable.
                    </p>
                </div>
                <div
                    className="flex justify-center gap-4 mb-8 flex-wrap"
                    data-aos="fade-up"
                    data-aos-delay="300"
                >
                    {services.map((service, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveTab(index)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-sm backdrop-blur border border-gray-300 hover:bg-white hover:text-primary ${activeTab === index
                                    ? "bg-white text-primary border-primary"
                                    : "bg-white/70 text-gray-600"
                                }`}
                        >
                            {service.title}
                        </button>
                    ))}
                </div>
                <div
                    className="max-w-4xl mx-auto grid md:grid-cols-2 items-start gap-10 bg-white/90 rounded-2xl shadow-sm backdrop-blur border border-gray-300 p-8"
                    data-aos="zoom-in"
                    data-aos-delay="400"
                >
                    <div className="space-y-4">
                        <h3 className="text-2xl font-semibold text-primary">
                            {services[activeTab].title}
                        </h3>
                        <p className="text-gray-700 text-lg">
                            {services[activeTab].description}
                        </p>
                    </div>
                    <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden shadow">
                        <Image
                            src={services[activeTab].image}
                            alt={services[activeTab].title}
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
                <p
                    className="text-gray-700 text-center mt-10 max-w-2xl mx-auto"
                    data-aos="fade-up"
                    data-aos-delay="500"
                >
                    Focus on one skill at a time—like patient vocab—to see quick results.
                </p>
                <a
                    href="/auth/login"
                    className="inline-block mt-4 bg-primary text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                    data-aos="fade-up"
                    data-aos-delay="600"
                >
                    Start Learning Now
                </a>
            </div>
        </section>
    );
}