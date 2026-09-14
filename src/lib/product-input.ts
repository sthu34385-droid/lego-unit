import { optionalNumber, optionalText, type ProductInput } from "@/lib/validation";

export function parseProductBody(body: Record<string, unknown>): ProductInput {
  const images = Array.isArray(body.images) ? body.images.map(String).filter(Boolean) : [];
  const salePrice = optionalNumber(body.salePrice);
  const price = optionalNumber(body.price);
  return {
    name: String(body.name ?? ""),
    description: optionalText(body.description),
    price: price ?? Number.NaN,
    salePrice,
    images,
    category: String(body.category ?? ""),
    ageRange: optionalText(body.ageRange),
    pieceCount: optionalNumber(body.pieceCount),
    stock: optionalNumber(body.stock),
    sku: optionalText(body.sku),
    isNew: Boolean(body.isNew),
    isBestSeller: Boolean(body.isBestSeller),
    isSale: Boolean(body.isSale) || (salePrice != null && salePrice > 0),
  };
}
