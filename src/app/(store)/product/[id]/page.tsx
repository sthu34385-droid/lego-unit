import { notFound } from "next/navigation";
import { getProduct, listProducts } from "@/lib/products";
import { listCategories } from "@/lib/category-store";
import { ProductDetail } from "./ProductDetail";
import { ProductGrid } from "@/components/product/ProductGrid";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  return { title: product?.name ?? "Product" };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();
  const [products, categories] = await Promise.all([listProducts(), listCategories()]);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="container-page py-8 md:py-12">
      <ProductDetail product={product} categories={categories} />
      {related.length > 0 ? (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">More in this category</h2>
          <ProductGrid products={related} categories={categories} />
        </section>
      ) : null}
    </div>
  );
}
