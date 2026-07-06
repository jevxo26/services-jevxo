"use client";

import { useState, useEffect, useMemo } from "react";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";
import { uploadImage } from "@/lib/upload";
import {
  useGetAllNestedServicesQuery,
  useGetAllSubServicesQuery,
  useCreateSubServiceMutation,
  useUpdateSubServiceMutation,
  useDeleteSubServiceMutation,
  NestedService,
  SubService,
} from "@/redux/features/admin/service";

export function useSubServiceState() {
  const rawRole = useAppSelector((state) => state.auth.role) || "superadmin";
  const role = typeof rawRole === "string" ? rawRole.toLowerCase().replace(/\s+/g, "") : "client";
  const currentUser = useAppSelector((state) => state.auth.user);
  const currentUserId = currentUser?.id || currentUser?._id || "";

  // APIs
  const { data: apiNestedRes, isLoading: isNestedLoading } = useGetAllNestedServicesQuery();
  const {
    data: apiSubServicesRes,
    isLoading: isSubServicesLoading,
    refetch: refetchSubServices,
  } = useGetAllSubServicesQuery();

  const [createMut, { isLoading: isCreating }] = useCreateSubServiceMutation();
  const [updateMut, { isLoading: isUpdating }] = useUpdateSubServiceMutation();
  const [deleteMut] = useDeleteSubServiceMutation();

  const [subServices, setSubServices] = useState<SubService[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SubService | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<SubService | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [nestedServiceId, setNestedServiceId] = useState("NONE");
  const [description, setDescription] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [faq, setFaq] = useState<{ question: string; answer: string }[]>([]);
  const [isUploadingImage1, setIsUploadingImage1] = useState(false);
  const [isUploadingImage2, setIsUploadingImage2] = useState(false);

  const handleImage1Upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingImage1(true);
    try {
      const url = await uploadImage(file);
      setImage1(url);
      toast.success("Image 1 uploaded successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload Image 1");
    } finally {
      setIsUploadingImage1(false);
    }
  };

  const handleImage2Upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingImage2(true);
    try {
      const url = await uploadImage(file);
      setImage2(url);
      toast.success("Image 2 uploaded successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload Image 2");
    } finally {
      setIsUploadingImage2(false);
    }
  };

  // All nested services for the dropdown
  const allNestedServices: NestedService[] = useMemo(() => {
    return apiNestedRes?.data || (Array.isArray(apiNestedRes) ? apiNestedRes : []);
  }, [apiNestedRes]);

  // Filter nested services for vendor — only their own
  const nestedServiceOptions = (() => {
    const base =
      role === "vendor"
        ? allNestedServices.filter(
            (ns) => String(ns.service?.vendor?.id || ns.service?.vendor_id) === String(currentUserId)
          )
        : allNestedServices;
    return [
      { value: "NONE", label: "Select a Parent Nested Service" },
      ...base.map((ns) => ({
        value: String(ns.id),
        label: ns.name,
      })),
    ];
  })();

  // Filter sub services for vendor
  useEffect(() => {
    const all: SubService[] = apiSubServicesRes?.data || (Array.isArray(apiSubServicesRes) ? apiSubServicesRes : []);

    if (role === "vendor") {
      const vendorNestedIds = allNestedServices
        .filter((ns) => String(ns.service?.vendor?.id || ns.service?.vendor_id) === String(currentUserId))
        .map((ns) => ns.id);
      setSubServices(all.filter((ss) => ss.nestedService && vendorNestedIds.includes(ss.nestedService.id)));
    } else {
      setSubServices(all);
    }
  }, [apiSubServicesRes, allNestedServices, role, currentUserId]);

  const resetForm = () => {
    setName("");
    setPrice("");
    setNestedServiceId("NONE");
    setDescription("");
    setImage1("");
    setImage2("");
    setFaq([]);
  };

  const openCreateModal = () => {
    setEditingItem(null);
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (item: SubService) => {
    setEditingItem(item);
    setName(item.name);
    setPrice(item.price != null ? String(item.price) : "");
    setNestedServiceId(item.nestedService ? String(item.nestedService.id) : "NONE");
    setDescription(item.description || "");
    setImage1(item.image1 || "");
    setImage2(item.image2 || "");
    setFaq(item.faq || []);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Sub-service name is required");
      return;
    }
    if (price === "") {
      toast.error("Price is required");
      return;
    }

    const payload = {
      name: name.trim(),
      price: Number(price),
      description: description.trim() || undefined,
      image1: image1.trim() || undefined,
      image2: image2.trim() || undefined,
      faq: faq.filter(f => f.question.trim() !== "" && f.answer.trim() !== ""),
      ...(!editingItem ? { nested_service_id: nestedServiceId === "NONE" ? 0 : Number(nestedServiceId) } : {}),
    };

    if (!editingItem && nestedServiceId === "NONE") {
      toast.error("Please select a parent nested service");
      return;
    }

    try {
      if (editingItem) {
        await updateMut({
          id: editingItem.id,
          data: {
            name: payload.name,
            price: payload.price,
            nested_service_id: nestedServiceId !== "NONE" ? Number(nestedServiceId) : undefined,
            description: payload.description,
            image1: payload.image1,
            image2: payload.image2,
            faq: payload.faq,
          },
        }).unwrap();
        toast.success("Sub-service updated successfully!");
      } else {
        await createMut({
          nested_service_id: Number(nestedServiceId),
          name: payload.name,
          price: payload.price,
          description: payload.description,
          image1: payload.image1,
          image2: payload.image2,
          faq: payload.faq,
        }).unwrap();
        toast.success("Sub-service created successfully!");
      }
      setIsModalOpen(false);
      refetchSubServices();
    } catch (err: any) {
      toast.error(err.data?.message || err.message || "Failed to save sub-service");
    }
  };

  const openDeleteModal = (item: SubService) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteMut(itemToDelete.id).unwrap();
      toast.success("Sub-service deleted successfully!");
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      refetchSubServices();
    } catch (err: any) {
      toast.error(err.data?.message || err.message || "Failed to delete sub-service");
    }
  };

  return {
    role,
    isSubServicesLoading,
    subServices,
    isModalOpen,
    setIsModalOpen,
    editingItem,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    itemToDelete,
    setItemToDelete,
    name,
    setName,
    price,
    setPrice,
    nestedServiceId,
    setNestedServiceId,
    nestedServiceOptions,
    openCreateModal,
    openEditModal,
    handleSubmit,
    openDeleteModal,
    handleDelete,
    isCreating,
    isUpdating,
    description,
    setDescription,
    image1,
    setImage1,
    image2,
    setImage2,
    faq,
    setFaq,
    isUploadingImage1,
    isUploadingImage2,
    handleImage1Upload,
    handleImage2Upload,
  };
}
