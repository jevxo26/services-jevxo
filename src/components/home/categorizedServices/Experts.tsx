import {
  Star,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";

const experts = [
  {
    name: "Ariful Islam",
    title: "Senior Technician (8yr Exp)",
    rating: 4.9,
    jobs: "420+ jobs",
  },
  {
    name: "Tanvir Ahmed",
    title: "Wiring Specialist",
    rating: 4.8,
    jobs: "215+ jobs",
  },
  {
    name: "Md. Zahid Ahmed",
    title: "Master Electrician",
    rating: 5.0,
    jobs: "580+ jobs",
  },
  {
    name: "Salman Khan",
    title: "Installation Pro",
    rating: 4.7,
    jobs: "180+ jobs",
  },
  {
    name: "Sadikul Ahmed",
    title: "Senior Technician (8yr Exp)",
    rating: 4.9,
    jobs: "420+ jobs",
  },
  {
    name: "Muntasir Alam",
    title: "Wiring Specialist",
    rating: 4.8,
    jobs: "215+ jobs",
  },
  {
    name: "Muntahara",
    title: "Master Electrician",
    rating: 5.0,
    jobs: "580+ jobs",
  },
  {
    name: "John Doe",
    title: "Installation Pro",
    rating: 4.7,
    jobs: "180+ jobs",
  },
];

export function Experts({ employees }: { employees?: any[] }) {
  const displayExperts = employees && employees.length > 0
    ? employees.map((emp, idx) => ({
        name: emp.name,
        title: emp.role || "Expert Technician",
        rating: 4.8 + (idx % 3) * 0.1,
        jobs: `${120 + idx * 35}+ jobs`,
      }))
    : experts;

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6 overflow-hidden">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900">
            Meet Our Top Rated Experts
          </h2>
        </div>

        {/* Marquee Container */}
        <div className="relative">
          <motion.div
            className="flex gap-6"
            animate={{
              x: [0, -50 * displayExperts.length * 1.1], // Move left continuously
            }}
            transition={{
              duration: 10, // Adjust speed here (higher = slower)
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[...displayExperts, ...displayExperts, ...displayExperts].map((expert, index) => (
              <div key={index} className="min-w-[280px] flex-shrink-0">
                <div className="bg-[#fff9f8] rounded-3xl p-8 text-center hover:shadow-xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 group h-full">
                  <div className="w-12 h-12 mx-auto mb-6 bg-green-100 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-green-600" />
                  </div>

                  <h3 className="font-semibold text-lg text-slate-900 mb-1">
                    {expert.name}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4">{expert.title}</p>

                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="w-5 h-5 fill-[#FF7C71] text-[#FF7C71]" />
                    <span className="font-bold text-lg text-slate-900">
                      {expert.rating}
                    </span>
                    <p className="text-slate-500 text-sm">({expert.jobs})</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
