"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
} from "@/services/categoryApi";

const UpdateCategoryPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading } = useGetCategoryByIdQuery(id as string);
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();

  const [name, setName] = useState("");


  useEffect(() => {
    if (data) setName(data.name);
  }, [data]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await updateCategory({
      id,
      data: { name },
    });

    router.push("/categories");
  };

  if (isLoading) return <p className="p-10">Loading...</p>;

  return (
    <div className="p-10 text-black">
      <h1 className="text-2xl font-bold mb-6">Update Category</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <input
          type="text"
          className="border p-3 rounded"
          value={name}
          autoFocus
          onChange={(e) => setName(e.target.value)}
        />

        <button
          disabled={isUpdating}
          className="bg-black text-white p-3 rounded"
        >
          {isUpdating ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default UpdateCategoryPage;
