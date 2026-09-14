"use client";

import { useEffect, useState } from "react";
import type { Category, Product } from "@/lib/types";
import type { FieldErrors } from "@/lib/validation";

type Props = {
  product?: Product;
  submitLabel: string;
  onSubmit: (payload: Record<string, unknown>) => Promise<void>;
};

export function ProductForm({ product, submitLabel, onSubmit }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price != null ? String(product.price) : "");
  const [salePrice, setSalePrice] = useState(product?.salePrice != null ? String(product.salePrice) : "");
  const [category, setCategory] = useState(product?.category ?? "");
  const [ageRange, setAgeRange] = useState(product?.ageRange ?? "");
  const [pieceCount, setPieceCount] = useState(product?.pieceCount != null ? String(product.pieceCount) : "");
  const [stock, setStock] = useState(product?.stock != null ? String(product.stock) : "");
  const [sku, setSku] = useState(product?.sku ?? "");
  const [isNew, setIsNew] = useState(product?.isNew ?? false);
  const [isBestSeller, setIsBestSeller] = useState(product?.isBestSeller ?? false);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => setCategories([]));
  }, []);

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
      description: description.trim() || null,
      price: price === "" ? NaN : Number(price),
      salePrice: salePrice === "" ? null : Number(salePrice),
      images,
      category,
      ageRange: ageRange.trim() || null,
      pieceCount: pieceCount === "" ? null : Number(pieceCount),
      stock: stock === "" ? null : Number(stock),
      sku: sku.trim() || null,
      isNew,
      isBestSeller,
      isSale: salePrice !== "",
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

  const mainImage = images[0];
  const extraImages = images.slice(1);

  return (
    <form onSubmit={handleSubmit} className="card p-5 md:p-7">
      <p className="text-sm text-muted">Required: name, price, category, and a main image.</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Field label="Product name" required error={errors.name} className="md:col-span-2">
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Price (MMK)" required error={errors.price}>
          <input className="input" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} />
        </Field>
        <Field label="Category" required error={errors.category}>
          <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Description" className="md:col-span-2">
          <textarea className="input min-h-28" value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
        <Field label="Discount price (MMK)" error={errors.salePrice}>
          <input className="input" inputMode="decimal" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} />
        </Field>
        <Field label="Product code">
          <input className="input" value={sku} onChange={(e) => setSku(e.target.value)} />
        </Field>
        <Field label="Stock" error={errors.stock}>
          <input className="input" inputMode="numeric" value={stock} onChange={(e) => setStock(e.target.value)} />
        </Field>
        <Field label="Age range">
          <input className="input" value={ageRange} onChange={(e) => setAgeRange(e.target.value)} />
        </Field>
        <Field label="Piece count" error={errors.pieceCount}>
          <input className="input" inputMode="numeric" value={pieceCount} onChange={(e) => setPieceCount(e.target.value)} />
        </Field>
      </div>

      <div className="mt-6">
        <p className="label">
          Main image <span className="text-red">*</span>
        </p>
        {errors.images ? <p className="mt-1 text-sm text-red">{errors.images}</p> : null}
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          multiple
          onChange={(e) => upload(e.target.files)}
          className="mt-2"
        />
        {uploading ? <p className="mt-2 text-sm text-muted">Uploading…</p> : null}
        {mainImage ? (
          <div className="mt-3 max-w-40">
            <p className="mb-1 text-xs text-muted">Main</p>
            <div className="relative overflow-hidden rounded-xl border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mainImage} alt="" className="aspect-square w-full object-cover" />
              <button
                type="button"
                className="absolute right-1 top-1 rounded-full bg-white px-2 text-xs"
                onClick={() => setImages((prev) => prev.slice(1))}
              >
                Remove
              </button>
            </div>
          </div>
        ) : null}
        {extraImages.length > 0 ? (
          <div className="mt-4">
            <p className="mb-1 text-xs text-muted">Additional images</p>
            <div className="grid grid-cols-3 gap-3 md:grid-cols-5">
              {extraImages.map((src) => (
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
          </div>
        ) : null}
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
  required,
  className,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="label">
        {label}
        {required ? <span className="text-red"> *</span> : null}
      </span>
      {children}
      {error ? <span className="mt-1 block text-sm text-red">{error}</span> : null}
    </label>
  );
}
