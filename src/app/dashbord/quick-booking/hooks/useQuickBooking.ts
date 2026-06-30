"use client";

import { useState, useMemo } from "react";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";
import { useGetAllCategoriesQuery } from "@/redux/features/admin/category";
import { useGetAllServicesQuery } from "@/redux/features/admin/service";
import { useGetAllUsersQuery } from "@/redux/features/admin/user";
import { useCreateBookingMutation } from "@/redux/features/admin/booking";
import { ValidateCouponResult } from "@/redux/features/admin/coupon";

export function useQuickBooking() {
  const role = useAppSelector((state) => state.auth.role) || "superadmin";
  const authUser = useAppSelector((state) => state.auth.user);

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");

  const [selectedClientId, setSelectedClientId] = useState("");

  const [cartQuantities, setCartQuantities] = useState<Record<number, number>>({});
  const [appliedCoupon, setAppliedCoupon] = useState<ValidateCouponResult | null>(null);

  const [bookingDetails, setBookingDetails] = useState({
    date: "",
    time: "",
    location: "",
    notes: "",
  });

  const { data: categoriesRes, isLoading: loadingCategories } = useGetAllCategoriesQuery();
  const { data: servicesRes, isLoading: loadingServices } = useGetAllServicesQuery();
  const { data: usersRes } = useGetAllUsersQuery();
  const [createBooking, { isLoading: submitting }] = useCreateBookingMutation();

  const categories = (categoriesRes?.data || []) as any[];
  const services = (servicesRes?.data || []) as any[];
  const allUsers = (usersRes?.data || Array.isArray(usersRes) ? (usersRes?.data || usersRes) : []) as any[];

  const categoryOptions = categories.map((c: any) => ({ value: String(c.id), label: c.name }));
  const clientOptions = allUsers
    .filter((u: any) => u.role?.name === "Client" || u.role === "client" || u.role?.name === "User" || u.role === "user" || !u.role)
    .map((u: any) => ({ value: String(u.id), label: u.name }));

  // Filter services by selected category
  const filteredServices = useMemo(() => {
    if (!selectedCategoryId) return [];
    return services.filter((s: any) => String(s.category?.id) === selectedCategoryId);
  }, [services, selectedCategoryId]);

  const serviceOptions = filteredServices.map((s: any) => ({ value: String(s.id), label: s.name }));

  const currentService = useMemo(() => {
    return services.find((s: any) => String(s.id) === selectedServiceId) || null;
  }, [services, selectedServiceId]);

  // Display services logic (Nested services / subservices)
  const displayServices = useMemo(() => {
    const nested = currentService?.nestedServices;
    if (nested && nested.length > 0) {
      return nested.map((ns: any) => ({
        id: String(ns.id),
        title: ns.name,
        description: ns.description,
        price: ns.starting_price || ns.price,
        image: ns.image,
        subServices: ns.subServices || [],
      }));
    }
    return [];
  }, [currentService]);

  const cartItems = useMemo(
    () =>
      displayServices
        .flatMap((s: any) =>
          (s.subServices || []).map((sub: any) => ({
            ...sub,
            parentTitle: s.title,
            quantity: cartQuantities[sub.id] || 0,
          }))
        )
        .filter((sub: any) => sub.quantity > 0),
    [displayServices, cartQuantities]
  );

  const cartItemCount = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum: number, item: any) => sum + Number(item.price || 0) * item.quantity,
    0
  );
  const payableTotal = appliedCoupon ? appliedCoupon.final_price : cartTotal;

  const handleUpdateQuantity = (subId: number, delta: number) => {
    setCartQuantities((prev) => {
      const nextQty = (prev[subId] || 0) + delta;
      if (nextQty <= 0) {
        const { [subId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [subId]: nextQty };
    });
  };

  const handleRemoveFromCart = (subId: number) => {
    setCartQuantities((prev) => {
      const { [subId]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleClearCart = () => {
    setCartQuantities({});
    setAppliedCoupon(null);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDetails.date || !bookingDetails.location) {
      toast.error("Booking Date and Service Location are required!");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Please add at least one service to your cart.");
      return;
    }

    const subServiceItems = cartItems.map((item: any) => ({
      sub_service_id: item.id,
      quantity: item.quantity,
    }));

    try {
      const payload: any = {
        location: bookingDetails.location,
        notes: bookingDetails.notes || undefined,
        date: bookingDetails.date,
        time: bookingDetails.time || undefined,
        user_id: Number(selectedClientId || authUser?.id), // Admin can select client, otherwise defaults to agent
        vendor_id: Number(currentService?.vendor?.id || currentService?.vendor_id || 1),
        service_id: Number(selectedServiceId),
        sub_service_items: subServiceItems,
        coupon_code: appliedCoupon?.coupon?.code,
      };

      await createBooking(payload).unwrap();
      toast.success("Booking placed successfully!");

      // Reset
      setSelectedCategoryId("");
      setSelectedServiceId("");
      setSelectedClientId("");
      setCartQuantities({});
      setAppliedCoupon(null);
      setBookingDetails({ date: "", time: "", location: "", notes: "" });
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to place booking. Please try again.");
    }
  };

  return {
    role,
    loadingCategories,
    loadingServices,
    categoryOptions,
    serviceOptions,
    clientOptions,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedServiceId,
    setSelectedServiceId,
    selectedClientId,
    setSelectedClientId,
    displayServices,
    cartQuantities,
    cartItems,
    cartItemCount,
    cartTotal,
    payableTotal,
    appliedCoupon,
    setAppliedCoupon,
    bookingDetails,
    setBookingDetails,
    handleUpdateQuantity,
    handleRemoveFromCart,
    handleClearCart,
    submitting,
    handleBookingSubmit,
  };
}
