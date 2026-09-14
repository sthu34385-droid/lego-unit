import { NextResponse } from "next/server";
import { listProducts, createProduct } from "@/lib/products";
import { listCategories } from "@/lib/category-store";
import { isAdminRequest } from "@/lib/auth";
import { validateProduct } from "@/lib/validation";
import { parseProductBody } from "@/lib/product-input";
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

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const input = parseProductBody(body);
  const categories = await listCategories();
  const errors = validateProduct(input, categories.map((c) => c.id));
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Validation failed", errors }, { status: 400 });
  }

  const product = await createProduct(input);
  revalidatePath("/", "layout");
  return NextResponse.json(product, { status: 201 });
}
