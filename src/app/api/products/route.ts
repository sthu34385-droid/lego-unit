import { NextResponse } from "next/server";
import { listProducts, createProduct } from "@/lib/products";
import { isAdminRequest } from "@/lib/auth";
import { isCategoryId, validateProduct } from "@/lib/validation";
import type { ProductInput } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = await listProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Partial<ProductInput>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const input: ProductInput = {
    name: String(body.name ?? ""),
    description: String(body.description ?? ""),
    price: Number(body.price),
    salePrice: body.salePrice == null ? null : Number(body.salePrice),
    images: Array.isArray(body.images) ? body.images.map(String) : [],
    category: String(body.category ?? ""),
    ageRange: String(body.ageRange ?? ""),
    pieceCount: Number(body.pieceCount),
    stock: Number(body.stock),
    isNew: Boolean(body.isNew),
    isBestSeller: Boolean(body.isBestSeller),
    isSale: Boolean(body.isSale),
  };

  const errors = validateProduct(input);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Validation failed", errors }, { status: 400 });
  }
  if (!isCategoryId(input.category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  const product = await createProduct({
    ...input,
    category: input.category,
    salePrice: input.isSale ? input.salePrice : null,
  });

  revalidatePath("/", "layout");
  return NextResponse.json(product, { status: 201 });
}
