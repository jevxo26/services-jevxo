"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import {
  Mail, User, Check, ShieldCheck, Loader2, ArrowRight, Sparkles, ChevronLeft, UserPlus,
} from "lucide-react"
import Link from "next/link"
import { useSignupState } from "@/app/signup/hooks/useSignupState"

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((m) => m.Player),
  { ssr: false }
)

export default function RegisterPage() {
  const {
    formData, handleChange, agreeTerms, setAgreeTerms,
    isOtpSent, setIsOtpSent, otp, timeLeft,
    otpInputsRef, isLoading, isVerifying,
    handleSubmit, handleOtpChange, handleOtpKeyDown, handleVerifyOtp, handleResendOtp,
  } = useSignupState()

  return (
    <div className="min-h-screen w-full flex bg-white font-sans">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[50%] flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50">
        <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-[#1E4E8C]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-60px] right-[-60px] w-64 h-64 bg-orange-300/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center text-center px-10">
          <div className="inline-flex items-center gap-2 bg-[#1E4E8C]/10 border border-[#1E4E8C]/20 text-[#1E4E8C] px-4 py-1.5 rounded-full text-xs font-bold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E4E8C] animate-pulse" />
            Bangladesh's #1 Home Service Platform
          </div>
          <div className="w-full max-w-[420px] xl:max-w-[480px]">
            <Player autoplay loop src="/signup.json" style={{ width: "100%", height: "auto" }} />
          </div>
          <h2 className="text-2xl xl:text-3xl font-black text-slate-800 leading-tight mt-4">
            Start your journey with <span className="text-[#1E4E8C]">Jevxo Services</span>
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-3 max-w-sm leading-relaxed">
            Join 50,000+ happy customers who trust Jevxo Services for professional home services every day.
          </p>
          <div className="flex items-center gap-8 mt-8 pt-6 border-t border-slate-200/60 w-full justify-center">
            {[{ v: "50K+", l: "Happy Clients" }, { v: "4.9★", l: "Avg Rating" }, { v: "120+", l: "Services" }].map((s, i) => (
              <React.Fragment key={i}>
                {i > 0 && <div className="w-px h-10 bg-slate-200" />}
                <div className="text-center">
                  <p className="text-2xl font-black text-slate-800">{s.v}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{s.l}</p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col justify-center overflow-y-auto relative">
        {/* Same bg-icons pattern used across all pages */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{ backgroundImage: "url('/bg-icons-design.png')", backgroundRepeat: "repeat" }}
        />

        <div className="relative z-10 px-5 sm:px-8 pt-5">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-[#1E4E8C] transition-colors group">
            <ChevronLeft size={17} className="group-hover:-translate-x-0.5 transition-transform" />Back to Home
          </Link>
        </div>

        <div className="flex-1 flex items-start sm:items-center justify-center px-4 sm:px-8 pb-8 pt-4 relative z-10">
          <div className="w-full max-w-[460px] bg-white/70 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none border border-slate-200/80 sm:border-0 rounded-3xl shadow-lg sm:shadow-none px-6 py-8 sm:px-2 sm:py-0">
            {!isOtpSent ? (
              <>
                <div className="flex flex-col items-center text-center mb-8">
                  <Link href="/" className="flex flex-col items-center gap-2.5 group mb-5">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#1E4E8C] to-rose-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-rose-400/25 group-hover:scale-105 transition-transform">
                      <Sparkles size={26} className="stroke-[2]" />
                    </div>
                    <span className="font-black text-xl sm:text-2xl text-slate-900 tracking-tight">Jevxo Services</span>
                  </Link>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight flex items-center gap-2.5">
                    <UserPlus size={28} className="text-[#1E4E8C]" />
                    Create Account
                  </h1>
                  <p className="text-slate-500 text-sm font-medium mt-2 leading-relaxed max-w-xs">Sign up to access premium home services.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    { name: "name", label: "Full Name", type: "text", placeholder: "John Doe", icon: User },
                    { name: "email", label: "Email Address", type: "email", placeholder: "name@company.com", icon: Mail },
                  ].map(({ name, label, type, placeholder, icon: Icon }) => (
                    <div key={name} className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest">{label}</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Icon size={17} /></div>
                        <input type={type} name={name} value={(formData as any)[name]} onChange={handleChange} placeholder={placeholder} className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1E4E8C] focus:ring-4 focus:ring-[#1E4E8C]/10 focus:outline-none transition-all text-sm font-medium text-slate-900 placeholder-slate-400" required />
                      </div>
                    </div>
                  ))}

                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest">Phone Number</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10 border-r border-slate-200 pr-3">
                        <span className="text-base leading-none">🇧🇩</span>
                        <span className="text-xs font-bold text-slate-400">+880</span>
                      </div>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="01712-XXXXXX" className="w-full pl-[84px] pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1E4E8C] focus:ring-4 focus:ring-[#1E4E8C]/10 focus:outline-none transition-all text-sm font-medium text-slate-900 placeholder-slate-400" required />
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-1">
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <div className="relative mt-0.5 shrink-0">
                        <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="sr-only" required />
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${agreeTerms ? "bg-[#1E4E8C] border-[#1E4E8C]" : "bg-white border-slate-300 group-hover:border-[#1E4E8C]/50"}`}>
                          {agreeTerms && <Check size={12} className="text-white stroke-[3]" />}
                        </div>
                      </div>
                      <span className="text-xs text-slate-500 font-medium select-none leading-relaxed">
                        I agree to the <Link href="/terms" className="text-[#1E4E8C] hover:underline font-semibold">Terms of Use</Link> and <Link href="/privacy" className="text-[#1E4E8C] hover:underline font-semibold">Privacy Policy</Link>.
                      </span>
                    </label>
                  </div>

                  <button type="submit" disabled={isLoading} className="w-full mt-1 bg-[#1E4E8C] hover:bg-[#1E4E8C]/90 disabled:opacity-70 text-white text-[15px] font-bold py-4 rounded-xl shadow-lg shadow-[#1E4E8C]/25 transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer border-none">
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <><span>Create Account</span><ArrowRight size={18} /></>}
                  </button>
                </form>

                <p className="text-center text-sm text-slate-500 font-medium mt-6">
                  Already have an account? <Link href="/login" className="text-[#1E4E8C] hover:underline font-bold">Login</Link>
                </p>
                <div className="flex items-center justify-center gap-4 flex-wrap mt-5 pt-5 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold"><ShieldCheck size={12} className="text-emerald-500" />SSL Encrypted</div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold"><Check size={12} className="text-emerald-500" />Privacy Protected</div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#1E4E8C] to-rose-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-rose-400/30">
                  <ShieldCheck size={30} className="stroke-[2]" />
                </div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Verify Your Number</h2>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-2 px-4">
                  We've sent a 4-digit code to <strong className="text-slate-800">{formData.phone || "+880 1712-XXXXXX"}</strong>
                </p>

                <form onSubmit={handleVerifyOtp} className="space-y-6 w-full mt-8">
                  <div className="flex justify-center gap-3">
                    {otp.map((digit, idx) => (
                      <input key={idx} type="text" inputMode="numeric" maxLength={1} value={digit} ref={(el) => { otpInputsRef.current[idx] = el }} onChange={(e) => handleOtpChange(e.target.value, idx)} onKeyDown={(e) => handleOtpKeyDown(e.key, idx)} className={`w-14 h-16 rounded-2xl border-2 text-center text-2xl font-black focus:outline-none transition-all shadow-sm ${digit ? "border-[#1E4E8C] bg-rose-50 text-[#1E4E8C]" : "border-slate-200 bg-slate-50 text-slate-800 focus:border-[#1E4E8C] focus:bg-white focus:ring-4 focus:ring-[#1E4E8C]/10"}`} required />
                    ))}
                  </div>
                  <div className="text-xs text-[#1E4E8C] font-extrabold tracking-wide">
                    {timeLeft > 0 ? (
                      `Resend code in 0${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? "0" + (timeLeft % 60) : timeLeft % 60}`
                    ) : (
                      <button type="button" onClick={handleResendOtp} className="text-[#1E4E8C] hover:underline font-black focus:outline-none">Resend Code</button>
                    )}
                  </div>
                  <button type="submit" disabled={isVerifying} className="w-full bg-[#1E4E8C] hover:bg-[#1E4E8C]/90 disabled:opacity-75 text-white text-sm font-black py-4 rounded-xl shadow-lg shadow-rose-400/25 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 focus:outline-none cursor-pointer border-none">
                    {isVerifying ? <Loader2 size={18} className="animate-spin" /> : <><span>VERIFY & PROCEED</span><ArrowRight size={18} strokeWidth={2.5} /></>}
                  </button>
                </form>
                <button type="button" onClick={() => setIsOtpSent(false)} className="mt-5 text-xs text-slate-500 hover:text-slate-800 hover:underline font-bold focus:outline-none cursor-pointer border-none bg-transparent">← Change Phone Number</button>
                <span className="text-[10px] text-slate-400 font-extrabold mt-6 flex items-center justify-center gap-1">
                  <ShieldCheck size={12} className="text-emerald-500" />Your connection is secure and encrypted
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="text-center py-5 text-[11px] text-slate-400 font-medium relative z-10 border-t border-slate-100 mx-6 space-y-1">
          <div>© {new Date().getFullYear()} Jevxo Services Services Ltd. · All rights reserved. <Link href="/privacy" className="ml-3 text-slate-400 hover:text-[#1E4E8C] transition-colors">Privacy</Link><Link href="/terms" className="ml-3 text-slate-400 hover:text-[#1E4E8C] transition-colors">Terms</Link></div>
          <div>Developed by <a href="https://aftabfarhan.tech" target="_blank" rel="noopener noreferrer" className="text-[#1E4E8C] hover:underline font-semibold">Aftab Farhan Arko</a></div>
        </div>
      </div>
    </div>
  )
}