import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">404</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">This page is missing a few pieces.</h1>
      <p className="mt-3 max-w-md text-muted">The set you were looking for is not here. Head back to the shop and keep building.</p>
      <Link href="/shop" className="btn btn-primary mt-8">
        Continue Shopping
      </Link>
    </div>
  );
}
