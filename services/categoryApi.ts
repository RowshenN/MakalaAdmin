import { Category } from "@/types/category";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://72.62.243.185/"
    baseUrl: "http://localhost:5000/"
  }),
  tagTypes: ["Category"],

  endpoints: (builder) => ({
    // ✅ GET ALL
    getCategories: builder.query<Category[], void>({
      query: () => "category",
      providesTags: ["Category"],
    }),

    // ✅ GET ONE
    getCategoryById: builder.query<Category, string>({
      query: (id) => `category/${id}`,
    }),

    // ✅ CREATE
    createCategory: builder.mutation({
      query: (data) => ({
        url: "category",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),

    // ✅ UPDATE
    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `category/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),

    // ✅ DELETE
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
