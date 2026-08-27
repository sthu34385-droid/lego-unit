"use client";

import { useState } from "react";
import type { CategoryId, Product } from "@/lib/types";
import { CATEGORIES } from "@/lib/categories";
import type { FieldErrors } from "@/lib/validation";

type Props = {
  product?: Product;
  submitLabel: string;
  onSubmit: (payload: Record<string, unknown>) => Promise<void>;
};

export function ProductForm({ product, submitLabel, onSubmit }: Props) {
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(String(product?.price ?? ""));
  const [salePrice, setSalePrice] = useState(product?.salePrice ? String(product.salePrice) : "");
  const [category, setCategory] = useState(product?.category ?? "city");
  const [ageRange, setAgeRange] = useState(product?.ageRange ?? "8+");
  const [pieceCount, setPieceCount] = useState(String(product?.pieceCount ?? ""));
  const [stock, setStock] = useState(String(product?.stock ?? "10"));
  const [isNew, setIsNew] = useState(product?.isNew ?? false);
  const [isBestSeller, setIsBestSeller] = useState(product?.isBestSeller ?? false);
  const [isSale, setIsSale] = useState(product?.isSale ?? false);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setFormError("");
    try {
      const form = new FormData();
      Array.from(files).forEach((file) => form.append("files", file));
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error ?? "Upload failed.");
        return;
      }
      setImages((prev) => [...prev, ...data.urls]);
    } catch {
      setFormError("Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    const payload = {
      name,
      description,
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : null,
      images,
      category,
      ageRange,
      pieceCount: Number(pieceCount),
      stock: Number(stock),
      isNew,
      isBestSeller,
      isSale,
    };
    try {
      await onSubmit(payload);
    } catch (err) {
      const data = err as { errors?: FieldErrors; error?: string };
      if (data.errors) setErrors(data.errors);
      setFormError(data.error ?? "Could not save product.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-5 md:p-7">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Name" error={errors.name} className="md:col-span-2">
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Description" error={errors.description} className="md:col-span-2">
          <textarea className="input min-h-28" value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
        <Field label="Price (MMK)" error={errors.price}>
          <input className="input" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} />
        </Field>
        <Field label="Sale price (MMK)" error={errors.salePrice}>
          <input className="input" inputMode="numeric" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} />
        </Field>
        <Field label="Category" error={errors.category}>
          <select
            className="input"
            value={category}
            onChange={(e) => setCategory(e.target.value as CategoryId)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Age range" error={errors.ageRange}>
          <input className="input" value={ageRange} onChange={(e) => setAgeRange(e.target.value)} placeholder="8+" />
        </Field>
        <Field label="Piece count" error={errors.pieceCount}>
          <input className="input" inputMode="numeric" value={pieceCount} onChange={(e) => setPieceCount(e.target.value)} />
        </Field>
        <Field label="Stock" error={errors.stock}>
          <input className="input" inputMode="numeric" value={stock} onChange={(e) => setStock(e.target.value)} />
        </Field>
      </div>

      <div className="mt-5 flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} />
          Mark as New
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={isBestSeller} onChange={(e) => setIsBestSeller(e.target.checked)} />
          Best Seller
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={isSale} onChange={(e) => setIsSale(e.target.checked)} />
          On Sale
        </label>
      </div>

      <div className="mt-6">
        <p className="label">Product images</p>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          multiple
          onChange={(e) => upload(e.target.files)}
        />
        {uploading ? <p className="mt-2 text-sm text-muted">Uploading…</p> : null}
        <div className="mt-3 grid grid-cols-3 gap-3 md:grid-cols-5">
          {images.map((src) => (
            <div key={src} className="relative overflow-hidden rounded-xl border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="aspect-square w-full object-cover" />
              <button
                type="button"
                className="absolute right-1 top-1 rounded-full bg-white px-2 text-xs"
                onClick={() => setImages((prev) => prev.filter((i) => i !== src))}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted">If you skip images, the shop shows original brick artwork for the set.</p>
      </div>

      {formError ? <p className="mt-4 text-sm text-red">{formError}</p> : null}
      <button type="submit" className="btn btn-primary mt-6" disabled={saving}>
        {saving ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="label">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-sm text-red">{error}</span> : null}
    </label>
  );
}
