"use client";

import { useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import {
  ShieldAlert,
  Trash2,
  PlusCircle,
  Edit2,
  X,
  Tag,
  Percent,
} from "lucide-react";
import { CustomTable } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CustomSelect } from "@/components/ui/select";
import { toast } from "sonner";
import {
  useGetAllCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  Coupon,
  CouponApplicableTo,
  CouponDiscountType,
} from "@/redux/features/admin/coupon";
import { useGetAllServicesQuery } from "@/redux/features/admin/service";

const defaultForm = {
  code: "",
  description: "",
  discount_type: "percentage" as CouponDiscountType,
  discount_value: "",
  max_discount: "",
  min_order_amount: "0",
  usage_limit: "",
  valid_from: "",
  valid_until: "",
  is_active: true,
  applicable_to: "all" as CouponApplicableTo,
  service_id: "",
  package_id: "",
};

export default function CouponsManagementPage() {
  const role = useAppSelector((state) => state.auth.role) || "superadmin";
  const { data: couponsRes, isLoading } = useGetAllCouponsQuery();
  const { data: servicesRes } = useGetAllServicesQuery();
  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();
  const [deleteCoupon] = useDeleteCouponMutation();

  const coupons = couponsRes?.data || [];
  const services = servicesRes?.data || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);
  const [form, setForm] = useState(defaultForm);

  const selectedService = services.find(
    (s: any) => String(s.id) === form.service_id
  );
  const packageOptions =
    selectedService?.packages?.map((p: any) => ({
      value: String(p.id),
      label: p.name,
    })) || [];

  const openCreate = () => {
    setEditingCoupon(null);
    setForm(defaultForm);
    setIsModalOpen(true);
  };

  const openEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setForm({
      code: coupon.code,
      description: coupon.description || "",
      discount_type: coupon.discount_type,
      discount_value: String(coupon.discount_value),
      max_discount: coupon.max_discount ? String(coupon.max_discount) : "",
      min_order_amount: String(coupon.min_order_amount || 0),
      usage_limit: coupon.usage_limit ? String(coupon.usage_limit) : "",
      valid_from: coupon.valid_from || "",
      valid_until: coupon.valid_until || "",
      is_active: coupon.is_active,
      applicable_to: coupon.applicable_to,
      service_id: coupon.service?.id ? String(coupon.service.id) : "",
      package_id: coupon.pkg?.id ? String(coupon.pkg.id) : "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim()) {
      toast.error("Coupon code is required");
      return;
    }
    if (!form.discount_value || Number(form.discount_value) <= 0) {
      toast.error("Discount value must be greater than 0");
      return;
    }

    const payload: any = {
      code: form.code.trim().toUpperCase(),
      description: form.description.trim() || undefined,
      discount_type: form.discount_type,
      discount_value: Number(form.discount_value),
      max_discount: form.max_discount ? Number(form.max_discount) : undefined,
      min_order_amount: Number(form.min_order_amount || 0),
      usage_limit: form.usage_limit ? Number(form.usage_limit) : undefined,
      valid_from: form.valid_from || undefined,
      valid_until: form.valid_until || undefined,
      is_active: form.is_active,
      applicable_to: form.applicable_to,
      service_id:
        form.applicable_to === "service" && form.service_id
          ? Number(form.service_id)
          : undefined,
      package_id:
        form.applicable_to === "package" && form.package_id
          ? Number(form.package_id)
          : undefined,
    };

    try {
      if (editingCoupon) {
        await updateCoupon({ id: editingCoupon.id, data: payload }).unwrap();
        toast.success("Coupon updated successfully");
      } else {
        await createCoupon(payload).unwrap();
        toast.success("Coupon created successfully");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save coupon");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCoupon(deleteTarget.id).unwrap();
      toast.success("Coupon deleted successfully");
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete coupon");
    }
  };

  if (role !== "superadmin") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center">
        <ShieldAlert size={48} className="text-[#FF6014] mb-4" />
        <h3 className="text-xl font-bold text-slate-800">Access Denied</h3>
        <p className="text-sm text-slate-500 mt-2">Only superadmin can manage coupons.</p>
      </div>
    );
  }

  const columns = [
    {
      key: "code",
      header: "Code",
      render: (item: Coupon) => (
        <span className="font-black text-slate-800 tracking-wide">{item.code}</span>
      ),
    },
    {
      key: "discount",
      header: "Discount",
      render: (item: Coupon) => (
        <span className="font-bold text-[#FF6014]">
          {item.discount_type === "percentage"
            ? `${item.discount_value}%`
            : `৳${Number(item.discount_value).toLocaleString()}`}
        </span>
      ),
    },
    {
      key: "usage",
      header: "Usage",
      render: (item: Coupon) => (
        <span className="text-xs font-semibold text-slate-600">
          {item.used_count}
          {item.usage_limit ? ` / ${item.usage_limit}` : " / ∞"}
        </span>
      ),
    },
    {
      key: "validity",
      header: "Validity",
      render: (item: Coupon) => (
        <span className="text-xs text-slate-500 font-medium">
          {item.valid_from || "—"} → {item.valid_until || "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: Coupon) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
            item.is_active
              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
              : "bg-slate-100 text-slate-500 border border-slate-200"
          }`}
        >
          {item.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: Coupon) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEdit(item)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => setDeleteTarget(item)}
            className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-500 hover:text-white text-rose-500"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#FFF8F4] text-[#FF6014] rounded-2xl">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Manage Coupons</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Create promo codes and discount coupons for bookings.
            </p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="bg-[#FF6014] hover:bg-[#E0530A] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md flex items-center gap-2"
        >
          <PlusCircle size={18} />
          Create Coupon
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center text-slate-400 text-sm">Loading coupons...</div>
        ) : coupons.length === 0 ? (
          <div className="py-20 text-center">
            <Percent size={40} className="mx-auto text-slate-200 mb-3" />
            <p className="text-slate-500 text-sm">No coupons created yet.</p>
          </div>
        ) : (
          <CustomTable columns={columns} data={coupons} />
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-slate-800">
                {editingCoupon ? "Edit Coupon" : "Create Coupon"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Coupon Code *
                  </label>
                  <Input
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. SAVE20"
                    required
                  />
                </div>
                <CustomSelect
                  label="Discount Type *"
                  options={[
                    { value: "percentage", label: "Percentage (%)" },
                    { value: "fixed", label: "Fixed Amount (৳)" },
                  ]}
                  value={form.discount_type}
                  onChange={(val) =>
                    setForm({ ...form, discount_type: val as CouponDiscountType })
                  }
                />
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Discount Value *
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={form.discount_value}
                    onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
                    required
                  />
                </div>
                {form.discount_type === "percentage" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Max Discount (৳)
                    </label>
                    <Input
                      type="number"
                      min={0}
                      value={form.max_discount}
                      onChange={(e) => setForm({ ...form, max_discount: e.target.value })}
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Min Order Amount (৳)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={form.min_order_amount}
                    onChange={(e) => setForm({ ...form, min_order_amount: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Usage Limit
                  </label>
                  <Input
                    type="number"
                    min={1}
                    value={form.usage_limit}
                    onChange={(e) => setForm({ ...form, usage_limit: e.target.value })}
                    placeholder="Leave empty for unlimited"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Valid From
                  </label>
                  <Input
                    type="date"
                    value={form.valid_from}
                    onChange={(e) => setForm({ ...form, valid_from: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Valid Until
                  </label>
                  <Input
                    type="date"
                    value={form.valid_until}
                    onChange={(e) => setForm({ ...form, valid_until: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Description
                </label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Optional description for internal reference"
                  className="rounded-2xl border border-slate-200/80 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm"
                />
              </div>

              <CustomSelect
                label="Applicable To"
                options={[
                  { value: "all", label: "All Bookings" },
                  { value: "service", label: "Specific Service" },
                  { value: "package", label: "Specific Package" },
                ]}
                value={form.applicable_to}
                onChange={(val) =>
                  setForm({
                    ...form,
                    applicable_to: val as CouponApplicableTo,
                    service_id: "",
                    package_id: "",
                  })
                }
              />

              {form.applicable_to === "service" && (
                <CustomSelect
                  label="Select Service"
                  options={services.map((s: any) => ({
                    value: String(s.id),
                    label: s.name,
                  }))}
                  value={form.service_id}
                  onChange={(val) => setForm({ ...form, service_id: val })}
                  placeholder="Choose service"
                />
              )}

              {form.applicable_to === "package" && (
                <>
                  <CustomSelect
                    label="Select Service (for packages)"
                    options={services.map((s: any) => ({
                      value: String(s.id),
                      label: s.name,
                    }))}
                    value={form.service_id}
                    onChange={(val) =>
                      setForm({ ...form, service_id: val, package_id: "" })
                    }
                    placeholder="Choose service"
                  />
                  <CustomSelect
                    label="Select Package"
                    options={packageOptions}
                    value={form.package_id}
                    onChange={(val) => setForm({ ...form, package_id: val })}
                    placeholder="Choose package"
                    disabled={!form.service_id}
                  />
                </>
              )}

              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="rounded border-slate-300 text-[#FF6014] focus:ring-[#FF6014]"
                />
                Active coupon
              </label>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="px-6 py-2.5 text-sm font-bold text-white bg-[#FF6014] hover:bg-[#E0530A] rounded-xl disabled:opacity-70"
                >
                  {editingCoupon ? "Update Coupon" : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-slate-800">Delete Coupon?</h3>
            <p className="text-sm text-slate-500 mt-2">
              Are you sure you want to delete <strong>{deleteTarget.code}</strong>?
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-sm font-bold text-slate-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
