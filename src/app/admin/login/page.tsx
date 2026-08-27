import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Admin login" };

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<p className="p-8 text-muted">Loading…</p>}>
      <LoginForm />
    </Suspense>
  );
}
