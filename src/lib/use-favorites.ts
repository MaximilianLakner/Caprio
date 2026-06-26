"use client";

import { useCallback, useEffect, useState } from "react";
import type { BoxListing } from "@/lib/data";

const KEY = "caprio:favorites";
const EVENT = "caprio:favorites-changed";

function read(): BoxListing[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as BoxListing[]) : [];
  } catch {
    return [];
  }
}

function write(list: BoxListing[]) {
  window.localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(EVENT));
}

/**
 * Client-side "Merkliste" (favorites) stored in localStorage. Hearting a box
 * persists the full listing so the Merkliste page can render without a fetch.
 * All hook instances stay in sync via a custom event + the storage event.
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<BoxListing[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setFavorites(read());
    setReady(true);
    const onChange = () => setFavorites(read());
    window.addEventListener(EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const toggle = useCallback((box: BoxListing) => {
    const list = read();
    const exists = list.some((b) => b.id === box.id);
    write(exists ? list.filter((b) => b.id !== box.id) : [...list, box]);
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.some((b) => b.id === id),
    [favorites],
  );

  return { favorites, toggle, isFavorite, count: favorites.length, ready };
}
