import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { listOrders } from "@/lib/orders";
import { listProducts } from "@/lib/products";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [orders, products] = await Promise.all([listOrders(), listProducts()]);
  const paidOrders = orders.filter((o) => o.status !== "Cancelled");
  const totalSales = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const lowStock = products.filter((p) => p.stock <= LOW_STOCK_THRESHOLD);

  const days: { date: string; total: number; count: number }[] = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const dayOrders = paidOrders.filter((o) => o.createdAt.slice(0, 10) === key);
    days.push({
      date: key,
      total: dayOrders.reduce((s, o) => s + o.total, 0),
      count: dayOrders.length,
    });
  }

  return NextResponse.json({
    totalOrders: orders.length,
    totalSales,
    totalProducts: products.length,
    lowStock,
    recentOrders: orders.slice(0, 8),
    salesByDay: days,
  });
}
