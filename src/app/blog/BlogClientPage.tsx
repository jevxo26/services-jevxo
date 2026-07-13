"use client";

import React, { useState } from "react";
import Image from "next/image";
import { BookOpen, Search, Loader2, Calendar, ChevronRight, Sparkles, X } from "lucide-react";
import { useGetAllBlogsQuery } from "@/redux/features/admin/blog";

export default function BlogClientPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedBlog, setSelectedBlog] = useState<any | null>(null);
  const [searchTimer, setSearchTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const { data: blogsRes, isLoading } = useGetAllBlogsQuery(debouncedSearch || undefined);
  const blogs: any[] = blogsRes?.data || [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    if (searchTimer) clearTimeout(searchTimer);
    const t = setTimeout(() => setDebouncedSearch(val), 500);
    setSearchTimer(t);
  };

  const clearSearch = () => {
    setSearch("");
    setDebouncedSearch("");
  };

  const getImages = (blog: any): string[] => {
    if (Array.isArray(blog.images) && blog.images.length > 0) return blog.images;
    if (typeof blog.images === "string") {
      const parts = blog.images.split(",").filter(Boolean);
      if (parts.length > 0) return parts;
    }
    return [];
  };

  return (
    <div className="min-h-screen bg-transparent overflow-hidden flex-1 flex flex-col relative font-sans pb-24">
      {/* Background Icon Pattern */}
      <div
        className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0"
        style={{ backgroundSize: "auto" }}
      />

      {/* ─── HERO BANNER ─── */}
      <section className="relative pt-12 pb-10 md:pt-16 md:pb-14 lg:pt-20 border-b border-slate-100 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 text-[10px] font-extrabold text-[#FF6014] uppercase tracking-[.12em] bg-[#FFF4EE] px-3.5 py-1.5 rounded-full border border-[#FF6014]/20">
              <Sparkles className="w-3.5 h-3.5" /> Rajseba Blog
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-slate-900 leading-[1.15]">
              Expert Tips, Guides &{" "}
              <span className="text-[#FF6014]">Home Care Insights</span>
            </h1>
            <p className="text-[14px] text-slate-500 font-semibold leading-relaxed max-w-2xl mx-auto">
              Stay informed with the latest home service tips, maintenance guides, and trusted
              advice from Rajseba's expert team.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-md mx-auto pt-2">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search blog posts..."
                className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-10 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6014]/40 focus:ring-4 focus:ring-[#FFF8F4] shadow-sm transition-all"
              />
              {search && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── BLOG POSTS GRID ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-16 relative z-10">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-32 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF6014]" />
            <span className="text-slate-400 text-xs font-semibold animate-pulse">
              Loading blog posts...
            </span>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-32 bg-white/70 backdrop-blur-md border border-slate-150 rounded-3xl space-y-3">
            <div className="w-14 h-14 bg-[#FFF4EE] text-[#FF6014] rounded-2xl flex items-center justify-center mx-auto">
              <BookOpen size={24} />
            </div>
            <p className="text-slate-700 font-bold text-base">
              {debouncedSearch
                ? `No blogs found for "${debouncedSearch}"`
                : "No blog posts published yet."}
            </p>
            <p className="text-slate-400 text-sm font-medium">
              Check back soon for expert home care tips and guides.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => {
              const imgs = getImages(blog);
              const thumb = imgs[0] || null;
              const date = blog.createdAt
                ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "";
              return (
                <article
                  key={blog.id}
                  onClick={() => setSelectedBlog(blog)}
                  className="group bg-white/80 backdrop-blur-md rounded-3xl border border-slate-150 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#FF6014]/20 transition-all duration-300 cursor-pointer flex flex-col"
                >
                  {/* Thumbnail */}
                  <div className="relative w-full h-52 bg-slate-100 overflow-hidden shrink-0">
                    {thumb ? (
                      <Image
                        src={thumb}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#FFF4EE]">
                        <BookOpen className="w-10 h-10 text-[#FF6014]/40" />
                      </div>
                    )}

                    {/* Image count badge */}
                    {imgs.length > 1 && (
                      <span className="absolute top-3 right-3 bg-slate-900/60 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                        {imgs.length} photos
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    {/* Date */}
                    {date && (
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                        <Calendar size={11} />
                        {date}
                      </div>
                    )}

                    <h2 className="font-extrabold text-slate-800 text-[15px] leading-snug mb-2 group-hover:text-[#FF6014] transition-colors line-clamp-2">
                      {blog.title}
                    </h2>

                    {blog.overview && (
                      <p className="text-slate-500 text-xs font-semibold leading-relaxed line-clamp-2 mb-3">
                        {blog.overview}
                      </p>
                    )}

                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-3 flex-1">
                      {blog.description}
                    </p>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#FF6014] uppercase tracking-wider bg-[#FFF4EE] px-2.5 py-1 rounded-full">
                        Read More
                      </span>
                      <ChevronRight size={16} className="text-slate-300 group-hover:text-[#FF6014] group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── BLOG DETAIL MODAL ─── */}
      {selectedBlog && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedBlog(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full border border-slate-100 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Images */}
            {(() => {
              const imgs = getImages(selectedBlog);
              if (imgs.length === 0) return null;
              return (
                <div className="relative w-full h-64 bg-slate-100 overflow-hidden">
                  <Image
                    src={imgs[0]}
                    alt={selectedBlog.title}
                    fill
                    className="object-cover"
                    sizes="672px"
                  />
                  {imgs.length > 1 && (
                    <div className="absolute bottom-3 right-3 flex gap-2">
                      {imgs.slice(1).map((img: string, i: number) => (
                        <div key={i} className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-white shadow-lg">
                          <Image src={img} alt="" fill className="object-cover" sizes="56px" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="p-7 space-y-4">
              {/* Date */}
              {selectedBlog.createdAt && (
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <Calendar size={11} />
                  {new Date(selectedBlog.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              )}

              <h2 className="text-xl font-extrabold text-slate-900 leading-snug">
                {selectedBlog.title}
              </h2>

              {selectedBlog.overview && (
                <p className="text-sm font-semibold text-[#FF6014] leading-relaxed border-l-2 border-[#FF6014]/30 pl-4">
                  {selectedBlog.overview}
                </p>
              )}

              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {selectedBlog.description}
              </p>
            </div>

            {/* Close Button */}
            <div className="px-7 py-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedBlog(null)}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all active:scale-[0.98]"
              >
                <X size={14} /> Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
