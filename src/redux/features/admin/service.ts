import { baseApi } from '@/redux/api/baseApi';

export interface Service {
  id: number;
  name: string;
  subtitle?: string;
  slug: string;
  description?: string;
  image?: string;
  banner?: string;
  employee_ids?: number[];
  category_id?: number;
  vendor_id?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface NestedService {
  id: number;
  name: string;
  description?: string;
  image?: string;
  price?: number;
  service?: Service;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface CreateNestedServiceRequest {
  service_id: number;
  name: string;
  description?: string;
  image?: string;
  price?: number;
}

export interface UpdateNestedServiceRequest {
  name?: string;
  description?: string;
  image?: string;
  price?: number;
}

export interface ServiceApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface CreateServiceRequest {
  name: string;
  subtitle?: string;
  slug: string;
  description?: string;
  image?: string;
  banner?: string;
  employee_ids?: number[];
  category_id?: number;
  vendor_id?: number;
}

export interface UpdateServiceRequest {
  name?: string;
  subtitle?: string;
  slug?: string;
  description?: string;
  image?: string;
  banner?: string;
  employee_ids?: number[];
  category_id?: number;
  vendor_id?: number;
}

export const serviceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllServices: builder.query<ServiceApiResponse<Service[]>, void>({
      query: () => '/services',
      providesTags: ['Service'],
    }),
    getServiceById: builder.query<ServiceApiResponse<Service>, string | number>({
      query: (id) => `/services/${id}`,
      providesTags: ['Service'],
    }),
    createService: builder.mutation<ServiceApiResponse<Service>, CreateServiceRequest>({
      query: (data) => ({
        url: '/services',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Service'],
    }),
    updateService: builder.mutation<
      ServiceApiResponse<Service>,
      { id: string | number; data: UpdateServiceRequest }
    >({
      query: ({ id, data }) => ({
        url: `/services/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Service'],
    }),
    deleteService: builder.mutation<ServiceApiResponse<void>, string | number>({
      query: (id) => ({
        url: `/services/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Service'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllServicesQuery,
  useGetServiceByIdQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = serviceApi;

/* ==========================================================================
   NESTED SERVICE API
   ========================================================================== */

export const nestedServiceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllNestedServices: builder.query<ServiceApiResponse<NestedService[]>, void>({
      query: () => '/nested-services',
      providesTags: ['NestedService'],
    }),
    getNestedServicesByParent: builder.query<ServiceApiResponse<NestedService[]>, string | number>({
      query: (serviceId) => `/nested-services/service/${serviceId}`,
      providesTags: ['NestedService'],
    }),
    getNestedServiceById: builder.query<ServiceApiResponse<NestedService>, string | number>({
      query: (id) => `/nested-services/${id}`,
      providesTags: ['NestedService'],
    }),
    createNestedService: builder.mutation<ServiceApiResponse<NestedService>, CreateNestedServiceRequest>({
      query: (data) => ({
        url: '/nested-services',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['NestedService'],
    }),
    updateNestedService: builder.mutation<
      ServiceApiResponse<NestedService>,
      { id: string | number; data: UpdateNestedServiceRequest }
    >({
      query: ({ id, data }) => ({
        url: `/nested-services/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['NestedService'],
    }),
    deleteNestedService: builder.mutation<ServiceApiResponse<void>, string | number>({
      query: (id) => ({
        url: `/nested-services/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['NestedService'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllNestedServicesQuery,
  useGetNestedServicesByParentQuery,
  useGetNestedServiceByIdQuery,
  useCreateNestedServiceMutation,
  useUpdateNestedServiceMutation,
  useDeleteNestedServiceMutation,
} = nestedServiceApi;
