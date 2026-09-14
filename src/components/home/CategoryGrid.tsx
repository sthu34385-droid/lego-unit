import Link from "next/link";
import { listCategories } from "@/lib/category-store";
import { categorySwatch } from "@/lib/display";

export async function CategoryGrid() {
  const categories = await listCategories();
  if (categories.length === 0) return null;

  return (
    <section className="container-page py-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Categories</h2>
        <Link href="/shop" className="text-sm font-semibold hover:underline">
          All products
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.id}`}
            className="card group overflow-hidden p-4 transition hover:-translate-y-0.5 hover:shadow-hover"
          >
            <span className="mb-3 block h-2 w-8 rounded-full" style={{ background: categorySwatch(cat.id) }} />
            <p className="font-semibold">{cat.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
