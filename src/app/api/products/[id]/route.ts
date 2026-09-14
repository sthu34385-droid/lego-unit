import { NextResponse } from "next/server";
import { deleteProduct, getProduct, updateProduct } from "@/lib/products";
import { listCategories } from "@/lib/category-store";
import { isAdminRequest } from "@/lib/auth";
import { validateProduct } from "@/lib/validation";
import { parseProductBody } from "@/lib/product-input";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const product = await getProduct(id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PUT(request: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const existing = await getProduct(id);
  if (!existing) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const input = parseProductBody({
    name: body.name ?? existing.name,
    description: body.description === undefined ? existing.description : body.description,
    price: body.price ?? existing.price,
    salePrice: body.salePrice === undefined ? existing.salePrice : body.salePrice,
    images: body.images === undefined ? existing.images : body.images,
    category: body.category ?? existing.category,
    ageRange: body.ageRange === undefined ? existing.ageRange : body.ageRange,
    pieceCount: body.pieceCount === undefined ? existing.pieceCount : body.pieceCount,
    stock: body.stock === undefined ? existing.stock : body.stock,
    sku: body.sku === undefined ? existing.sku : body.sku,
    isNew: body.isNew === undefined ? existing.isNew : body.isNew,
    isBestSeller: body.isBestSeller === undefined ? existing.isBestSeller : body.isBestSeller,
    isSale: body.isSale === undefined ? existing.isSale : body.isSale,
  });

  const categories = await listCategories();
  const errors = validateProduct(input, categories.map((c) => c.id));
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Validation failed", errors }, { status: 400 });
  }

  const product = await updateProduct(id, input);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  revalidatePath("/", "layout");
  return NextResponse.json(product);
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const ok = await deleteProduct(id);
  if (!ok) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
