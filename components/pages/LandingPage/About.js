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
            Hana Boulahrouz a TEFL/TESOL-certified tutor and her team of experts based in Algeria, working
            to help students, professionals, and teacher of medecine, dentistry, pharmacy and paramedics like you shine on the global stage. We’ve designed EngMed to understand your needs and
            support your goals.
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