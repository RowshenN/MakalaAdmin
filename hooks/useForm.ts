import { useState } from "react";

export function useForm<T extends Record<string, unknown>>(initial: T) {
  const [form, setForm] = useState<T>(initial);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange =
    (name: keyof T) => (value: string | undefined) => {
      setForm((prev) => ({ ...prev, [name]: value ?? "" }));
    };

  return { form, setForm, handleChange, handleSelectChange };
}
