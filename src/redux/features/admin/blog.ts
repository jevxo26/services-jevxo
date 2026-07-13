import { baseApi } from '@/redux/api/baseApi';

export interface Blog {
  id: number;
  title: string;
  description: string;
  overview?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface BlogApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface CreateBlogRequest {
  title: string;
  description: string;
  overview?: string;
  images?: string[];
}

export interface UpdateBlogRequest {
  title?: string;
  description?: string;
  overview?: string;
  images?: string[];
}

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBlogs: builder.query<BlogApiResponse<Blog[]>, string | undefined>({
      query: (search) => ({
        url: '/blogs',
        params: search ? { search } : undefined,
      }),
      providesTags: ['Blog'],
    }),
    getBlogById: builder.query<BlogApiResponse<Blog>, string | number>({
      query: (id) => `/blogs/${id}`,
      providesTags: ['Blog'],
    }),
    createBlog: builder.mutation<BlogApiResponse<Blog>, CreateBlogRequest>({
      query: (data) => ({
        url: '/blogs',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Blog'],
    }),
    updateBlog: builder.mutation<
      BlogApiResponse<Blog>,
      { id: string | number; data: UpdateBlogRequest }
    >({
      query: ({ id, data }) => ({
        url: `/blogs/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Blog'],
    }),
    deleteBlog: builder.mutation<BlogApiResponse<void>, string | number>({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Blog'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllBlogsQuery,
  useGetBlogByIdQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;
