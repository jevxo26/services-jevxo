"use client";

import { useState, useMemo } from "react";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";
import { uploadImage } from "@/lib/upload";
import {
  useGetAllNestedServicesQuery,
  useCreateNestedServiceMutation,
  useUpdateNestedServiceMutation,
  useDeleteNestedServiceMutation,
  NestedService,
} from "@/redux/features/admin/service";
import { useGetAllServicesQuery, Service } from "@/redux/features/admin/service";

export function useNestedServiceState() {
  const rawRole = useAppSelector((state) => state.auth.role) || "superadmin";
  const role = typeof rawRole === "string" ? rawRole.toLowerCase().replace(/\s+/g, "") : "client";
  const currentUser = useAppSelector((state) => state.auth.user);
  const currentUserId = currentUser?.id || currentUser?._id || "";

  // APIs
  const {
    data: apiNestedRes,
    isLoading: isNestedLoading,
    refetch: refetchNested,
  } = useGetAllNestedServicesQuery();
  const { data: apiServicesRes } = useGetAllServicesQuery();

  const [deleteMut] = useDeleteNestedServiceMutation();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<NestedService | null>(null);

  // Filter nested services for vendor
  const nestedServices = useMemo(() => {
    const all: NestedService[] = apiNestedRes?.data || (Array.isArray(apiNestedRes) ? apiNestedRes : []);
    const allServices: Service[] = apiServicesRes?.data || (Array.isArray(apiServicesRes) ? apiServicesRes : []);

    if (role === "vendor") {
      const vendorServiceIds = allServices
        .filter((s) => String(s.vendor?.id || s.vendor_id) === String(currentUserId))
        .map((s) => s.id);
      return all.filter((ns) => ns.service && vendorServiceIds.includes(ns.service.id));
    }
    return all;
  }, [apiNestedRes, apiServicesRes, role, currentUserId]);

  const openDeleteModal = (item: NestedService) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteMut(itemToDelete.id).unwrap();
      toast.success("Nested service deleted successfully!");
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      refetchNested();
    } catch (err: any) {
      toast.error(err.data?.message || err.message || "Failed to delete nested service");
    }
  };

  return {
    role,
    isNestedLoading,
    nestedServices,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    itemToDelete,
    setItemToDelete,
    openDeleteModal,
    handleDelete,
  };
}
