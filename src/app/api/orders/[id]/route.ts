import { NextResponse } from "next/server";
import { getOrder, updateOrderStatus, deleteOrder } from "@/lib/orders";
import { isAdminRequest } from "@/lib/auth";
import { ORDER_STATUSES } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const order = await getOrder(id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json(order);
}

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const status = body.status;
  if (!status || !ORDER_STATUSES.includes(status as (typeof ORDER_STATUSES)[number])) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const order = await updateOrderStatus(id, status as (typeof ORDER_STATUSES)[number]);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json(order);
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const ok = await deleteOrder(id);
  if (!ok) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
