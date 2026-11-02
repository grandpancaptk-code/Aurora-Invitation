import type { Toast } from "@/types/invitation";

export function ToastStack({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-[80] flex w-[92%] max-w-[380px] -translate-x-1/2 flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`animate-modalIn pointer-events-auto border px-4 py-3 text-[12px] shadow-[0_12px_32px_rgba(0,0,0,0.18)] ${
            t.type === "success"
              ? "border-brand-gold/30 bg-brand-forest text-brand-cream"
              : t.type === "error"
                ? "border-red-200 bg-brand-cream text-red-700"
                : "border-brand-gold/30 bg-brand-cream text-brand-forest"
          }`}
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}
