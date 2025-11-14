"use client";

import { useEffect, useState } from "react";
import { getRequest, postRequest, putRequest, deleteRequest } from "@/app/utils/api";
import Link from "next/link";

export default function ItemsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchItems = async () => {
    const res = await getRequest(`/items?page=${page}&search=${search}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setItems(res.items);
    setTotalPages(res.pages);
  };

  useEffect(() => { fetchItems(); }, [page]);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <input
          placeholder="Search items…"
          className="border px-3 py-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Link href="/dashboard/items/create" className="bg-blue-500 text-white px-4 py-2 rounded">
          + Add Item
        </Link>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td className="p-2 border">{item.title}</td>
              <td className="p-2 border flex gap-3">
                <Link href={`/dashboard/items/${item._id}`} className="text-blue-600">
                  Edit
                </Link>
                <button
                  className="text-red-600"
                  onClick={async () => {
                    await deleteRequest(`/items/${item._id}`, {
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    fetchItems();
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center gap-3 mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 border rounded"
        >
          Prev
        </button>

        <span>{page} / {totalPages}</span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}