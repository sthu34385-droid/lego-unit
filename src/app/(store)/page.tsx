import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProductSection } from "@/components/home/ProductSection";
import { listProducts } from "@/lib/products";
import { listCategories } from "@/lib/category-store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, categories] = await Promise.all([listProducts(), listCategories()]);
  const latest = [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8);

  return (
    <>
      <Hero />
      <CategoryGrid />
      <ProductSection title="Products" products={latest} href="/shop" categories={categories} />
    </>
  );
}
