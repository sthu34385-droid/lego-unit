import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export function CategoryGrid() {
  return (
    <section className="container-page py-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Browse</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">Categories</h2>
        </div>
        <Link href="/shop" className="text-sm font-semibold hover:underline">
          All sets
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.id}`}
            className="card group overflow-hidden p-4 transition hover:-translate-y-0.5 hover:shadow-hover"
          >
            <div className="mb-4 flex gap-1">
              {cat.colors.slice(0, 4).map((color) => (
                <span key={color} className="h-3 w-3 rounded-sm" style={{ background: color }} />
              ))}
            </div>
            <p className="font-semibold">{cat.name}</p>
            <p className="mt-1 text-xs leading-5 text-muted">{cat.tagline}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
