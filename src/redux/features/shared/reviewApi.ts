import { baseApi } from '@/redux/api/baseApi';

export interface CreateReviewRequest {
  service_id: number;
  nested_service_id?: number;
  employee_id?: number;
  rating: number;
  comment?: string;
}

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReview: builder.mutation<{ statusCode: number; message: string; data: any }, CreateReviewRequest>({
      query: (body) => ({
        url: `/reviews`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Booking'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateReviewMutation,
} = reviewApi;
