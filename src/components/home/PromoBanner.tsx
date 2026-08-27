import Link from "next/link";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/constants";
import { formatMMK } from "@/lib/format";

export function PromoBanner() {
  return (
    <section className="container-page py-6">
      <div className="overflow-hidden rounded-[1.8rem] bg-ink px-6 py-10 text-white md:flex md:items-center md:justify-between md:px-12">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-yellow">This week</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Free delivery over {formatMMK(FREE_DELIVERY_THRESHOLD)}.
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Sale sets ship the same way as everything else — packed, tracked by phone, and paid how you
            prefer.
          </p>
        </div>
        <Link href="/shop?filter=sale" className="btn btn-yellow mt-6 md:mt-0">
          Shop the sale
        </Link>
      </div>
    </section>
  );
}
