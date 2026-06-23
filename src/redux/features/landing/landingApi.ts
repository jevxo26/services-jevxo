import { baseApi } from '@/redux/api/baseApi';

// Public endpoints — no auth required
export const landingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /category — public, returns all categories
    getPublicCategories: builder.query<any, void>({
      query: () => '/category',
      providesTags: ['Category'],
    }),

    // GET /category/:id
    getPublicCategoryById: builder.query<any, number>({
      query: (id) => `/category/${id}`,
    }),

    // GET /nested-services — public, returns all nested services with relations
    getPublicNestedServices: builder.query<any, void>({
      query: () => '/nested-services',
    }),

    // GET /nested-services/service/:serviceId
    getPublicNestedServicesByService: builder.query<any, number>({
      query: (serviceId) => `/nested-services/service/${serviceId}`,
    }),

    // GET /reviews — public, returns all reviews
    getPublicReviews: builder.query<any, void>({
      query: () => '/reviews',
    }),

    // GET /reviews/service/:serviceId
    getPublicReviewsByService: builder.query<any, number>({
      query: (serviceId) => `/reviews/service/${serviceId}`,
    }),

    // GET /reviews/nested-service/:nestedServiceId
    getPublicReviewsByNestedService: builder.query<any, number>({
      query: (nestedServiceId) => `/reviews/nested-service/${nestedServiceId}`,
    }),

    // GET /services/:id — public, returns a single service details (nestedServices, packages, employees, category)
    getPublicServiceById: builder.query<any, number>({
      query: (id) => `/services/${id}`,
    }),

    // GET /services/slug/:slug — public, returns a single service details by slug
    getPublicServiceBySlug: builder.query<any, string>({
      query: (slug) => `/services/slug/${slug}`,
    }),

    // GET /packages — public, returns all packages
    getPublicPackages: builder.query<any, void>({
      query: () => '/packages',
    }),

    // GET /packages/service/:serviceId — public, returns packages for a service
    getPublicPackagesByService: builder.query<any, number>({
      query: (serviceId) => `/packages/service/${serviceId}`,
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetPublicCategoriesQuery,
  useGetPublicCategoryByIdQuery,
  useGetPublicNestedServicesQuery,
  useGetPublicNestedServicesByServiceQuery,
  useGetPublicReviewsQuery,
  useGetPublicReviewsByServiceQuery,
  useGetPublicReviewsByNestedServiceQuery,
  useGetPublicServiceByIdQuery,
  useGetPublicServiceBySlugQuery,
  useGetPublicPackagesQuery,
  useGetPublicPackagesByServiceQuery,
} = landingApi;
