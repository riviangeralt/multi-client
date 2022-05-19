import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiURL = "http://localhost:8000/api/v1/"; //"https://multi-client-mern.herokuapp.com/api/v1/";
// Define a service using a base URL and expected endpoints
export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({ baseUrl: apiURL }),
  endpoints: (builder) => ({
    getDashboard: builder.query({
      query: (token) => ({
        url: "dashboard",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetDashboardQuery } = dashboardApi;
