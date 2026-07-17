"use client";

import { ShieldAlert, PlusCircle, MapPin } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import LocationModal from "./components/LocationModal";
import LocationTable from "./components/LocationTable";
import { useLocationState } from "./hooks/useLocationState";

export default function AdminLocationsPage() {
  const {
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
  } = useLocationState();

  const lang = useAppSelector((state) => state.lang.value);

  if (role !== "superadmin") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center">
        <div className="p-4 bg-[#EEF2FF] rounded-2xl text-[#4F46E5] mb-4">
          <ShieldAlert size={48} />
        </div>
        <h3 className="text-xl font-bold text-slate-800">{lang === "bn" ? "অ্যাক্সেস অস্বীকৃত" : "Access Denied"}</h3>
        <p className="text-sm text-slate-500 mt-2">{lang === "bn" ? "শুধুমাত্র সুপার অ্যাডমিন লোকেশন ম্যানেজ করতে পারেন।" : "Only Super Admins can manage locations."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#EEF2FF] text-[#4F46E5] rounded-2xl">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">{lang === "bn" ? "লোকেশনসমূহ" : "Locations"}</h1>
            <p className="text-xs text-slate-400 mt-0.5">{lang === "bn" ? "বিভাগ, জেলা এবং এলাকা ম্যানেজ করুন" : "Manage Divisions, Districts, and Areas"}</p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="bg-brand-primary text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2"
        >
          <PlusCircle size={18} /> {lang === "bn"
            ? activeTab === "divisions" ? "বিভাগ যোগ করুন" : activeTab === "districts" ? "জেলা যোগ করুন" : "এলাকা যোগ করুন"
            : `Add ${activeTab === "divisions" ? "Division" : activeTab === "districts" ? "District" : "Area"}`}
        </button>
      </div>

      <div className="flex gap-4 border-b border-slate-200">
        {(["divisions", "districts", "areas"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-1 font-bold capitalize transition-all border-b-2 ${
              activeTab === tab
                ? "border-brand-primary text-brand-primary"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            {lang === "bn"
              ? tab === "divisions" ? "বিভাগ" : tab === "districts" ? "জেলা" : "এলাকা"
              : tab}
          </button>
        ))}
      </div>

      <div>
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-[#4F46E5] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <LocationTable
            activeTab={activeTab}
            divisions={divisions}
            districts={districts}
            areas={areas}
            openEdit={openEdit}
            handleDelete={handleDelete}
          />
        )}
      </div>

      {isModalOpen && (
        <LocationModal
          editingItem={editingItem}
          activeTab={activeTab}
          setIsModalOpen={setIsModalOpen}
          handleSubmit={handleSubmit}
          name={name}
          setName={setName}
          banglaName={banglaName}
          setBanglaName={setBanglaName}
          code={code}
          setCode={setCode}
          latitude={latitude}
          setLatitude={setLatitude}
          longitude={longitude}
          setLongitude={setLongitude}
          parentId={parentId}
          setParentId={setParentId}
          divOptions={divOptions}
          distOptions={distOptions}
        />
      )}
    </div>
  );
}
