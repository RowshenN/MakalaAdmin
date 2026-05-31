import { Magazine } from "@/types/magazine";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const magazineApi = createApi({
  reducerPath: "magazineApi",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://72.62.243.185/"
    baseUrl: "http://localhost:5000/"
  }),
  tagTypes: ["Magazine"],

  endpoints: (builder) => ({
    // ✅ GET ALL
    getMagazines: builder.query<Magazine[], void>({
      query: () => "magazine",
      providesTags: ["Magazine"],
    }),

    // ✅ GET ONE
    getMagazineById: builder.query<Magazine, string>({
      query: (id) => `magazine/${id}`,
    }),

    // ✅ CREATE
    createMagazine: builder.mutation({
      query: (data) => ({
        url: "magazine",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Magazine"],
    }),

    // ✅ UPDATE
    updateMagazine: builder.mutation({
      query: ({ id, data }) => ({
        url: `magazine/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Magazine"],
    }),

    // ✅ DELETE
    deleteMagazine: builder.mutation({
      query: (id) => ({
        url: `magazine/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Magazine"],
    }),
  }),
});

export const {
  useGetMagazinesQuery,
  useGetMagazineByIdQuery,
  useCreateMagazineMutation,
  useUpdateMagazineMutation,
  useDeleteMagazineMutation,
} = magazineApi;
