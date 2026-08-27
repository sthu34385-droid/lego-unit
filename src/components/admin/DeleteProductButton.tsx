"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteProductButton({
  id,
  name,
  redirectTo,
}: {
  id: string;
  name: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function remove() {
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not delete this product.");
        setDeleting(false);
        return;
      }
      if (redirectTo) {
        router.push(redirectTo);
      }
      router.refresh();
    } catch {
      setError("Could not delete this product.");
      setDeleting(false);
    }
  }

  if (confirming) {
    return (
      <div className="inline-flex flex-col items-end gap-2">
        <p className="text-sm text-ink">Delete “{name}”? This cannot be undone.</p>
        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            className="btn btn-ghost h-10 px-4 text-sm"
            onClick={() => {
              setConfirming(false);
              setError("");
            }}
            disabled={deleting}
          >
            Cancel
          </button>
          <button type="button" className="btn btn-danger h-10 px-4 text-sm" onClick={remove} disabled={deleting}>
            {deleting ? "Deleting…" : "Yes, delete"}
          </button>
        </div>
        {error ? <p className="text-sm text-red">{error}</p> : null}
      </div>
    );
  }

  return (
    <button type="button" className="btn btn-danger h-10 px-4 text-sm" onClick={() => setConfirming(true)}>
      Delete
    </button>
  );
}
