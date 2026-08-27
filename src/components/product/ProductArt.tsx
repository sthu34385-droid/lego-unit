"use client";

import { useId } from "react";
import { getCategory } from "@/lib/categories";
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
      <ellipse cx="12" cy="25" rx="4.2" ry="2.3" fill={shadeHex(color, 18)} opacity="0.95" />
      <ellipse cx="28" cy="25" rx="4.2" ry="2.3" fill={shadeHex(color, 18)} opacity="0.95" />
      <ellipse cx="12" cy="25" rx="2.1" ry="1.1" fill={shadeHex(color, 38)} />
      <ellipse cx="28" cy="25" rx="2.1" ry="1.1" fill={shadeHex(color, 38)} />
    </g>
  );
}

function shadeHex(hex: string, amount: number): string {
  const raw = hex.replace("#", "");
  const num = parseInt(raw.length === 3 ? raw.split("").map((c) => c + c).join("") : raw, 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 255) + amount));
  const b = Math.min(255, Math.max(0, (num & 255) + amount));
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

export function ProductArt({ product, className, variant = 0 }: Props) {
  const category = getCategory(product.category);
  const uid = useId().replace(/:/g, "");
  const rng = mulberry32(hashString(product.id) + variant * 1337);
  const bricks = Array.from({ length: 14 }, (_, i) => {
    const col = Math.floor(rng() * 5);
    const row = Math.floor(rng() * 4);
    const lift = Math.floor(rng() * 3);
    const color = category.colors[Math.floor(rng() * category.colors.length)];
    const x = 48 + col * 22 + row * -18;
    const y = 38 + row * 16 - lift * 10 + (i % 3);
    return { x, y, color, z: row * 10 + col, shade: Math.floor(rng() * 12) };
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
          <stop offset="0%" stopColor={shadeHex(category.colors[0], 90)} />
          <stop offset="100%" stopColor={shadeHex(category.colors[1], 70)} />
        </linearGradient>
      </defs>
      <rect width="240" height="180" rx="18" fill={`url(#bg-${uid})`} />
      <g opacity="0.18">
        {Array.from({ length: 8 }).map((_, i) => (
          <circle key={i} cx={20 + i * 28} cy="18" r="6" fill="#fff" />
        ))}
      </g>
      {bricks.map((brick, i) => (
        <Brick key={i} x={brick.x} y={brick.y} color={brick.color} />
      ))}
    </svg>
  );
}

export function productImageSrc(product: Pick<Product, "images">, index = 0): string | null {
  return product.images[index] ?? null;
}
