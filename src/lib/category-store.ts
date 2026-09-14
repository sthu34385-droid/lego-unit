import { slugify } from "./format";
import { readJson, writeJson } from "./store";
import type { Category } from "./types";

const FILE = "categories.json";

export const SEED_CATEGORIES: Category[] = [
  { id: "city", name: "City", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "technic", name: "Technic", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "creator", name: "Creator", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "friends", name: "Friends", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "cars", name: "Cars", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "architecture", name: "Architecture", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "space", name: "Space", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "animals", name: "Animals", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "kids", name: "Kids", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "other", name: "Other", createdAt: "2026-01-01T00:00:00.000Z" },
];

async function getAll(): Promise<Category[]> {
  const categories = await readJson<Category[]>(FILE, SEED_CATEGORIES);
  if (categories.length === 0) {
    await writeJson(FILE, SEED_CATEGORIES);
    return SEED_CATEGORIES;
  }
  return categories;
}

export async function listCategories(): Promise<Category[]> {
  const categories = await getAll();
  return [...categories].sort((a, b) => a.name.localeCompare(b.name));
}

export async function getCategory(id: string): Promise<Category | undefined> {
  const categories = await getAll();
  return categories.find((c) => c.id === id);
}

export async function createCategory(name: string): Promise<Category> {
  const trimmed = name.trim();
  const categories = await getAll();
  const base = slugify(trimmed) || "category";
  let id = base;
  let n = 1;
  while (categories.some((c) => c.id === id)) {
    n += 1;
    id = `${base}-${n}`;
  }
  const category: Category = {
    id,
    name: trimmed,
    createdAt: new Date().toISOString(),
  };
  categories.push(category);
  await writeJson(FILE, categories);
  return category;
}

export async function renameCategory(id: string, name: string): Promise<Category | undefined> {
  const trimmed = name.trim();
  const categories = await getAll();
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) return undefined;
  categories[index] = { ...categories[index], name: trimmed };
  await writeJson(FILE, categories);
  return categories[index];
}

export async function deleteCategory(id: string): Promise<boolean> {
  const categories = await getAll();
  const next = categories.filter((c) => c.id !== id);
  if (next.length === categories.length) return false;
  await writeJson(FILE, next);
  return true;
}
