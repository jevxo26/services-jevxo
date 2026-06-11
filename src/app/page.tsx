import ExploreCategories from "@/components/sections/home/ExploreCategories";
import Hero from "@/components/sections/home/Hero";
import HowItWorks from "@/components/sections/home/HowItWorks";
import Testimonials from "@/components/sections/home/Testimonials";
import TopServices from "@/components/sections/home/TopServices";
import WhyChooseUs from "@/components/sections/home/WhyChooseUs";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Hero/>
      <ExploreCategories/>
      <TopServices/>
      <WhyChooseUs/>
      <HowItWorks/>
      <Testimonials/>
    </div>
  );
}