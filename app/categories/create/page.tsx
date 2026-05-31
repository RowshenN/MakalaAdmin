"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateCategoryMutation } from "@/services/categoryApi";

const CreateCategoryPage = () => {
  const [name, setName] = useState("");
  const router = useRouter();

  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await createCategory({ name });

    router.push("/categories");
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl text-black font-bold mb-6">Create Category</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <input
          type="text"
          placeholder="Category name"
          className="border text-black p-3 rounded"
          value={name}
          autoFocus
          onChange={(e) => setName(e.target.value)}
        />

        <button
          disabled={isLoading}
          className="bg-black text-white p-3 rounded"
        >
          {isLoading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
};

export default CreateCategoryPage;
