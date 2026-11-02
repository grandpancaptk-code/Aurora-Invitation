type Stat = { label: string; value: number };

export function StatsGrid({ stats }: { stats: Stat[] }) {
  return (
    <div className="mb-8 grid grid-cols-2 gap-3 sm:mb-10 sm:gap-4 lg:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="border border-brand-gold/25 bg-white p-4 sm:p-5 lg:p-6">
          <div className="mb-2 text-[9px] uppercase leading-tight tracking-[0.2em] opacity-60 sm:mb-3 sm:text-[10px]">
            {s.label}
          </div>
          <div className="font-serif text-[28px] leading-none sm:text-[32px] lg:text-[36px]">{s.value}</div>
          <div className="mt-3 h-[1px] w-full bg-gradient-to-r from-brand-gold/60 to-transparent sm:mt-4" />
        </div>
      ))}
    </div>
  );
}
