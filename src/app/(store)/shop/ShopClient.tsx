"use client";

import { useMemo, useState } from "react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { effectivePrice } from "@/lib/format";
import type { Category, Product } from "@/lib/types";

type Props = {
  products: Product[];
  categories: Category[];
  initialQuery: string;
  initialCategory: string;
  initialSort: string;
};

export function ShopClient({
  products,
  categories,
  initialQuery,
  initialCategory,
  initialSort,
}: Props) {
  const [q, setQ] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort || "newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const filtered = useMemo(() => {
    let list = [...products];
    const query = q.trim().toLowerCase();
    if (query) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          (p.description ?? "").toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          (p.sku ?? "").toLowerCase().includes(query),
      );
    }
    if (category) list = list.filter((p) => p.category === category);
    const min = Number(minPrice);
    const max = Number(maxPrice);
    if (minPrice && !Number.isNaN(min)) list = list.filter((p) => effectivePrice(p) >= min);
    if (maxPrice && !Number.isNaN(max)) list = list.filter((p) => effectivePrice(p) <= max);

    list.sort((a, b) => {
      if (sort === "price-asc") return effectivePrice(a) - effectivePrice(b);
      if (sort === "price-desc") return effectivePrice(b) - effectivePrice(a);
      return b.createdAt.localeCompare(a.createdAt);
    });
    return list;
  }, [products, q, category, sort, minPrice, maxPrice]);

  return (
    <div className="container-page py-8 md:py-12">
      <h1 className="text-4xl font-semibold tracking-tight">Shop</h1>

      <div className="mt-8 grid gap-3 rounded-[1.5rem] border border-line bg-white p-4 md:grid-cols-3">
        <label className="block">
          <span className="label">Search</span>
          <input className="input" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <label className="block">
          <span className="label">Category</span>
          <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            {categories.map((c) => (
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
          />
        </label>
        <label className="block">
          <span className="label">Max price (MMK)</span>
          <input
            className="input"
            inputMode="numeric"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value.replace(/[^\d]/g, ""))}
          />
        </label>
      </div>

      <p className="mt-6 mb-4 text-sm text-muted">{filtered.length} products</p>
      <ProductGrid products={filtered} categories={categories} />
    </div>
  );
}
