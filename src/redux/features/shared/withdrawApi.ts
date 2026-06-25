import { baseApi } from '@/redux/api/baseApi';

export interface Withdraw {
  id: number;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  admin_note?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  vendor: {
    id: number;
    name: string;
    email: string;
    role?: string;
  };
  booking?: {
    id: number;
    total_price: number;
    date?: string;
    service?: { name: string; id: number };
    pkg?: { name: string; id: number };
    user?: { name: string; id: number };
  };
  getway?: {
    id: number;
    getway_type: string;
    info: any;
  };
}

export interface WithdrawApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface CreateWithdrawRequest {
  amount?: number;
  bookingId?: number;
  vendorId?: number;
  gatewayId?: number;
}

export interface UpdateWithdrawStatusRequest {
  status: 'pending' | 'approved' | 'rejected';
  admin_note?: string;
}

export const withdrawApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    requestWithdraw: builder.mutation<WithdrawApiResponse<Withdraw>, CreateWithdrawRequest>({
      query: (data) => ({
        url: '/withdraws/request',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Withdraw'],
    }),
    getAllWithdraws: builder.query<WithdrawApiResponse<Withdraw[]>, void>({
      query: () => '/withdraws',
      providesTags: ['Withdraw'],
    }),
    getWithdrawsByVendorId: builder.query<WithdrawApiResponse<Withdraw[]>, string | number>({
      query: (vendorId) => `/withdraws/vendor/${vendorId}`,
      providesTags: ['Withdraw'],
    }),
    getWithdrawById: builder.query<WithdrawApiResponse<Withdraw>, string | number>({
      query: (id) => `/withdraws/${id}`,
      providesTags: ['Withdraw'],
    }),
    updateWithdrawStatus: builder.mutation<
      WithdrawApiResponse<Withdraw>,
      { id: string | number; data: UpdateWithdrawStatusRequest }
    >({
      query: ({ id, data }) => ({
        url: `/withdraws/${id}/status`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Withdraw'],
    }),
    deleteWithdraw: builder.mutation<WithdrawApiResponse<void>, string | number>({
      query: (id) => ({
        url: `/withdraws/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Withdraw'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useRequestWithdrawMutation,
  useGetAllWithdrawsQuery,
  useGetWithdrawsByVendorIdQuery,
  useGetWithdrawByIdQuery,
  useUpdateWithdrawStatusMutation,
  useDeleteWithdrawMutation,
} = withdrawApi;
