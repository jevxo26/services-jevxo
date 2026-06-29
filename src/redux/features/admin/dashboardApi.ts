import { baseApi } from "../../api/baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOverviewStats: builder.query<any, void>({
      query: () => "/dashboard/overview",
      providesTags: ["Booking", "Withdraw", "Profile", "Admin"],
    }),
  }),
});

export const { useGetOverviewStatsQuery } = dashboardApi;
