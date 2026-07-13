"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import {
  useGetAllBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  Blog,
} from "@/redux/features/admin/blog";
import { toast } from "sonner";
import { uploadImage } from "@/lib/upload";

export function useBlogState() {
  const role = useAppSelector((state) => state.auth.role) || "superadmin";

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { data: apiBlogsRes, isLoading: isBlogsLoading } = useGetAllBlogsQuery(
    debouncedSearch || undefined
  );
  const [createBlogMut, { isLoading: isCreating }] = useCreateBlogMutation();
  const [updateBlogMut, { isLoading: isUpdating }] = useUpdateBlogMutation();
  const [deleteBlogMut] = useDeleteBlogMutation();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);

  // Form states
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [overview, setOverview] = useState("");
  const [description, setDescription] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    const apiBlogs = apiBlogsRes?.data || [];
    setBlogs(apiBlogs);
  }, [apiBlogsRes]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length >= 3) {
      toast.error("You can upload a maximum of 3 images.");
      return;
    }

    setIsUploadingImage(true);
    try {
      const file = files[0];
      const url = await uploadImage(file);
      setImages((prev) => [...prev, url]);
      toast.success("Image uploaded successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to upload image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const openCreateModal = () => {
    setEditingBlog(null);
    setImages([]);
    setTitle("");
    setOverview("");
    setDescription("");
    setIsModalOpen(true);
  };

  const openEditModal = (blog: Blog) => {
    setEditingBlog(blog);
    const blogImages = Array.isArray(blog.images)
      ? blog.images
      : typeof blog.images === 'string'
      ? (blog.images as string).split(',').filter(Boolean)
      : [];
    setImages(blogImages);
    setTitle(blog.title || "");
    setOverview(blog.overview || "");
    setDescription(blog.description || "");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      overview: overview.trim() || undefined,
      images,
    };

    try {
      if (editingBlog) {
        await updateBlogMut({
          id: editingBlog.id,
          data: payload,
        }).unwrap();
        toast.success("Blog updated successfully!");
      } else {
        await createBlogMut(payload).unwrap();
        toast.success("Blog created successfully!");
      }
      setIsModalOpen(false);
    } catch (e: any) {
      console.error("Failed to save blog:", e);
      toast.error(e.data?.message || e.message || "Failed to save blog");
    }
  };

  const openDeleteModal = (blog: Blog) => {
    setBlogToDelete(blog);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!blogToDelete) return;
    try {
      await deleteBlogMut(blogToDelete.id).unwrap();
      toast.success("Blog deleted successfully!");
      setIsDeleteModalOpen(false);
      setBlogToDelete(null);
    } catch (e: any) {
      console.error("Failed to delete blog:", e);
      toast.error(e.data?.message || e.message || "Failed to delete blog");
    }
  };

  return {
    role,
    isBlogsLoading,
    blogs,
    search,
    setSearch,
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
  };
}
