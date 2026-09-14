"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useToast } from "@/components/ui/Toast";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/cn";
import { isOutOfStock } from "@/lib/display";

export function AddToCartButton({
  product,
  quantity = 1,
  compact = false,
  disabled = false,
}: {
  product: Product;
  quantity?: number;
  compact?: boolean;
  disabled?: boolean;
}) {
  const add = useCartStore((s) => s.add);
  const { toast } = useToast();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || isOutOfStock(product.stock)) return;
    add(product.id, quantity);
    toast("Added to cart", { href: "/cart", hrefLabel: "Cart" });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isOutOfStock(product.stock)}
      className={cn(
        compact ? "btn btn-primary h-10 shrink-0 px-3 text-sm" : "btn btn-primary w-full",
      )}
    >
      <ShoppingBag size={compact ? 15 : 17} />
      {compact ? "Add" : "Add to Cart"}
    </button>
  );
}
