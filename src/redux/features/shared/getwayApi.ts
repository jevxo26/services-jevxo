import { baseApi } from '@/redux/api/baseApi';

export interface Getway {
  id: number;
  getway_type: string;
  info: any;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGetwayRequest {
  userId: number;
  getway_type: string;
  info: any;
}

export const getwayApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGetwaysByUserId: builder.query<Getway[], number>({
      query: (userId) => `/getways/user/${userId}`,
      providesTags: ['Getways'] as any,
    }),
    createGetway: builder.mutation<any, CreateGetwayRequest>({
      query: (data) => ({
        url: '/getways',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Getways'] as any,
    }),
    deleteGetway: builder.mutation<any, number>({
      query: (id) => ({
        url: `/getways/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Getways'] as any,
    }),
  }),
});

export const {
  useGetGetwaysByUserIdQuery,
  useCreateGetwayMutation,
  useDeleteGetwayMutation,
} = getwayApi;
