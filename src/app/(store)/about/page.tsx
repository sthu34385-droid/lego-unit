import Link from "next/link";
import { STORE_NAME } from "@/lib/constants";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="container-page py-12 md:py-20">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{STORE_NAME}</h1>
        <div className="mt-6 space-y-5 text-base leading-7 text-muted">
          <p>Building sets priced in Myanmar Kyat. No customer account needed.</p>
          <p>Add items to your cart and send the order on Telegram.</p>
        </div>
        <Link href="/shop" className="btn btn-primary mt-8">
          Shop Now
        </Link>
      </div>
    </div>
  );
}
