"use client";

import Link from "next/link";
import { ProductBadge } from "./ProductBadge";
import { ProductMedia } from "./ProductMedia";
import { AddToCartButton } from "./AddToCartButton";
import { effectivePrice, formatMMK, formatPieces } from "@/lib/format";
import { getCategory } from "@/lib/categories";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const price = effectivePrice(product);
  const category = getCategory(product.category);
  const out = product.stock <= 0;

  return (
    <article className="card group flex h-full min-w-0 flex-col transition duration-200 hover:-translate-y-1 hover:shadow-hover">
      <Link href={`/product/${product.id}`} className="relative block aspect-[4/3] overflow-hidden rounded-t-[1.25rem] bg-[#efece6]">
        <ProductMedia product={product} className="transition duration-500 group-hover:scale-[1.03]" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.isNew ? <ProductBadge kind="NEW" /> : null}
          {product.isBestSeller ? <ProductBadge kind="BEST SELLER" /> : null}
          {product.isSale ? <ProductBadge kind="SALE" /> : null}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{category.name}</p>
          <Link href={`/product/${product.id}`} className="mt-1 block text-[1.02rem] font-semibold leading-snug">
            {product.name}
          </Link>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-muted">
          <span className="rounded-full bg-paper px-2 py-1">{product.ageRange}</span>
          <span className="rounded-full bg-paper px-2 py-1">{formatPieces(product.pieceCount)}</span>
        </div>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-2">
          <div>
            {product.isSale && product.salePrice ? (
              <p className="text-xs text-muted line-through">{formatMMK(product.price)}</p>
            ) : null}
            <p className="text-base font-semibold">{formatMMK(price)}</p>
          </div>
          <AddToCartButton product={product} compact disabled={out} />
        </div>
        {out ? <p className="text-xs font-medium text-red">Out of stock</p> : null}
      </div>
    </article>
  );
}
