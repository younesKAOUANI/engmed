import { ChartColumnBig, Clock, Handshake, Volume2 } from "lucide-react";

const challenges = [
  {
    title: "Patient Communication",
    description:
      "Struggling to explain diagnoses or treatments clearly to international patients or colleagues.",
    backgroundColor: "bg-blue-50",
    icon: <Handshake size={92} color="oklch(62.3% 0.214 259.815)" />,
  },
  {
    title: "Professional Growth",
    description:
      "Missing out on conferences, research papers, or global opportunities due to language gaps.",
    backgroundColor: "bg-yellow-50",
    icon: <ChartColumnBig size={92} color={"oklch(76.9% 0.188 70.08)"} />,
  },
  {
    title: "Time Pressure",
    description:
      "Balancing busy hospital shifts with learning English feels overwhelming.",
    backgroundColor: "bg-red-50",
    icon: <Clock size={92} color="oklch(63.7% 0.237 25.331)" />,
  },
  {
    title: "Confidence in Speaking",
    description:
      "Feeling nervous or hesitant when speaking English with peers or during presentations.",
    backgroundColor: "bg-green-50",
    icon: <Volume2 size={92} color="oklch(72.3% 0.219 149.579)" />,
  },
];

const WhyChooseUs = () => {
  return (
    <section id="challenges" className="py-16 bg-white" data-aos="fade-up">
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2
          className="text-3xl font-bold text-gray-800 mb-6"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          You are facing problems with...
        </h2>
        <p
          className="text-gray-600 mb-8 max-w-2xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          Every day, you’re saving lives—but English can feel like a hurdle.
          Here’s what we hear from people like you:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {challenges.map((item, index) => (
            <div
              key={index}
              className={`relative ${item.backgroundColor} rounded-lg shadow p-6 w-full aspect-square text-left overflow-hidden`}
              data-aos="flip-up"
              data-aos-delay={300 + index * 100}
            >
              <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
              <

                p className="text-gray-700 text-md">{item.description}</p>
              <div className="absolute bottom-6 right-6 text-black opacity-70">
                {item.icon}
              </div>
            </div>
          ))}
        </div>
        <p
          className="text-gray-600 mt-6 max-w-2xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="700"
        >
          Just 15 minutes a day with EngMed can improve your patient interactions
          in weeks.
        </p>
        <a
          href="/auth/login"
          className="mt-6 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition inline-block"
          data-aos="fade-up"
          data-aos-delay="800"
        >
          Overcome These Challenges
        </a>
      </div>
    </section>
  );
};

export default WhyChooseUs;