import { NextResponse } from "next/server";
import { createCategory, listCategories } from "@/lib/category-store";
import { isAdminRequest } from "@/lib/auth";
import { validateCategoryName } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  const categories = await listCategories();
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  const category = await createCategory(String(body.name));
  revalidatePath("/", "layout");
  return NextResponse.json(category, { status: 201 });
}
