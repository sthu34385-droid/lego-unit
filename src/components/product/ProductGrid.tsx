import { ProductCard } from "./ProductCard";
import type { Category, Product } from "@/lib/types";

export function ProductGrid({ products, categories }: { products: Product[]; categories: Category[] }) {
  if (products.length === 0) {
    return (
      <div className="card px-6 py-16 text-center">
        <p className="text-lg font-semibold">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} categories={categories} />
      ))}
    </div>
  );
}
