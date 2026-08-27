"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import type { Product } from "@/lib/types";
import { PAYMENT_METHODS } from "@/lib/types";
import { effectivePrice, formatMMK } from "@/lib/format";
import { getDeliveryFee } from "@/lib/constants";
import { normalizePhone, validateCheckout, type FieldErrors } from "@/lib/validation";
import type { PaymentMethodId } from "@/lib/types";

export function CheckoutClient() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const hydrated = useCartStore((s) => s.hydrated);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>("cod");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  const lines = useMemo(() => {
    if (!products) return [];
    return items
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return product ? { item, product } : null;
      })
      .filter((line): line is { item: (typeof items)[number]; product: Product } => Boolean(line));
  }, [items, products]);

  const subtotal = lines.reduce((sum, line) => sum + effectivePrice(line.product) * line.item.quantity, 0);
  const delivery = getDeliveryFee(subtotal);
  const total = subtotal + delivery;

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    const payload = {
      customerName,
      phone: normalizePhone(phone),
      address,
      note,
      paymentMethod,
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    };
    const nextErrors = validateCheckout(payload);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error ?? "Could not place the order.");
        if (data.errors) setErrors(data.errors);
        return;
      }
      clear();
      router.push(`/order/${data.orderId}`);
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!hydrated || products === null) {
    return <p className="mt-8 text-muted">Loading checkout…</p>;
  }

  if (lines.length === 0) {
    return (
      <div className="card mt-8 px-6 py-16 text-center">
        <p className="text-lg font-semibold">Your cart is empty.</p>
        <Link href="/shop" className="btn btn-primary mt-6">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={placeOrder} className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="card p-5 md:p-7">
        <h2 className="text-lg font-semibold">Delivery details</h2>
        <div className="mt-5 space-y-4">
          <Field label="Full name" error={errors.customerName}>
            <input className="input" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
          </Field>
          <Field label="Phone number" error={errors.phone}>
            <input
              className="input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="09xxxxxxxx"
              inputMode="tel"
            />
          </Field>
          <Field label="Delivery address" error={errors.address}>
            <textarea
              className="input min-h-28"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Township, street, landmark"
            />
          </Field>
          <Field label="Note (optional)">
            <textarea
              className="input min-h-20"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Gate code, preferred time, extra instructions"
            />
          </Field>
        </div>

        <h2 className="mt-8 text-lg font-semibold">Payment method</h2>
        {errors.paymentMethod ? <p className="mt-2 text-sm text-red">{errors.paymentMethod}</p> : null}
        <div className="mt-4 space-y-3">
          {PAYMENT_METHODS.map((method) => (
            <label
              key={method.id}
              className={`flex cursor-pointer gap-3 rounded-2xl border p-4 ${
                paymentMethod === method.id ? "border-ink bg-paper" : "border-line"
              }`}
            >
              <input
                type="radio"
                name="payment"
                className="mt-1"
                checked={paymentMethod === method.id}
                onChange={() => setPaymentMethod(method.id)}
              />
              <span>
                <span className="block font-semibold">{method.label}</span>
                <span className="mt-1 block text-sm text-muted">{method.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <aside className="card h-fit p-5 md:p-7">
        <h2 className="text-lg font-semibold">Order summary</h2>
        <ul className="mt-4 space-y-3">
          {lines.map(({ item, product }) => (
            <li key={product.id} className="flex justify-between gap-3 text-sm">
              <span>
                {product.name}
                <span className="text-muted"> × {item.quantity}</span>
              </span>
              <span>{formatMMK(effectivePrice(product) * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Subtotal</span>
            <span>{formatMMK(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Delivery fee</span>
            <span>{delivery === 0 ? "Free" : formatMMK(delivery)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatMMK(total)}</span>
          </div>
        </div>
        {formError ? <p className="mt-4 text-sm text-red">{formError}</p> : null}
        <button type="submit" className="btn btn-primary mt-6 w-full" disabled={submitting}>
          {submitting ? "Placing order…" : "Place Order"}
        </button>
      </aside>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-sm text-red">{error}</span> : null}
    </label>
  );
}
