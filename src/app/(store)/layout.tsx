import { Footer } from "@/components/store/Footer";
import { Header } from "@/components/store/Header";
import { ToastProvider } from "@/components/ui/Toast";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </ToastProvider>
  );
}
