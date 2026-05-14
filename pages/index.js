import Head from "next/head";
import LandingHeader from "@/components/pages/LandingPage/LandingHeader";
import LandingFooter from "@/components/pages/LandingPage/LandingFooter";
import Image from "next/image";
import Hero from "@/components/pages/LandingPage/Hero";
import WhyChooseUs from "@/components/pages/LandingPage/WhyChooseUs";
import Services from "@/components/pages/LandingPage/Services";
import About from "@/components/pages/LandingPage/About";
import ContactUs from "@/components/pages/LandingPage/ContactUs";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Head>
        <title>EngMed - Improve Your Medical English</title>
        <meta name="description" content="Master medical English with EngMed — designed for healthcare professionals in France" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <LandingHeader />
      <Hero />
      <WhyChooseUs />
      <Services />
      <About />
      {/* <Testimonials /> */}
      <ContactUs />
      <LandingFooter />
    </div>
  );
}