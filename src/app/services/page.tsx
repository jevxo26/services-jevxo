import CustomQuote from '@/components/home/services/CustomQuote';
import ServiceHero from '@/components/home/services/ServiceHero';
import ServiceLists from '@/components/home/services/ServiceLists';
import TrendingServices from '@/components/home/services/TrendingServices';

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
          <CustomQuote />
        </div>
      </div>
    );
};

export default Services;