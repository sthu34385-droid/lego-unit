import { notFound } from "next/navigation";
import { getOrder } from "@/lib/orders";
import { PAYMENT_METHODS } from "@/lib/types";
import { formatDateTime, formatMMK } from "@/lib/format";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();
  const payment = PAYMENT_METHODS.find((m) => m.id === order.paymentMethod);

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Order</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{order.orderId}</h1>
      <p className="mt-1 text-muted">{formatDateTime(order.createdAt)}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="font-semibold">Customer</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Name" value={order.customerName} />
            <Row label="Phone" value={order.phone} />
            <Row label="Address" value={order.address} />
            <Row label="Note" value={order.note || "—"} />
            <Row label="Payment" value={payment?.label ?? order.paymentMethod} />
          </dl>
        </section>
        <section className="card p-5">
          <h2 className="font-semibold">Status</h2>
          <OrderStatusSelect orderId={order.orderId} status={order.status} />
          <div className="mt-6 space-y-2 text-sm">
            {order.items.map((item) => (
              <div key={item.productId} className="flex justify-between gap-3">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{formatMMK(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="flex justify-between border-t border-line pt-3">
              <span className="text-muted">Subtotal</span>
              <span>{formatMMK(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Delivery</span>
              <span>{formatMMK(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>{formatMMK(order.total)}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted">{label}</dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  );
}
