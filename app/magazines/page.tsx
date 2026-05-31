"use client";

import Link from "next/link";
import {
  useGetMagazinesQuery,
  useDeleteMagazineMutation,
} from "@/services/magazineApi";
import { Magazine } from "@/types/magazine";

const MagazinesPage = () => {
  const { data, isLoading, isError } = useGetMagazinesQuery();
  const [deleteMagazine] = useDeleteMagazineMutation();

  const handleDelete = async (id: string) => {
    await deleteMagazine(id);
  };

  if (isLoading) return <p className="p-10">Loading...</p>;
  if (isError) return <p className="p-10">Error loading magazines</p>;

  return (
    <div className="p-10">
      <div className="flex text-black justify-between mb-6">
        <h1 className="text-2xl font-bold">Magazines</h1>

        <Link
          href="/magazines/create"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Create
        </Link>
      </div>

      <div className="bg-white shadow rounded-xl p-4">
        {data?.map((mag: Magazine) => (
          <div key={mag.id} className="flex justify-between border-b border-gray-300 py-3">
            <span className="text-black ">{mag.title}</span>

            <div className="flex gap-3">
              <Link href={`/magazines/${mag.id}`} className="text-blue-500">
                Edit
              </Link>

              <button
                onClick={() => handleDelete(mag.id)}
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

export default MagazinesPage;
