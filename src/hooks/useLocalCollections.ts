import { useEffect, useState, useCallback } from "react";
import { listInProgress, readMyList, toggleMyList } from "@/lib/storage";
import type { WatchProgress } from "@/lib/types";

// Rehydrate from localStorage after mount to avoid SSR hydration mismatches,
// and expose imperative mutators that also refresh state on the same tab.
export function useContinueWatching() {
  const [items, setItems] = useState<WatchProgress[]>([]);
  const refresh = useCallback(() => setItems(listInProgress()), []);
  useEffect(() => {
    refresh();
    const onStorage = () => refresh();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);
  return { items, refresh };
}

export function useMyList() {
  const [ids, setIds] = useState<string[]>([]);
  const refresh = useCallback(() => setIds(readMyList()), []);
  useEffect(() => {
    refresh();
    const onStorage = () => refresh();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);
  const toggle = useCallback(
    (id: string) => {
      const added = toggleMyList(id);
      refresh();
      return added;
    },
    [refresh],
  );
  return { ids, toggle, refresh };
}
