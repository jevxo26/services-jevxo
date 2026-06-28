import ExploreCategories from "@/components/home/sections/home/ExploreCategories";
import Hero from "@/components/home/sections/home/Hero";
import HowItWorks from "@/components/home/sections/home/HowItWorks";
import Testimonials from "@/components/home/sections/home/Testimonials";
import TopServices from "@/components/home/sections/home/TopServices";
import WhyChooseUs from "@/components/home/sections/home/WhyChooseUs";
import Stats from "@/components/home/sections/home/Stats";
import SpecialOffers from "@/components/home/sections/home/SpecialOffers";
import FeaturedProviders from "@/components/home/sections/home/FeaturedProviders";
import ServiceAreas from "@/components/home/sections/home/ServiceAreas";
// import PartnerCta from "@/components/home/sections/home/PartnerCta";
import FAQ from "@/components/home/sections/home/FAQ";
import HomeMotionWrapper from "@/components/home/HomeMotionWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rajseba - Expert Care for Your Premium Home",
  description: "Professional home services in Bangladesh with verified experts. Book top-rated cleaning, AC repair, plumbing, electrical, and other home services today.",
  keywords: ["home services", "AC repair", "cleaning", "plumbing", "electrical", "Bangladesh", "Dhaka", "Rajseba"],
  openGraph: {
    title: "Rajseba - Expert Care for Your Premium Home",
    description: "Professional home services in Bangladesh with verified experts.",
    url: "https://rajseba.com",
    siteName: "Rajseba",
    locale: "en_US",
    type: "website",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Hero />
      <div className="relative overflow-hidden">
        {/* Soft premium radial glows for depth and premium aesthetic */}
        <div className="absolute top-[10%] left-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-[#FF6014]/4 blur-[130px] rounded-full pointer-events-none z-0" />
        <div className="absolute top-[40%] right-[-10%] w-[500px] md:w-[700px] h-[500px] md:h-[700px] bg-cyan-500/3 blur-[150px] rounded-full pointer-events-none z-0" />
        <div className="absolute bottom-[10%] left-[-5%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-emerald-500/3 blur-[130px] rounded-full pointer-events-none z-0" />

        {/* Content sections rendered above the background */}
        <div
          className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0"
          style={{ backgroundSize: 'auto' }}
        />
        <div className="relative z-10 flex flex-col gap-6 md:gap-6">
          <HomeMotionWrapper>
            <ExploreCategories />
          </HomeMotionWrapper>

          <HomeMotionWrapper>
            <TopServices />
          </HomeMotionWrapper>

          {/* ✨ Special Deals — shown right after browsing services to drive booking */}
          <HomeMotionWrapper>
            <SpecialOffers />
          </HomeMotionWrapper>

          {/* 👷 Top Professionals — builds trust before WhyChooseUs */}
          <HomeMotionWrapper>
            <FeaturedProviders />
          </HomeMotionWrapper>

          <HomeMotionWrapper>
            <WhyChooseUs />
          </HomeMotionWrapper>

          <HomeMotionWrapper>
            <Stats />
          </HomeMotionWrapper>

          {/* 🗺️ Coverage Map — shown after stats to answer "is this available near me?" */}
          <HomeMotionWrapper>
            <ServiceAreas />
          </HomeMotionWrapper>

          <HomeMotionWrapper>
            <HowItWorks />
          </HomeMotionWrapper>

          <HomeMotionWrapper>
            <Testimonials />
          </HomeMotionWrapper>

          {/* <PartnerCta /> */}

          <HomeMotionWrapper>
            <FAQ />
          </HomeMotionWrapper>
        </div>
      </div>
    </div>
  );
}
