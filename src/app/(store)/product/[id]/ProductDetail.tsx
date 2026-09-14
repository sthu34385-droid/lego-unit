"use client";

import { useState } from "react";
import Link from "next/link";
import type { Category, Product } from "@/lib/types";
import { ProductMedia } from "@/components/product/ProductMedia";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { effectivePrice, formatMMK, formatPieces } from "@/lib/format";
import { hasNumber, hasText, isOutOfStock, maxQuantity } from "@/lib/display";

export function ProductDetail({ product, categories }: { product: Product; categories: Category[] }) {
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const category = categories.find((c) => c.id === product.category);
  const price = effectivePrice(product);
  const extraImages = product.images.slice(1).filter(Boolean);
  const out = isOutOfStock(product.stock);
  const showSale = hasNumber(product.salePrice) && product.salePrice > 0 && product.salePrice < product.price;

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <div className="overflow-hidden rounded-[1.8rem] border border-line bg-white">
          <div className="aspect-[4/3]">
            <ProductMedia product={product} index={active} />
          </div>
        </div>
        {extraImages.length > 0 ? (
          <div className="mt-3 grid grid-cols-4 gap-3">
            {product.images.filter(Boolean).map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setActive(i)}
                className={`overflow-hidden rounded-2xl border ${active === i ? "border-ink" : "border-line"} bg-white`}
              >
                <div className="aspect-[4/3]">
                  <ProductMedia product={product} index={i} />
                </div>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div>
        {category ? (
          <Link href={`/shop?category=${product.category}`} className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            {category.name}
          </Link>
        ) : null}
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">{product.name}</h1>
        <div className="mt-6">
          {showSale ? <p className="text-sm text-muted line-through">{formatMMK(product.price)}</p> : null}
          <p className="text-3xl font-semibold">{formatMMK(price)}</p>
        </div>
        {hasText(product.description) ? (
          <p className="mt-5 text-[1.02rem] leading-7 text-muted">{product.description}</p>
        ) : null}
        {hasText(product.sku) || hasNumber(product.pieceCount) || hasText(product.ageRange) || hasNumber(product.stock) || category ? (
          <dl className="mt-8 grid grid-cols-2 gap-3 text-sm">
            {hasText(product.sku) ? (
              <div className="rounded-2xl bg-white p-4">
                <dt className="text-muted">Product code</dt>
                <dd className="mt-1 font-semibold">{product.sku}</dd>
              </div>
            ) : null}
            {hasNumber(product.pieceCount) ? (
              <div className="rounded-2xl bg-white p-4">
                <dt className="text-muted">Pieces</dt>
                <dd className="mt-1 font-semibold">{formatPieces(product.pieceCount)}</dd>
              </div>
            ) : null}
            {hasText(product.ageRange) ? (
              <div className="rounded-2xl bg-white p-4">
                <dt className="text-muted">Age</dt>
                <dd className="mt-1 font-semibold">{product.ageRange}</dd>
              </div>
            ) : null}
            {hasNumber(product.stock) ? (
              <div className="rounded-2xl bg-white p-4">
                <dt className="text-muted">Stock</dt>
                <dd className="mt-1 font-semibold">{out ? "Out of stock" : `${product.stock} available`}</dd>
              </div>
            ) : null}
            {category ? (
              <div className="rounded-2xl bg-white p-4">
                <dt className="text-muted">Category</dt>
                <dd className="mt-1 font-semibold">{category.name}</dd>
              </div>
            ) : null}
          </dl>
        ) : null}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <QuantitySelector value={qty} min={1} max={maxQuantity(product.stock)} onChange={setQty} />
          <div className="sm:flex-1">
            <AddToCartButton product={product} quantity={qty} disabled={out} />
          </div>
        </div>
      </div>
    </div>
  );
}
