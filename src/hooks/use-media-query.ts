"use client";

import { useSyncExternalStore, useCallback } from "react";

function getMatches(query: string): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(query).matches;
}

function subscribe(callback: () => void, query: string): () => void {
  const mql = window.matchMedia(query);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

export function useMediaQuery(query: string): boolean {
  const getSnapshot = useCallback(() => getMatches(query), [query]);
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(
    (callback) => subscribe(callback, query),
    getSnapshot,
    getServerSnapshot
  );
}

export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 768px)");
}

export function useIsTablet(): boolean {
  return useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
}

export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1025px)");
}
