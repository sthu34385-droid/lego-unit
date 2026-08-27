"use client";

import { useMemo, useState } from "react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CATEGORIES } from "@/lib/categories";
import { effectivePrice } from "@/lib/format";
import type { Product } from "@/lib/types";

type Props = {
  products: Product[];
  initialQuery: string;
  initialCategory: string;
  initialSort: string;
  initialFilter: string;
};

export function ShopClient({
  products,
  initialQuery,
  initialCategory,
  initialSort,
  initialFilter,
}: Props) {
  const [q, setQ] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort || "newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filter, setFilter] = useState(initialFilter);

  const filtered = useMemo(() => {
    let list = [...products];
    const query = q.trim().toLowerCase();
    if (query) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.includes(query),
      );
    }
    if (category) list = list.filter((p) => p.category === category);
    if (filter === "sale") list = list.filter((p) => p.isSale);
    if (filter === "new") list = list.filter((p) => p.isNew);
    const min = Number(minPrice);
    const max = Number(maxPrice);
    if (minPrice && !Number.isNaN(min)) list = list.filter((p) => effectivePrice(p) >= min);
    if (maxPrice && !Number.isNaN(max)) list = list.filter((p) => effectivePrice(p) <= max);

    list.sort((a, b) => {
      if (sort === "price-asc") return effectivePrice(a) - effectivePrice(b);
      if (sort === "price-desc") return effectivePrice(b) - effectivePrice(a);
      if (sort === "popularity") {
        return b.soldCount + (b.isBestSeller ? 50 : 0) - (a.soldCount + (a.isBestSeller ? 50 : 0));
      }
      return b.createdAt.localeCompare(a.createdAt);
    });
    return list;
  }, [products, q, category, sort, minPrice, maxPrice, filter]);

  return (
    <div className="container-page py-8 md:py-12">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Catalog</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Shop building sets</h1>
        <p className="mt-3 text-muted">Search by name, filter by category and price, then sort the way you like.</p>
      </div>

      <div className="mt-8 grid gap-3 rounded-[1.5rem] border border-line bg-white p-4 md:grid-cols-[1.2fr_1fr_1fr]">
        <label className="block">
          <span className="label">Search</span>
          <input
            className="input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Police station, shuttle, treehouse…"
          />
        </label>
        <label className="block">
          <span className="label">Category</span>
          <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="label">Sort</span>
          <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="popularity">Popularity</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </label>
        <label className="block">
          <span className="label">Min price (MMK)</span>
          <input
            className="input"
            inputMode="numeric"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value.replace(/[^\d]/g, ""))}
            placeholder="0"
          />
        </label>
        <label className="block">
          <span className="label">Max price (MMK)</span>
          <input
            className="input"
            inputMode="numeric"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value.replace(/[^\d]/g, ""))}
            placeholder="500000"
          />
        </label>
        <label className="block">
          <span className="label">Show</span>
          <select className="input" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">Everything</option>
            <option value="new">New</option>
            <option value="sale">Sale</option>
          </select>
        </label>
      </div>

      <p className="mt-6 mb-4 text-sm text-muted">{filtered.length} sets</p>
      <ProductGrid products={filtered} />
    </div>
  );
}
