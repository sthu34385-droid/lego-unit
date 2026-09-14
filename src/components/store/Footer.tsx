import Link from "next/link";
import { Logo } from "./Logo";
import { STORE_NAME } from "@/lib/constants";
import { listCategories } from "@/lib/category-store";

export async function Footer() {
  const categories = await listCategories();

  return (
    <footer className="mt-auto border-t border-line bg-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted">
            {STORE_NAME}. Building sets in MMK. Order via Telegram.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Shop</p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/shop?category=${cat.id}`} className="hover:underline">
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Visit</p>
          <p className="mt-4 text-sm leading-6 text-muted">Yangon, Myanmar</p>
          <Link href="/about" className="mt-4 inline-block text-sm font-semibold hover:underline">
            About
          </Link>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-muted sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {STORE_NAME}</p>
          <p>Prices in MMK</p>
        </div>
      </div>
    </footer>
  );
}
