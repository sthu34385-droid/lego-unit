"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import type { Product } from "@/lib/types";
import { ProductMedia } from "@/components/product/ProductMedia";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { TelegramOrderButton } from "@/components/cart/TelegramOrderButton";
import { effectivePrice, formatMMK } from "@/lib/format";
import { getDeliveryFee } from "@/lib/constants";
import { maxQuantity } from "@/lib/display";

export function CartClient() {
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);
  const hydrated = useCartStore((s) => s.hydrated);
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  if (!hydrated || products === null) {
    return <p className="mt-8 text-muted">Loading cart…</p>;
  }

  const lines = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { item, product } : null;
    })
    .filter((line): line is { item: (typeof items)[number]; product: Product } => Boolean(line));

  if (lines.length === 0) {
    return (
      <div className="card mt-8 px-6 py-16 text-center">
        <p className="text-lg font-semibold">Your cart is empty.</p>
        <Link href="/shop" className="btn btn-primary mt-6">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const subtotal = lines.reduce((sum, line) => sum + effectivePrice(line.product) * line.item.quantity, 0);
  const delivery = getDeliveryFee(subtotal);
  const total = subtotal + delivery;

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
      <div className="space-y-3">
        {lines.map(({ item, product }) => {
          const price = effectivePrice(product);
          return (
            <div key={product.id} className="card flex gap-4 p-3 md:p-4">
              <Link href={`/product/${product.id}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-paper">
                <ProductMedia product={product} />
              </Link>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link href={`/product/${product.id}`} className="font-semibold">
                      {product.name}
                    </Link>
                    <p className="mt-1 text-sm text-muted">{formatMMK(price)}</p>
                  </div>
                  <button type="button" className="text-sm text-red" onClick={() => remove(product.id)}>
                    Remove
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <QuantitySelector
                    value={item.quantity}
                    max={maxQuantity(product.stock)}
                    onChange={(value) => setQuantity(product.id, value)}
                  />
                  <p className="font-semibold">{formatMMK(price * item.quantity)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <aside className="card h-fit p-5">
        <h2 className="text-lg font-semibold">Summary</h2>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Subtotal</span>
            <span>{formatMMK(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Delivery</span>
            <span>{delivery === 0 ? "Free" : formatMMK(delivery)}</span>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-base font-semibold">
            <span>Total</span>
            <span>{formatMMK(total)}</span>
          </div>
        </div>
        <TelegramOrderButton
          className="mt-6"
          deliveryFee={delivery}
          lines={lines.map(({ item, product }) => ({
            name: product.name,
            quantity: item.quantity,
            unitPrice: effectivePrice(product),
          }))}
        />
        <Link href="/shop" className="btn btn-ghost mt-3 w-full">
          Continue Shopping
        </Link>
      </aside>
    </div>
  );
}
