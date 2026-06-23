"use client";

import { useAppSelector } from "@/redux/hooks";
import { ShieldAlert, Trash2, PlusCircle, Edit2, X, MapPin } from "lucide-react";
import { useState } from "react";
import { CustomTable } from "@/components/ui/table";
import type { TableAction } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { CustomSelect } from "@/components/ui/select";
import { toast } from "sonner";

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
  Devision,
  District,
  Area,
} from "@/redux/features/admin/location";

export default function AdminLocationsPage() {
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
    ...divisions.map(d => ({ value: String(d.id), label: d.name }))
  ];

  const distOptions = [
    { value: "NONE", label: "Select District" },
    ...districts.map(d => ({ value: String(d.id), label: d.name }))
  ];

  if (role !== "superadmin") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center">
        <div className="p-4 bg-[#FFF8F7] rounded-2xl text-[#FF7C71] mb-4"><ShieldAlert size={48} /></div>
        <h3 className="text-xl font-bold text-slate-800">Access Denied</h3>
        <p className="text-sm text-slate-500 mt-2">Only Super Admins can manage locations.</p>
      </div>
    );
  }

  const resetForm = () => {
    setName(""); setBanglaName(""); setCode(""); setLongitude(""); setLatitude(""); setParentId("NONE"); setEditingItem(null);
  };

  const openCreate = () => { resetForm(); setIsModalOpen(true); };
  
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
    if (!confirm(`Delete this ${activeTab.slice(0, -1)}?`)) return;
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

  const getColumns = () => {
    const cols: any = [
      { key: "name", header: "Name (EN)", render: (i: any) => <span className="font-bold">{i.name}</span> },
      { key: "banglaName", header: "Name (BN)", render: (i: any) => i.banglaName || "—" },
      { key: "code", header: "Code", render: (i: any) => i.code || "—" },
      { key: "coords", header: "Coordinates", render: (i: any) => <span className="text-xs text-slate-500">{i.latitude || '—'}, {i.longitude || '—'}</span> },
    ];
    if (activeTab === "districts") {
      cols.splice(2, 0, { key: "parent", header: "Division", render: (i: any) => i.devision?.name || "—" });
    }
    if (activeTab === "areas") {
      cols.splice(2, 0, { key: "parent", header: "District", render: (i: any) => i.district?.name || "—" });
    }
    return cols;
  };

  const actions: TableAction<any>[] = [
    { label: "Edit", icon: Edit2, onClick: openEdit, variant: "secondary" },
    { label: "Delete", icon: Trash2, onClick: handleDelete, variant: "destructive" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Locations</h1>
          <p className="text-slate-500 mt-1">Manage Divisions, Districts, and Areas</p>
        </div>
        <button onClick={openCreate} className="bg-brand-primary text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2">
          <PlusCircle size={18} /> Add {activeTab === "divisions" ? "Division" : activeTab === "districts" ? "District" : "Area"}
        </button>
      </div>

      <div className="flex gap-4 border-b border-slate-200">
        {(["divisions", "districts", "areas"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-1 font-bold capitalize transition-all border-b-2 ${activeTab === tab ? "border-brand-primary text-brand-primary" : "border-transparent text-slate-400 hover:text-slate-600"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div>
        {(activeTab === "divisions" && divLoad) || (activeTab === "districts" && distLoad) || (activeTab === "areas" && areaLoad) ? (
           <div className="py-20 text-center"><div className="w-8 h-8 border-4 border-[#FF7C71] border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : (
          <CustomTable 
            columns={getColumns()} 
            data={activeTab === "divisions" ? divisions : activeTab === "districts" ? districts : areas} 
            actions={actions} 
            searchKey="name" 
            searchPlaceholder={`Search ${activeTab}...`} 
            pageSize={15} 
          />
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingItem ? "Edit" : "Create"} {activeTab.slice(0, -1)}</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500">Name (EN) *</label>
                  <Input value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500">Name (BN)</label>
                  <Input value={banglaName} onChange={e => setBanglaName(e.target.value)} />
                </div>
              </div>
              
              {activeTab === "districts" && (
                <div>
                  <label className="text-xs font-bold text-slate-500">Division *</label>
                  <CustomSelect options={divOptions} value={parentId} onChange={setParentId} />
                </div>
              )}
              {activeTab === "areas" && (
                <div>
                  <label className="text-xs font-bold text-slate-500">District *</label>
                  <CustomSelect options={distOptions} value={parentId} onChange={setParentId} />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-500">Code</label>
                <Input value={code} onChange={e => setCode(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500">Latitude</label>
                  <Input value={latitude} onChange={e => setLatitude(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500">Longitude</label>
                  <Input value={longitude} onChange={e => setLongitude(e.target.value)} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-bold text-slate-500">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-brand-primary text-white font-bold rounded-xl">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
