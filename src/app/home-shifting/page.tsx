"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Home, Building2, MapPin, Phone, Mail, User, Upload,
  X, CheckCircle, ArrowRight, Truck, Package, Shield,
  Star, Clock, Users, ChevronRight,
} from "lucide-react";
import { Navbar } from "@/components/home/Navbar";
import { useAppSelector } from "@/redux/hooks";
import { useCreateCustomShiftingMutation } from "@/redux/features/admin/customShiftingApi";

async function uploadToImgBB(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("image", file);
  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY || "demo"}`,
    { method: "POST", body: fd }
  );
  const j = await res.json();
  if (j.success) return j.data.url;
  throw new Error("Upload failed");
}

function RouteMap({ type }: { type: string }) {
  const [dash, setDash] = useState(0);
  const total = 300;
  useEffect(() => {
    setDash(0);
    const start = Date.now();
    const id = setInterval(() => {
      const p = Math.min((Date.now() - start) / 1800, 1);
      setDash(Math.round((1 - Math.pow(1 - p, 3)) * total));
      if (p >= 1) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [type]);
  const t = Math.min(dash / total, 1);
  const tx = 50 + (330 - 50) * t;
  const ty = 220 - (220 - 60) * t;
  return (
    <div className="relative w-full h-52 sm:h-64">
      <div className="absolute inset-0 rounded-2xl" style={{ backgroundImage: "linear-gradient(rgba(255,96,20,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,96,20,0.08) 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
      <svg viewBox="0 0 380 260" className="w-full h-full">
        <defs>
          <linearGradient id="rg" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF6014" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        <path d="M 50,220 C 50,160 130,150 190,130 C 250,110 310,100 330,60" fill="none" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
        <path d="M 50,220 C 50,160 130,150 190,130 C 250,110 310,100 330,60" fill="none" stroke="url(#rg)" strokeWidth="3" strokeDasharray={total} strokeDashoffset={total - dash} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 4px rgba(255,96,20,0.35))" }} />
        <g transform="translate(50,220)">
          <circle r="14" fill="#FF6014" opacity="0.12" />
          <circle r="9" fill="#FF6014" />
          <circle r="3.5" fill="white" />
          <text x="17" y="4" fontSize="9" fill="#FF6014" fontWeight="800">Pickup</text>
        </g>
        <g transform="translate(330,60)">
          <circle r="14" fill="#10b981" opacity="0.12" />
          <circle r="9" fill="#10b981" />
          <circle r="3.5" fill="white" />
          <text x="-72" y="-12" fontSize="9" fill="#10b981" fontWeight="800">Drop-off</text>
        </g>
        {[0.33, 0.66].map((p, i) => (
          <circle key={i} cx={50 + 280 * p} cy={220 - 160 * p} r="4" fill={dash / total >= p ? "#FF6014" : "#e2e8f0"} stroke="white" strokeWidth="1.5" />
        ))}
        {dash > 15 && (
          <g transform={`translate(${tx},${ty})`}>
            <circle r="14" fill="#FF6014" opacity="0.15" />
            <text textAnchor="middle" dominantBaseline="central" fontSize="13">🚚</text>
          </g>
        )}
      </svg>
      <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 rounded-xl px-2.5 py-1 border border-slate-100 shadow-sm">
        {type === "office" ? <Building2 size={11} className="text-blue-500" /> : <Home size={11} className="text-[#FF6014]" />}
        <span className="text-[11px] font-bold text-slate-700">{type === "office" ? "Office" : "Home"} Shifting</span>
      </div>
    </div>
  );
}

const WHY = [
  { icon: Shield, title: "Fully Insured", desc: "All goods covered end-to-end" },
  { icon: Truck, title: "On-Time", desc: "Delivery guaranteed on schedule" },
  { icon: Star, title: "5★ Rated", desc: "10,000+ satisfied clients" },
  { icon: Users, title: "Expert Team", desc: "Verified, trained professionals" },
  { icon: Clock, title: "24/7 Support", desc: "Always here when you need us" },
  { icon: CheckCircle, title: "Safe Packing", desc: "Premium materials & care" },
];

const STEPS = [
  "Submit your shifting request with details",
  "Our team reviews and assigns a verified vendor",
  "Vendor contacts you to confirm schedule",
  "Professional shifting carried out safely",
];

export default function HomeShiftingPage() {
  const user = useAppSelector((s) => s.auth.user);
  const isAuth = useAppSelector((s) => s.auth.isAuthenticated);
  const [create, { isLoading }] = useCreateCustomShiftingMutation();

  const [form, setForm] = useState({ name: "", email: "", phone: "", shiftingType: "home", sourceAddress: "", destinationAddress: "" });
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAuth && user) {
      setForm((p) => ({ ...p, name: (user as any).name || p.name, email: (user as any).email || p.email, phone: (user as any).phone || (user as any).phoneNumber || p.phone }));
    }
  }, [isAuth, user]);

  const inp = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const addFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const merged = [...files, ...Array.from(e.target.files || [])].slice(0, 6);
    setFiles(merged);
    setPreviews(merged.map((f) => URL.createObjectURL(f)));
  };

  const rmFile = (i: number) => {
    const nf = files.filter((_, j) => j !== i);
    setFiles(nf);
    setPreviews(nf.map((f) => URL.createObjectURL(f)));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    try {
      const urls = files.length
        ? (await Promise.allSettled(files.map(uploadToImgBB)))
            .filter((r): r is PromiseFulfilledResult<string> => r.status === "fulfilled")
            .map((r) => r.value)
        : [];
      await create({ ...form, images: urls, userId: isAuth && user ? Number((user as any).id) : undefined }).unwrap();
      setDone(true);
    } catch { setErr("Something went wrong. Please try again."); }
  };

  if (done) return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#FFF8F4] flex items-center justify-center px-4 relative">
        <div className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-[0.07] pointer-events-none" style={{ backgroundSize: "auto" }} />
        <div className="relative z-10 max-w-sm w-full text-center space-y-5 bg-white/80 backdrop-blur-xl rounded-3xl border border-[#FF6014]/10 p-8 shadow-xl">
          <div className="w-16 h-16 bg-green-50 border-2 border-green-200 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h2 className="text-xl font-black text-slate-800">Booking Submitted! 🎉</h2>
          <p className="text-sm text-slate-500 leading-relaxed">Your request is received. Our team will contact you shortly to assign a verified vendor.</p>
          <Link href="/" className="block bg-[#FF6014] text-white font-bold py-3 rounded-2xl text-sm shadow-lg hover:bg-[#E0530A] transition-all">Back to Home</Link>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#FFF8F4] relative">
        <div className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-[0.07] pointer-events-none z-0" style={{ backgroundSize: "auto" }} />
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF8F4]/80 via-white/40 to-orange-50/60 pointer-events-none z-0" />

        {/* ── Hero Banner ── */}
        <section className="relative z-10 w-full overflow-hidden bg-gradient-to-br from-[#FF6014] via-[#FF7A37] to-[#FF8C52]">
          <div className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10" style={{ backgroundSize: "auto" }} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1 text-center lg:text-left">
                <span className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4">
                  <Truck size={12} /> Premium Shifting Service
                </span>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                  Move Smarter with<br />
                  <span className="text-yellow-300">Rajseba Shifting</span>
                </h1>
                <p className="text-sm text-white/80 mt-3 max-w-md mx-auto lg:mx-0 leading-relaxed font-semibold">
                  Professional home &amp; office relocation across Dhaka. Fully insured, on-time, and hassle-free shifting by verified experts.
                </p>
                <div className="flex flex-wrap gap-3 mt-6 justify-center lg:justify-start">
                  {["Fully Insured", "On-Time Delivery", "Verified Vendors"].map((t) => (
                    <span key={t} className="inline-flex items-center gap-1.5 bg-white/15 border border-white/25 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      <CheckCircle size={11} /> {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 w-full max-w-xs lg:max-w-sm">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                  <Image src="/rajseba_about_banner.png" alt="Home Shifting Service" fill className="object-cover" priority />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex gap-3">
                    {[{ n: "10K+", l: "Moves Done" }, { n: "4.9★", l: "Avg Rating" }, { n: "24/7", l: "Support" }].map((s) => (
                      <div key={s.l} className="flex-1 bg-white/90 backdrop-blur-sm rounded-xl p-2 text-center">
                        <p className="text-sm font-black text-[#FF6014]">{s.n}</p>
                        <p className="text-[9px] font-bold text-slate-600">{s.l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Main Content ── */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid lg:grid-cols-[1fr_420px] gap-6 items-start">

            {/* ── Booking Form ── */}
            <div className="bg-white/85 backdrop-blur-xl border border-[#FF6014]/10 rounded-3xl shadow-[0_4px_32px_rgba(255,96,20,0.06)] overflow-hidden order-2 lg:order-1">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-[#FF6014] to-[#FF7A37] px-6 py-4 flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Package size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="text-base font-black text-white">Book Your Shift</h2>
                  <p className="text-xs text-white/75 font-semibold mt-0.5">Fill in details below to get started</p>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <form onSubmit={submit} className="space-y-4">
                  {/* Shifting Type */}
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block">Shifting Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[{ v: "home", l: "Home Shifting", I: Home }, { v: "office", l: "Office Shifting", I: Building2 }].map(({ v, l, I }) => (
                        <button key={v} type="button" onClick={() => setForm((p) => ({ ...p, shiftingType: v }))}
                          className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold border-2 transition-all ${form.shiftingType === v ? "bg-[#FF6014] border-[#FF6014] text-white shadow-lg shadow-[#FF6014]/20" : "bg-slate-50 border-slate-200 text-slate-600 hover:border-[#FF6014]/40"}`}>
                          <I size={14} />{l}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name + Phone */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[{ n: "name", l: "Full Name *", pl: "Your full name", I: User, t: "text" }, { n: "phone", l: "Phone *", pl: "+880 1XXXXXXXXX", I: Phone, t: "tel" }].map(({ n, l, pl, I, t }) => (
                      <div key={n}>
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5 block">{l}</label>
                        <div className="relative">
                          <I size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type={t} name={n} required value={(form as any)[n]} onChange={inp} placeholder={pl}
                            className="w-full pl-9 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6014] focus:ring-4 focus:ring-[#FF6014]/10 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5 block">Email <span className="text-slate-300 normal-case font-semibold">(Optional)</span></label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="email" name="email" value={form.email} onChange={inp} placeholder="you@email.com"
                        className="w-full pl-9 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6014] focus:ring-4 focus:ring-[#FF6014]/10 transition-all" />
                    </div>
                  </div>

                  {/* Addresses */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[{ n: "sourceAddress", l: "Pickup Address *", pl: "Full pickup address...", color: "text-[#FF6014]" }, { n: "destinationAddress", l: "Destination *", pl: "Full destination address...", color: "text-green-500" }].map(({ n, l, pl, color }) => (
                      <div key={n}>
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5 block">
                          <span className={color}>●</span> {l}
                        </label>
                        <div className="relative">
                          <MapPin size={14} className={`absolute left-3.5 top-3.5 ${color}`} />
                          <textarea name={n} required value={(form as any)[n]} onChange={inp} rows={3} placeholder={pl}
                            className="w-full pl-9 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6014] focus:ring-4 focus:ring-[#FF6014]/10 transition-all resize-none" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Image upload */}
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5 block">Inventory Photos <span className="text-slate-300 normal-case font-semibold">(Optional · max 6)</span></label>
                    <div onClick={() => fileRef.current?.click()}
                      className="border-2 border-dashed border-slate-200 hover:border-[#FF6014]/50 rounded-2xl p-4 text-center cursor-pointer transition-all hover:bg-[#FFF8F4]/50 group">
                      <Upload size={18} className="text-slate-400 group-hover:text-[#FF6014] mx-auto mb-1 transition-colors" />
                      <p className="text-xs font-bold text-slate-500">Click to upload photos</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">JPG, PNG — up to 5MB each</p>
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={addFiles} />
                    {previews.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {previews.map((src, i) => (
                          <div key={i} className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                            <img src={src} alt="" className="w-full h-full object-cover" />
                            <button type="button" onClick={() => rmFile(i)} className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center">
                              <X size={9} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {isAuth && (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-2xl px-4 py-2.5">
                      <CheckCircle size={13} className="text-green-500 flex-shrink-0" />
                      <p className="text-xs font-bold text-green-700">Details auto-filled from your profile</p>
                    </div>
                  )}

                  {err && <p className="text-red-500 text-xs font-bold bg-red-50 border border-red-100 rounded-2xl px-4 py-3">⚠️ {err}</p>}

                  <button type="submit" disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#FF6014] to-[#FF7C71] text-white font-black py-4 rounded-2xl shadow-lg shadow-[#FF6014]/25 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed">
                    {isLoading ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Submitting...</> : <>Book My Shift <ArrowRight size={16} /></>}
                  </button>

                  {!isAuth && (
                    <p className="text-center text-xs text-slate-400 font-semibold">
                      <Link href="/login" className="text-[#FF6014] font-black hover:underline">Login</Link> to auto-fill your details
                    </p>
                  )}
                </form>
              </div>
            </div>

            {/* ── Right Sidebar ── */}
            <div className="space-y-5 order-1 lg:order-2">
              {/* Route Map */}
              <div className="bg-white/85 backdrop-blur-xl border border-[#FF6014]/10 rounded-3xl shadow-[0_4px_32px_rgba(255,96,20,0.06)] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={14} className="text-[#FF6014]" />
                  <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Live Route Preview</span>
                </div>
                <RouteMap type={form.shiftingType} />
              </div>

              {/* Service Image */}
              <div className="relative rounded-3xl overflow-hidden aspect-[16/9] shadow-lg border border-[#FF6014]/10">
                <Image src="/cleaner-hero.png" alt="Professional Shifting Team" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-black text-base leading-tight">Professional & Safe Shifting</p>
                  <p className="text-white/75 text-xs font-semibold mt-1">Trained teams, premium packing materials</p>
                </div>
              </div>

              {/* How it works */}
              <div className="bg-white/85 backdrop-blur-xl border border-slate-100 rounded-3xl p-5 shadow-sm">
                <h3 className="text-sm font-black text-slate-800 mb-3">How It Works</h3>
                <div className="space-y-3">
                  {STEPS.map((s, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#FF6014] text-white text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md shadow-[#FF6014]/20">{i + 1}</div>
                      <span className="text-xs text-slate-600 font-semibold leading-relaxed">{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA for non-auth */}
              {!isAuth && (
                <div className="bg-gradient-to-br from-[#FF6014] to-[#FF7A37] rounded-3xl p-5 text-center shadow-lg">
                  <p className="text-sm font-black text-white mb-1">Already a member?</p>
                  <p className="text-xs text-white/75 font-semibold mb-4">Login to auto-fill your info and track bookings</p>
                  <Link href="/login" className="inline-flex items-center gap-2 bg-white text-[#FF6014] font-black text-xs px-5 py-2.5 rounded-xl hover:bg-orange-50 transition-colors shadow-sm">
                    Login Now <ChevronRight size={13} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Why Choose Us ── */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-800">Why Choose Rajseba Shifting?</h2>
            <p className="text-sm text-slate-500 font-semibold mt-2">Everything you need for a stress-free move</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {WHY.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white/85 backdrop-blur-md border border-slate-100 rounded-2xl p-4 flex flex-col items-center text-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="w-10 h-10 bg-[#FFF8F4] border border-[#FF6014]/15 rounded-xl flex items-center justify-center">
                  <Icon size={17} className="text-[#FF6014]" />
                </div>
                <p className="text-xs font-black text-slate-800 leading-tight">{title}</p>
                <p className="text-[11px] text-slate-400 font-semibold leading-tight">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer spacer for mobile bottom nav ── */}
        <div className="h-20 md:h-0" />
      </div>
    </>
  );
}
