"use client";

import { useState } from "react";
import { api } from "../../lib/api";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", role: "user" });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      setMessage("Registered successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-xl font-medium text-gray-900">Create account</h1>
          <p className="text-sm text-gray-400 mt-1">Sign up to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-md outline-none focus:border-gray-400 transition-colors placeholder:text-gray-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-md outline-none focus:border-gray-400 transition-colors placeholder:text-gray-400"
          />
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-md outline-none focus:border-gray-400 transition-colors text-gray-700 bg-white"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
        {message && <p className="mt-4 text-sm text-green-600">{message}</p>}

        <p className="mt-6 text-sm text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-gray-900 hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
}