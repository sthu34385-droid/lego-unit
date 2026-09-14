"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, ShoppingBag, X } from "lucide-react";
import { Logo } from "./Logo";
import { useCartStore } from "@/lib/cart-store";
import { cn } from "@/lib/cn";
import { categorySwatch } from "@/lib/display";
import type { Category } from "@/lib/types";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const items = useCartStore((s) => s.items);
  const hydrated = useCartStore((s) => s.hydrated);
  const setHydrated = useCartStore((s) => s.setHydrated);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    if (useCartStore.persist.hasHydrated()) setHydrated();
  }, [setHydrated]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setOpen(false);
    setCatsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const shopActive = pathname === "/shop" || pathname.startsWith("/product");
  const cartActive = pathname === "/cart";

  return (
    <header className="sticky top-0 z-40">
      <div className="grid h-1.5 grid-cols-4">
        <span className="bg-red" />
        <span className="bg-yellow" />
        <span className="bg-blue" />
        <span className="bg-green" />
      </div>
      <div className="border-b border-line bg-white/92 backdrop-blur-md">
        <div className="container-page grid h-[4.35rem] grid-cols-[1fr_auto] items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
          <Logo />

          <nav className="hidden items-center rounded-full border border-line bg-paper p-1 md:flex">
            <NavLink href="/" active={pathname === "/"}>
              Home
            </NavLink>
            <Link
              href="/shop"
              className={cn(
                "rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm ring-1 ring-line transition hover:bg-white",
                shopActive && "ring-ink",
              )}
            >
              Shop
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setCatsOpen(true)}
              onMouseLeave={() => setCatsOpen(false)}
            >
              <button
                type="button"
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition",
                  catsOpen ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink",
                )}
                onClick={() => setCatsOpen((v) => !v)}
                aria-expanded={catsOpen}
              >
                Categories
                <ChevronDown size={14} className={cn("transition", catsOpen && "rotate-180")} />
              </button>
              {catsOpen && categories.length > 0 ? (
                <div className="absolute left-1/2 top-full z-30 w-[min(540px,calc(100vw-2rem))] -translate-x-1/2 pt-3">
                  <div className="overflow-hidden rounded-3xl border border-line bg-white p-3 shadow-hover">
                    <div className="grid grid-cols-2 gap-1">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/shop?category=${cat.id}`}
                          className="rounded-2xl px-3 py-2.5 transition hover:bg-paper"
                          onClick={() => setCatsOpen(false)}
                        >
                          <span className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: categorySwatch(cat.id) }} />
                            <span className="font-semibold">{cat.name}</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
            <NavLink href="/about" active={pathname === "/about"}>
              About
            </NavLink>
          </nav>

          <div className="flex items-center justify-end gap-2">
            <Link
              href="/cart"
              className={cn(
                "relative inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line bg-white px-3.5 text-sm font-semibold text-ink transition hover:bg-paper",
                cartActive && "ring-1 ring-ink",
              )}
              aria-label="Cart"
            >
              <ShoppingBag size={16} />
              <span className="hidden sm:inline">Cart</span>
              {hydrated && count > 0 ? (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-yellow px-1.5 text-[10px] font-bold text-ink">
                  {count}
                </span>
              ) : null}
            </Link>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper md:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 bg-white md:hidden">
          <div className="grid h-1.5 grid-cols-4">
            <span className="bg-red" />
            <span className="bg-yellow" />
            <span className="bg-blue" />
            <span className="bg-green" />
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <Logo onClick={() => setOpen(false)} />
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>
          <nav className="flex flex-col gap-1 px-4 pt-6 text-2xl font-semibold tracking-tight">
            <Link href="/" className="rounded-2xl px-3 py-3" onClick={() => setOpen(false)}>
              Home
            </Link>
            <Link href="/shop" className="rounded-2xl px-3 py-3" onClick={() => setOpen(false)}>
              Shop
            </Link>
            <Link href="/about" className="rounded-2xl px-3 py-3" onClick={() => setOpen(false)}>
              About
            </Link>
            <Link href="/cart" className="rounded-2xl px-3 py-3" onClick={() => setOpen(false)}>
              Cart
            </Link>
          </nav>
          {categories.length > 0 ? (
            <>
              <p className="mt-8 px-7 text-xs font-semibold uppercase tracking-[0.16em] text-muted">Categories</p>
              <div className="mt-3 grid grid-cols-2 gap-2 px-4">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${cat.id}`}
                    className="rounded-2xl border border-line bg-paper px-3 py-3 text-sm font-semibold"
                    onClick={() => setOpen(false)}
                  >
                    <span className="mb-2 block h-1.5 w-8 rounded-full" style={{ background: categorySwatch(cat.id) }} />
                    {cat.name}
                  </Link>
                ))}
              </div>
            </>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-medium transition",
        active ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink",
      )}
    >
      {children}
    </Link>
  );
}
