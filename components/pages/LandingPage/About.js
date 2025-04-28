import Image from "next/image";

const About = () => {
  return (
    <section
      id="who-we-are"
      className="py-16 relative bg-gradient-to-b from-cyan-600 to-primary/80"
      data-aos="fade-up"
    >
      <div className="container mx-auto flex items-center justify-center gap-12">
        <div
          className="px-4 text-left relative z-10 w-1/2"
          data-aos="fade-right"
          data-aos-delay="100"
        >
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Built by Algerians, for Algerians
          </h2>
          <p className="text-gray-100 mb-8 text-lg">
            We’re a team of TEFL/TESOL-certified tutors based in Algeria, working
            to help doctors like you shine on the global stage. From our offices
            in Oum El Bouaghi, we’ve designed EngMed to understand your needs and
            support your goals.
          </p>
          <p className="text-gray-100 text-lg">
            <strong>Why Us?</strong> We’ve helped doctors across Algeria improve
            their English for better patient care and careers.
          </p>
        </div>
        <div data-aos="fade-left" data-aos-delay="200">
          <Image
            src="/services.jpg"
            alt="Our team"
            width={400}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default About;