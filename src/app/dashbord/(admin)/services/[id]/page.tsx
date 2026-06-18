"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetServiceByIdQuery } from "@/redux/features/admin/service";
import { ArrowLeft, Tag, Globe, User, Users, Briefcase, Wrench, Package } from "lucide-react";
import Image from "next/image";

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: serviceRes, isLoading, error } = useGetServiceByIdQuery(id, {
    skip: !id,
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center">
        <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-400 font-medium">Loading service details...</p>
      </div>
    );
  }

  const service = serviceRes?.data;

  if (error || !service) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center">
        <h3 className="text-xl font-bold text-slate-800">Service Not Found</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-sm mb-6">
          The service you are looking for does not exist or has been deleted.
        </p>
        <button
          onClick={() => router.push("/dashbord/services")}
          className="bg-brand-primary hover:bg-brand-dark text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200 pb-12">
      {/* Header Navigation */}
      <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
        <button
          onClick={() => router.push("/dashbord/services")}
          className="p-2 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700 rounded-xl transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Service Details</h1>
          <p className="text-sm text-slate-500">Overview of {service.name}</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Image & Basic Info */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="h-48 w-full bg-slate-100 relative">
              {service.image ? (
                <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <Wrench size={48} />
                </div>
              )}
            </div>
            <div className="p-6 text-center">
              <h2 className="text-2xl font-bold text-slate-900">{service.name}</h2>
              {service.subtitle && <p className="text-slate-500 font-medium text-sm mt-1">{service.subtitle}</p>}
              <div className="mt-4 inline-flex items-center gap-1.5 bg-slate-50 text-slate-600 font-mono font-bold text-xs px-3 py-1.5 rounded-xl border border-slate-200/60">
                <Globe size={14} /> /{service.slug}
              </div>
            </div>
          </div>

          {/* Quick Stats / Relations */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 space-y-4">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Properties</h3>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
                <Tag size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</p>
                <p className="font-semibold text-slate-700 text-sm">{service.category?.name || "Unassigned"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                <User size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vendor</p>
                <p className="font-semibold text-slate-700 text-sm">{service.vendor?.name || "No Vendor"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Descriptions & Lists */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Wrench size={18} className="text-brand-primary" /> Service Description
            </h3>
            {service.description ? (
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{service.description}</p>
            ) : (
              <p className="text-slate-400 text-sm italic">No description provided.</p>
            )}
          </div>

          {/* Assigned Employees */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Users size={18} className="text-brand-primary" /> Assigned Employees
            </h3>
            {service.employees && service.employees.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.employees.map((emp: any) => (
                  <div key={emp.id} className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 bg-white shadow-sm border border-slate-200 text-slate-700 font-bold rounded-xl flex items-center justify-center shrink-0 text-sm">
                      {emp.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-slate-900 text-sm truncate">{emp.name}</p>
                      <p className="text-xs text-slate-500 truncate">{emp.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center bg-slate-50 border border-slate-100 rounded-2xl border-dashed">
                <p className="text-sm text-slate-400 font-medium">No employees assigned to this service yet.</p>
              </div>
            )}
          </div>

          {/* Packages & Nested Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Package size={18} className="text-brand-primary" /> Packages
              </h3>
              {service.packages && service.packages.length > 0 ? (
                <ul className="space-y-2">
                  {service.packages.map((pkg: any) => (
                    <li key={pkg.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <span className="text-sm font-semibold text-slate-700">{pkg.name}</span>
                      <span className="text-xs font-bold bg-white px-2 py-1 rounded-lg border border-slate-200 text-brand-primary">৳{pkg.price}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-400 italic">No packages available.</p>
              )}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Briefcase size={18} className="text-brand-primary" /> Nested Services
              </h3>
              {service.nestedServices && service.nestedServices.length > 0 ? (
                <ul className="space-y-2">
                  {service.nestedServices.map((ns: any) => (
                    <li key={ns.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <span className="text-sm font-semibold text-slate-700">{ns.name}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-400 italic">No nested services.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
