"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Award, 
  Heart, 
  Sparkles, 
  Users, 
  Target, 
  CheckCircle,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const STATS = [
  { value: "10,000+", label: "Happy Households" },
  { value: "500+", label: "Vetted Professionals" },
  { value: "20+", label: "Service Categories" },
  { value: "99.8%", label: "Satisfaction Rate" }
];

const CORE_VALUES = [
  {
    title: "Uncompromising Safety",
    description: "Every professional undergoes multi-tier biometric background screening and skills validation.",
    icon: ShieldCheck,
    bg: "bg-rose-50 text-[#FF5A5F]"
  },
  {
    title: "Premium Standards",
    description: "We guarantee standard-setting quality backed by our money-back customer guarantee.",
    icon: Award,
    bg: "bg-amber-50 text-amber-600"
  },
  {
    title: "Customer-First Heart",
    description: "Our dedicated support team is available 24/7 to solve your household issues immediately.",
    icon: Heart,
    bg: "bg-emerald-50 text-emerald-600"
  },
  {
    title: "Continuous Innovation",
    description: "Utilizing modern technology to schedule, match, and fulfill bookings seamlessly.",
    icon: Sparkles,
    bg: "bg-indigo-50 text-indigo-600"
  }
];

const TEAM_MEMBERS = [
  {
    name: "Mahbubur Rahman",
    role: "Founder & CEO",
    bio: "Visionary leader passionate about solving daily utility logistics for urban households.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
  },
  {
    name: "Farhana Yasmin",
    role: "Head of Customer Experience",
    bio: "Dedicated customer advocate ensuring service protocols are followed with precision.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
  },
  {
    name: "Asif Adnan",
    role: "Director of Vendor Operations",
    bio: "Background screening expert ensuring Rajseba matches only the top 5% of field technicians.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 15 }
  }
} as const;

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50/50">
      
      {/* ── HERO BANNER SECTION ── */}
      <section className="relative bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20 overflow-hidden">
        {/* Soft background glows */}
        <div className="absolute -top-1/4 right-0 w-[450px] h-[450px] bg-[#FF5A5F]/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <span className="text-xs font-black text-[#FF5A5F] uppercase tracking-widest bg-[#FFF0F1] px-3.5 py-1.5 rounded-full border border-rose-100/50">
                Our Story
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Redefining Home Care for <span className="text-[#FF5A5F]">Premium Living</span>
              </h1>
              <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Rajseba was born out of a simple need: to bring safety, reliability, and top-tier professionalism to the home services industry in Bangladesh. We connect premium homes with background-verified expert professionals for seamless care.
              </p>
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link href="/services">
                  <Button className="bg-[#FF5A5F] hover:bg-[#FF4449] text-white text-xs font-extrabold px-6 py-3.5 h-auto rounded-xl border-none transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2">
                    Explore Services
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="bg-slate-50 hover:bg-slate-150 text-slate-700 text-xs font-extrabold px-6 py-3.5 h-auto rounded-xl border border-slate-200 transition-all cursor-pointer active:scale-95">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-md border border-slate-100">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop"
                alt="Beautiful home design banner"
                fill
                className="object-cover"
                priority
              />
            </div>
            
          </div>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {STATS.map((stat, i) => (
              <div key={i} className="space-y-1">
                <p className="text-3xl md:text-4xl lg:text-5xl font-black text-[#FF5A5F] tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs md:text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION & VISION ── */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Mission Card */}
            <div className="bg-white border border-slate-100 rounded-[32px] p-8 md:p-10 shadow-xs space-y-4 hover:border-[#FF5A5F]/20 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF0F1] text-[#FF5A5F] flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 tracking-wide">Our Mission</h2>
              <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                To build Bangladesh's most reliable and secure ecosystem for on-demand home services, empowering local professionals with job dignity while delivering standard-setting logistics convenience to premium urban households.
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-white border border-slate-100 rounded-[32px] p-8 md:p-10 shadow-xs space-y-4 hover:border-[#FF5A5F]/20 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF0F1] text-[#FF5A5F] flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 tracking-wide">Our Vision</h2>
              <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                To become the ultimate household companion in South Asia, synonymous with absolute quality, trusted integrity, and visual excellence, transforming the way services are booked, verified, and valued in society.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── CORE VALUES SECTION ── */}
      <section className="bg-white border-y border-slate-100 py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 tracking-wide">
              Values That Drive Us
            </h2>
            <p className="text-sm md:text-base text-slate-400 mt-2">
              Our culture is built on values that guarantee the safety and comfort of your household.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {CORE_VALUES.map((val, i) => {
              const Icon = val.icon;
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-3xl p-6 border border-slate-100 hover:shadow-[0_12px_24px_-4px_rgba(0,0,0,0.03)] transition-all duration-300 flex flex-col items-center text-center space-y-4 h-full justify-between"
                >
                  <div className="space-y-4 flex flex-col items-center">
                    <span className={`p-3.5 rounded-2xl ${val.bg} flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-base">{val.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-xs">{val.description}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    Vetted standard
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

        </div>
      </section>

      {/* ── OUR TEAM SECTION ── */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
            <span className="text-xs font-black text-[#FF5A5F] uppercase tracking-widest bg-[#FFF0F1] px-3.5 py-1.5 rounded-full border border-rose-100/50">
              The Minds
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 tracking-wide">
              Meet Our Leadership Team
            </h2>
            <p className="text-sm md:text-base text-slate-500 mt-2">
              Our leaders bring together technology, hospitality, and rigorous background verification standards.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {TEAM_MEMBERS.map((member, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col items-center text-center space-y-4 hover:shadow-[0_15px_30px_rgba(0,0,0,0.03)] hover:border-[#FF5A5F]/15 transition-all duration-300 h-full"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden relative border-2 border-[#FFF0F1] shadow-xs">
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">{member.name}</h3>
                  <p className="text-xs font-semibold text-[#FF5A5F] uppercase tracking-wider mt-0.5">{member.role}</p>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs">{member.bio}</p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

    </div>
  );
}
