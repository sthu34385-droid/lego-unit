import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrder } from "@/lib/orders";
import { formatDateTime, formatMMK } from "@/lib/format";
import { PAYMENT_METHODS } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return { title: `Order ${orderId}` };
}

export default async function OrderPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const order = await getOrder(orderId);
  if (!order) notFound();
  const payment = PAYMENT_METHODS.find((m) => m.id === order.paymentMethod);

  return (
    <div className="container-page py-10 md:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="card p-6 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-green">Order placed</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Thank you, {order.customerName}.</h1>
          <p className="mt-3 text-muted">
            We received your order and will confirm it by phone. Save this number for your records.
          </p>
          <p className="mt-6 text-sm text-muted">Order number</p>
          <p className="text-xl font-semibold tracking-tight">{order.orderId}</p>
          <p className="mt-1 text-sm text-muted">{formatDateTime(order.createdAt)}</p>

          <div className="mt-8 border-t border-line pt-6">
            <h2 className="font-semibold">Ordered products</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {order.items.map((item) => (
                <li key={item.productId} className="flex justify-between gap-3">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>{formatMMK(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between text-sm">
              <span className="text-muted">Subtotal</span>
              <span>{formatMMK(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Delivery</span>
              <span>{order.deliveryFee === 0 ? "Free" : formatMMK(order.deliveryFee)}</span>
            </div>
            <div className="mt-2 flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatMMK(order.total)}</span>
            </div>
          </div>

          <div className="mt-8 grid gap-4 border-t border-line pt-6 text-sm md:grid-cols-2">
            <div>
              <p className="font-semibold">Delivery</p>
              <p className="mt-2 text-muted">
                {order.customerName}
                <br />
                {order.phone}
                <br />
                {order.address}
              </p>
              {order.note ? <p className="mt-2 text-muted">Note: {order.note}</p> : null}
            </div>
            <div>
              <p className="font-semibold">Payment</p>
              <p className="mt-2 text-muted">{payment?.label ?? order.paymentMethod}</p>
              <p className="mt-1 text-muted">Status: {order.status}</p>
            </div>
          </div>

          <Link href="/shop" className="btn btn-primary mt-8">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
