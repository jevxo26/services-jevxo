"use client";

import { CategorizedHero } from '@/components/home/categorizedServices/CategorizedHero';
import { SpecializedServices } from '@/components/home/categorizedServices/SpecializedServices';
import { Packages } from '@/components/home/categorizedServices/Packages';
import { Experts } from '@/components/home/categorizedServices/Experts';
import { Commitments } from '@/components/home/categorizedServices/Commitments';

// // Slug mapping to display names
// const SLUG_TO_NAME: Record<string, string> = {
//   "ac-repair": "AC Repair",
//   plumbing: "Plumbing",
//   cleaning: "Cleaning",
//   electrical: "Electrical",
//   shifting: "Shifting",
//   cctv: "CCTV",
//   "appliance-repair": "Appliance Repair",
//   painting: "Painting",
//   gardening: "Gardening",
//   "pest-control": "Pest Control",
//   "home-salon": "Home Salon",
//   carpentry: "Carpentry",
// };



// Main Component
export default function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {

  // // Unwrap parameters according to React 19/Next 16 standards
  // const { slug } = React.use(params);
  // const categoryName = SLUG_TO_NAME[slug] || slug.replace("-", " ");

  return (
    <div className="min-h-screen bg-slate-50/50 relative">
      <div
        className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0"
        style={{ backgroundSize: "auto" }}
      />
        <CategorizedHero/>
        <SpecializedServices />
        <Packages />
        <Experts />
        <Commitments />

    </div>
  );
}
