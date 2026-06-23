"use client";

import { useState, useCallback } from "react";
import { api, ApiError } from "@/lib/api";
import type { Paginated, ListQuery } from "@/types";

interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * useFetch — Hook generik untuk satu kali data fetching (GET by ID, dsb).
 */
export function useFetch<T>(endpoint: string) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const fetch = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const data = await api.get<T>(endpoint);
      setState({ data, isLoading: false, error: null });
    } catch (err) {
      const message = err instanceof ApiError
        ? err.message
        : "Terjadi kesalahan. Silakan coba lagi.";
      setState((s) => ({ ...s, isLoading: false, error: message }));
    }
  }, [endpoint]);

  return { ...state, refetch: fetch };
}

/**
 * usePaginatedFetch — Hook untuk list data dengan pagination.
 */
export function usePaginatedFetch<T>(baseEndpoint: string) {
  const [state, setState] = useState<FetchState<Paginated<T>>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const [query, setQuery] = useState<ListQuery>({
    page: 1,
    limit: 10,
    sortOrder: "desc",
  });

  const fetch = useCallback(
    async (overrideQuery?: Partial<ListQuery>) => {
      const q = { ...query, ...overrideQuery };
      setQuery(q);
      setState((s) => ({ ...s, isLoading: true, error: null }));

      const params = new URLSearchParams();
      Object.entries(q).forEach(([k, v]) => {
        if (v !== undefined && v !== "") params.set(k, String(v));
      });

      try {
        const data = await api.get<Paginated<T>>(
          `${baseEndpoint}?${params.toString()}`
        );
        setState({ data, isLoading: false, error: null });
      } catch (err) {
        const message = err instanceof ApiError
          ? err.message
          : "Terjadi kesalahan. Silakan coba lagi.";
        setState((s) => ({ ...s, isLoading: false, error: message }));
      }
    },
    [baseEndpoint, query]
  );

  return { ...state, query, refetch: fetch };
}
