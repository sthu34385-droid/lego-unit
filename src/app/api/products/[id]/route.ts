import { NextResponse } from "next/server";
import { deleteProduct, getProduct, updateProduct } from "@/lib/products";
import { isAdminRequest } from "@/lib/auth";
import { isCategoryId, validateProduct } from "@/lib/validation";
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
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const input = {
    name: String(body.name ?? ""),
    description: String(body.description ?? ""),
    price: Number(body.price),
    salePrice: body.salePrice == null || body.salePrice === "" ? null : Number(body.salePrice),
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

  const product = await updateProduct(id, {
    ...input,
    category: input.category,
    salePrice: input.isSale ? input.salePrice : null,
  });

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
