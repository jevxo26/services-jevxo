"use client";

import { useAppSelector } from "@/redux/hooks";
import { ShieldAlert, BarChart3, MapPin, AlertCircle, Sparkles, RefreshCw } from "lucide-react";
import { useGetAnalyticsStatsQuery, useGetAIInsightsQuery } from "@/redux/features/admin/dashboardApi";

export default function AnalyticsPage() {
  const role = useAppSelector((state) => state.auth.role) || "superadmin";
  const lang = useAppSelector((state) => state.lang.value);

  const { 
    data: statsData, 
    isLoading: isStatsLoading, 
    isError: isStatsError,
    refetch: refetchStats
  } = useGetAnalyticsStatsQuery();

  const {
    data: aiData,
    isLoading: isAiLoading,
    refetch: refetchAi
  } = useGetAIInsightsQuery();

  // Access check
  if (role !== "superadmin") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center animate-in fade-in duration-200">
        <div className="p-4 bg-[#EEF2FF] rounded-2xl text-[#4F46E5] mb-4">
          <ShieldAlert size={48} />
        </div>
        <h3 className="text-xl font-bold text-slate-800">{lang === "bn" ? "অ্যাক্সেস অস্বীকৃত" : "Access Denied"}</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">{lang === "bn" ? "এই প্যানেলটি শুধুমাত্র অ্যাডমিনদের জন্য।" : "This panel is restricted to Administrators."}</p>
      </div>
    );
  }

  if (isStatsLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#4F46E5] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-500 animate-pulse">
          {lang === "bn" ? "অ্যানালিটিক্স লোড হচ্ছে..." : "Loading analytics insights..."}
        </p>
      </div>
    );
  }

  if (isStatsError || !statsData?.data) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500" />
        <h3 className="text-lg font-bold text-slate-800">{lang === "bn" ? "উফ! কোনো সমস্যা হয়েছে" : "Oops! Something went wrong"}</h3>
        <p className="text-sm text-slate-500 max-w-xs">{lang === "bn" ? "অ্যানালিটিক্স ডেটা লোড করতে ব্যর্থ হয়েছে।" : "Failed to load live analytics dashboard metrics."}</p>
        <button 
          onClick={refetchStats}
          className="px-4 py-2 bg-slate-950 text-white text-xs font-bold rounded-full hover:bg-slate-900 transition-all"
        >
          {lang === "bn" ? "আবার চেষ্টা করুন" : "Try Again"}
        </button>
      </div>
    );
  }

  const { categoryBreakdown, regionalActivity, ratings, utilization } = statsData.data;

  // AI insights translation
  const aiReportEn = aiData?.data?.insightsEn || aiData?.data?.message || "Generating report...";
  const aiReportBn = aiData?.data?.insightsBn || aiData?.data?.message || "প্রতিবেদন তৈরি হচ্ছে...";
  const activeAiReport = lang === "bn" ? aiReportBn : aiReportEn;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#EEF2FF] text-[#4F46E5] rounded-2xl">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">{lang === "bn" ? "সিস্টেম অ্যানালিটিক্স" : "System Analytics"}</h1>
            <p className="text-xs text-slate-400 mt-0.5">{lang === "bn" ? "বুকিং, আঞ্চলিক চাহিদা এবং ক্যাটাগরি মেট্রিকস নিয়ে বিস্তারিত তথ্য।" : "Detailed statistical insights regarding bookings, regional demand, and category metrics."}</p>
          </div>
        </div>
        <button
          onClick={() => { refetchStats(); refetchAi(); }}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-all active:scale-[0.98] self-start sm:self-auto shadow-xs"
        >
          <RefreshCw size={14} />
          {lang === "bn" ? "রিফ্রেশ" : "Refresh"}
        </button>
      </div>

      {/* AI Business Insight Panel */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-6 rounded-[24px] border border-slate-800 shadow-xl relative overflow-hidden group">
        {/* Glow effect */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#4F46E5]/10 blur-3xl group-hover:bg-[#4F46E5]/15 transition-all duration-700" />
        
        <div className="flex items-start gap-4 relative z-10">
          <div className="p-3 bg-gradient-to-br from-[#4F46E5] to-orange-600 text-white rounded-2xl shadow-lg shadow-orange-500/20 shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between gap-4">
              <h4 className="text-sm font-black text-white uppercase tracking-wider">
                {lang === "bn" ? "রাজসেবা এআই পারফরম্যান্স কনসালট্যান্ট" : "Rajseba AI Business Consultant"}
              </h4>
              <span className="text-[9px] font-black bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {lang === "bn" ? "সরাসরি ইনসাইট" : "Live AI Analysis"}
              </span>
            </div>
            
            {isAiLoading ? (
              <div className="space-y-2 py-2">
                <div className="h-4 bg-slate-800 rounded-md w-3/4 animate-pulse" />
                <div className="h-4 bg-slate-800 rounded-md w-5/6 animate-pulse" />
                <div className="h-4 bg-slate-800 rounded-md w-2/3 animate-pulse" />
              </div>
            ) : (
              <p className="text-xs leading-relaxed text-slate-300 font-semibold max-w-4xl whitespace-pre-line">
                {activeAiReport}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Categories vs Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Service Categories Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {lang === "bn" ? "সার্ভিস ক্যাটাগরি ডিস্ট্রিবিউশন" : "Service Category Distribution"}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {lang === "bn" ? "বুকিং সংখ্যা অনুযায়ী জনপ্রিয় ক্যাটাগরিস" : "Popular categories sorted by booking count"}
            </p>
          </div>

          <div className="space-y-4">
            {categoryBreakdown.map((cat: any, i: number) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                  <span className="text-slate-800">{cat.name}</span>
                  <div className="flex gap-2">
                    <span className="text-slate-400">{cat.count}</span>
                    <span className="text-[#4F46E5]">{cat.percentage}%</span>
                  </div>
                </div>
                <div className="h-2.5 w-full bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${cat.percentage}%` }}
                    className={`h-full ${cat.color || 'bg-[#4F46E5]'} rounded-full transition-all duration-500`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Booking Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {lang === "bn" ? "আঞ্চলিক বুকিং ডিস্ট্রিবিউশন" : "Regional Booking Distribution"}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {lang === "bn" ? "ঢাকা মেট্রোপলিটন এলাকায় সক্রিয় জোনসমূহ" : "Active zones across Dhaka metropolitan area"}
            </p>
          </div>

          <div className="space-y-4">
            {regionalActivity.map((region: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#EEF2FF] text-[#4F46E5] rounded-xl">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-slate-800">{region.name}</h5>
                    <span className="text-xs text-slate-400 font-medium">
                      {lang === "bn" ? `${region.count.replace('Jobs', 'টি কাজ').replace('completed', '')} সম্পন্ন` : `${region.count} completed`}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-slate-800">{region.percentage}%</span>
                  <span className="text-[10px] font-bold text-emerald-600 block">
                    {lang === "bn" ? `${region.trend.replace('growth', 'বৃদ্ধি')}` : `${region.trend} growth`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Grid: Rating Analytics & Platform utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Rating Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900">
            {lang === "bn" ? "রেটিং ব্রেকডাউন" : "Rating Breakdown"}
          </h3>
          
          <div className="flex items-center gap-6 pb-2">
            <div>
              <h2 className="text-4xl font-extrabold text-slate-900">{ratings.average}</h2>
              <span className="text-xs font-semibold text-[#4F46E5] flex items-center gap-0.5 mt-1">★ {lang === "bn" ? "রেটিং স্কোর" : "Rating Score"}</span>
            </div>
            <div className="h-10 w-px bg-slate-100" />
            <div>
              <p className="text-xs text-slate-500 font-medium">
                {lang === "bn" ? `এই বছর সংগৃহীত ${ratings.total.toLocaleString()} টি কাস্টমার রেটিং থেকে।` : `Out of ${ratings.total.toLocaleString()} customer ratings collected this year.`}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {ratings.starsBreakdown.map((star: any, i: number) => (
              <div key={i} className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                <span className="w-24 whitespace-nowrap">{lang === "bn" ? star.stars.replace("Stars", "তারকা").replace("Star", "তারকা").replace("& below", "ও নিচে") : star.stars}</span>
                <div className="h-2 flex-1 bg-slate-50 rounded-full overflow-hidden">
                  <div style={{ width: `${star.val}%` }} className={`h-full ${star.color}`} />
                </div>
                <span className="w-8 text-right text-slate-700">{star.val}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Utilization Rate */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 space-y-6">
          <h3 className="text-base font-bold text-slate-900">
            {lang === "bn" ? "প্রোভাইডার ইউটিলাইজেশন রেট" : "Provider Utilization Rate"}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs text-slate-400 font-bold uppercase">
                  {lang === "bn" ? "গড় জব ডিসপ্যাচ সময়" : "Average Job Dispatch Time"}
                </span>
                <h4 className="text-xl font-bold text-slate-800 mt-1">
                  {lang === "bn" ? utilization.dispatchTime.replace('Minutes', 'মিনিট') : utilization.dispatchTime}
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  {lang === "bn" ? "বুকিং অনুরোধ থেকে টেকনিশিয়ান যাত্রা শুরু পর্যন্ত" : "From booking request to technician en route"}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs text-slate-400 font-bold uppercase">
                  {lang === "bn" ? "কাস্টমার রিটেনশন" : "Customer Retention"}
                </span>
                <h4 className="text-xl font-bold text-slate-800 mt-1">{utilization.retentionRate}</h4>
                <p className="text-xs text-slate-400 mt-1">
                  {lang === "bn" ? "৩০ দিনের মধ্যে ২টি বা তার বেশি সার্ভিস বুক করেছেন" : "Booked 2+ services within 30 days"}
                </p>
              </div>
            </div>

            {/* Circular utilization indicator using CSS */}
            <div className="flex flex-col items-center justify-center p-4 border border-slate-50 rounded-2xl bg-slate-50/20">
              <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-slate-100 shadow-inner">
                {/* SVG circular progress indicator */}
                <svg className="absolute w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="54" className="stroke-slate-200 fill-none" strokeWidth="8" />
                  <circle cx="64" cy="64" r="54" className="stroke-rose-500 fill-none" strokeWidth="8" strokeDasharray="339.29" strokeDashoffset={`${339.29 - (339.29 * utilization.activeRate) / 100}`} />
                </svg>
                <div className="text-center z-10">
                  <h3 className="text-2xl font-black text-slate-800">{utilization.activeRate}%</h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {lang === "bn" ? "সক্রিয়তার হার" : "Active rate"}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 text-center font-medium mt-3">
                {lang === "bn" ? "অনলাইন বনাম জবে সক্রিয় প্রফেশনালস" : "Professionals online vs active on jobs"}
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
