import { NextResponse } from "next/server";
import { listOrders } from "@/lib/orders";
import { isAdminRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const orders = await listOrders();
  return NextResponse.json(orders);
}
