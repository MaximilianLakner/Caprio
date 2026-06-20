/** Compact roof-box mark — a box riding a roofline inside a rounded square. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#11351d" />
      <path
        d="M7 21c0-4 4-7 9-7s9 3 9 7c0 1-1 1.6-2 1.6H9c-1 0-2-.6-2-1.6Z"
        fill="#a6d2b6"
      />
      <path d="M6 24.5h20" stroke="#afc4cf" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="16" cy="19.5" r="1.2" fill="#11351d" />
    </svg>
  );
}
