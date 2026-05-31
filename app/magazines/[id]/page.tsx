"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  useGetMagazineByIdQuery,
  useUpdateMagazineMutation,
} from "@/services/magazineApi";

const UpdateMagazinePage = () => {
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading } = useGetMagazineByIdQuery(id as string);
  const [updateMagazine, { isLoading: isUpdating }] =
    useUpdateMagazineMutation();

  const [title, setTitle] = useState("");

  useEffect(() => {
    if (data) setTitle(data.title);
  }, [data]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await updateMagazine({
      id,
      data: { title },
    });

    router.push("/magazines");
  };

  if (isLoading) return <p className="p-10">Loading...</p>;

  return (
    <div className="text-black p-10">
      <h1 className="text-2xl font-bold mb-6">Update Magazine</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <input
          type="text"
          className="border p-3 rounded"
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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

export default UpdateMagazinePage;
