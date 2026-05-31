"use client";

import { useRouter } from "next/navigation";
import { useCreateAuthorMutation } from "@/services/authorApi";
import { message } from "antd";
import { useForm } from "@/hooks/useForm";

const initialForm = {
  firstName: "",
  lastName: "",
  worksAt: "",
  studiesAt: "",
  phoneNumber: "",
};

const CreateAuthorPage = () => {
  const router = useRouter();
  const [createAuthor, { isLoading }] = useCreateAuthorMutation();
  const { form, handleChange } = useForm(initialForm);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.firstName.trim() || !form.lastName.trim()) {
      message.error("First name and last name are required");
      return;
    }

    try {
      await createAuthor(form).unwrap();
      message.success("Author created successfully");
      router.push("/authors");
    } catch (err) {
      message.error("Failed to create author");
      console.error(err);
    }
  };

  return (
    <div className="p-10 w-full text-black">
      <h1 className="text-2xl font-bold mb-6">Create Author</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex gap-2 items-center w-full justify-start">
          <label className="whitespace-nowrap">First Name :</label>
          <input
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            className="border w-full p-3 text-black rounded outline-0"
          />
        </div>

        <div className="flex gap-2 items-center w-full justify-start">
          <label className="whitespace-nowrap">Last Name :</label>
          <input
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            className="border w-full p-3 text-black rounded outline-0"
          />
        </div>

        <div className="flex gap-2 items-center w-full justify-start">
          <label className="whitespace-nowrap">Phone Number :</label>
          <input
            name="phoneNumber"
            placeholder="Phone Number"
            value={form.phoneNumber}
            onChange={handleChange}
            className="border w-full p-3 text-black rounded outline-0"
          />
        </div>

        <div className="flex gap-2 items-center w-full justify-start">
          <label className="whitespace-nowrap">Works At :</label>
          <input
            name="worksAt"
            placeholder="Works At"
            value={form.worksAt}
            onChange={handleChange}
            className="border w-full p-3 text-black rounded outline-0"
          />
        </div>

        <div className="flex gap-2 items-center w-full justify-start">
          <label className="whitespace-nowrap">Studies At :</label>
          <input
            name="studiesAt"
            placeholder="Studies At"
            value={form.studiesAt}
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
