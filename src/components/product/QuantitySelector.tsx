"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
};

export function QuantitySelector({ value, min = 1, max = 99, onChange }: Props) {
  return (
    <div className="inline-flex items-center rounded-full border border-line bg-white">
      <button
        type="button"
        className={cn("flex h-11 w-11 items-center justify-center rounded-full", value <= min && "opacity-40")}
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label="Decrease quantity"
        disabled={value <= min}
      >
        <Minus size={16} />
      </button>
      <span className="w-8 text-center text-sm font-semibold">{value}</span>
      <button
        type="button"
        className={cn("flex h-11 w-11 items-center justify-center rounded-full", value >= max && "opacity-40")}
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label="Increase quantity"
        disabled={value >= max}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
