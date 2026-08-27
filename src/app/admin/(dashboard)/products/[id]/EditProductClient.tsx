"use client";

import { useRouter } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import type { Product } from "@/lib/types";

export function EditProductClient({ product }: { product: Product }) {
  const router = useRouter();

  async function onSubmit(payload: Record<string, unknown>) {
    const res = await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw data;
    router.push("/admin/products");
    router.refresh();
  }

  return <ProductForm product={product} onSubmit={onSubmit} submitLabel="Save changes" />;
}
