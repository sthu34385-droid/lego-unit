import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/lib/types";

export function ProductSection({
  title,
  eyebrow,
  products,
  href,
}: {
  title: string;
  eyebrow: string;
  products: Product[];
  href: string;
}) {
  if (products.length === 0) return null;
  return (
    <section className="container-page py-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{eyebrow}</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
        </div>
        <Link href={href} className="text-sm font-semibold hover:underline">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
