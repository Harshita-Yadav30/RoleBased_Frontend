"use client";

import { useEffect, useState } from "react";
import { getRequest, putRequest, clientAuthConfig } from "../../../utils/api";
import { useRouter, useParams } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

export default function EditItemPage() {
  const params = useParams() as { id?: string };
  const router = useRouter();
  const id = params?.id;
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", description: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await getRequest<any>(`/items/${id}`, clientAuthConfig());
        setForm({ title: res.data.title, description: res.data.description || "" });
      } catch (err) {
        console.error(err);
        alert("Unable to load item");
        router.push("/dashboard/items");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSave = async () => {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }
    try {
      await putRequest(`/items/${id}`, parsed.data, clientAuthConfig());
      router.push("/dashboard/items");
    } catch (err) {
      console.error(err);
      setError("Save failed");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl mb-4">Edit Item</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <input
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="border p-2 w-full mb-3"
        placeholder="Title"
      />
      <textarea
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="border p-2 w-full mb-3"
        placeholder="Description"
      />
      <div className="flex gap-3">
        <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">
          Save
        </button>
        <button onClick={() => router.push("/dashboard/items")} className="px-4 py-2 border rounded">
          Cancel
        </button>
      </div>
    </div>
  );
}