"use client";

import { useId } from "react";
import { categorySwatch } from "@/lib/display";
import { hashString, mulberry32 } from "@/lib/hash";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/cn";

type Props = {
  product: Pick<Product, "id" | "category" | "name">;
  className?: string;
  variant?: number;
};

function Brick({
  x,
  y,
  color,
}: {
  x: number;
  y: number;
  color: string;
}) {
  const top = color;
  const left = shadeHex(color, -28);
  const right = shadeHex(color, -14);
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M20 18 L40 28 L20 38 L0 28 Z" fill={top} />
      <path d="M0 28 L20 38 L20 50 L0 40 Z" fill={left} />
      <path d="M20 38 L40 28 L40 40 L20 50 Z" fill={right} />
    </g>
  );
}

function shadeHex(hex: string, amount: number) {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 255) + amount));
  const b = Math.min(255, Math.max(0, (num & 255) + amount));
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

export function ProductArt({ product, className, variant = 0 }: Props) {
  const base = categorySwatch(product.category);
  const palette = [base, shadeHex(base, 40), shadeHex(base, -35), "#ffd400"];
  const uid = useId().replace(/:/g, "");
  const rng = mulberry32(hashString(product.id) + variant * 1337);
  const bricks = Array.from({ length: 14 }, (_, i) => {
    const col = Math.floor(rng() * 5);
    const row = Math.floor(rng() * 4);
    const lift = Math.floor(rng() * 3);
    const color = palette[Math.floor(rng() * palette.length)];
    const x = 48 + col * 22 + row * -18;
    const y = 38 + row * 16 - lift * 10 + (i % 3);
    return { x, y, color, z: row * 10 + col };
  }).sort((a, b) => a.z - b.z);

  return (
    <svg
      viewBox="0 0 240 180"
      className={cn("block h-full w-full", className)}
      overflow="hidden"
      role="img"
      aria-label={product.name}
    >
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={shadeHex(palette[0], 90)} />
          <stop offset="100%" stopColor={shadeHex(palette[1], 70)} />
        </linearGradient>
      </defs>
      <rect width="240" height="180" rx="18" fill={`url(#bg-${uid})`} />
      {bricks.map((brick, i) => (
        <Brick key={i} x={brick.x} y={brick.y} color={brick.color} />
      ))}
    </svg>
  );
}
