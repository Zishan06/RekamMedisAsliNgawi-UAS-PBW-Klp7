"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/**
 * useDebounce — Menunda update nilai selama delay tertentu.
 * Berguna untuk search input agar tidak trigger API di setiap keystroke.
 *
 * @example
 * const debouncedSearch = useDebounce(searchQuery, 400);
 * // gunakan debouncedSearch untuk query API
 */
export function useDebounce<T>(value: T, delay: number = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * useLocalStorage — State yang tersinkron ke localStorage.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const nextValue = typeof value === "function"
          ? (value as (prev: T) => T)(prev)
          : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(nextValue));
        } catch {
          // ignore
        }
        return nextValue;
      });
    },
    [key]
  );

  return [storedValue, setValue];
}

/**
 * useClickOutside — Deteksi klik di luar elemen.
 * Berguna untuk dropdown, modal, popover.
 */
export function useClickOutside<T extends HTMLElement>(
  callback: () => void
): React.RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [callback]);

  return ref;
}

/**
 * useMediaQuery — Reactive media query hook.
 * @example const isMobile = useMediaQuery("(max-width: 768px)");
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

/**
 * useDisclosure — Manajemen state buka/tutup (modal, drawer, dropdown).
 */
export function useDisclosure(defaultOpen = false) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const open  = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  return { isOpen, open, close, toggle };
}

/**
 * usePrevious — Menyimpan nilai sebelumnya dari state/prop.
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>(undefined);
  useEffect(() => { ref.current = value; });
  return ref.current;
}

/**
 * useIsMounted — Cek apakah komponen sudah/masih mounted.
 * Berguna untuk menghindari setState pada unmounted component.
 */
export function useIsMounted(): () => boolean {
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);
  return useCallback(() => isMounted.current, []);
}
