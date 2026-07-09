"use client";

import { useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";
import { useConfirm } from "@/context/ConfirmDialogContext";

import {
  useGetAllDevisionsQuery,
  useCreateDevisionMutation,
  useUpdateDevisionMutation,
  useDeleteDevisionMutation,
  useGetAllDistrictsQuery,
  useCreateDistrictMutation,
  useUpdateDistrictMutation,
  useDeleteDistrictMutation,
  useGetAllAreasQuery,
  useCreateAreaMutation,
  useUpdateAreaMutation,
  useDeleteAreaMutation,
} from "@/redux/features/admin/location";

export function useLocationState() {
  const confirm = useConfirm();
  const rawRole = useAppSelector((state) => state.auth.role) || "superadmin";
  const role = typeof rawRole === "string" ? rawRole.toLowerCase().replace(/\s+/g, "") : "client";

  const [activeTab, setActiveTab] = useState<"divisions" | "districts" | "areas">("divisions");

  // Division State
  const { data: divRes, isLoading: divLoad } = useGetAllDevisionsQuery();
  const [createDiv] = useCreateDevisionMutation();
  const [updateDiv] = useUpdateDevisionMutation();
  const [deleteDiv] = useDeleteDevisionMutation();

  // District State
  const { data: distRes, isLoading: distLoad } = useGetAllDistrictsQuery();
  const [createDist] = useCreateDistrictMutation();
  const [updateDist] = useUpdateDistrictMutation();
  const [deleteDist] = useDeleteDistrictMutation();

  // Area State
  const { data: areaRes, isLoading: areaLoad } = useGetAllAreasQuery();
  const [createArea] = useCreateAreaMutation();
  const [updateArea] = useUpdateAreaMutation();
  const [deleteArea] = useDeleteAreaMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Common Form
  const [name, setName] = useState("");
  const [banglaName, setBanglaName] = useState("");
  const [code, setCode] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [parentId, setParentId] = useState("NONE");

  const divisions = divRes?.data || [];
  const districts = distRes?.data || [];
  const areas = areaRes?.data || [];

  const divOptions = [
    { value: "NONE", label: "Select Division" },
    ...divisions.map((d) => ({ value: String(d.id), label: d.name })),
  ];

  const distOptions = [
    { value: "NONE", label: "Select District" },
    ...districts.map((d) => ({ value: String(d.id), label: d.name })),
  ];

  const resetForm = () => {
    setName("");
    setBanglaName("");
    setCode("");
    setLongitude("");
    setLatitude("");
    setParentId("NONE");
    setEditingItem(null);
  };

  const openCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEdit = (item: any) => {
    setEditingItem(item);
    setName(item.name || "");
    setBanglaName(item.banglaName || "");
    setCode(item.code || "");
    setLongitude(item.longitude || "");
    setLatitude(item.latitude || "");
    if (activeTab === "districts") setParentId(String(item.devision?.id || "NONE"));
    if (activeTab === "areas") setParentId(String(item.district?.id || "NONE"));
    setIsModalOpen(true);
  };

  const handleDelete = async (item: any) => {
    const tabLabel = activeTab.slice(0, -1);
    const isConfirmed = await confirm({
      title: `Delete ${tabLabel.charAt(0).toUpperCase() + tabLabel.slice(1)}?`,
      message: `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (!isConfirmed) return;
    try {
      if (activeTab === "divisions") await deleteDiv(item.id).unwrap();
      if (activeTab === "districts") await deleteDist(item.id).unwrap();
      if (activeTab === "areas") await deleteArea(item.id).unwrap();
      toast.success("Deleted successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Delete failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name is required");

    const payload: any = { name, banglaName, code, longitude, latitude };

    try {
      if (activeTab === "divisions") {
        if (editingItem) await updateDiv({ id: editingItem.id, data: payload }).unwrap();
        else await createDiv(payload).unwrap();
      } else if (activeTab === "districts") {
        if (parentId === "NONE") return toast.error("Select a division");
        payload.devision_id = Number(parentId);
        if (editingItem) await updateDist({ id: editingItem.id, data: payload }).unwrap();
        else await createDist(payload).unwrap();
      } else if (activeTab === "areas") {
        if (parentId === "NONE") return toast.error("Select a district");
        payload.district_id = Number(parentId);
        if (editingItem) await updateArea({ id: editingItem.id, data: payload }).unwrap();
        else await createArea(payload).unwrap();
      }
      toast.success("Saved successfully!");
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Save failed");
    }
  };

  const isLoading =
    (activeTab === "divisions" && divLoad) ||
    (activeTab === "districts" && distLoad) ||
    (activeTab === "areas" && areaLoad);

  return {
    role,
    activeTab,
    setActiveTab,
    divisions,
    districts,
    areas,
    divOptions,
    distOptions,
    isModalOpen,
    setIsModalOpen,
    editingItem,
    name,
    setName,
    banglaName,
    setBanglaName,
    code,
    setCode,
    longitude,
    setLongitude,
    latitude,
    setLatitude,
    parentId,
    setParentId,
    openCreate,
    openEdit,
    handleDelete,
    handleSubmit,
    isLoading,
  };
}
