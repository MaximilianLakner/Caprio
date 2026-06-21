"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Fades its children up into view the first time they enter the viewport.
 * The hidden state is defined in globals.css (`[data-reveal]`), so the first
 * server-rendered paint is already correct — no flash. Honours
 * `prefers-reduced-motion` by showing instantly.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Show instantly when the user prefers reduced motion, or in environments
    // without a usable viewport / IntersectionObserver (so content is never
    // left hidden — e.g. some headless renderers report innerHeight 0).
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined" || !window.innerHeight) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal=""
      data-shown={shown ? "" : undefined}
      className={className}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
