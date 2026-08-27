"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Something went wrong</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">This page needs another brick.</h1>
      <p className="mt-3 max-w-md text-muted">Please try again. If it keeps happening, refresh and continue shopping.</p>
      <button type="button" className="btn btn-primary mt-8" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
