import Link from "next/link";
import { listOrders } from "@/lib/orders";
import { formatDateTime, formatMMK } from "@/lib/format";
import { PAYMENT_METHODS } from "@/lib/types";
import { DeleteOrderButton } from "@/components/admin/DeleteOrderButton";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await listOrders();

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Orders</h1>
      <p className="mt-1 text-muted">{orders.length} total</p>
      {orders.length === 0 ? (
        <div className="card mt-8 px-6 py-16 text-center">
          <p className="font-semibold">No orders yet.</p>
          <p className="mt-2 text-sm text-muted">New orders will appear here.</p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-[1.25rem] border border-line bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.orderId} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${o.orderId}`} className="font-semibold hover:underline">
                      {o.orderId}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {o.customerName}
                    <span className="block text-xs text-muted">{o.phone}</span>
                  </td>
                  <td className="px-4 py-3">{formatMMK(o.total)}</td>
                  <td className="px-4 py-3">
                    {PAYMENT_METHODS.find((m) => m.id === o.paymentMethod)?.label ?? o.paymentMethod}
                  </td>
                  <td className="px-4 py-3">{o.status}</td>
                  <td className="px-4 py-3 text-muted">{formatDateTime(o.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <DeleteOrderButton orderId={o.orderId} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
