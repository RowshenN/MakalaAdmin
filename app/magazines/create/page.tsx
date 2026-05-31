"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateMagazineMutation } from "@/services/magazineApi";

const CreateMagazinePage = () => {
  const [title, setTitle] = useState("");
  const router = useRouter();

  const [createMagazine, { isLoading }] = useCreateMagazineMutation();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await createMagazine({ title });

    router.push("/magazines");
  };

  return (
    <div className="p-10 text-black ">
      <h1 className="text-2xl font-bold mb-6">Create Magazine</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <input
          type="text"
          placeholder="Magazine title"
          className="border text-black p-3 rounded"
          value={title}
          autoFocus
          onChange={(e) => setTitle(e.target.value)}
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

export default CreateMagazinePage;
