"use client";
import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  ShieldCheck,
  Award,
  Heart,
  Sparkles,
  Users,
  Target,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/* ─── Data ───────────────────────────────────────────────────── */
const STATS = [
  { value: "10,000+", label: "Happy Households" },
  { value: "500+", label: "Vetted Professionals" },
  { value: "20+", label: "Service Categories" },
  { value: "99.8%", label: "Satisfaction Rate" },
];

const CORE_VALUES = [
  {
    title: "Uncompromising Safety",
    description:
      "Every professional undergoes multi-tier biometric background screening and skills validation.",
    icon: ShieldCheck,
    bg: "bg-rose-50 text-[#FF7C71]",
  },
  {
    title: "Premium Standards",
    description:
      "We guarantee standard-setting quality backed by our money-back customer guarantee.",
    icon: Award,
    bg: "bg-amber-50 text-amber-600",
  },
  {
    title: "Customer-First Heart",
    description:
      "Our dedicated support team is available 24/7 to solve your household issues immediately.",
    icon: Heart,
    bg: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Continuous Innovation",
    description:
      "Utilizing modern technology to schedule, match, and fulfill bookings seamlessly.",
    icon: Sparkles,
    bg: "bg-indigo-50 text-indigo-600",
  },
];

const TEAM_MEMBERS = [
  {
    name: "Mahbubur Rahman",
    role: "Founder & CEO",
    bio: "Visionary leader passionate about solving daily utility logistics for urban households.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Farhana Yasmin",
    role: "Head of Customer Experience",
    bio: "Dedicated customer advocate ensuring service protocols are followed with precision.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Asif Adnan",
    role: "Director of Vendor Operations",
    bio: "Background screening expert ensuring Rajseba matches only the top 5% of field technicians.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
  },
];

/* ─── Animation variants ─────────────────────────────────────── */
const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.82 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 110, damping: 14 },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const staggerSlow: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 90, damping: 16 },
  },
};

/* ─── Helper: auto-trigger on scroll ────────────────────────── */
function Reveal({
  children,
  variants = stagger,
  className = "",
  once = true,
}: {
  children: React.ReactNode;
  variants?: Variants;
  className?: string;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-70px" });

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Animated counter for stats ────────────────────────────── */
function StatCard({ value, label, delay }: { value: string; label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
      className="space-y-1 text-center"
    >
      <motion.p
        initial={{ opacity: 0, scale: 0.5 }}
        animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={{ type: "spring", stiffness: 130, damping: 12, delay: delay + 0.1 }}
        className="text-2xl md:text-3xl lg:text-4xl font-black text-[#FF7C71] tracking-tight"
      >
        {value}
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: delay + 0.25 }}
        className="text-xs md:text-sm font-semibold text-slate-500 uppercase tracking-wider"
      >
        {label}
      </motion.p>
    </motion.div>
  );
}

