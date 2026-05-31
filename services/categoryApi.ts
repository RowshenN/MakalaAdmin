import { Category } from "@/types/category";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "./config";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ["Category"],

  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => "category",
      providesTags: ["Category"],
    }),

    getCategoryById: builder.query<Category, string>({
      query: (id) => `category/${id}`,
    }),

    createCategory: builder.mutation({
      query: (data) => ({
        url: "category",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),

    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `category/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),

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
