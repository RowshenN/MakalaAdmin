import { Magazine } from "@/types/magazine";
import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithReauth } from "./baseQuery";

export const magazineApi = createApi({
  reducerPath: "magazineApi",
  baseQuery: createBaseQueryWithReauth(""),
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
