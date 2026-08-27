import { cn } from "@/lib/cn";

export function ProductBadge({
  kind,
}: {
  kind: "NEW" | "BEST SELLER" | "SALE";
}) {
  const styles = {
    NEW: "bg-blue text-white",
    "BEST SELLER": "bg-ink text-white",
    SALE: "bg-red text-white",
  } as const;

  return <span className={cn("badge", styles[kind])}>{kind}</span>;
}
