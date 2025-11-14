"use client";

import { useEffect, useState } from "react";
import { getRequest, postRequest } from "../utils/api";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "Admin" | "User";
}

interface Item {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const limit = 5;

  const fetchItems = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await getRequest<{ items: Item[]; total: number; page: number; pages: number }>(
      `/items?search=${search}&page=${page}&limit=${limit}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data) {
      setItems(res.data.items);
      setPages(res.data.pages);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/");

    (async () => {
      const res = await getRequest<User>("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data) setUser(res.data);
      else {
        localStorage.removeItem("token");
        router.push("/");
      }
    })();
  }, [router]);

  useEffect(() => {
    fetchItems();
  }, [page, search]);

  const addItem = async () => {
    if (!title) return alert("Title is required");
    const token = localStorage.getItem("token");
    if (!token) return;

    await postRequest<Item>("/items", { title, description }, { headers: { Authorization: `Bearer ${token}` } });
    setTitle("");
    setDescription("");
    fetchItems();
  };

  const startEditing = (item: Item) => {
    setEditingId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description || "");
  };

  const saveEdit = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/items/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: editTitle, description: editDescription }),
    });

    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
    fetchItems();
  };

  const deleteItem = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/items/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchItems();
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl p-8 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-gray-800">Dashboard</h1>
          <div className="flex gap-4">
            {user.role === "Admin" && (
              <button
                className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition shadow-md hover:shadow-lg"
                onClick={() => router.push("/admin")}
              >
                Admin Panel
              </button>
            )}
            <button
              className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition shadow-md hover:shadow-lg"
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/");
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Add Item Form */}
        <div className="bg-purple-50 p-6 rounded-2xl shadow-inner space-y-4">
          <h2 className="text-2xl font-semibold text-purple-800">Add New Item</h2>
          <input
            className="w-full p-4 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full p-4 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-purple-600 transition shadow-md"
            onClick={addItem}
          >
            Add Item
          </button>
        </div>

        {/* Search */}
        <input
          className="w-full p-4 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          placeholder="Search Items"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Items List */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="p-4 border border-purple-200 rounded-2xl flex justify-between items-center bg-purple-50 shadow-inner"
            >
              <div className="flex-1">
                {editingId === item._id ? (
                  <>
                    <input
                      className="w-full p-2 border border-purple-300 rounded-xl mb-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <textarea
                      className="w-full p-2 border border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-purple-800 text-lg">{item.title}</p>
                    {item.description && <p className="text-purple-700">{item.description}</p>}
                  </>
                )}
              </div>

              <div className="flex gap-2">
                {editingId === item._id ? (
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
                    onClick={() => saveEdit(item._id)}
                  >
                    Save
                  </button>
                ) : (
                  <>
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition"
                      onClick={() => startEditing(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition"
                      onClick={() => deleteItem(item._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded ${
                i + 1 === page ? "bg-purple-600 text-white" : "bg-purple-200 text-purple-800"
              }`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}