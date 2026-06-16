"use client";
import { Button } from "@/components/ui/button";
import { CustomCalendar } from "@/components/ui/calendar";
import { CustomSelect } from "@/components/ui/select";
import dayjs from "dayjs";
import { Calendar, MapPin, Search } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TbAirConditioning, TbTruck, TbScissors } from "react-icons/tb";
import {
  FaFaucet,
  FaBolt,
  FaTv,
  FaPaintRoller,
  FaLeaf,
  FaBug,
  FaHammer,
} from "react-icons/fa";
import { MdOutlineCleaningServices, MdOutlineSecurity } from "react-icons/md";
import { useRouter } from "next/navigation";

const ServiceHero = () => {
  const categories = [
    {
      id: "ac-repair",
      label: "AC Repair",
      slug: "ac-repair",
      icon: TbAirConditioning,
    },
    { id: "plumbing", label: "Plumbing", slug: "plumbing", icon: FaFaucet },
    {
      id: "cleaning",
      label: "Cleaning",
      slug: "cleaning",
      icon: MdOutlineCleaningServices,
    },
    { id: "electrical", label: "Electrical", slug: "electrical", icon: FaBolt },
    { id: "shifting", label: "Shifting", slug: "shifting", icon: TbTruck },
    { id: "cctv", label: "CCTV", slug: "cctv", icon: MdOutlineSecurity },
    {
      id: "appliance-repair",
      label: "Appliance Repair",
      slug: "appliance-repair",
      icon: FaTv,
    },
    {
      id: "painting",
      label: "Painting",
      slug: "painting",
      icon: FaPaintRoller,
    },
    { id: "gardening", label: "Gardening", slug: "gardening", icon: FaLeaf },
    {
      id: "pest-control",
      label: "Pest Control",
      slug: "pest-control",
      icon: FaBug,
    },
    {
      id: "home-salon",
      label: "Home Salon",
      slug: "home-salon",
      icon: TbScissors,
    },
    { id: "carpentry", label: "Carpentry", slug: "carpentry", icon: FaHammer },
  ];

  const [selectedCategory, setSelectedCategory] = useState("");
  const [location, setLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const router = useRouter();
  

  const categoryOptions = categories.map((cat) => ({
    value: cat.slug,
    label: cat.label,
  }));

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 18,
      },
    },
  } as const;

  const { scrollY } = useScroll();
  // Visual scroll-driven handoff to the header search bar
  const searchOpacity = useTransform(scrollY, [0, 200], [1, 0]);
  const searchScale = useTransform(scrollY, [0, 200], [1, 0.85]);
  const searchY = useTransform(scrollY, [0, 200], [0, -60]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategory) {
      let url = `/categories/${selectedCategory}`;
      const params = [];
      if (location) params.push(`location=${encodeURIComponent(location)}`);
      if (selectedDate)
        params.push(`date=${selectedDate.format("YYYY-MM-DD")}`);
      if (params.length > 0) {
        url += `?${params.join("&")}`;
      }
      router.push(url);
    } else {
      router.push("/categories/ac-repair");
    }
  };

  return (
    <section className="bg-gradient-to-br from-[#fff0ef] via-white to-[#fff7f7] py-10 md:py-16 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Badge */}
        <div className="flex justify-center mb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#ffe1e2] shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff5a5f]" />
            <span className="text-xs font-semibold text-[#ff5a5f]">
              Trusted Home Services in Bangladesh
            </span>
          </div>
        </div>

        <div className="text-center max-w-lg mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1a1a1a] leading-tight mb-3 max-w-3xl mx-auto lg:mx-0">
            Find the Best Home <span className="text-primary"> Services </span>{" "}
            for Your Lifestyle
          </h1>
          <p className="text-sm md:text-base text-[#6b7280] max-w-xl mx-auto lg:mx-0 mb-4">
            Premium, reliable, and effortless home service solutions across
            Bangladesh.
          </p>
        </div>

        {/* Animated Floating Search Bar Card with Handoff Scroll Control */}
        <motion.form
          variants={itemVariants}
          style={{
            opacity: searchOpacity,
            scale: searchScale,
            y: searchY,
          }}
          onSubmit={handleSearch}
          className="w-full max-w-3xl mx-auto bg-white rounded-2xl md:rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 p-3 flex flex-col md:flex-row items-center gap-3 md:gap-0"
        >
          {/* Category Dropdown Select */}
          <div className="flex items-center gap-3 flex-1 w-full px-4 py-2 md:py-1 relative">
            <Search className="text-slate-400 w-5 h-5 flex-shrink-0" />
            <CustomSelect
              options={categoryOptions}
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="Select Category"
              className="w-full"
              triggerClassName="border-none bg-transparent hover:bg-transparent shadow-none px-0 py-1.5 h-auto text-slate-700 font-medium focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none"
            />
          </div>

          {/* Vertical Separator */}
          <div className="hidden md:block h-8 w-px bg-slate-200" />

          {/* Location Text Input */}
          <div className="flex items-center gap-3 flex-1 w-full px-4 py-2 md:py-1">
            <MapPin className="text-slate-400 w-5 h-5 flex-shrink-0" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location"
              className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full py-1.5"
            />
          </div>

          {/* Vertical Separator */}
          <div className="hidden md:block h-8 w-px bg-slate-200" />

          {/* Date Picker Popover Trigger */}
          <div className="flex items-center gap-3 flex-1 w-full px-4 py-2 md:py-1 relative">
            <div
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex items-center gap-3 w-full py-1.5 cursor-pointer"
            >
              <Calendar className="text-slate-400 w-5 h-5 flex-shrink-0" />
              <span className="text-sm text-slate-700 select-none">
                {selectedDate
                  ? selectedDate.format("DD MMM, YYYY")
                  : "Select Date"}
              </span>
            </div>

            {showCalendar && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowCalendar(false)}
                />
                <div className="absolute top-full left-0 md:left-auto md:right-0 mt-3 z-50 bg-white border border-slate-100 rounded-2xl shadow-xl p-2 max-w-[340px]">
                  <CustomCalendar
                    staticInline={true}
                    value={selectedDate}
                    onChange={(date) => {
                      setSelectedDate(date);
                      setShowCalendar(false);
                    }}
                  />
                </div>
              </>
            )}
          </div>
          {/* Book Now Action Button */}
          <Button
            type="submit"
            className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white font-bold px-8 py-3.5 h-auto rounded-xl md:rounded-full transition-all duration-200 shadow-sm active:scale-95 text-base flex-shrink-0 cursor-pointer"
          >
            Book Now
          </Button>
        </motion.form>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center items-center gap-4 my-8">
          {[
            ["⭐", "4.9 Customer Rating"],
            ["👨‍🔧", "500+ Professionals"],
            ["🛡️", "Verified & Trusted"],
          ].map(([icon, label]) => (
            <div key={label as string} className="flex items-center gap-1.5">
              <span>{icon}</span>
              <span className="text-xs font-medium text-[#6b7280]">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Quick-nav category pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat, i) => (
            <Link
              key={i}
              href={`categories/service/${cat.id}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full border font-semibold text-xs transition-all duration-200 hover:-translate-y-0.5 no-underline border-[#e5e7eb] text-[#4b5563] bg-white hover:border-[#ff5a5f] hover:text-[#ff5a5f] hover:shadow-sm"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceHero;
