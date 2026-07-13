"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  BookOpen,
  Loader2,
  Calendar,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  ShieldCheck,
  ImageOff,
  Sparkles,
} from "lucide-react";
import { useGetAllBlogsQuery } from "@/redux/features/admin/blog";

/* ── helpers ── */
function getImages(blog: any): string[] {
  if (Array.isArray(blog.images) && blog.images.length > 0)
    return (blog.images as string[]).filter(Boolean);
  if (typeof blog.images === "string") {
    const parts = blog.images.split(",").filter(Boolean);
    if (parts.length > 0) return parts;
  }
  return [];
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* ─────────────────────────────────────
   DETAIL PANEL
───────────────────────────────────── */
function BlogDetail({ blog, onClose }: { blog: any; onClose: () => void }) {
  const [activeImg, setActiveImg] = useState(0);
  const imgs = getImages(blog);

  const prev = () => setActiveImg((p) => (p - 1 + imgs.length) % imgs.length);
  const next = () => setActiveImg((p) => (p + 1) % imgs.length);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-3 duration-300 space-y-6 sm:space-y-8">
      {/* Back */}
      <button
        onClick={onClose}
        className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-400 hover:text-[#FF6014] transition-colors"
      >
        <ArrowLeft size={13} /> Back to articles
      </button>

      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        {blog.createdAt && (
          <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <Calendar size={10} className="text-[#FF6014]" />
            {formatDate(blog.createdAt)}
          </div>
        )}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 leading-snug">
          {blog.title}
        </h1>
        {blog.overview && (
          <p className="text-sm font-semibold text-slate-600 leading-relaxed border-l-4 border-[#FF6014]/50 pl-4 py-2 bg-[#FFF8F4] rounded-r-2xl">
            {blog.overview}
          </p>
        )}
      </div>

      {/* Image gallery */}
      {imgs.length > 0 && (
        <div className="space-y-3">
          <div className="relative w-full aspect-[16/9] sm:aspect-[16/8] rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-100 shadow-md bg-slate-100">
            <Image
              src={imgs[activeImg]}
              alt={`${blog.title} — image ${activeImg + 1}`}
              fill
              className="object-cover transition-opacity duration-300"
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 900px"
            />
            {imgs.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 bg-white/80 backdrop-blur-sm rounded-full shadow-md text-slate-600 hover:bg-white transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={next}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 bg-white/80 backdrop-blur-sm rounded-full shadow-md text-slate-600 hover:bg-white transition-all"
                >
                  <ChevronRight size={16} />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                  {imgs.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`rounded-full transition-all ${i === activeImg ? "bg-[#FF6014] w-5 h-2" : "bg-white/60 hover:bg-white w-2 h-2"
                        }`}
                    />
                  ))}
                </div>
                <span className="absolute top-3 right-3 bg-slate-900/55 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                  {activeImg + 1} / {imgs.length}
                </span>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {imgs.length > 1 && (
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1">
              {imgs.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${i === activeImg
                      ? "border-[#FF6014] shadow-md shadow-orange-100 opacity-100"
                      : "border-transparent opacity-50 hover:opacity-90"
                    }`}
                >
                  <Image src={img} alt={`Thumb ${i + 1}`} fill className="object-cover" sizes="96px" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content + Sidebar */}
      <div className="flex flex-col md:grid md:grid-cols-12 gap-6 md:gap-8">
        {/* Description */}
        <div className="md:col-span-8 space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest pb-3 border-b border-slate-100">
            <BookOpen size={11} className="text-[#FF6014]" /> Full Article
          </div>
          <p className="text-slate-700 text-sm sm:text-[15px] leading-[1.9] font-medium whitespace-pre-line">
            {blog.description}
          </p>
        </div>

        {/* Sidebar CTA */}
        <div className="md:col-span-4">
          <div className="bg-gradient-to-br from-[#FFF9F6] to-[#FFF1E9] border border-orange-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4">
            <h3 className="font-black text-slate-800 text-sm flex items-center gap-1.5 uppercase tracking-wider">
              <ShieldCheck size={14} className="text-[#FF6014]" /> Need Help?
            </h3>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              Our certified home service professionals are ready to help.
            </p>
            <div className="flex flex-row sm:flex-col gap-2">
              <a
                href="/services"
                className="flex-1 flex items-center justify-center bg-[#FF6014] hover:bg-[#E0530A] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm shadow-orange-500/10"
              >
                Book Service
              </a>
              <a
                href="tel:01813333373"
                className="flex-1 flex items-center justify-center bg-white border border-orange-100 hover:bg-orange-50/50 text-[#FF6014] text-xs font-bold py-2.5 px-4 rounded-xl transition-all"
              >
                Call Hotline
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   BLOG CARD
───────────────────────────────────── */
function BlogCard({ blog, index, onClick }: { blog: any; index: number; onClick: () => void }) {
  const imgs = getImages(blog);
  const thumb = imgs[0] || null;
  const words = (blog.title || "").split(" ");
  const firstWord = words[0];
  const restWords = words.slice(1).join(" ");

  return (
    <button
      onClick={onClick}
      className="group w-full text-left bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-orange-50/60 hover:border-[#FF6014]/20 transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative w-full h-44 sm:h-52 bg-[#FFF4EE] overflow-hidden shrink-0">
        {thumb ? (
          <Image
            src={thumb}
            alt={blog.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <ImageOff className="w-7 h-7 text-[#FF6014]/30" />
            <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">No image</span>
          </div>
        )}
        {/* Soft white overlay — makes image halka */}
        <div className="absolute inset-0 bg-white/30" />
        {/* Hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {imgs.length > 1 && (
          <span className="absolute top-2.5 right-2.5 bg-white/80 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm border border-slate-100">
            {imgs.length} photos
          </span>
        )}
        <span className="absolute top-2.5 left-2.5 bg-white/90 text-slate-500 text-[9px] font-black px-2 py-0.5 rounded-full backdrop-blur-sm">
          #{String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {blog.createdAt && (
          <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2.5">
            <Calendar size={9} className="text-[#FF6014]" />
            {formatDate(blog.createdAt)}
          </div>
        )}
        {/* Title: first word orange, rest dark navy — matches homepage hero style */}
        <h2 className="font-bold text-[15px] sm:text-[17px] leading-snug mb-2.5 line-clamp-2 tracking-tight">
          <span className="text-[#FF6014]">{firstWord} </span>
          <span className="text-slate-900">{restWords}</span>
        </h2>
        {blog.overview && (
          <p className="text-slate-500 text-xs font-semibold leading-relaxed line-clamp-2 flex-1 mb-3 sm:mb-4">
            {blog.overview}
          </p>
        )}
        <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-auto">
          <span className="text-[9px] sm:text-[10px] font-extrabold text-[#FF6014] uppercase tracking-wider bg-[#FFF4EE] px-2.5 py-1 rounded-full">
            Read Article
          </span>
          <ChevronRight size={15} className="text-slate-200 group-hover:text-[#FF6014] group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </button>
  );
}

/* ─────────────────────────────────────
   MAIN PAGE
───────────────────────────────────── */
export default function BlogClientPage() {
  const [selectedBlog, setSelectedBlog] = useState<any | null>(null);

  const { data: blogsRes, isLoading } = useGetAllBlogsQuery(undefined);
  const blogs: any[] = blogsRes?.data || [];

  return (
    <div className="min-h-screen bg-transparent overflow-hidden flex-1 flex flex-col relative font-sans pb-20">
      {/* Background pattern */}
      <div
        className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0"
        style={{ backgroundSize: "auto" }}
      />

      {/* ─── PAGE HEADER ─── */}
      <section className="relative pt-8 pb-8 md:pt-12 md:pb-10 border-b border-slate-100 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#FFF4EE] text-[#FF6014] rounded-xl shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <Sparkles size={10} className="text-[#FF6014]" />
                  <span className="text-[10px] font-black text-[#FF6014] uppercase tracking-[.12em]">
                    Rajseba Blog
                  </span>
                </div>
                <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                  Expert Tips <span className="text-[#FF6014]">& Home Care</span> Insights
                </h1>
              </div>
            </div>
            {!isLoading && blogs.length > 0 && !selectedBlog && (
              <span className="self-start sm:self-center text-[10px] font-black text-slate-400 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm shrink-0">
                {blogs.length} article{blogs.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ─── CONTENT ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 md:mt-10 relative z-10 w-full">

        {/* Detail view */}
        {selectedBlog ? (
          <div className="bg-white/80 backdrop-blur-md border border-slate-100 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm">
            <BlogDetail blog={selectedBlog} onClose={() => setSelectedBlog(null)} />
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 sm:py-32 gap-3">
            <Loader2 className="w-7 h-7 animate-spin text-[#FF6014]" />
            <span className="text-slate-400 text-xs font-semibold animate-pulse">Loading articles...</span>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-24 sm:py-32 bg-white/70 backdrop-blur-md border border-dashed border-slate-200 rounded-2xl sm:rounded-3xl space-y-3">
            <div className="w-14 h-14 bg-[#FFF4EE] text-[#FF6014] rounded-2xl flex items-center justify-center mx-auto">
              <BookOpen size={24} />
            </div>
            <p className="text-slate-700 font-bold text-sm">No blog posts published yet.</p>
            <p className="text-slate-400 text-xs font-medium">Check back soon for expert home care tips.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
            {blogs.map((blog, index) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                index={index}
                onClick={() => setSelectedBlog(blog)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
