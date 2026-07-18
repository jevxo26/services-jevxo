"use client";

import { ShieldAlert, PlusCircle, Image as ImageIcon, BookOpen, Clock } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import BlogModal from "./components/BlogModal";
import DeleteBlogModal from "./components/DeleteBlogModal";
import BlogTable from "./components/BlogTable";
import { useBlogState } from "./hooks/useBlogState";

export default function BlogManagementPage() {
  const {
    role,
    isBlogsLoading,
    blogs,
    isModalOpen,
    setIsModalOpen,
    editingBlog,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    blogToDelete,
    setBlogToDelete,
    images,
    setImages,
    title,
    setTitle,
    overview,
    setOverview,
    description,
    setDescription,
    isUploadingImage,
    handleImageUpload,
    removeImage,
    openCreateModal,
    openEditModal,
    handleSubmit,
    openDeleteModal,
    handleDelete,
    isCreating,
    isUpdating,
  } = useBlogState();

  const lang = useAppSelector((state) => state.lang.value);

  if (role !== "superadmin") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center animate-in fade-in duration-200">
        <div className="p-4 bg-[#EEF2FF] rounded-2xl text-[#1E4E8C] mb-4">
          <ShieldAlert size={48} />
        </div>
        <h3 className="text-xl font-bold text-slate-800">{lang === "bn" ? "অ্যাক্সেস অস্বীকৃত" : "Access Denied"}</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">{lang === "bn" ? "এই প্যানেলটি শুধুমাত্র অ্যাডমিনদের জন্য।" : "This panel is restricted to Administrators. Please switch your role using the selector in the navbar to test this view."}</p>
      </div>
    );
  }

  // Calculate statistics
  const totalBlogs = blogs.length;
  const totalImages = blogs.reduce((acc, b) => {
    const imgs = Array.isArray(b.images)
      ? b.images
      : typeof b.images === 'string'
        ? (b.images as any).split(',').filter(Boolean)
        : [];
    return acc + imgs.length;
  }, 0);
  const latestBlogDate = blogs.length > 0 && blogs[0].createdAt
    ? new Date(blogs[0].createdAt).toLocaleDateString()
    : "—";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#EEF2FF] text-[#1E4E8C] rounded-2xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">{lang === "bn" ? "ব্লগ ম্যানেজমেন্ট" : "Blog Management"}</h1>
            <p className="text-xs text-slate-400 mt-0.5">{lang === "bn" ? "সিস্টেমের ব্লগ পোস্ট, বিবরণ এবং ইমেজ ম্যানেজ করুন।" : "Manage system-wide blog posts, content, and thumbnails."}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={openCreateModal}
            className="bg-[#1E4E8C] hover:bg-[#123C73] text-white font-bold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-[#1E4E8C]/15"
          >
            <PlusCircle size={18} /> {lang === "bn" ? "ব্লগ যোগ করুন" : "Add Blog"}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {!isBlogsLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200/50 p-5 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] flex items-center justify-between relative overflow-hidden group hover:border-[#1E4E8C]/20 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-[#EEF2FF] blur-2xl -mr-6 -mt-6 group-hover:bg-[#EEF2FF]/80 transition-colors" />
            <div className="relative space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {lang === "bn" ? "মোট ব্লগ" : "Total Blogs"}
              </span>
              <h3 className="text-2xl font-black text-slate-800">{totalBlogs}</h3>
              <p className="text-[10px] font-bold text-slate-400">
                {lang === "bn" ? "প্রকাশিত নিবন্ধসমূহ" : "Published articles"}
              </p>
            </div>
            <div className="relative p-3 bg-[#EEF2FF] text-[#1E4E8C] rounded-2xl">
              <BookOpen size={22} />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200/50 p-5 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] flex items-center justify-between relative overflow-hidden group hover:border-[#1E4E8C]/20 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-rose-50/50 blur-2xl -mr-6 -mt-6 group-hover:bg-rose-50 transition-colors" />
            <div className="relative space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {lang === "bn" ? "মোট ছবি" : "Total Images"}
              </span>
              <h3 className="text-2xl font-black text-slate-800">{totalImages}</h3>
              <p className="text-[10px] font-bold text-slate-400">
                {lang === "bn" ? "আপলোড করা ছবিসমূহ" : "Uploaded images"}
              </p>
            </div>
            <div className="relative p-3 bg-rose-50 text-rose-500 rounded-2xl">
              <ImageIcon size={22} />
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200/50 p-5 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] flex items-center justify-between relative overflow-hidden group hover:border-[#1E4E8C]/20 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-indigo-50/50 blur-2xl -mr-6 -mt-6 group-hover:bg-indigo-50 transition-colors" />
            <div className="relative space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {lang === "bn" ? "সর্বশেষ ব্লগ" : "Latest Post"}
              </span>
              <h3 className="text-2xl font-black text-slate-800">{latestBlogDate}</h3>
              <p className="text-[10px] font-bold text-slate-400">
                {lang === "bn" ? "সর্বশেষ প্রকাশের তারিখ" : "Latest publication date"}
              </p>
            </div>
            <div className="relative p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Clock size={22} />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {isBlogsLoading ? (
        <div className="flex items-center justify-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm">
          <div className="w-8 h-8 border-4 border-[#1E4E8C] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : blogs.length === 0 ? (
        <div className="bg-white border border-slate-200/60 rounded-3xl p-16 text-center shadow-[0_8px_30px_rgb(0,0,0,0.02)] max-w-2xl mx-auto border-dashed">
          <div className="w-16 h-16 bg-[#EEF2FF] text-[#1E4E8C] rounded-2xl flex items-center justify-center mx-auto mb-5 border border-[#1E4E8C]/10 shadow-inner">
            <BookOpen size={28} />
          </div>
          <h3 className="text-lg font-black text-slate-800">{lang === "bn" ? "কোনো ব্লগ পোস্ট পাওয়া যায়নি" : "No Blogs Found"}</h3>
          <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">{lang === "bn" ? "সিস্টেমে কন্টেন্ট প্রদর্শন করার জন্য নতুন ব্লগ পোস্ট যোগ করুন।" : "Add blog posts with titles, descriptions, and up to 3 images to showcase on the system landing/blog pages."}</p>
          <button
            onClick={openCreateModal}
            className="mt-6 bg-[#1E4E8C] hover:bg-[#123C73] text-white font-extrabold px-6 py-3 rounded-2xl text-sm transition-all active:scale-[0.98] shadow-md shadow-[#1E4E8C]/15 inline-flex items-center gap-2"
          >
            <PlusCircle size={16} /> {lang === "bn" ? "ব্লগ পোস্ট তৈরি করুন" : "Create Blog"}
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/50 rounded-3xl shadow-sm overflow-hidden p-1">
          <BlogTable
            blogs={blogs}
            openEditModal={openEditModal}
            openDeleteModal={openDeleteModal}
          />
        </div>
      )}

      {/* Modals */}
      {isModalOpen && (
        <BlogModal
          editingBlog={editingBlog}
          setIsModalOpen={setIsModalOpen}
          handleSubmit={handleSubmit}
          images={images}
          setImages={setImages}
          title={title}
          setTitle={setTitle}
          overview={overview}
          setOverview={setOverview}
          description={description}
          setDescription={setDescription}
          isUploadingImage={isUploadingImage}
          handleImageUpload={handleImageUpload}
          removeImage={removeImage}
          isCreating={isCreating}
          isUpdating={isUpdating}
        />
      )}

      <DeleteBlogModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        blogToDelete={blogToDelete}
        setBlogToDelete={setBlogToDelete}
        handleDelete={handleDelete}
      />
    </div>
  );
}
