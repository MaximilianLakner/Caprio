import { TONES } from "@/lib/data";

/**
 * Self-contained illustrative "photo" for a listing — a soft gradient panel
 * with an aerodynamic roof-box silhouette. No external images, so nothing
 * ever loads broken and the look stays intentional.
 */
export function RoofboxVisual({
  tone = 0,
  className = "",
}: {
  tone?: number;
  className?: string;
}) {
  const t = TONES[tone % TONES.length];
  const id = `g${tone}`;

  return (
    <svg
      viewBox="0 0 400 280"
      className={className}
      role="img"
      aria-label="Dachbox"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={t.from} />
          <stop offset="100%" stopColor={t.to} />
        </linearGradient>
      </defs>

      <rect width="400" height="280" fill={`url(#${id})`} />

      {/* soft horizon glow */}
      <ellipse cx="200" cy="250" rx="220" ry="60" fill="#ffffff" opacity="0.18" />

      {/* roof rails */}
      <rect x="70" y="196" width="260" height="6" rx="3" fill="#11351d" opacity="0.16" />
      <rect x="92" y="172" width="10" height="26" rx="3" fill="#11351d" opacity="0.16" />
      <rect x="298" y="172" width="10" height="26" rx="3" fill="#11351d" opacity="0.16" />

      {/* the box — aerodynamic capsule */}
      <path
        d="M104 176
           C104 150 132 120 200 120
           C282 120 300 150 300 176
           C300 184 292 188 282 188
           L120 188
           C110 188 104 184 104 176 Z"
        fill="#ffffff"
        opacity="0.92"
      />
      {/* shade + seam */}
      <path
        d="M104 176 C104 160 118 142 150 132 C140 150 138 168 140 188 L120 188 C110 188 104 184 104 176 Z"
        fill="#11351d"
        opacity="0.05"
      />
      <path
        d="M118 176 C118 160 150 138 200 138 C262 138 286 160 286 176"
        fill="none"
        stroke="#11351d"
        strokeOpacity="0.14"
        strokeWidth="2"
      />
      {/* lock dot */}
      <circle cx="200" cy="180" r="3.5" fill="#11351d" opacity="0.28" />
    </svg>
  );
}
