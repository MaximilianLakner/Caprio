/**
 * Caprio hero illustration — a friendly travel scene (car with a roof box on a
 * little island) framed by floating motifs. Pure SVG, palette-only colours:
 * forest #11351d · sage #a6d2b6 · sky #afc4cf · mint #c9e6d4 · white.
 */
export function HeroIllustration({ className = "" }: { className?: string }) {
  const ink = "#11351d";
  const sage = "#a6d2b6";
  const sky = "#afc4cf";
  const mint = "#c9e6d4";
  const deep = "#1f5e3c";

  const Star = ({
    x,
    y,
    s = 8,
    fill = ink,
  }: {
    x: number;
    y: number;
    s?: number;
    fill?: string;
  }) => (
    <path
      d={`M${x} ${y - s} C ${x + s * 0.18} ${y - s * 0.18}, ${x + s * 0.18} ${
        y - s * 0.18
      }, ${x + s} ${y} C ${x + s * 0.18} ${y + s * 0.18}, ${x + s * 0.18} ${
        y + s * 0.18
      }, ${x} ${y + s} C ${x - s * 0.18} ${y + s * 0.18}, ${x - s * 0.18} ${
        y + s * 0.18
      }, ${x - s} ${y} C ${x - s * 0.18} ${y - s * 0.18}, ${x - s * 0.18} ${
        y - s * 0.18
      }, ${x} ${y - s} Z`}
      fill={fill}
    />
  );

  return (
    <svg
      viewBox="0 0 760 470"
      className={className}
      role="img"
      aria-label="Caprio – mit der Dachbox unterwegs"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* sun halo */}
      <circle cx="380" cy="180" r="130" fill={mint} opacity="0.5" />
      <circle cx="380" cy="158" r="52" fill={sage} stroke={ink} strokeWidth="3" />

      {/* clouds */}
      <g stroke={ink} strokeWidth="3">
        <path
          d="M150 150c-16 0-26 10-26 21h70c0-11-9-17-17-17 0-2-2-4-5-4-2 0-3 1-4 2-3-2-9-2-13-2Z"
          fill="#ffffff"
        />
        <path
          d="M566 110c-14 0-22 9-22 18h60c0-9-8-15-15-15 0-2-2-3-4-3-2 0-3 1-4 2-3-2-8-2-15-2Z"
          fill="#ffffff"
        />
      </g>

      {/* mountains */}
      <g stroke={ink} strokeWidth="3" strokeLinejoin="round">
        <path d="M214 360 308 214 402 360Z" fill={sky} />
        <path d="M286 250 308 214 332 251 318 262 308 254 298 262Z" fill="#ffffff" />
        <path d="M398 360 470 252 542 360Z" fill={sage} />
        <path d="M452 278 470 252 490 280 478 288 470 282 462 288Z" fill="#ffffff" />
      </g>

      {/* island base — isometric slab */}
      <path
        d="M150 388c0-26 103-46 230-46s230 20 230 46v18c0 26-103 46-230 46s-230-20-230-46Z"
        fill={deep}
        stroke={ink}
        strokeWidth="3"
      />
      <ellipse cx="380" cy="388" rx="230" ry="46" fill={sage} stroke={ink} strokeWidth="3" />

      {/* road */}
      <path
        d="M250 402c40-18 120-22 180-10 50 10 90 4 120-12"
        stroke="#ffffff"
        strokeWidth="22"
        strokeLinecap="round"
      />
      <path
        d="M250 402c40-18 120-22 180-10 50 10 90 4 120-12"
        stroke={ink}
        strokeWidth="2.5"
        strokeDasharray="2 16"
        strokeLinecap="round"
      />

      {/* trees */}
      <g stroke={ink} strokeWidth="3" strokeLinejoin="round">
        <rect x="196" y="356" width="7" height="22" rx="2" fill={deep} />
        <path d="M199 312c16 8 22 28 8 40-10 9-26 9-36 0-12-12-6-32 8-40 5-3 15-3 20 0Z" fill={sage} />
        <rect x="560" y="360" width="6" height="20" rx="2" fill={deep} />
        <path d="M563 326c12 6 16 22 6 31-8 7-20 7-28 0-9-9-4-25 6-31 4-2 11-2 16 0Z" fill={mint} />
      </g>

      {/* ---- car with roof box (hero) ---- */}
      <g stroke={ink} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
        {/* shadow */}
        <ellipse cx="380" cy="408" rx="96" ry="13" fill={ink} opacity="0.12" stroke="none" />
        {/* body */}
        <path
          d="M300 372c-8 0-14-5-14-12 0-9 8-14 18-16 6-10 16-20 30-24 18-5 40-4 56 4 8 4 16 10 22 18 12 1 24 6 24 16 0 8-6 14-15 14Z"
          fill={sky}
        />
        {/* cabin + windows */}
        <path d="M324 324c14-6 44-7 60 1l8 19h-78Z" fill={mint} />
        <path d="M352 322v20" />
        {/* roof box */}
        <rect x="330" y="300" width="92" height="20" rx="10" fill={sage} />
        <path d="M376 300v20" stroke={ink} strokeWidth="2" />
        {/* wheels */}
        <circle cx="330" cy="372" r="18" fill="#ffffff" />
        <circle cx="330" cy="372" r="6" fill={deep} stroke="none" />
        <circle cx="430" cy="372" r="18" fill="#ffffff" />
        <circle cx="430" cy="372" r="6" fill={deep} stroke="none" />
      </g>

      {/* floating badges */}
      {/* map pin */}
      <g transform="translate(150 250)">
        <circle r="30" fill="#ffffff" stroke={ink} strokeWidth="3" />
        <path
          d="M0 -14c-9 0-15 7-15 15 0 9 15 19 15 19s15-10 15-19c0-8-6-15-15-15Z"
          fill={sage}
          stroke={ink}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <circle cy="1" r="5" fill="#ffffff" stroke={ink} strokeWidth="2" />
      </g>
      {/* suitcase */}
      <g transform="translate(615 232)" stroke={ink} strokeWidth="3" strokeLinejoin="round">
        <rect x="-22" y="-16" width="44" height="34" rx="7" fill={sky} />
        <path d="M-9 -16v-6h18v6" fill="none" />
        <path d="M-22 -3h44" />
      </g>

      {/* sparkles */}
      <Star x={250} y={150} s={11} fill={ink} />
      <Star x={510} y={195} s={9} fill={deep} />
      <Star x={120} y={330} s={8} fill={sage} />
      <Star x={650} y={320} s={10} fill={ink} />
      <Star x={470} y={120} s={7} fill={sky} />
    </svg>
  );
}
