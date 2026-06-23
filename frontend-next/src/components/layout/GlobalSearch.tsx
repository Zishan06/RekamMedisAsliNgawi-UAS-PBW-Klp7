"use client";

/**
 * GlobalSearch.tsx — Search bar interaktif dengan:
 * - Debounce 300ms
 * - Loading skeleton
 * - Grouped results per kategori
 * - Highlighted matching text
 * - Keyboard navigation (↑↓ Enter Escape)
 * - Recent searches (localStorage)
 * - Empty state
 */

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Loader2,
  User,
  Stethoscope,
  FileText,
  Activity,
  Heart,
  Clock,
  X,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useDebounce, useClickOutside } from "@/hooks/use-common";
import {
  mockSearch,
  SearchResult,
  SearchResultType,
  TYPE_CONFIG,
} from "@/lib/dummy-search";

/* ─────────────────────────────────────────────
   Constants
───────────────────────────────────────────── */
const MAX_RECENT = 5;
const RECENT_KEY = "rme_recent_searches";

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string) {
  if (!query.trim() || typeof window === "undefined") return;
  try {
    const recent = getRecentSearches().filter(
      (q) => q.toLowerCase() !== query.toLowerCase()
    );
    recent.unshift(query.trim());
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
  } catch {
    // ignore
  }
}

function removeRecentSearch(query: string) {
  if (typeof window === "undefined") return;
  try {
    const recent = getRecentSearches().filter(
      (q) => q.toLowerCase() !== query.toLowerCase()
    );
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
  } catch {
    // ignore
  }
}

/* ─────────────────────────────────────────────
   Icon per type
───────────────────────────────────────────── */
function getTypeIcon(type: SearchResultType, size = 16) {
  const cls = "flex-shrink-0";
  switch (type) {
    case "pasien":
      return <User size={size} className={cn(cls, "text-primary-500")} />;
    case "dokter":
      return <Stethoscope size={size} className={cn(cls, "text-earth-500")} />;
    case "perawat":
      return <Heart size={size} className={cn(cls, "text-purple-500")} />;
    case "rekam-medis":
      return <FileText size={size} className={cn(cls, "text-blue-500")} />;
    case "diagnosa":
      return <Activity size={size} className={cn(cls, "text-danger")} />;
  }
}

function getTypeBg(type: SearchResultType) {
  switch (type) {
    case "pasien":
      return "bg-primary-50";
    case "dokter":
      return "bg-earth-50";
    case "perawat":
      return "bg-purple-50";
    case "rekam-medis":
      return "bg-blue-50";
    case "diagnosa":
      return "bg-red-50";
  }
}

/* ─────────────────────────────────────────────
   Highlight matching text
───────────────────────────────────────────── */
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-primary-100 text-primary-800 rounded-sm px-0.5 not-italic">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

