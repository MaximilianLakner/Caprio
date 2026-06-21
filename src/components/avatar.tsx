/** Circular avatar — shows the user's profile picture, or their initials. */
export function getInitials(name?: string, email?: string): string {
  const source = name?.trim() || email?.split("@")[0] || "";
  const parts = source.split(/[\s._-]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({
  name,
  email,
  src,
  className = "h-9 w-9",
}: {
  name?: string;
  email?: string;
  src?: string | null;
  className?: string;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name ?? "Profilbild"}
        className={`${className} rounded-full border border-line object-cover`}
      />
    );
  }
  return (
    <span
      className={`${className} flex items-center justify-center rounded-full bg-ink text-xs font-semibold text-cream`}
      aria-hidden="true"
    >
      {getInitials(name, email)}
    </span>
  );
}
