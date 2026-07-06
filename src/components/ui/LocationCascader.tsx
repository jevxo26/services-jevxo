"use client";

import React, { useEffect, useState } from "react";
import Select from "react-select";
import {
  useGetAllDevisionsQuery,
  useGetAllDistrictsQuery,
  useGetAllAreasQuery,
} from "@/redux/features/admin/location";

interface LocationCascaderProps {
  selectedDevisionId?: string | number;
  selectedDistrictId?: string | number;
  selectedAreaId?: string | number;
  onDevisionChange?: (id: string) => void;
  onDistrictChange?: (id: string) => void;
  onAreaChange?: (id: string) => void;
  isDisabled?: boolean;
}

export function LocationCascader({
  selectedDevisionId,
  selectedDistrictId,
  selectedAreaId,
  onDevisionChange,
  onDistrictChange,
  onAreaChange,
  isDisabled = false,
}: LocationCascaderProps) {
  const { data: divRes, isLoading: isLoadingDivisions } = useGetAllDevisionsQuery();
  const { data: distRes, isLoading: isLoadingDistricts } = useGetAllDistrictsQuery();
  const { data: areaRes, isLoading: isLoadingAreas } = useGetAllAreasQuery();

  const divisions = divRes?.data || [];
  const allDistricts = distRes?.data || [];
  const allAreas = areaRes?.data || [];

  // Local state to manage selections if they are not passed from parent
  const [localDevision, setLocalDevision] = useState<string>(selectedDevisionId?.toString() || "");
  const [localDistrict, setLocalDistrict] = useState<string>(selectedDistrictId?.toString() || "");
  const [localArea, setLocalArea] = useState<string>(selectedAreaId?.toString() || "");

  // Sync external props to local state
  useEffect(() => {
    if (selectedDevisionId !== undefined) setLocalDevision(selectedDevisionId.toString());
    if (selectedDistrictId !== undefined) setLocalDistrict(selectedDistrictId.toString());
    if (selectedAreaId !== undefined) setLocalArea(selectedAreaId.toString());
  }, [selectedDevisionId, selectedDistrictId, selectedAreaId]);

  const activeDevision = selectedDevisionId !== undefined ? selectedDevisionId.toString() : localDevision;
  const activeDistrict = selectedDistrictId !== undefined ? selectedDistrictId.toString() : localDistrict;
  const activeArea = selectedAreaId !== undefined ? selectedAreaId.toString() : localArea;

  const filteredDistricts = allDistricts.filter(
    (d: any) => d.devision?.id?.toString() === activeDevision
  );
  const filteredAreas = allAreas.filter(
    (a: any) => a.district?.id?.toString() === activeDistrict
  );

  const divisionOptions = divisions.map((d: any) => ({ value: d.id.toString(), label: d.name }));
  const districtOptions = filteredDistricts.map((d: any) => ({ value: d.id.toString(), label: d.name }));
  const areaOptions = filteredAreas.map((a: any) => ({ value: a.id.toString(), label: a.name }));

  const currentDevisionOption = divisionOptions.find(o => o.value === activeDevision) || null;
  const currentDistrictOption = districtOptions.find(o => o.value === activeDistrict) || null;
  const currentAreaOption = areaOptions.find(o => o.value === activeArea) || null;

  const handleDevisionChange = (selectedOption: any) => {
    const val = selectedOption?.value || "";
    if (selectedDevisionId === undefined) {
      setLocalDevision(val);
      setLocalDistrict("");
      setLocalArea("");
    }
    if (onDevisionChange) onDevisionChange(val);
    if (onDistrictChange) onDistrictChange("");
    if (onAreaChange) onAreaChange("");
  };

  const handleDistrictChange = (selectedOption: any) => {
    const val = selectedOption?.value || "";
    if (selectedDistrictId === undefined) {
      setLocalDistrict(val);
      setLocalArea("");
    }
    if (onDistrictChange) onDistrictChange(val);
    if (onAreaChange) onAreaChange("");
  };

  const handleAreaChange = (selectedOption: any) => {
    const val = selectedOption?.value || "";
    if (selectedAreaId === undefined) {
      setLocalArea(val);
    }
    if (onAreaChange) onAreaChange(val);
  };

  const selectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      borderRadius: "0.75rem", // rounded-xl
      borderColor: state.isFocused ? "#fda4af" : "#e2e8f0", // rose-300 or slate-200
      backgroundColor: "#f8fafc", // slate-50
      padding: "2px",
      fontSize: "0.875rem", // text-sm
      fontWeight: "500", // font-medium
      boxShadow: state.isFocused ? "0 0 0 2px #FFF0EB" : "none", // ring-rose-100
      "&:hover": {
        borderColor: state.isFocused ? "#fda4af" : "#cbd5e1"
      }
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? "#f43f5e" : state.isFocused ? "#FFF0EB" : "white", // rose-500, rose-100
      color: state.isSelected ? "white" : "#0f172a", // slate-900
      fontSize: "0.875rem",
      "&:active": {
        backgroundColor: "#e11d48", // rose-600
      }
    })
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">
          Division
        </label>
        <Select
          options={divisionOptions}
          value={currentDevisionOption}
          onChange={handleDevisionChange}
          isDisabled={isDisabled || isLoadingDivisions}
          isLoading={isLoadingDivisions}
          placeholder="Select Division"
          isClearable
          styles={selectStyles}
          instanceId="select-devision"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">
          District
        </label>
        <Select
          options={districtOptions}
          value={currentDistrictOption}
          onChange={handleDistrictChange}
          isDisabled={isDisabled || !activeDevision || isLoadingDistricts}
          isLoading={isLoadingDistricts}
          placeholder="Select District"
          isClearable
          styles={selectStyles}
          instanceId="select-district"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">
          Area
        </label>
        <input
          type="text"
          value={activeArea}
          onChange={(e) => {
            const val = e.target.value;
            if (selectedAreaId === undefined) {
              setLocalArea(val);
            }
            if (onAreaChange) onAreaChange(val);
          }}
          disabled={isDisabled || !activeDistrict}
          placeholder="Type Area Name"
          className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-[7px] text-sm text-slate-900 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all font-medium h-[38px]"
        />
      </div>
    </div>
  );
}
