"use client";

import { useState } from "react";
import { postRequest } from "../../app/utils/api";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState("User");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerHandler = async () => {
    const res = await postRequest("/auth/signup", {
      name,
      role,
      email,
      password,
    });

    if (res.data.user) {
      router.push("/");
    } else {
      alert(res.data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 space-y-6 animate-fadeIn">
        
        <h1 className="text-3xl font-extrabold text-center text-gray-800">
          Create Account
        </h1>
        <p className="text-center text-gray-500 -mt-3">
          Join us today
        </p>

        <div className="space-y-4">
          <input
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            placeholder="Full Name"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <select
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>

          <button
            onClick={registerHandler}
            className="w-full bg-purple-600 text-white p-3 rounded-xl font-semibold text-lg hover:bg-purple-700 transition-all shadow-md hover:shadow-xl"
          >
            Register
          </button>
        </div>

        <p
          className="text-purple-700 text-center font-medium cursor-pointer hover:underline"
          onClick={() => router.push("/")}
        >
          Already have an account?
        </p>
      </div>
    </div>
  );
}