import { NextResponse } from "next/server";
import { createOrder, listOrders } from "@/lib/orders";
import { isAdminRequest } from "@/lib/auth";
import { isPaymentMethod, normalizePhone, validateCheckout } from "@/lib/validation";
import type { CartItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const orders = await listOrders();
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const paymentMethod = String(body.paymentMethod ?? "");
  const items = Array.isArray(body.items)
    ? (body.items as CartItem[]).map((item) => ({
        productId: String(item.productId),
        quantity: Number(item.quantity),
      }))
    : [];

  const payload = {
    customerName: String(body.customerName ?? ""),
    phone: normalizePhone(String(body.phone ?? "")),
    address: String(body.address ?? ""),
    note: String(body.note ?? ""),
    paymentMethod: isPaymentMethod(paymentMethod) ? paymentMethod : ("" as never),
    items,
  };

  const errors = validateCheckout(payload);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Please check the form.", errors }, { status: 400 });
  }

  try {
    const order = await createOrder(payload);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not place order.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
