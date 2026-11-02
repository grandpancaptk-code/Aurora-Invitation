import { EVENT_INFO } from "@/lib/invitation/constants";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-white/10 bg-brand-forest text-brand-cream">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center justify-between gap-4 px-5 py-8 sm:gap-6 sm:px-6 sm:py-10 md:flex-row lg:px-8 lg:py-12">
        <div className="flex w-full min-w-0 items-center gap-3 md:w-auto">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-brand-gold/40 font-serif text-brand-gold">
            ◍
          </div>
          <div className="min-w-0">
            <div className="truncate font-serif text-[10px] tracking-[0.22em] text-brand-gold sm:text-[11px]">
              {EVENT_INFO.brand}
            </div>
            <div className="truncate text-[10px] font-light tracking-wide opacity-60 sm:text-[11px]">
              AURORA • Private Launching 2026
            </div>
          </div>
        </div>
        <div className="flex w-full flex-wrap items-center justify-center gap-3 text-[10px] uppercase tracking-[0.16em] opacity-60 sm:gap-6 sm:text-[11px] sm:tracking-[0.18em] md:w-auto md:justify-end">
          <span className="truncate">{EVENT_INFO.address}</span>
          <span className="hidden h-4 w-[1px] bg-white/20 md:inline" />
          <span className="shrink-0 border border-brand-gold/30 px-3 py-1.5">By Invitation Only</span>
        </div>
      </div>
    </footer>
  );
}
