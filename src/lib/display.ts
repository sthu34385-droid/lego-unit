export function hasText(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const text = value.trim();
  return text.length > 0 && text !== "null" && text !== "undefined";
}

export function hasNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function isOutOfStock(stock: number | null | undefined): boolean {
  return hasNumber(stock) && stock <= 0;
}

export function maxQuantity(stock: number | null | undefined): number {
  if (!hasNumber(stock)) return 99;
  return Math.max(stock, 1);
}

const SWATCHES = ["#d01012", "#ffd400", "#006cb7", "#00944a", "#f57c00", "#111111", "#e85d8c", "#0b1d36"];

export function categorySwatch(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash + id.charCodeAt(i) * (i + 1)) % SWATCHES.length;
  return SWATCHES[hash];
}
