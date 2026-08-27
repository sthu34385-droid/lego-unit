import { CURRENCY } from "./constants";
import type { Product } from "./types";

export function formatMMK(amount: number): string {
  const rounded = Math.round(amount);
  return `${rounded.toLocaleString("en-US")} ${CURRENCY}`;
}

export function effectivePrice(product: Pick<Product, "price" | "salePrice" | "isSale">): number {
  if (product.isSale && product.salePrice && product.salePrice > 0 && product.salePrice < product.price) {
    return product.salePrice;
  }
  return product.price;
}

export function formatPieces(count: number): string {
  return `${count.toLocaleString("en-US")} pcs`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}
