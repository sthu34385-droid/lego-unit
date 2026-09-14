"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/types";

export function CategoriesClient({ initialCategories }: { initialCategories: Category[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Category | null>(null);
  const [busy, setBusy] = useState(false);

  const sorted = useMemo(
    () => [...categories].sort((a, b) => a.name.localeCompare(b.name)),
    [categories],
  );

  async function refresh() {
    const res = await fetch("/api/categories");
    const data = await res.json();
    if (Array.isArray(data)) setCategories(data);
    router.refresh();
  }

  async function addCategory(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setBusy(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not add category.");
        return;
      }
      setName("");
      setSuccess(`Added “${data.name}”.`);
      await refresh();
    } catch {
      setError("Could not add category.");
    } finally {
      setBusy(false);
    }
  }

  async function saveEdit(id: string) {
    setError("");
    setSuccess("");
    setBusy(true);
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not rename category.");
        return;
      }
      setEditingId(null);
      setSuccess(`Renamed to “${data.name}”.`);
      await refresh();
    } catch {
      setError("Could not rename category.");
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setError("");
    setSuccess("");
    setBusy(true);
    try {
      const res = await fetch(`/api/categories/${pendingDelete.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not delete category.");
        setPendingDelete(null);
        return;
      }
      setSuccess(`Deleted “${pendingDelete.name}”.`);
      setPendingDelete(null);
      await refresh();
    } catch {
      setError("Could not delete category.");
      setPendingDelete(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Categories</h1>
      <p className="mt-1 text-muted">{sorted.length} total</p>

      <form onSubmit={addCategory} className="card mt-6 flex flex-col gap-3 p-5 sm:flex-row sm:items-end">
        <label className="block min-w-0 flex-1">
          <span className="label">New category</span>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <button type="submit" className="btn btn-primary" disabled={busy}>
          Add category
        </button>
      </form>

      {error ? <p className="mt-4 text-sm text-red">{error}</p> : null}
      {success ? <p className="mt-4 text-sm text-green">{success}</p> : null}

      {pendingDelete ? (
        <div className="card mt-4 p-5">
          <p className="font-semibold">Are you sure you want to delete “{pendingDelete.name}”?</p>
          <p className="mt-2 text-sm text-muted">Products using this category must be reassigned first.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="btn btn-danger" onClick={confirmDelete} disabled={busy}>
              {busy ? "Deleting…" : "Yes, delete"}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setPendingDelete(null)} disabled={busy}>
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-6 overflow-x-auto rounded-[1.25rem] border border-line bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((cat) => (
              <tr key={cat.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  {editingId === cat.id ? (
                    <input className="input" value={editName} onChange={(e) => setEditName(e.target.value)} />
                  ) : (
                    <span className="font-medium">{cat.name}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap justify-end gap-2">
                    {editingId === cat.id ? (
                      <>
                        <button type="button" className="btn btn-primary h-10 px-4 text-sm" onClick={() => saveEdit(cat.id)} disabled={busy}>
                          Save
                        </button>
                        <button type="button" className="btn btn-ghost h-10 px-4 text-sm" onClick={() => setEditingId(null)}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="btn btn-ghost h-10 px-4 text-sm"
                          onClick={() => {
                            setEditingId(cat.id);
                            setEditName(cat.name);
                          }}
                        >
                          Edit
                        </button>
                        <button type="button" className="btn btn-danger h-10 px-4 text-sm" onClick={() => setPendingDelete(cat)}>
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