/* ─────────────────────────────────────────────
   Skeleton Loading
───────────────────────────────────────────── */
function SearchSkeleton() {
  return (
    <div className="py-2 px-2 space-y-1">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3 px-2 py-2.5">
          <div className="w-8 h-8 rounded-lg skeleton flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 rounded skeleton w-2/3" />
            <div className="h-3 rounded skeleton w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Global Search Component
───────────────────────────────────────────── */
export function GlobalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useClickOutside<HTMLDivElement>(() => {
    setIsFocused(false);
    setActiveIndex(-1);
  });
  const listRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  // Load recent searches on focus
  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setRecentSearches(getRecentSearches());
  }, []);

  // Global Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsFocused(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch results when debounced query changes
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setActiveIndex(-1);

    mockSearch(debouncedQuery).then((data) => {
      if (isMounted) {
        setResults(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery]);

  // Group results by type
  const groupedResults = useMemo(() => {
    const groups: Partial<Record<SearchResultType, SearchResult[]>> = {};
    results.forEach((r) => {
      if (!groups[r.type]) groups[r.type] = [];
      groups[r.type]!.push(r);
    });
    // Sort groups by TYPE_CONFIG order
    return Object.entries(groups).sort(
      ([a], [b]) =>
        TYPE_CONFIG[a as SearchResultType].order -
        TYPE_CONFIG[b as SearchResultType].order
    ) as [SearchResultType, SearchResult[]][];
  }, [results]);

  // Flat list for keyboard navigation
  const flatResults = useMemo(() => results, [results]);

  const handleSelect = useCallback(
    (item: SearchResult) => {
      saveRecentSearch(item.title);
      setQuery("");
      setIsFocused(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
      router.push(item.href);
    },
    [router]
  );

  const handleRecentSelect = useCallback(
    (term: string) => {
      setQuery(term);
      inputRef.current?.focus();
    },
    []
  );

  const handleRemoveRecent = useCallback((e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    removeRecentSearch(term);
    setRecentSearches(getRecentSearches());
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isFocused) return;

      if (e.key === "Escape") {
        setIsFocused(false);
        setActiveIndex(-1);
        inputRef.current?.blur();
        return;
      }

      if (flatResults.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < flatResults.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : flatResults.length - 1
        );
      } else if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        const selected = flatResults[activeIndex];
        if (selected) handleSelect(selected);
      }
    },
    [isFocused, flatResults, activeIndex, handleSelect]
  );

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const el = listRef.current.querySelector(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const showDropdown = isFocused;
  const showRecent = isFocused && !query && recentSearches.length > 0;
  const showResults = isFocused && query.length > 0;

  // Running index for keyboard nav across groups
  let runningIndex = -1;

  return (
    <div ref={containerRef} className="flex-1 max-w-xl relative z-40">
      {/* ── Input ─────────────────────────────── */}
      <div className="relative group">
        {isLoading ? (
          <Loader2
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-500 animate-spin"
          />
        ) : (
          <Search
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500 transition-colors"
          />
        )}
        <input
          ref={inputRef}
          id="global-search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder="Cari pasien, dokter, diagnosa..."
          autoComplete="off"
          className={cn(
            "w-full pl-10 pr-16 py-2.5 rounded-xl text-sm",
            "bg-neutral-50 border border-neutral-200",
            "text-neutral-800 placeholder:text-neutral-400",
            "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400",
            "focus:bg-white transition-all duration-200"
          )}
        />
        {/* Clear button */}
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              inputRef.current?.focus();
            }}
            className="absolute right-9 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            <X size={12} />
          </button>
        )}
        {/* Keyboard shortcut hint */}
        <kbd
          className={cn(
            "hidden md:inline-flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-0.5 px-1.5 py-0.5 rounded-md text-2xs font-mono transition-opacity duration-200",
            isFocused || query
              ? "opacity-0 pointer-events-none"
              : "opacity-100 bg-neutral-200/70 text-neutral-400"
          )}
        >
          ⌘K
        </kbd>
      </div>

      {/* ── Dropdown ─────────────────────────── */}
      {showDropdown && (
        <div
          className={cn(
            "absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-neutral-200",
            "shadow-2xl shadow-neutral-900/10 overflow-hidden animate-fade-in",
            "max-h-[min(500px,70vh)] flex flex-col"
          )}
        >
          {/* ── Recent Searches ─────────────────── */}
          {showRecent && !showResults && (
            <div className="py-2">
              <div className="px-4 py-2 flex items-center justify-between">
                <span className="text-2xs font-bold text-neutral-400 uppercase tracking-wider">
                  Pencarian Terakhir
                </span>
              </div>
              {recentSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => handleRecentSelect(term)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 transition-colors group/item text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
                    <Clock size={14} className="text-neutral-400" />
                  </div>
                  <span className="flex-1 text-sm text-neutral-700 font-medium truncate">
                    {term}
                  </span>
                  <span
                    role="button"
                    onClick={(e) => handleRemoveRecent(e, term)}
                    className="opacity-0 group-hover/item:opacity-100 w-5 h-5 flex items-center justify-center rounded-full text-neutral-400 hover:text-neutral-600 hover:bg-neutral-200 transition-all"
                  >
                    <X size={11} />
                  </span>
                </button>
              ))}
              {/* Hint */}
              <div className="px-4 pt-2 pb-1 border-t border-neutral-100 mt-1">
                <p className="text-2xs text-neutral-400">
                  Tekan <kbd className="px-1 py-0.5 bg-neutral-100 rounded text-2xs font-mono">⌘K</kbd> untuk fokus cepat
                </p>
              </div>
            </div>
          )}

          {/* ── Empty Focus State (no query, no recent) ── */}
          {isFocused && !query && recentSearches.length === 0 && (
            <div className="py-8 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center mb-3">
                <Search size={22} className="text-primary-400" />
              </div>
              <p className="text-sm font-semibold text-neutral-800">Mulai Mencari</p>
              <p className="text-xs text-neutral-500 mt-1 max-w-[220px]">
                Ketik nama pasien, dokter, nomor rekam medis, atau diagnosa.
              </p>
              <div className="flex items-center gap-1.5 mt-4 text-2xs text-neutral-400">
                <kbd className="px-1.5 py-0.5 bg-neutral-100 rounded font-mono">↑↓</kbd>
                <span>navigasi</span>
                <kbd className="px-1.5 py-0.5 bg-neutral-100 rounded font-mono ml-1">Enter</kbd>
                <span>pilih</span>
                <kbd className="px-1.5 py-0.5 bg-neutral-100 rounded font-mono ml-1">Esc</kbd>
                <span>tutup</span>
              </div>
            </div>
          )}

          {/* ── Loading ─────────────────────────── */}
          {isLoading && query && <SearchSkeleton />}

          {/* ── Results ─────────────────────────── */}
          {!isLoading && showResults && (
            <div ref={listRef} className="overflow-y-auto no-scrollbar flex-1 py-1.5">
              {groupedResults.length > 0 ? (
                groupedResults.map(([type, items]) => (
                  <div key={type} className="mb-1">
                    {/* Group Header */}
                    <div className="flex items-center gap-2 px-4 py-1.5">
                      <span className="text-2xs font-bold text-neutral-400 uppercase tracking-wider">
                        {TYPE_CONFIG[type].label}
                      </span>
                      <div className="h-px flex-1 bg-neutral-100" />
                      <span className="text-2xs text-neutral-400">
                        {items.length}
                      </span>
                    </div>

                    {/* Group Items */}
                    {items.map((item) => {
                      runningIndex++;
                      const idx = runningIndex;
                      const isActive = activeIndex === idx;

                      return (
                        <button
                          key={item.id}
                          data-index={idx}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setActiveIndex(idx)}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left",
                            isActive ? "bg-primary-50" : "hover:bg-neutral-50"
                          )}
                        >
                          {/* Icon */}
                          <div
                            className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors border border-transparent",
                              getTypeBg(type),
                              isActive && "border-primary-100"
                            )}
                          >
                            {getTypeIcon(type)}
                          </div>

                          {/* Text */}
                          <div className="flex-1 min-w-0">
                            <p
                              className={cn(
                                "text-sm font-semibold truncate",
                                isActive ? "text-primary-700" : "text-neutral-900"
                              )}
                            >
                              <HighlightText text={item.title} query={query} />
                            </p>
                            <p className="text-xs text-neutral-500 truncate">
                              <HighlightText text={item.subtitle} query={query} />
                            </p>
                          </div>

                          {/* Arrow */}
                          <ChevronRight
                            size={14}
                            className={cn(
                              "flex-shrink-0 transition-colors",
                              isActive ? "text-primary-400" : "text-neutral-300"
                            )}
                          />
                        </button>
                      );
                    })}
                  </div>
                ))
              ) : (
                /* No results */
                <div className="py-10 flex flex-col items-center justify-center text-center px-4">
                  <div className="w-14 h-14 rounded-2xl bg-neutral-50 flex items-center justify-center mb-3 border border-neutral-100">
                    <Search size={24} className="text-neutral-300" />
                  </div>
                  <p className="text-sm font-bold text-neutral-900">
                    Tidak ada hasil untuk&nbsp;&quot;{query}&quot;
                  </p>
                  <p className="text-xs text-neutral-500 mt-1.5 max-w-[230px]">
                    Coba gunakan kata kunci lain atau periksa ejaan Anda.
                  </p>
                </div>
              )}

              {/* Footer hint */}
              {groupedResults.length > 0 && (
                <div className="flex items-center gap-1.5 px-4 py-2.5 border-t border-neutral-100 mt-1">
                  <span className="text-2xs text-neutral-400">
                    {results.length} hasil ditemukan
                  </span>
                  <span className="text-2xs text-neutral-300 ml-auto">
                    <kbd className="px-1 py-0.5 bg-neutral-100 rounded font-mono text-2xs">↑↓</kbd>
                    {" "}navigasi
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
