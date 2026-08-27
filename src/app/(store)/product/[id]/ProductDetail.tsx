"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { ProductMedia } from "@/components/product/ProductMedia";
import { ProductBadge } from "@/components/product/ProductBadge";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { getCategory } from "@/lib/categories";
import { effectivePrice, formatMMK, formatPieces } from "@/lib/format";

export function ProductDetail({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const category = getCategory(product.category);
  const price = effectivePrice(product);
  const galleryCount = Math.max(product.images.length, 3);
  const out = product.stock <= 0;

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <div className="overflow-hidden rounded-[1.8rem] border border-line bg-white">
          <div className="aspect-[4/3]">
            <ProductMedia product={product} index={Math.min(active, Math.max(product.images.length - 1, 0))} variant={active} />
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {Array.from({ length: Math.min(galleryCount, 3) }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`overflow-hidden rounded-2xl border ${active === i ? "border-ink" : "border-line"} bg-white`}
            >
              <div className="aspect-[4/3]">
                <ProductMedia product={product} index={i} variant={i} />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <Link href={`/shop?category=${product.category}`} className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          {category.name}
        </Link>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">{product.name}</h1>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.isNew ? <ProductBadge kind="NEW" /> : null}
          {product.isBestSeller ? <ProductBadge kind="BEST SELLER" /> : null}
          {product.isSale ? <ProductBadge kind="SALE" /> : null}
        </div>
        <div className="mt-6">
          {product.isSale && product.salePrice ? (
            <p className="text-sm text-muted line-through">{formatMMK(product.price)}</p>
          ) : null}
          <p className="text-3xl font-semibold">{formatMMK(price)}</p>
        </div>
        <p className="mt-5 text-[1.02rem] leading-7 text-muted">{product.description}</p>
        <dl className="mt-8 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-white p-4">
            <dt className="text-muted">Pieces</dt>
            <dd className="mt-1 font-semibold">{formatPieces(product.pieceCount)}</dd>
          </div>
          <div className="rounded-2xl bg-white p-4">
            <dt className="text-muted">Age</dt>
            <dd className="mt-1 font-semibold">{product.ageRange}</dd>
          </div>
          <div className="rounded-2xl bg-white p-4">
            <dt className="text-muted">Stock</dt>
            <dd className="mt-1 font-semibold">{out ? "Out of stock" : `${product.stock} available`}</dd>
          </div>
          <div className="rounded-2xl bg-white p-4">
            <dt className="text-muted">Category</dt>
            <dd className="mt-1 font-semibold">{category.name}</dd>
          </div>
        </dl>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <QuantitySelector value={qty} min={1} max={Math.max(product.stock, 1)} onChange={setQty} />
          <div className="sm:flex-1">
            <AddToCartButton product={product} quantity={qty} disabled={out} />
          </div>
        </div>
      </div>
    </div>
  );
}
