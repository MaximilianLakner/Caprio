import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-32 text-center">
      <p className="font-display text-7xl font-semibold text-taupe-300">404</p>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">
        Diese Seite ist noch in der Garage
      </h1>
      <p className="mt-3 text-ink-soft">
        Den Inhalt, den du suchst, gibt es (noch) nicht. Im MVP sind nicht alle
        Seiten gebaut – die wichtigsten findest du übers Menü.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream transition-transform hover:-translate-y-px"
      >
        <ArrowLeft size={16} />
        Zur Startseite
      </Link>
    </div>
  );
}