/* ─── Component ─────────────────────────────────────────────── */
export default function AboutPage() {
  /* Parallax for hero */
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ══ HERO ════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative bg-white border-b border-slate-100 py-10 md:py-14 lg:py-16 overflow-hidden"
      >
        {/* Parallax glow */}
        <motion.div
          style={{ y: glowY }}
          className="absolute -top-1/4 right-0 w-[500px] h-[500px] bg-[#FF7C71]/6 blur-[120px] rounded-full pointer-events-none"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, 40]) }}
          className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#FF7C71]/3 blur-[100px] rounded-full pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left text */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="lg:col-span-7 space-y-5 text-center lg:text-left"
            >
              <motion.span
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut", delay: 0 }}
                className="inline-block text-xs font-black text-[#FF7C71] uppercase tracking-widest bg-[#FFF8F7] px-3.5 py-1.5 rounded-full border border-rose-100/50"
              >
                Our Story
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut", delay: 0.06 }}
                className="text-xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight"
              >
                Redefining Home Care for{" "}
                <motion.span
                  className="text-[#FF7C71] inline-block"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.5, ease: "easeOut" }}
                >
                  Premium Living
                </motion.span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut", delay: 0.12 }}
                className="text-sm md:text-base text-slate-500 leading-relaxed max-w-2xl mx-auto lg:mx-0"
              >
                Rajseba was born out of a simple need: to bring safety, reliability, and
                top-tier professionalism to the home services industry in Bangladesh. We
                connect premium homes with background-verified expert professionals for
                seamless care.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut", delay: 0.18 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
              >
                <Link href="/services">
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                    <Button className="bg-[#FF7C71] hover:bg-[#E5675D] text-white text-xs font-extrabold px-6 py-3.5 h-auto rounded-xl border-none transition-colors cursor-pointer shadow-md hover:shadow-[0_8px_20px_rgba(255,90,95,0.35)] flex items-center gap-2">
                      Explore Services
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/contact">
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      variant="outline"
                      className="bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-extrabold px-6 py-3.5 h-auto rounded-xl border border-slate-200 transition-colors cursor-pointer"
                    >
                      Contact Us
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right image with parallax scale */}
            <motion.div
              variants={fadeRight}
              initial="hidden"
              animate="visible"
              className="lg:col-span-5 relative h-[260px] md:h-[360px] rounded-3xl overflow-hidden shadow-md border border-slate-100"
            >
              <motion.div style={{ scale: imgScale }} className="absolute inset-0">
                <Image
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop"
                  alt="Beautiful home design banner"
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
              {/* Shine sweep on load */}
              <motion.div
                initial={{ x: "-100%", opacity: 0.6 }}
                animate={{ x: "200%", opacity: 0 }}
                transition={{ duration: 0.9, delay: 0.5, ease: "easeInOut" }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none z-10"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ STATS ════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-slate-100 py-10 md:py-14 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <StatCard key={i} value={stat.value} label={stat.label} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ MISSION & VISION ════════════════════════════════════ */}
      <section className="bg-white py-10 md:py-14 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <Reveal variants={fadeLeft}>
              <motion.div
                whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(255,90,95,0.08)" }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-slate-100 rounded-[32px] p-8 md:p-10 space-y-4 hover:border-[#FF7C71]/20 transition-colors duration-300"
              >
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  className="w-12 h-12 rounded-2xl bg-[#FFF8F7] text-[#FF7C71] flex items-center justify-center"
                >
                  <Target className="w-6 h-6" />
                </motion.div>
                <h2 className="text-lg md:text-xl font-bold text-foreground tracking-wide">
                  Our Mission
                </h2>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                  To build Bangladesh's most reliable and secure ecosystem for on-demand
                  home services, empowering local professionals with job dignity while
                  delivering standard-setting logistics convenience to premium urban
                  households.
                </p>
              </motion.div>
            </Reveal>

            <Reveal variants={fadeRight}>
              <motion.div
                whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(255,90,95,0.08)" }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-slate-100 rounded-[32px] p-8 md:p-10 space-y-4 hover:border-[#FF7C71]/20 transition-colors duration-300"
              >
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  className="w-12 h-12 rounded-2xl bg-[#FFF8F7] text-[#FF7C71] flex items-center justify-center"
                >
                  <Users className="w-6 h-6" />
                </motion.div>
                <h2 className="text-lg md:text-xl font-bold text-foreground tracking-wide">
                  Our Vision
                </h2>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                  To become the ultimate household companion in South Asia, synonymous with
                  absolute quality, trusted integrity, and visual excellence, transforming
                  the way services are booked, verified, and valued in society.
                </p>
              </motion.div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ CORE VALUES ══════════════════════════════════════════ */}
      <section className="bg-white border-y border-slate-100 py-10 md:py-14 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <Reveal variants={stagger} className="text-center max-w-2xl mx-auto mb-10 lg:mb-14">
            <motion.h2
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              viewport={{ once: true, margin: "-70px" }}
              className="text-lg md:text-xl font-bold text-foreground mb-3 tracking-wide"
            >
              Values That Drive Us
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.07 }}
              viewport={{ once: true, margin: "-70px" }}
              className="text-sm text-slate-400 mt-2"
            >
              Our culture is built on values that guarantee the safety and comfort of your household.
            </motion.p>
          </Reveal>

          <Reveal variants={staggerSlow} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {CORE_VALUES.map((val, i) => {
              const Icon = val.icon;
              return (
                <motion.div
                  key={i}
                  variants={cardVariant}
                  whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.05)" }}
                  className="bg-white rounded-3xl p-6 border border-slate-100 transition-colors duration-300 flex flex-col items-center text-center space-y-4 h-full justify-between"
                >
                  <div className="space-y-4 flex flex-col items-center">
                    <motion.span
                      className={`p-3.5 rounded-2xl ${val.bg} flex items-center justify-center`}
                      whileHover={{ rotate: [0, -12, 12, 0], scale: 1.15 }}
                      transition={{ duration: 0.45 }}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.span>
                    <h3 className="font-extrabold text-slate-900 text-sm">{val.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                      {val.description}
                    </p>
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.07 }}
                    className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    Vetted standard
                  </motion.div>
                </motion.div>
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* ══ TEAM ════════════════════════════════════════════════ */}
      <section className="bg-white py-10 md:py-14 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <Reveal variants={stagger} className="text-center max-w-2xl mx-auto mb-10 lg:mb-14">
            <motion.span
              variants={scaleIn}
              className="inline-block text-xs font-black text-[#FF7C71] uppercase tracking-widest bg-[#FFF8F7] px-3.5 py-1.5 rounded-full border border-rose-100/50"
            >
              The Minds
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.07 }}
              viewport={{ once: true, margin: "-70px" }}
              className="text-lg md:text-xl font-bold text-foreground mt-3 mb-3 tracking-wide"
            >
              Meet Our Leadership Team
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.14 }}
              viewport={{ once: true, margin: "-70px" }}
              className="text-sm text-slate-500 mt-2"
            >
              Our leaders bring together technology, hospitality, and rigorous background
              verification standards.
            </motion.p>
          </Reveal>

          <Reveal variants={staggerSlow} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEAM_MEMBERS.map((member, i) => (
              <motion.div
                key={i}
                variants={cardVariant}
                whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.05)" }}
                className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col items-center text-center space-y-4 hover:border-[#FF7C71]/15 transition-colors duration-300 h-full"
              >
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12 }}
                  className="relative"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden relative border-2 border-[#FFF8F7] shadow-sm">
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-[#FF7C71]/30"
                    initial={{ scale: 1, opacity: 0 }}
                    whileHover={{ scale: 1.18, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                >
                  <h3 className="font-extrabold text-slate-900 text-sm">{member.name}</h3>
                  <p className="text-xs font-semibold text-[#FF7C71] uppercase tracking-wider mt-0.5">
                    {member.role}
                  </p>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="text-xs text-slate-500 leading-relaxed max-w-xs"
                >
                  {member.bio}
                </motion.p>
              </motion.div>
            ))}
          </Reveal>
        </div>
      </section>
    </div>
  );
}