"use client";

import Link from "next/link";
import {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
} from "@/services/categoryApi";
import { Category } from "@/types/category";

const CategoriesPage = () => {
  const { data, isLoading, isError } = useGetCategoriesQuery();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleDelete = async (id: string) => {
    await deleteCategory(id);
  };

  if (isLoading) return <p className="p-10">Loading...</p>;
  if (isError) return <p className="p-10">Error loading categories</p>;

  return (
    <div className="p-10">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl text-black font-bold">Categories</h1>

        <Link
          href="/categories/create"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Create
        </Link>
      </div>

      <div className="bg-white shadow rounded-xl p-4">
        {data?.map((cat: Category) => (
          <div
            key={cat.id}
            className="flex justify-between border-b border-gray-300 py-3"
          >
            <span className="text-black ">{cat.name}</span>

            <div className="flex gap-3">
              <Link href={`/categories/${cat.id}`} className="text-blue-500">
                Edit
              </Link>

              <button
                onClick={() => handleDelete(cat.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
