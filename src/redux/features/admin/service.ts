import { baseApi } from '@/redux/api/baseApi';

export interface Service {
  id: number;
  name: string;
  subtitle?: string;
  slug: string;
  description?: string;
  overview?: string;
  details?: string;
  faq?: { question: string; answer: string }[];
  image?: string;
  banner?: string;
  employee_ids?: number[];
  category_id?: number;
  vendor_id?: number;
  createdAt?: string;
  updatedAt?: string;
  agent_commission_percentage?: number;
  nestedServices?: any[];
  packages?: any[];
  employees?: any[];
  vendor?: any;
  category?: any;
}

export interface SubService {
  id: number;
  name: string;
  price: number;
  nestedService?: NestedService;
  description?: string;
  image1?: string;
  image2?: string;
  faq?: { question: string; answer: string }[];
}

export interface NestedService {
  id: number;
  name: string;
  description?: string;
  image?: string;
  starting_price?: number;
  subServices?: SubService[];
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
  starting_price?: number;
  sub_services?: { name: string; price: number }[];
}

export interface UpdateNestedServiceRequest {
  name?: string;
  description?: string;
  image?: string;
  starting_price?: number;
  sub_services?: { name: string; price: number }[];
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
  overview?: string;
  details?: string;
  faq?: { question: string; answer: string }[];
  image?: string;
  banner?: string;
  employee_ids?: number[];
  category_id?: number;
  vendor_id?: number;
  agent_commission_percentage?: number;
}

export interface UpdateServiceRequest {
  name?: string;
  subtitle?: string;
  slug?: string;
  description?: string;
  overview?: string;
  details?: string;
  faq?: { question: string; answer: string }[];
  image?: string;
  banner?: string;
  employee_ids?: number[];
  category_id?: number;
  vendor_id?: number;
  agent_commission_percentage?: number;
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

/* ==========================================================================
   SUB SERVICE API
   ========================================================================== */

export interface CreateSubServiceRequest {
  nested_service_id: number;
  name: string;
  price: number;
  description?: string;
  image1?: string;
  image2?: string;
  faq?: { question: string; answer: string }[];
}

export interface UpdateSubServiceRequest {
  nested_service_id?: number;
  name?: string;
  price?: number;
  description?: string;
  image1?: string;
  image2?: string;
  faq?: { question: string; answer: string }[];
}

export const subServiceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubServices: builder.query<ServiceApiResponse<SubService[]>, void>({
      query: () => '/sub-services',
      providesTags: ['SubService'],
    }),
    getSubServiceById: builder.query<ServiceApiResponse<SubService>, string | number>({
      query: (id) => `/sub-services/${id}`,
      providesTags: ['SubService'],
    }),
    createSubService: builder.mutation<ServiceApiResponse<SubService>, CreateSubServiceRequest>({
      query: (data) => ({
        url: '/sub-services',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['SubService', 'NestedService'],
    }),
    updateSubService: builder.mutation<
      ServiceApiResponse<SubService>,
      { id: string | number; data: UpdateSubServiceRequest }
    >({
      query: ({ id, data }) => ({
        url: `/sub-services/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['SubService', 'NestedService'],
    }),
    deleteSubService: builder.mutation<ServiceApiResponse<void>, string | number>({
      query: (id) => ({
        url: `/sub-services/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SubService', 'NestedService'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllSubServicesQuery,
  useGetSubServiceByIdQuery,
  useCreateSubServiceMutation,
  useUpdateSubServiceMutation,
  useDeleteSubServiceMutation,
} = subServiceApi;
