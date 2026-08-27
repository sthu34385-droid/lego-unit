import type { Product } from "@/lib/types";
import { ProductArt } from "./ProductArt";
import { cn } from "@/lib/cn";

type Props = {
  product: Pick<Product, "id" | "name" | "category" | "images">;
  className?: string;
  variant?: number;
  index?: number;
};

export function ProductMedia({ product, className, variant = 0, index = 0 }: Props) {
  const src = product.images[index] ?? product.images[0];
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={product.name} className={cn("block h-full w-full object-cover", className)} />
    );
  }
  return <ProductArt product={product} variant={variant} className={className} />;
}
