"use client";

import { useState } from "react";
import { api } from "../../lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);
    try {
      await api.post("/auth/login", form);
      setMessage("Logged in successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-xl font-medium text-gray-900">Sign in</h1>
          <p className="text-sm text-gray-400 mt-1">Welcome back</p>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
        {message && <p className="mt-4 text-sm text-green-600">{message}</p>}

        <p className="mt-6 text-sm text-gray-400">
          Don't have an account?{" "}
          <a href="/register" className="text-gray-900 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
}