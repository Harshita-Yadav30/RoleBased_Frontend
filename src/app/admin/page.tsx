"use client";

import { useEffect, useState } from "react";
import { getRequest, postRequest, clientAuthConfig } from "../utils/api";
import { useRouter } from "next/navigation";

type UserType = { _id: string; name: string; email: string; role: string };

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState<"" | "Admin" | "User">("");

  const fetchUsers = async () => {
    try {
      const res = await getRequest<UserType[]>("/users", clientAuthConfig());
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/");

    (async () => {
      try {
        const me = await getRequest<any>("/auth/me", clientAuthConfig());
        if (me.data.role !== "Admin") {
          router.push("/dashboard");
          return;
        }
        await fetchUsers();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const updateRole = async (userId: string, newRole: "Admin" | "User") => {
    try {
      await postRequest(`/users/${userId}/role`, { role: newRole }, clientAuthConfig());
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to update role");
    }
  };

  const filteredUsers = filterRole ? users.filter((u) => u.role === filterRole) : users;

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 py-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-gray-800">Dashboard</h1>
          <div className="flex gap-4">
            <button
              className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition shadow-md hover:shadow-lg"
              onClick={() => router.push("/dashboard")}
            >
              Back to Dashboard
            </button>
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

        {/* Role Filter */}
        <div className="flex flex-wrap gap-4 items-center">
          <span className="text-gray-700 font-medium">Filter by role:</span>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as "" | "Admin" | "User")}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            <option value="">All</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left text-gray-700 font-medium">Name</th>
                <th className="p-3 text-left text-gray-700 font-medium">Email</th>
                <th className="p-3 text-left text-gray-700 font-medium">Role</th>
                <th className="p-3 text-left text-gray-700 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr
                  key={u._id}
                  className="border-b last:border-b-0 hover:bg-gray-50 transition"
                >
                  <td className="p-3 text-gray-800">{u.name}</td>
                  <td className="p-3 text-gray-600">{u.email}</td>
                  <td className="p-3 text-gray-800">{u.role}</td>
                  <td className="p-3 flex gap-2">
                    {u.role === "User" ? (
                      <button
                        className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                        onClick={() => updateRole(u._id, "Admin")}
                      >
                        Make Admin
                      </button>
                    ) : (
                      <button
                        className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                        onClick={() => updateRole(u._id, "User")}
                      >
                        Make User
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}