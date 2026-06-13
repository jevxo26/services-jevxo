"use client"

import * as React from "react"
import { useAppSelector } from "@/redux/hooks";
import { getRoleName } from "@/redux/features/auth/authSlice";
import {
  ShieldAlert,
  Calendar,
  CreditCard,
  User,
  Shield,
  ArrowRight,
  MessageSquare,
  Mail,
  Phone
} from "lucide-react"
import Link from "next/link"

export default function HelpCenterPage() {
  const role = useAppSelector((state) => state.auth.role) || "superadmin";

  const categories = [
    {
      title: "Booking & Scheduling",
      icon: Calendar,
      desc: "Learn how to book a service, reschedule an appointment, or handle cancellations.",
      links: [
        "How do I change my booking time?",
        "Can I book multiple services?"
      ]
    },
    {
      title: "Payments & Refund",
      icon: CreditCard,
      desc: "Understand pricing, payment methods, and our guaranteed refund policy.",
      links: [
        "When will I get my refund?",
        "Which payment methods are accepted?"
      ]
    },
    {
      title: "Account & Privacy",
      icon: User,
      desc: "Manage your profile, data preferences, and security settings easily.",
      links: [
        "Changing your account email",
        "How we protect your data"
      ]
    },
    {
      title: "Safety & Trust",
      icon: Shield,
      desc: "Our commitment to professional vetting and on-site service safety.",
      links: [
        "Verified service provider badge",
        "Report a safety concern"
      ]
    }
  ]

  const sideArticles = [
    {
      tag: "Refund Policy",
      title: "Getting your 100% money back",
      time: "5 min read • Updated yesterday"
    },
    {
      tag: "Insurance",
      title: "Service Warranty & Coverage",
      time: "8 min read • Updated 3 days ago"
    },
    {
      tag: "Partnership",
      title: "Becoming a Rajseba Pro",
      time: "12 min read • Updated 1 week ago"
    }
  ]

  if (role !== "client") {
    return <AccessDenied roleRequired="Customer" />
  }

  return (
    <div className="relative min-h-screen p-1 sm:p-6 overflow-hidden animate-in fade-in duration-200">
      <div className="w-full space-y-10 relative z-10">

        {/* Title Header */}
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Help Center</h1>
          <p className="text-slate-500 mt-2 font-semibold text-sm max-w-3xl leading-relaxed">
            Find answers to frequently asked questions, read detailed tutorials, or connect with our customer care associates directly.
          </p>
        </div>

        {/* Explore Categories Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Explore Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((cat, idx) => {
              const Icon = cat.icon
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-6"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-rose-50/60 rounded-2xl flex items-center justify-center text-[#FF464C] border border-rose-100/30">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-800 text-base">{cat.title}</h3>
                      <p className="text-xs text-slate-400 font-semibold leading-relaxed mt-1">{cat.desc}</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-50">
                    {cat.links.map((link, lidx) => (
                      <Link
                        key={lidx}
                        href="#"
                        className="flex items-center text-xs font-bold text-[#FF5B60] hover:text-[#FF464C] transition-colors"
                      >
                        <span className="mr-1.5 text-sm font-bold">→</span>
                        {link}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Popular Articles Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Popular Articles</h2>
              <p className="text-xs text-slate-400 mt-0.5 font-semibold">Most read guides by the Rajseba community</p>
            </div>
            <Link href="#" className="text-xs font-bold text-rose-500 hover:underline">
              View all articles
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Featured Guide Card */}
            <div className="lg:col-span-7 bg-slate-900 rounded-[32px] overflow-hidden p-6 sm:p-8 flex flex-col justify-between aspect-[16/10] relative group shadow-sm">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-102 transition-transform duration-500"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop&q=80')"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/10 z-0" />

              <div className="relative z-10 w-fit">
                <span className="bg-[#FF464C] text-white text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Featured Guide
                </span>
              </div>

              <div className="relative z-10 space-y-2">
                <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                  New User's Guide to Seamless Home Services
                </h3>
                <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-2xl">
                  Everything you need to know about your first booking, from selecting the right pro to final inspection.
                </p>
              </div>
            </div>

            {/* Right Articles List */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {sideArticles.map((art, idx) => (
                <div
                  key={idx}
                  className="bg-white/95 p-5 rounded-[28px] border border-slate-100 shadow-sm flex flex-col justify-between gap-2 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <span className="text-[9px] font-bold text-[#FF464C] uppercase tracking-wider">
                    {art.tag}
                  </span>
                  <h4 className="font-extrabold text-slate-800 text-sm hover:text-[#FF464C] transition-colors">
                    {art.title}
                  </h4>
                  <span className="text-[10px] text-slate-450 font-semibold block mt-1">
                    {art.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Still Need Help Banner Section */}
        <div className="bg-rose-50/45 rounded-[40px] border border-rose-100/30 p-8 sm:p-10 text-center space-y-8 mt-6">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Still need help?</h2>
            <p className="text-xs text-slate-500 font-semibold max-w-lg mx-auto leading-relaxed">
              Our dedicated support team is ready to assist you. Choose your preferred way to connect with us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 divide-y md:divide-y-0 md:divide-x divide-rose-100/50">
            {/* Live Chat */}
            <div className="space-y-4 pt-4 md:pt-0">
              <div className="w-14 h-14 bg-white border border-rose-100/70 rounded-full flex items-center justify-center text-[#FF5B60] mx-auto shadow-sm">
                <MessageSquare size={22} />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm">Live Chat</h4>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">Typical response time: 2 mins</p>
              </div>
              <button className="bg-[#FF5B60] hover:bg-[#FF464C] text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-sm shadow-rose-500/10 active:scale-[0.98] transition-all w-fit mx-auto focus:outline-none">
                Start Chatting
              </button>
            </div>

            {/* Email Support */}
            <div className="space-y-4 pt-6 md:pt-0 md:pl-6">
              <div className="w-14 h-14 bg-white border border-rose-100/70 rounded-full flex items-center justify-center text-[#FF5B60] mx-auto shadow-sm">
                <Mail size={22} />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm">Email Support</h4>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">Typical response time: 2 hours</p>
              </div>
              <button className="border border-[#FF5B60] hover:bg-rose-50/40 text-[#FF5B60] text-xs font-bold px-6 py-2.5 rounded-full active:scale-[0.98] transition-all w-fit mx-auto focus:outline-none">
                Send Email
              </button>
            </div>

            {/* hotline */}
            <div className="space-y-4 pt-6 md:pt-0 md:pl-6">
              <div className="w-14 h-14 bg-white border border-rose-100/70 rounded-full flex items-center justify-center text-[#FF5B60] mx-auto shadow-sm">
                <Phone size={22} />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm">24/7 Hotline</h4>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">Immediate support for emergencies</p>
              </div>
              <button className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-6 py-2.5 rounded-full active:scale-[0.98] transition-all w-fit mx-auto focus:outline-none">
                +880 1678 900000
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

function AccessDenied({ roleRequired }: { roleRequired: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center animate-in fade-in duration-200">
      <div className="p-4 bg-rose-50 rounded-2xl text-rose-500 mb-4">
        <ShieldAlert size={48} />
      </div>
      <h3 className="text-xl font-bold text-slate-800">Access Denied</h3>
      <p className="text-sm text-slate-500 mt-2 max-w-sm">
        This subpage is only accessible to users with the <strong className="text-slate-800">{roleRequired}</strong> role. 
        Please toggle your preview role using the selector at the top.
      </p>
    </div>
  )
}
