import { useCallback, useEffect, useRef, useState } from "react";

/** Safe localStorage read (returns fallback on SSR or parse failure). */
export function readStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as T;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

/** Safe localStorage write. */
export function writeStored(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    if (value === null || value === undefined) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota or privacy mode — ignore */
  }
}

/**
 * State backed by localStorage. The initial render always uses `fallback`
 * so server and client markup match; stored data is loaded after mount.
 */
export function useStoredState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const hydrated = useRef(false);

  useEffect(() => {
    setValue(readStored<T>(key, fallback));
    hydrated.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (hydrated.current) writeStored(key, value);
  }, [key, value]);

  const reset = useCallback(() => setValue(fallback), [fallback]);

  return [value, setValue, reset] as const;
}
