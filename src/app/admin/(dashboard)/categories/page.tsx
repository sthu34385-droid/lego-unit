import { listCategories } from "@/lib/category-store";
import { CategoriesClient } from "./CategoriesClient";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await listCategories();
  return <CategoriesClient initialCategories={categories} />;
}
