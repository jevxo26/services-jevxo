import ExploreCategories from "@/components/home/sections/home/ExploreCategories";
import Hero from "@/components/home/sections/home/Hero";
import HowItWorks from "@/components/home/sections/home/HowItWorks";
import Testimonials from "@/components/home/sections/home/Testimonials";
import TopServices from "@/components/home/sections/home/TopServices";
import WhyChooseUs from "@/components/home/sections/home/WhyChooseUs";
import Stats from "@/components/home/sections/home/Stats";
// import AppDownload from "@/components/home/sections/home/AppDownload";
// import PartnerCta from "@/components/home/sections/home/PartnerCta";
import FAQ from "@/components/home/sections/home/FAQ";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Hero />
      <div className="relative overflow-hidden">
        {/* Soft premium radial glows for depth and premium aesthetic */}
        <div className="absolute top-[10%] left-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-[#FF5A5F]/4 blur-[130px] rounded-full pointer-events-none z-0" />
        <div className="absolute top-[40%] right-[-10%] w-[500px] md:w-[700px] h-[500px] md:h-[700px] bg-cyan-500/3 blur-[150px] rounded-full pointer-events-none z-0" />
        <div className="absolute bottom-[10%] left-[-5%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-emerald-500/3 blur-[130px] rounded-full pointer-events-none z-0" />

        {/* Content sections rendered above the background */}
        <div 
        className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0"
        style={{ backgroundSize: 'auto' }}
        />
        <div className="relative z-10">
          <ExploreCategories />
          <TopServices />
          <WhyChooseUs />
          <Stats />
          <HowItWorks />
          <Testimonials />
          <FAQ />
        </div>
      </div>
      </div>
  );
}
