import { useCallback, useState } from "react";
import type { Toast, ToastType } from "@/types/invitation";

/** Lightweight toast queue used by the invitation and dashboard pages. */
export function useToasts(duration = 3200) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (msg: string, type: ToastType = "success") => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, msg, type }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
    },
    [duration],
  );

  return { toasts, showToast };
}
