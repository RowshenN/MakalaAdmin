"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  useGetAuthorByIdQuery,
  useUpdateAuthorMutation,
} from "@/services/authorApi";

const UpdateAuthorPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading } = useGetAuthorByIdQuery(id as string);
  const [updateAuthor, { isLoading: isUpdating }] = useUpdateAuthorMutation();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    worksAt: "",
    studiesAt: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (data) {
      setForm({
        firstName: data.firstName,
        lastName: data.lastName,
        worksAt: data.worksAt || "",
        studiesAt: data.studiesAt || "",
        phoneNumber: data.phoneNumber || "",
      });
    }
  }, [data]);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await updateAuthor({
      id,
      data: form,
    });

    router.push("/authors");
  };

  if (isLoading) return <p className="p-10">Loading...</p>;

  return (
    <div className="p-10 text-black w-full ">
      <h1 className="text-2xl font-bold mb-6">Update Author</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        <div className="flex gap-2 items-center w-full justify-start ">
          <label className="whitespace-nowrap ">First Name :</label>
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className="border w-full p-3 rounded"
          />
        </div>

        <div className="flex gap-2 items-center w-full justify-start ">
          <label className="whitespace-nowrap ">Last :</label>
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className="border w-full p-3 rounded"
          />
        </div>

        <div className="flex gap-2 items-center w-full justify-start ">
          <label className="whitespace-nowrap ">PhoneNumber :</label>
          <input
            name="phoneNumber"
            placeholder="Phone Number"
            value={form.phoneNumber}
            onChange={handleChange}
            className="border w-full p-3 text-black rounded outline-0"
          />
        </div>

        <div className="flex gap-2 items-center w-full justify-start ">
          <label className="whitespace-nowrap ">Works At :</label>
          <input
            name="worksAt"
            value={form.worksAt}
            onChange={handleChange}
            className="border w-full p-3 rounded"
          />
        </div>

        <div className="flex gap-2 items-center w-full justify-start ">
          <label className="whitespace-nowrap ">Studies At :</label>
          <input
            name="studiesAt"
            value={form.studiesAt}
            onChange={handleChange}
            className="border w-full p-3 rounded"
          />
        </div>

        <button className="bg-black cursor-pointer text-white p-3 rounded">
          {isUpdating ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default UpdateAuthorPage;
