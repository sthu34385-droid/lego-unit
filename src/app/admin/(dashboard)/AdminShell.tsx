"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, LogOut } from "lucide-react";
import { Logo } from "@/components/store/Logo";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-dvh bg-paper">
      <div className="flex min-h-dvh flex-col md:flex-row">
        <aside className="border-b border-line bg-white md:w-60 md:border-b-0 md:border-r">
          <div className="flex items-center justify-between px-4 py-4 md:block">
            <Logo />
            <p className="hidden pt-2 text-xs text-muted md:block">Staff dashboard</p>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-2 pb-3 md:flex-col md:px-3 md:pb-6">
            {LINKS.map((link) => {
              const active = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition-colors duration-150",
                    active ? "bg-yellow" : "hover:bg-yellow/50",
                  )}
                >
                  <Icon size={16} />
                  {link.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium hover:bg-paper"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </nav>
        </aside>
        <div className="min-w-0 flex-1 p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}
