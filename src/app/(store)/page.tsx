import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProductSection } from "@/components/home/ProductSection";
import { PromoBanner } from "@/components/home/PromoBanner";
import { listProducts } from "@/lib/products";
import { effectivePrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await listProducts();
  const featured = [...products]
    .sort((a, b) => b.soldCount + (b.isBestSeller ? 40 : 0) - (a.soldCount + (a.isBestSeller ? 40 : 0)))
    .slice(0, 4);
  const newest = [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4);
  const bestsellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const sale = products.filter((p) => p.isSale && effectivePrice(p) < p.price).slice(0, 4);

  return (
    <>
      <Hero />
      <ProductSection title="Featured" eyebrow="Start here" products={featured} href="/shop?sort=popularity" />
      <CategoryGrid />
      <ProductSection title="New arrivals" eyebrow="Just in" products={newest} href="/shop?sort=newest" />
      <PromoBanner />
      <ProductSection title="Best sellers" eyebrow="Most loved" products={bestsellers} href="/shop?sort=popularity" />
      <ProductSection title="Sale" eyebrow="Limited extras" products={sale} href="/shop?filter=sale" />
    </>
  );
}
