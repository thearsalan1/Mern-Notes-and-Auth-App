"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useRouter } from "next/navigation";

interface Note {
  _id: string;
  title: string;
  content: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/notes");
      setNotes(res.data.data || []);
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push("/login");
      } else {
        setError(err.response?.data?.message || "Failed to load notes");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setCreating(true);
    try {
      const res = await api.post("/notes", newNote);
      setNotes((prev) => [...prev, res.data.data]);
      setNewNote({ title: "", content: "" });
      setMessage("Note created");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create note");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    setMessage(null);
    setError(null);
    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      setMessage("Note deleted");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete note");
    }
  };

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
        <span className="text-sm font-medium text-gray-900">Primetrade</span>
        <button
          onClick={handleLogout}
          className="text-sm px-4 py-2 text-gray-500 hover:text-gray-900 transition-colors"
        >
          Logout
        </button>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-10">
        {/* Create Note */}
        <div>
          <h2 className="text-sm font-medium text-gray-900 mb-4">New Note</h2>
          <form onSubmit={handleCreate} className="space-y-3">
            <input
              placeholder="Title"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              required
              className="w-full px-3 py-2.5 text-sm text-gray-900 border border-gray-200 rounded-md outline-none focus:border-gray-400 transition-colors placeholder:text-gray-400"
            />
            <textarea
              placeholder="Content"
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              required
              rows={3}
className="w-full px-3 py-2.5 text-sm text-gray-900 border border-gray-200 rounded-md outline-none focus:border-gray-400 transition-colors placeholder:text-gray-400 resize-none"
            />
            <button
              type="submit"
              disabled={creating}
              className="text-sm px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {creating ? "Adding..." : "Add note"}
            </button>
          </form>

          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          {message && <p className="mt-3 text-sm text-green-600">{message}</p>}
        </div>

        {/* Notes List */}
        <div>
          <h2 className="text-sm font-medium text-gray-900 mb-4">
            Your Notes{" "}
            <span className="text-gray-400 font-normal">({notes.length})</span>
          </h2>

          {notes.length === 0 ? (
            <p className="text-sm text-gray-400">No notes yet.</p>
          ) : (
            <ul className="space-y-2">
              {notes.map((note) => (
                <li
                  key={note._id}
                  className="flex items-start justify-between gap-4 p-4 border border-gray-100 rounded-md hover:border-gray-200 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{note.title}</p>
                    <p className="text-sm text-gray-400 mt-0.5 line-clamp-2">{note.content}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors shrink-0 mt-0.5"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}