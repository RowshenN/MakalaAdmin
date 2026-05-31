import { Magazine } from "@/types/magazine";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "./config";

export const magazineApi = createApi({
  reducerPath: "magazineApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ["Magazine"],

  endpoints: (builder) => ({
    getMagazines: builder.query<Magazine[], void>({
      query: () => "magazine",
      providesTags: ["Magazine"],
    }),

    getMagazineById: builder.query<Magazine, string>({
      query: (id) => `magazine/${id}`,
    }),

    createMagazine: builder.mutation({
      query: (data) => ({
        url: "magazine",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Magazine"],
    }),

    updateMagazine: builder.mutation({
      query: ({ id, data }) => ({
        url: `magazine/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Magazine"],
    }),

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
