"use client";

import Link from "next/link";
import { ProductMedia } from "./ProductMedia";
import { AddToCartButton } from "./AddToCartButton";
import { effectivePrice, formatMMK, formatPieces } from "@/lib/format";
import { hasNumber, hasText, isOutOfStock } from "@/lib/display";
import type { Category, Product } from "@/lib/types";

export function ProductCard({ product, categories }: { product: Product; categories: Category[] }) {
  const price = effectivePrice(product);
  const category = categories.find((c) => c.id === product.category);
  const out = isOutOfStock(product.stock);
  const showSale = hasNumber(product.salePrice) && product.salePrice > 0 && product.salePrice < product.price;

  return (
    <article className="card group flex h-full min-w-0 flex-col transition duration-200 hover:-translate-y-1 hover:shadow-hover">
      <Link href={`/product/${product.id}`} className="relative block aspect-[4/3] overflow-hidden rounded-t-[1.25rem] bg-[#efece6]">
        <ProductMedia product={product} className="transition duration-500 group-hover:scale-[1.03]" />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          {category ? (
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{category.name}</p>
          ) : null}
          <Link href={`/product/${product.id}`} className="mt-1 block text-[1.02rem] font-semibold leading-snug">
            {product.name}
          </Link>
        </div>
        {hasText(product.ageRange) || hasNumber(product.pieceCount) ? (
          <div className="flex flex-wrap gap-2 text-xs text-muted">
            {hasText(product.ageRange) ? (
              <span className="rounded-full bg-paper px-2 py-1">{product.ageRange}</span>
            ) : null}
            {hasNumber(product.pieceCount) ? (
              <span className="rounded-full bg-paper px-2 py-1">{formatPieces(product.pieceCount)}</span>
            ) : null}
          </div>
        ) : null}
        <div className="mt-auto flex flex-wrap items-end justify-between gap-2">
          <div>
            {showSale ? <p className="text-xs text-muted line-through">{formatMMK(product.price)}</p> : null}
            <p className="text-base font-semibold">{formatMMK(price)}</p>
          </div>
          <AddToCartButton product={product} compact disabled={out} />
        </div>
        {out ? <p className="text-xs font-medium text-red">Out of stock</p> : null}
      </div>
    </article>
  );
}
