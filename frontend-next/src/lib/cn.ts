import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn() — Utility untuk menggabungkan Tailwind classes secara aman.
 * Menggabungkan clsx (conditional classes) + tailwind-merge (dedup Tailwind).
 *
 * @example
 * cn("px-4 py-2", isActive && "bg-primary-600", "text-white")
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
