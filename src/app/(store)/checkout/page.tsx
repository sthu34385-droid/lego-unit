import { CheckoutClient } from "./CheckoutClient";

export const metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="container-page py-8 md:py-12">
      <h1 className="text-4xl font-semibold tracking-tight">Checkout</h1>
      <p className="mt-2 max-w-xl text-muted">
        No account needed. Enter your delivery details, choose a payment method, and place the order.
      </p>
      <CheckoutClient />
    </div>
  );
}
