"use client";

import { useRouter } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  const router = useRouter();

  async function onSubmit(payload: Record<string, unknown>) {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw data;
    }
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Add product</h1>
      <p className="mt-1 text-muted">New sets appear in the shop immediately.</p>
      <div className="mt-6">
        <ProductForm onSubmit={onSubmit} submitLabel="Create product" />
      </div>
    </div>
  );
}
