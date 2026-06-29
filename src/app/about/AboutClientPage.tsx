"use client";
import { useRef, useState, useEffect } from "react";
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
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  MapPin,
  Check,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAccessToken } from "@/lib/token";



/* ─── Real Operational Pillars ───────────────────────────────── */
const PILLARS = [
  {
    title: "100% Background-Vetted Team",
    description:
      "Every technician undergoes biometric NID check, police verification, and a rigorous skills assessment.",
    icon: ShieldCheck,
    bg: "bg-[#FFF8F4] text-[#FF6014]",
  },
  {
    title: "Transparent Fixed Pricing",
    description:
      "Say goodbye to surprise charges. Get detailed rate cards and fixed billing estimates before booking.",
    icon: Award,
    bg: "bg-amber-50 text-amber-600",
  },
  {
    title: "Premium Damage Guarantee",
    description:
      "All service appointments are backed by Rajseba's damage protection guarantee for absolute peace of mind.",
    icon: Heart,
    bg: "bg-rose-50 text-[#FF6014]",
  },
  {
    title: "24/7 Priority Support",
    description:
      "Our dedicated helpline handles every booking from dispatch to post-service warranty questions.",
    icon: Sparkles,
    bg: "bg-purple-50 text-purple-600",
  },
];

/* ─── Core Services Covered ──────────────────────────────────── */
const SERVICES_COVERED = [
  "Air Conditioner (AC) Servicing & Installation",
  "Professional Home & Office Deep Cleaning",
  "Certified Electrical & Plumbing Maintenance",
  "Kitchen Hood & Home Appliance Repair",
  "Professional Wall Painting & Woodwork",
  "Packers & Movers Logistics Services",
];

/* ─── Real Management Team ───────────────────────────────────── */
const TEAM_MEMBERS = [
  {
    name: "Mahbubur Rahman",
    role: "Founder & CEO",
    bio: "Pioneering digital logistics for urban home maintenance, driven to establish job security and dignity for service professionals.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Farhana Yasmin",
    role: "Head of Customer Experience",
    bio: "Setting strict SLA protocols and service compliance measures to ensure every customer is delighted on every visit.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Asif Adnan",
    role: "Director of Vendor Operations",
    bio: "Leading verification audits and continuous skill training labs to verify only the top 5% of technicians join Rajseba.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
  },
];

/* ─── Animation variants ─────────────────────────────────────── */
const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

/* ─── Scroll-Reveal Helper ──────────────────────────────────── */
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
  const inView = useInView(ref, { once, margin: "-50px" });

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

