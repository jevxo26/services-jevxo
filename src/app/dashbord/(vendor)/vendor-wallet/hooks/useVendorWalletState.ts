"use client";

import { useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import {
  useGetWithdrawsByVendorIdQuery,
  useRequestWithdrawMutation,
  Withdraw,
} from "@/redux/features/shared/withdrawApi";
import {
  useGetGetwaysByUserIdQuery,
  useCreateGetwayMutation,
  useDeleteGetwayMutation,
  Getway,
} from "@/redux/features/shared/getwayApi";
import { useGetAllBookingsQuery } from "@/redux/features/admin/booking";
import { useGetAllUsersQuery } from "@/redux/features/admin/user";
import { toast } from "sonner";
import { useConfirm } from "@/context/ConfirmDialogContext";

export function useVendorWalletState() {
  const confirm = useConfirm();
  const { user, role, isAuthenticated } = useAppSelector((state) => state.auth);
  const vendorId = user?.id ? Number(user.id) : 1;
  const normalizedRole = typeof role === "string" ? role.toLowerCase() : "";

  const {
    data: apiWithdrawsRes,
    isLoading: isWithdrawsLoading,
    refetch: refetchWithdraws,
  } = useGetWithdrawsByVendorIdQuery(vendorId);

  const { data: apiBookingsRes, isLoading: isBookingsLoading } = useGetAllBookingsQuery(undefined);

  const { data: usersRes } = useGetAllUsersQuery();
  const allUsers = usersRes?.data || (Array.isArray(usersRes) ? usersRes : []);
  const currentUser = allUsers.find((u: any) => u.id === vendorId || u._id === vendorId) || user;

  const [requestWithdrawMut, { isLoading: isRequesting }] = useRequestWithdrawMutation();

  const { data: gatewaysRes, isLoading: isGatewaysLoading, refetch: refetchGateways } = useGetGetwaysByUserIdQuery(vendorId);
  const [createGatewayMut, { isLoading: isCreatingGateway }] = useCreateGetwayMutation();
  const [deleteGatewayMut] = useDeleteGetwayMutation();
  const gateways: Getway[] = gatewaysRes || [];

  // State for Withdraw Modal
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [selectedGatewayId, setSelectedGatewayId] = useState<number | null>(null);

  // State for Add Gateway Modal
  const [isAddGatewayModalOpen, setIsAddGatewayModalOpen] = useState(false);
  const [newGatewayType, setNewGatewayType] = useState("bkash");
  const [newGatewayInfo, setNewGatewayInfo] = useState("");

  const withdraws: Withdraw[] =
    apiWithdrawsRes?.data || (Array.isArray(apiWithdrawsRes) ? apiWithdrawsRes : []);

  const bookings = apiBookingsRes?.data || (Array.isArray(apiBookingsRes) ? apiBookingsRes : []);

  const withdrawableBookings = bookings.filter((b: any) => {
    const isVendor =
      b.vendor?.id?.toString() === vendorId.toString() || b.vendor_id?.toString() === vendorId.toString();
    const isAgent = b.agent?.id?.toString() === vendorId.toString();

    if (normalizedRole === "agent") {
      if (!isAgent) return false;
    } else {
      if (!isVendor) return false;
    }

    if (b.status !== "completed") return false;
    const isAlreadyRequested = withdraws.some((w: Withdraw) => w.booking?.id?.toString() === b.id?.toString());
    return !isAlreadyRequested;
  });

  const handleRequestWithdrawClick = (bookingId: number) => {
    if (gateways.length === 0) {
      toast.error("Please add a payment method first.");
      return;
    }
    setSelectedBookingId(bookingId);
    setSelectedGatewayId(gateways[0].id);
    setIsWithdrawModalOpen(true);
  };

  const handleRequestWithdrawConfirm = async () => {
    if (!selectedBookingId || !selectedGatewayId) return;
    try {
      await requestWithdrawMut({
        bookingId: selectedBookingId,
        vendorId,
        gatewayId: selectedGatewayId,
      }).unwrap();
      toast.success("Withdrawal requested successfully!");
      setIsWithdrawModalOpen(false);
      refetchWithdraws();
    } catch (err: any) {
      toast.error(err.data?.message || err.message || "Failed to request withdrawal");
    }
  };

  const handleAddGateway = async () => {
    try {
      let parsedInfo = {};
      try {
        parsedInfo = JSON.parse(newGatewayInfo || "{}");
      } catch (e) {
        parsedInfo = { details: newGatewayInfo };
      }

      await createGatewayMut({
        userId: vendorId,
        getway_type: newGatewayType,
        info: parsedInfo,
      }).unwrap();
      toast.success("Payment method added!");
      setNewGatewayInfo("");
      setIsAddGatewayModalOpen(false);
      refetchGateways();
    } catch (err: any) {
      toast.error(err.data?.message || err.message || "Failed to add payment method");
    }
  };

  const handleDeleteGateway = async (id: number) => {
    const isConfirmed = await confirm({
      title: "Delete Payment Method?",
      message: "Are you sure you want to delete this payment method? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (!isConfirmed) return;
    try {
      await deleteGatewayMut(id).unwrap();
      toast.success("Payment method deleted");
      refetchGateways();
    } catch (err: any) {
      toast.error(err.data?.message || err.message || "Failed to delete");
    }
  };

  // Summary stats
  const totalPending = withdraws
    .filter((w) => w.status === "pending")
    .reduce((sum, w) => sum + Number(w.amount || 0), 0);
  const totalWithdrawn = withdraws
    .filter((w) => w.status === "approved")
    .reduce((sum, w) => sum + Number(w.amount || 0), 0);
  const walletBalance = currentUser?.wallet_balance || 0;
  const commissionPct = currentUser?.commission_percentage || 0;

  return {
    vendorId,
    normalizedRole,
    isAuthenticated,
    isWithdrawsLoading,
    refetchWithdraws,
    isBookingsLoading,
    isGatewaysLoading,
    gateways,
    isWithdrawModalOpen,
    setIsWithdrawModalOpen,
    selectedGatewayId,
    setSelectedGatewayId,
    isAddGatewayModalOpen,
    setIsAddGatewayModalOpen,
    newGatewayType,
    setNewGatewayType,
    newGatewayInfo,
    setNewGatewayInfo,
    withdraws,
    withdrawableBookings,
    totalPending,
    totalWithdrawn,
    walletBalance,
    commissionPct,
    handleRequestWithdrawClick,
    handleRequestWithdrawConfirm,
    handleAddGateway,
    handleDeleteGateway,
    isRequesting,
    isCreatingGateway,
  };
}
