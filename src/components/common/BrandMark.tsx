import { EVENT_INFO } from "@/lib/invitation/constants";

type Props = {
  subtitle: string;
  tone?: "light" | "dark";
};

/** Logo lockup used in the invitation header, dashboard header and footer. */
export function BrandMark({ subtitle, tone = "light" }: Props) {
  const ring = tone === "light" ? "border-brand-gold/60" : "border-brand-gold";
  return (
    <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
      {/* <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border ${ring}`}>
        <span className="font-serif text-[13px] text-brand-gold">◍</span>
      </div> */}
      <img
        src="/images/GP-Logo.png"
        alt="Grand Panca Residence Logo"
        className="h-8 w-auto shrink-0 sm:h-[32px]"
      />
      <div className="min-w-0 leading-[1.05]">
        <div className="truncate font-serif text-[9px] tracking-[0.18em] text-brand-gold sm:text-[10.5px] sm:tracking-[0.22em]">
          {EVENT_INFO.brand}
        </div>
        <div className="mt-[2px] truncate text-[7.5px] font-light tracking-[0.28em] opacity-70 sm:text-[8.5px] sm:tracking-[0.36em]">
          {subtitle}
        </div>
      </div>
    </div>
  );
}
