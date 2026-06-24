import CustomQuote from '@/components/home/services/CustomQuote';
import ServiceHero from '@/components/home/services/ServiceHero';
import ServiceLists from '@/components/home/services/ServiceLists';
import TrendingServices from '@/components/home/services/TrendingServices';
import CategorizedSections from '@/components/home/services/CategorizedSections';
import { Metadata } from 'next';

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
    <div className="min-h-screen bg-background relative">
      <ServiceHero />
      <div
        className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0"
        style={{ backgroundSize: "auto" }}
      />
      <div className="relative z-10 space-y-16 md:space-y-24 lg:space-y-32">
        <TrendingServices />
        <ServiceLists />
        <CategorizedSections />
        <CustomQuote />
      </div>
    </div>
  );
};

export default Services;