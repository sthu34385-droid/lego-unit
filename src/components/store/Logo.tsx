import Image from "next/image";
import Link from "next/link";
import { STORE_NAME } from "@/lib/constants";
import { cn } from "@/lib/cn";

export function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className={cn("flex shrink-0 items-center", className)}>
      <Image
        src="/logo.jpg"
        alt={STORE_NAME}
        width={56}
        height={56}
        className="h-12 w-12 rounded-xl object-cover"
        priority
      />
    </Link>
  );
}
