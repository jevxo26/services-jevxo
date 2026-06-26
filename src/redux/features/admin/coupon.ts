import { baseApi } from '@/redux/api/baseApi';

export type CouponDiscountType = 'percentage' | 'fixed';
export type CouponApplicableTo = 'all' | 'service' | 'package';

export interface Coupon {
  id: number;
  code: string;
  description?: string;
  discount_type: CouponDiscountType;
  discount_value: number;
  max_discount?: number;
  min_order_amount?: number;
  usage_limit?: number;
  used_count: number;
  valid_from?: string;
  valid_until?: string;
  is_active: boolean;
  applicable_to: CouponApplicableTo;
  service?: { id: number; name: string };
  pkg?: { id: number; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface CouponApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface CreateCouponRequest {
  code: string;
  description?: string;
  discount_type: CouponDiscountType;
  discount_value: number;
  max_discount?: number;
  min_order_amount?: number;
  usage_limit?: number;
  valid_from?: string;
  valid_until?: string;
  is_active?: boolean;
  applicable_to?: CouponApplicableTo;
  service_id?: number;
  package_id?: number;
}

export interface ValidateCouponRequest {
  code: string;
  subtotal: number;
  service_id?: number;
  package_id?: number;
}

export interface ValidateCouponResult {
  coupon: Coupon;
  subtotal: number;
  discount_amount: number;
  final_price: number;
}

export const couponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCoupons: builder.query<CouponApiResponse<Coupon[]>, void>({
      query: () => '/coupons',
      providesTags: ['Coupon'],
    }),
    getCouponById: builder.query<CouponApiResponse<Coupon>, string | number>({
      query: (id) => `/coupons/${id}`,
      providesTags: ['Coupon'],
    }),
    createCoupon: builder.mutation<CouponApiResponse<Coupon>, CreateCouponRequest>({
      query: (data) => ({
        url: '/coupons',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Coupon'],
    }),
    updateCoupon: builder.mutation<
      CouponApiResponse<Coupon>,
      { id: string | number; data: Partial<CreateCouponRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/coupons/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Coupon'],
    }),
    deleteCoupon: builder.mutation<CouponApiResponse<void>, string | number>({
      query: (id) => ({
        url: `/coupons/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Coupon'],
    }),
    validateCoupon: builder.mutation<
      CouponApiResponse<ValidateCouponResult>,
      ValidateCouponRequest
    >({
      query: (data) => ({
        url: '/coupons/validate',
        method: 'POST',
        body: data,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllCouponsQuery,
  useGetCouponByIdQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useValidateCouponMutation,
} = couponApi;
