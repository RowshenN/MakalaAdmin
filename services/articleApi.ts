import { createApi } from "@reduxjs/toolkit/query/react";
import { Article } from "@/types/article";
import { createBaseQueryWithReauth } from "./baseQuery";

export const articleApi = createApi({
  reducerPath: "articleApi",
  baseQuery: createBaseQueryWithReauth("article/"),
  tagTypes: ["Article"],
  endpoints: (builder) => ({
    getArticles: builder.query<{ data: Article[]; total: number }, void>({
      query: () => "",
      providesTags: ["Article"],
    }),

    getArticleBySLug: builder.query<Article, string>({
      query: (slug) => `${slug}`,
    }),

    createArticle: builder.mutation<Article, Partial<Article>>({
      query: (body) => ({
        url: "",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Article"],
    }),

    updateArticle: builder.mutation<
      Article,
      { id: string; body: Partial<Article> }
    >({
      query: ({ id, body }) => ({
        url: `${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Article"],
    }),

    deleteArticle: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Article"],
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetArticleBySLugQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
} = articleApi;
