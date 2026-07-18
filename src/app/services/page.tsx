import CustomQuote from '@/components/home/services/CustomQuote';
import ServiceHero from '@/components/home/services/ServiceHero';
import ServiceLists from '@/components/home/services/ServiceLists';
import TrendingServices from '@/components/home/services/TrendingServices';
import CategorizedSections from '@/components/home/services/CategorizedSections';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: "Professional Home Services Directory - Rajseba",
  description: "Browse and book from our comprehensive list of verified home services including cleaning, appliance repair, plumbing, electrical, and painting in Bangladesh.",
  keywords: ["home service list", "AC service", "home cleaning services", "plumbing service", "electrical work", "Dhaka services"],
  openGraph: {
    title: "Professional Home Services Directory - Rajseba",
    description: "Browse and book from our comprehensive list of verified home services.",
    url: "https://rajseba.com/services",
    siteName: "Rajseba",
    locale: "en_US",
    type: "website",
  },
};

const Services = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <ServiceHero />
      <div
        className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0"
        style={{ backgroundSize: "auto" }}
      />
      <div className="relative space-y-4 md:space-y-6 lg:space-y-8">
        <TrendingServices />
        <Suspense fallback={
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E4E8C]" />
          </div>
        }>
          <ServiceLists />
        </Suspense>
        <CategorizedSections />
        <CustomQuote />
      </div>
    </div>
  );
};

export default Services;