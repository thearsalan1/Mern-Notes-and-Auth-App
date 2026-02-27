"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  email: string;
  role: string;
}

interface Note {
  _id: string;
  title: string;
  content: string;
  owner: { email: string; role: string };
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [tab, setTab] = useState<"users" | "notes">("users");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [usersRes, notesRes] = await Promise.all([
          api.get("/admin/users"),
          api.get("/admin/notes"),
        ]);
        setUsers(usersRes.data.data || []);
        setNotes(notesRes.data.data || []);
      } catch (err: any) {
        if (err.response?.status === 401) router.push("/login");
        else if (err.response?.status === 403) router.push("/dashboard");
        else setError(err.response?.data?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleLogout = async () => {
    await api.post("/auth/logout");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-900">Primetrade</span>
          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
            Admin
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          Logout
        </button>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {error && <p className="mb-6 text-sm text-red-500">{error}</p>}

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-gray-100">
          {(["users", "notes"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-sm px-4 py-2.5 capitalize transition-colors border-b-2 -mb-px ${
                tab === t
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {t}
              <span className="ml-2 text-xs text-gray-400">
                {t === "users" ? users.length : notes.length}
              </span>
            </button>
          ))}
        </div>

        {/* Users Tab */}
        {tab === "users" && (
          <div>
            {users.length === 0 ? (
              <p className="text-sm text-gray-400">No users found.</p>
            ) : (
              <ul className="space-y-2">
                {users.map((user) => (
                  <li
                    key={user._id}
                    className="flex items-center justify-between px-4 py-3 border border-gray-100 rounded-md hover:border-gray-200 transition-colors"
                  >
                    <div>
                      <p className="text-sm text-gray-900">{user.email}</p>
                      <p className="text-xs text-gray-400 mt-0.5 font-mono">{user._id}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        user.role === "admin"
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {user.role}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Notes Tab */}
        {tab === "notes" && (
          <div>
            {notes.length === 0 ? (
              <p className="text-sm text-gray-400">No notes found.</p>
            ) : (
              <ul className="space-y-2">
                {notes.map((note) => (
                  <li
                    key={note._id}
                    className="px-4 py-3 border border-gray-100 rounded-md hover:border-gray-200 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {note.title}
                        </p>
                        <p className="text-sm text-gray-400 mt-0.5 line-clamp-1">
                          {note.content}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 shrink-0 mt-0.5">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      {note.owner?.email}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}