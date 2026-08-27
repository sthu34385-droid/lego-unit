import Link from "next/link";
import { STORE_NAME } from "@/lib/constants";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="container-page py-12 md:py-20">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">The shop</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
          A quieter kind of toy store.
        </h1>
        <div className="mt-6 space-y-5 text-base leading-7 text-muted">
          <p>
            {STORE_NAME} is an independent boutique for building sets. We stock city scenes, machines,
            landmarks, and first-build kits — chosen for how they look on a shelf and how they feel in
            the hands.
          </p>
          <p>
            There are no customer accounts. You browse, add to cart, and check out with a name, a phone
            number, and a delivery address. Orders are confirmed by phone and packed in Yangon for
            delivery across Myanmar.
          </p>
          <p>
            Prices are listed in Myanmar Kyat. Delivery is a flat fee, and it is free over a set
            threshold. Pay cash on arrival, by bank transfer, or with mobile payment.
          </p>
        </div>
        <Link href="/shop" className="btn btn-primary mt-8">
          Shop Now
        </Link>
      </div>
    </div>
  );
}
