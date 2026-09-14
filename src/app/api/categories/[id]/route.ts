import { NextResponse } from "next/server";
import { deleteCategory, getCategory, renameCategory } from "@/lib/category-store";
import { countProductsByCategory } from "@/lib/products";
import { isAdminRequest } from "@/lib/auth";
import { validateCategoryName } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const category = await getCategory(id);
  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }
  return NextResponse.json(category);
}

export async function PUT(request: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  let body: { name?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const error = validateCategoryName(String(body.name ?? ""));
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const category = await renameCategory(id, String(body.name));
  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  revalidatePath("/", "layout");
  return NextResponse.json(category);
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const category = await getCategory(id);
  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  const inUse = await countProductsByCategory(id);
  if (inUse > 0) {
    return NextResponse.json(
      {
        error: `Cannot delete “${category.name}”. ${inUse} product${inUse === 1 ? "" : "s"} still use this category. Reassign them first.`,
        count: inUse,
      },
      { status: 409 },
    );
  }

  const ok = await deleteCategory(id);
  if (!ok) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