export default function AboutClientPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  const [statsData, setStatsData] = useState<any>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>(TEAM_MEMBERS);

  useEffect(() => {
    fetch("https://rajseba-api-production.up.railway.app/stats")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setStatsData(json.data);
        }
      })
      .catch((err) => console.error("Error fetching stats:", err));

    // Fetch team members (SuperAdmins) from users API
    const token = getAccessToken();
    const headers: any = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    fetch("https://rajseba-api-production.up.railway.app/users", {
      headers,
    })
      .then((res) => res.json())
      .then((json) => {
        const users = json.data || (Array.isArray(json) ? json : []);
        if (Array.isArray(users) && users.length > 0) {
          const admins = users.filter((u: any) => {
            const roleName = (u.role?.name || u.role || "").toLowerCase();
            return roleName === "superadmin" || roleName === "super admin";
          });
          if (admins.length > 0) {
            const mappedTeam = admins.map((u: any) => ({
              name: u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Super Admin",
              role: u.role?.name || (typeof u.role === "string" ? u.role : "Super Admin"),
              bio: u.profile?.description || u.description || "Leading operations, technology, and service standards to change the home service sector in Bangladesh.",
              avatar: u.profile?.avatar || u.profile?.images?.[0] || u.profile?.picture || u.avatar || u.picture || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
            }));
            setTeamMembers(mappedTeam);
          }
        }
      })
      .catch((err) => console.error("Error fetching users for team:", err));
  }, []);

  const displayStats = [
    {
      value: statsData?.servicesCompleted ? `${statsData.servicesCompleted.toLocaleString()}+` : "120,000+",
      label: "Bookings Done",
      desc: "Across Dhaka City"
    },
    {
      value: statsData?.verifiedExperts ? `${statsData.verifiedExperts.toLocaleString()}+` : "2,500+",
      label: "Verified Experts",
      desc: "Background screened"
    },
    {
      value: statsData?.averageRating ? `${statsData.averageRating.toFixed(1)}/5.0` : "4.0/5.0",
      label: "Average Rating",
      desc: "From real clients"
    },
    {
      value: statsData?.happyCustomers ? `${statsData.happyCustomers.toLocaleString()}+` : "50,000+",
      label: "Happy Customers",
      desc: "Rajseba Guarantee"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/30 overflow-x-hidden text-slate-800">
      {/* ══ HERO SECTION ════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative bg-white border-b border-slate-100/80 py-8 md:py-12 overflow-hidden"
      >
        {/* Parallax glow styling */}
        <motion.div
          style={{ y: glowY }}
          className="absolute -top-1/4 right-0 w-[400px] h-[400px] bg-[#FF6014]/5 blur-[100px] rounded-full pointer-events-none"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, 30]) }}
          className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-[#FF6014]/3 blur-[90px] rounded-full pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Left Column Content */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="lg:col-span-7 space-y-4 text-center lg:text-left"
            >
              <motion.span
                variants={cardVariant}
                className="inline-block text-[10px] font-extrabold text-[#FF6014] uppercase tracking-widest bg-[#FFF8F4] px-3 py-1 rounded-full border border-[#FF6014]/20"
              >
                About Rajseba
              </motion.span>

              <motion.h1
                variants={cardVariant}
                className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight"
              >
                Your Premier Partner for{" "}
                <span className="text-[#FF6014] relative inline-block">
                  Expert Home Care
                  <span className="absolute bottom-1 left-0 w-full h-1 bg-[#FF6014]/15 rounded-full" />
                </span>
              </motion.h1>

              <motion.p
                variants={cardVariant}
                className="text-sm md:text-base text-slate-500 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium"
              >
                Rajseba is Bangladesh's premium digital marketplace built to resolve the common
                hassles of home maintenance. We connect urban households with certified, NID-verified,
                and background-checked service professionals, delivering premium quality service directly to your doorstep.
              </motion.p>

              <motion.div
                variants={cardVariant}
                className="grid sm:grid-cols-2 gap-3 max-w-xl mx-auto lg:mx-0 pt-1"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 justify-center lg:justify-start">
                  <div className="w-5 h-5 rounded-full bg-[#FFF8F4] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-[#FF6014]" />
                  </div>
                  <span>NID & Police-Verified Experts</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 justify-center lg:justify-start">
                  <div className="w-5 h-5 rounded-full bg-[#FFF8F4] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-[#FF6014]" />
                  </div>
                  <span>100% Fixed & Honest Rates</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 justify-center lg:justify-start">
                  <div className="w-5 h-5 rounded-full bg-[#FFF8F4] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-[#FF6014]" />
                  </div>
                  <span>Service Warranty Covered</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 justify-center lg:justify-start">
                  <div className="w-5 h-5 rounded-full bg-[#FFF8F4] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-[#FF6014]" />
                  </div>
                  <span>Dedicated Support Managers</span>
                </div>
              </motion.div>

              <motion.div
                variants={cardVariant}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-3"
              >
                <Link href="/services">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="bg-[#FF6014] hover:bg-[#E0530A] text-white text-xs font-extrabold px-6 py-3.5 h-auto rounded-xl border-none transition-colors cursor-pointer shadow-md hover:shadow-[0_8px_20px_rgba(255,90,95,0.3)] flex items-center gap-2">
                      Book Service Now
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/contact">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-extrabold px-6 py-3.5 h-auto rounded-xl border border-slate-200 transition-colors cursor-pointer"
                    >
                      Talk to an Agent
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Column Image */}
            <motion.div
              variants={fadeRight}
              initial="hidden"
              animate="visible"
              className="lg:col-span-5 relative h-[240px] md:h-[320px] rounded-3xl overflow-hidden shadow-lg border border-slate-100"
            >
              <motion.div style={{ scale: imgScale }} className="absolute inset-0">
                <Image
                  src="/rajseba_about_banner.png"
                  alt="Premium Home Service Representation"
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ STATS SECTION ════════════════════════════════════════ */}
      <section className="bg-white border-b border-slate-100 py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {displayStats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-slate-50/50 rounded-2xl p-4 text-center border border-slate-100"
              >
                <p className="text-xl md:text-2xl font-black text-[#FF6014] tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mt-1">
                  {stat.label}
                </p>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  {stat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CORE VALUE PILLARS ═══════════════════════════════════ */}
      <section className="py-8 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <Reveal variants={stagger} className="text-center max-w-2xl mx-auto mb-8">
            <span className="inline-block text-[10px] font-extrabold text-[#FF6014] uppercase tracking-widest bg-[#FFF8F4] px-3 py-1 rounded-full border border-[#FF6014]/20">
              Our Pillars
            </span>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
              Safety, Integrity & Trust
            </h2>
            <p className="text-xs md:text-sm text-slate-500 font-semibold mt-2 leading-relaxed">
              We design every part of Rajseba to guarantee standard-setting home care convenience.
            </p>
          </Reveal>

          <Reveal variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PILLARS.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={i}
                  variants={cardVariant}
                  whileHover={{ y: -5, boxShadow: "0 12px 30px rgba(0,0,0,0.03)" }}
                  className="bg-white rounded-2xl p-5 border border-slate-100 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <span className={`inline-flex p-3 rounded-xl ${pillar.bg} shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#FF6014] uppercase tracking-wider pt-4 border-t border-slate-50/50 mt-4">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6014]" />
                    Vetted Standard
                  </div>
                </motion.div>
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* ══ REAL CONTENT: SERVICES COVERED ══════════════════════ */}
      <section className="py-8 md:py-12 bg-slate-50/50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <Reveal variants={fadeLeft} className="space-y-4">
              <span className="inline-block text-[10px] font-extrabold text-[#FF6014] uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full border border-rose-100/50">
                Services Range
              </span>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                One Platform for All Your Household Needs
              </h2>
              <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed">
                From fixing quick electric errors to managing large relocation logistics, our team is equipped with tested tools and expert knowledge.
              </p>

              <ul className="grid sm:grid-cols-2 gap-2 pt-2">
                {SERVICES_COVERED.slice(0, 4).map((srv, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF6014] shrink-0" />
                    <span>{srv}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2">
                <Link href="/services">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black text-[#FF6014] hover:underline cursor-pointer">
                    View Complete Rate Card & Services <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </div>
            </Reveal>

            <Reveal variants={fadeRight} className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between gap-3">
                <div className="space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-[#FFF8F4] text-[#FF6014] flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-black text-slate-900">Serving Dhaka City</h4>
                  <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                    Available in Gulshan, Banani, Uttara, Dhanmondi, Mirpur, and more areas.
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between gap-3">
                <div className="space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-black text-slate-900">Safety First Code</h4>
                  <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                    Dedicated managers monitor critical safety codes and post-service sanitation checkups.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ MISSION & VISION SECTION ═════════════════════════════ */}
      <section className="py-8 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            <Reveal variants={fadeLeft}>
              <div className="bg-slate-50/45 border border-slate-100 rounded-3xl p-6 md:p-8 space-y-3 hover:border-[#FF6014]/10 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#FFF8F4] text-[#FF6014] flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-wide">
                  Our Mission
                </h3>
                <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed">
                  To empower service workers with job security and true professional dignity while delivering absolute convenience, security, and premium quality home maintenance to urban families in Bangladesh.
                </p>
              </div>
            </Reveal>

            <Reveal variants={fadeRight}>
              <div className="bg-slate-50/45 border border-slate-100 rounded-3xl p-6 md:p-8 space-y-3 hover:border-[#FF6014]/10 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#FF6014] flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-wide">
                  Our Vision
                </h3>
                <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed">
                  To scale as Bangladesh's most trusted household platform, establishing standard-setting training labs, strict verification procedures, and automated on-demand service fulfillment systems.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ LEADERSHIP TEAM SECTION ══════════════════════════════ */}
      <section className="py-8 md:py-12 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <Reveal variants={stagger} className="text-center max-w-2xl mx-auto mb-8">
            <span className="inline-block text-[10px] font-extrabold text-[#FF6014] uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full border border-rose-100/50">
              Leadership
            </span>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 mt-2 tracking-tight">
              Meet Our Founders & Leaders
            </h2>
            <p className="text-xs md:text-sm text-slate-500 font-semibold mt-2">
              Driven by technology and high operational standards to change the home service sector.
            </p>
          </Reveal>

          <Reveal variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, i) => (
              <motion.div
                key={i}
                variants={cardVariant}
                whileHover={{ y: -5 }}
                className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col items-center text-center space-y-3 hover:border-slate-200 transition-all h-full"
              >
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-slate-50 shadow-sm shrink-0">
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div>
                  <h3 className="font-black text-slate-900 text-sm">{member.name}</h3>
                  <p className="text-[10px] font-bold text-[#FF6014] uppercase tracking-wider mt-0.5">
                    {member.role}
                  </p>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </Reveal>
        </div>
      </section>
    </div>
  );
}
