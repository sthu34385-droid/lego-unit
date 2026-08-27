import { slugify } from "./format";
import { readJson, writeJson } from "./store";
import type { Product } from "./types";
import { SEED_PRODUCTS } from "./seed";

const FILE = "products.json";

async function getAll(): Promise<Product[]> {
  const products = await readJson<Product[]>(FILE, SEED_PRODUCTS);
  if (products.length === 0) {
    await writeJson(FILE, SEED_PRODUCTS);
    return SEED_PRODUCTS;
  }
  return products;
}

export async function listProducts(): Promise<Product[]> {
  const products = await getAll();
  return [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getProduct(id: string): Promise<Product | undefined> {
  const products = await getAll();
  return products.find((p) => p.id === id);
}

export async function createProduct(
  input: Omit<Product, "id" | "createdAt" | "soldCount">,
): Promise<Product> {
  const products = await getAll();
  const base = slugify(input.name) || "set";
  let id = base;
  let n = 1;
  while (products.some((p) => p.id === id)) {
    n += 1;
    id = `${base}-${n}`;
  }
  const product: Product = {
    ...input,
    id,
    soldCount: 0,
    createdAt: new Date().toISOString(),
  };
  products.unshift(product);
  await writeJson(FILE, products);
  return product;
}

export async function updateProduct(
  id: string,
  patch: Partial<Omit<Product, "id" | "createdAt">>,
): Promise<Product | undefined> {
  const products = await getAll();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return undefined;
  const next = { ...products[index], ...patch, id };
  products[index] = next;
  await writeJson(FILE, products);
  return next;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const products = await getAll();
  const next = products.filter((p) => p.id !== id);
  if (next.length === products.length) return false;
  await writeJson(FILE, next);
  return true;
}

export async function recordSales(lines: { id: string; quantity: number }[]): Promise<void> {
  const products = await getAll();
  for (const line of lines) {
    const index = products.findIndex((p) => p.id === line.id);
    if (index === -1) continue;
    products[index] = {
      ...products[index],
      stock: Math.max(0, products[index].stock - line.quantity),
      soldCount: products[index].soldCount + line.quantity,
    };
  }
  await writeJson(FILE, products);
}
