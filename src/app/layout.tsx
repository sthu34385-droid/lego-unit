import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Lego-Unit — Premium building sets",
    template: "%s · Lego-Unit",
  },
  description:
    "Lego-Unit shop for building sets in Myanmar. Browse, add to cart, and order on Telegram.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-paper text-ink font-sans">{children}</body>
    </html>
  );
}
