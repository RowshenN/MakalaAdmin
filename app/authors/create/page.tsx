"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateAuthorMutation } from "@/services/authorApi";

const CreateAuthorPage = () => {
  const router = useRouter();

  const [createAuthor, { isLoading }] = useCreateAuthorMutation();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    worksAt: "",
    studiesAt: "",
    phoneNumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await createAuthor(form);

    router.push("/authors");
  };

  return (
    <div className="p-10 w-full text-black">
      <h1 className="text-2xl font-bold mb-6">Create Author</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex gap-2 items-center w-full justify-start ">
          <label className="whitespace-nowrap ">First Name :</label>
          <input
            name="firstName"
            placeholder="First Name"
            onChange={handleChange}
            className="border w-full p-3 text-black rounded outline-0"
          />
        </div>

        <div className="flex gap-2 items-center w-full justify-start ">
          <label className="whitespace-nowrap ">Last Name :</label>
          <input
            name="lastName"
            placeholder="Last Name"
            onChange={handleChange}
            className="border w-full p-3 text-black rounded outline-0"
          />
        </div>

        <div className="flex gap-2 items-center w-full justify-start ">
          <label className="whitespace-nowrap ">Phone Number :</label>
          <input
            name="phoneNumber"
            placeholder="Phone Number"
            onChange={handleChange}
            className="border w-full p-3 text-black rounded outline-0"
          />
        </div>

        <div className="flex gap-2 items-center w-full justify-start ">
          <label className="whitespace-nowrap ">Works At :</label>
          <input
            name="worksAt"
            placeholder="Works At"
            onChange={handleChange}
            className="border w-full p-3 text-black rounded outline-0"
          />
        </div>

        <div className="flex gap-2 items-center w-full justify-start ">
          <label className="whitespace-nowrap ">Studies At :</label>
          <input
            name="studiesAt"
            placeholder="Studies At"
            onChange={handleChange}
            className="border w-full p-3 text-black rounded outline-0"
          />
        </div>

        <button className="bg-black cursor-pointer text-white p-3 rounded">
          {isLoading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
};

export default CreateAuthorPage;
