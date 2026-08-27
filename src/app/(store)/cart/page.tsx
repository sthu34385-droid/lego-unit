import { CartClient } from "./CartClient";

export const metadata = { title: "Cart" };

export default function CartPage() {
  return (
    <div className="container-page py-8 md:py-12">
      <h1 className="text-4xl font-semibold tracking-tight">Cart</h1>
      <CartClient />
    </div>
  );
}
