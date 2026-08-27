import Link from "next/link";

export function Hero() {
  return (
    <section className="container-page grid items-center gap-10 py-10 md:grid-cols-[1.05fr_0.95fr] md:py-16">
      <div className="rise">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Premium building sets</p>
        <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl">
          Build the world you keep on the shelf.
        </h1>
        <p className="mt-5 max-w-md text-base leading-7 text-muted md:text-lg">
          Lego-Unit curates city streets, racers, landmarks, and first builds — priced in MMK, packed with
          care, and ready to ship across Myanmar.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/shop" className="btn btn-primary">
            Shop Now
          </Link>
          <Link href="/shop?sort=newest" className="btn btn-ghost">
            New arrivals
          </Link>
        </div>
      </div>
      <div className="rise rise-delay-1 relative">
        <HeroArt />
      </div>
    </section>
  );
}

function HeroArt() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-line bg-white shadow-card">
      <svg viewBox="0 0 640 520" className="block h-auto w-full" role="img" aria-label="Colorful building set">
        <rect width="640" height="520" fill="#f4f0e8" />
        <circle cx="520" cy="80" r="90" fill="#ffd400" opacity="0.55" />
        <circle cx="80" cy="430" r="70" fill="#006cb7" opacity="0.2" />
        <g transform="translate(90 80)">
          <IsometricStack />
        </g>
        <text x="48" y="478" fill="#111" fontSize="18" fontWeight="600" fontFamily="inherit">
          Original builds. Quiet luxury. Serious play.
        </text>
      </svg>
    </div>
  );
}

function IsometricStack() {
  const bricks = [
    { x: 180, y: 210, c: "#d01012", w: 3 },
    { x: 240, y: 180, c: "#ffd400", w: 2 },
    { x: 140, y: 250, c: "#006cb7", w: 4 },
    { x: 280, y: 230, c: "#00944a", w: 2 },
    { x: 200, y: 150, c: "#111111", w: 2 },
    { x: 320, y: 190, c: "#f57c00", w: 3 },
    { x: 100, y: 190, c: "#ffffff", w: 2 },
    { x: 250, y: 120, c: "#006cb7", w: 2 },
    { x: 160, y: 120, c: "#d01012", w: 1 },
    { x: 360, y: 250, c: "#ffd400", w: 2 },
  ];
  return (
    <g>
      {bricks.map((b, i) => (
        <g key={i} transform={`translate(${b.x} ${b.y})`}>
          <path d={`M0 20 L${40 * b.w} 20 L${40 * b.w + 28} 4 L28 4 Z`} fill={b.c} />
          <path d={`M0 20 L28 4 L28 28 L0 44 Z`} fill={shade(b.c, -30)} />
          <path d={`M0 20 L${40 * b.w} 20 L${40 * b.w} 36 L0 36 Z`} fill={shade(b.c, -18)} />
          {Array.from({ length: b.w }).map((_, s) => (
            <ellipse key={s} cx={18 + s * 40} cy="10" rx="10" ry="5" fill={shade(b.c, 24)} />
          ))}
        </g>
      ))}
    </g>
  );
}

function shade(hex: string, amount: number) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, (n >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((n >> 8) & 255) + amount));
  const b = Math.min(255, Math.max(0, (n & 255) + amount));
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}
