import { listProducts } from "@/lib/products";
import { listCategories } from "@/lib/category-store";
import { ShopClient } from "./ShopClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shop",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [products, categories] = await Promise.all([listProducts(), listCategories()]);
  const params = await searchParams;
  const pick = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  return (
    <ShopClient
      products={products}
      categories={categories}
      initialQuery={pick("q") ?? ""}
      initialCategory={pick("category") ?? ""}
      initialSort={pick("sort") ?? "newest"}
    />
  );
}
