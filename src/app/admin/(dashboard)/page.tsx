import Link from "next/link";
import { listOrders } from "@/lib/orders";
import { listProducts } from "@/lib/products";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants";
import { formatDateTime, formatMMK } from "@/lib/format";
import { hasNumber } from "@/lib/display";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [orders, products] = await Promise.all([listOrders(), listProducts()]);
  const paid = orders.filter((o) => o.status !== "Cancelled");
  const totalSales = paid.reduce((sum, o) => sum + o.total, 0);
  const lowStock = products.filter((p) => hasNumber(p.stock) && p.stock <= LOW_STOCK_THRESHOLD);
  const recent = orders.slice(0, 8);

  const salesByDay = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    const dayOrders = paid.filter((o) => o.createdAt.slice(0, 10) === key);
    return {
      date: key,
      total: dayOrders.reduce((s, o) => s + o.total, 0),
    };
  });
  const max = Math.max(...salesByDay.map((d) => d.total), 1);

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-muted">A quiet look at the shop.</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Stat label="Total orders" value={String(orders.length)} />
        <Stat label="Total sales" value={formatMMK(totalSales)} />
        <Stat label="Total products" value={String(products.length)} />
      </div>

      <div className="mt-8 card p-5">
        <h2 className="font-semibold">Sales · last 7 days</h2>
        <div className="mt-5 flex h-40 items-end gap-2">
          {salesByDay.map((day) => (
            <div key={day.date} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t-lg bg-yellow"
                style={{ height: `${Math.max(8, (day.total / max) * 100)}%` }}
                title={formatMMK(day.total)}
              />
              <span className="text-[10px] text-muted">{day.date.slice(5)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Low stock</h2>
            <Link href="/admin/products" className="text-sm font-semibold hover:underline">
              Manage
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="mt-4 text-sm text-muted">All sets have healthy stock.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {lowStock.map((p) => (
                <li key={p.id} className="flex justify-between text-sm">
                  <Link href={`/admin/products/${p.id}`} className="hover:underline">
                    {p.name}
                  </Link>
                  <span className="text-red">{p.stock} left</span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm font-semibold hover:underline">
              View all
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No orders yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {recent.map((o) => (
                <li key={o.orderId} className="flex justify-between gap-3 text-sm">
                  <Link href={`/admin/orders/${o.orderId}`} className="hover:underline">
                    {o.orderId}
                    <span className="block text-xs text-muted">
                      {o.customerName} · {formatDateTime(o.createdAt)}
                    </span>
                  </Link>
                  <span className="text-right">
                    {formatMMK(o.total)}
                    <span className="block text-xs text-muted">{o.status}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
