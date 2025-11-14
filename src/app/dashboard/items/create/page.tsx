"use client";

import { useState } from "react";
import { postRequest } from "@/app/utils/api";
import { useRouter } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

export default function CreateItem() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", description: "" });
  const [error, setError] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleSubmit = async () => {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }

    await postRequest("/items", parsed.data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    router.push("/dashboard/items");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">Create New Item</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <input
        className="border p-2 block w-full mb-3"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <textarea
        className="border p-2 block w-full mb-3"
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
        Create
      </button>
    </div>
  );
}