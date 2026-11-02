import type { Wish } from "@/types/invitation";
import { EVENT_INFO } from "@/lib/invitation/constants";

type Props = {
  wishes: Wish[];
  guestCount: number;
  guestName?: string; // Menyambungkan nama dari form RSVP
  wishName: string;
  onWishNameChange: (value: string) => void;
  wishMessage: string;
  onWishMessageChange: (value: string) => void;
  onSubmit: () => void;
};

export function WishesSection({
  wishes,
  guestCount,
  guestName = "",
  wishName,
  onWishNameChange,
  wishMessage,
  onWishMessageChange,
  onSubmit,
}: Props) {
  const stats = [
    { l: "Tamu", v: `${guestCount || 128}+` },
    { l: "Cluster", v: "8 Unit" },
    {
      l: "Launch",
      v: EVENT_INFO.date.split(" ")[1] + " " + EVENT_INFO.date.split(" ")[2],
    },
  ];

  // Gunakan wishName jika diisi manual, atau autofill dari guestName jika wishName kosong
  const effectiveWishName = wishName || guestName;

  return (
    <section className="relative overflow-hidden bg-brand-forest text-brand-cream">
      <div className="wishes-glow pointer-events-none absolute inset-0 opacity-[0.14]" />
      <div className="relative mx-auto w-full max-w-[1280px] px-5 py-8 sm:px-6 sm:py-12 md:py-16 lg:px-8 lg:py-[92px]">
        <div className="reveal mb-8 flex flex-col justify-between gap-4 sm:mb-10 sm:gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3">
              <span className="h-[1px] w-8 bg-brand-gold sm:w-10" />
              <span className="text-[10px] uppercase tracking-[0.28em] text-brand-gold sm:text-[11px] sm:tracking-[0.32em]">
                Papan Ucapan
              </span>
            </div>
            <h2 className="font-serif text-[clamp(1.75rem,8vw,2.25rem)] leading-[0.95] sm:text-[34px] md:text-[42px] lg:text-[48px]">
              Ucapan &amp; Doa
            </h2>
          </div>
          <p className="max-w-[38ch] text-[13px] font-light leading-[1.6] opacity-70 sm:text-[13.5px] sm:leading-[1.7]">
            Tinggalkan jejak harapan untuk perjalanan baru AURORA. Ucapan Anda akan tampil secara langsung.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 sm:gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
          <div className="reveal order-2 lg:sticky lg:top-8 lg:order-1">
            <div className="border border-brand-gold/20 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-6 lg:p-7">
              <h3 className="mb-4 font-serif text-[17px] sm:mb-5 sm:text-[18px]">Kirim Ucapan</h3>
              <div className="space-y-4 sm:space-y-5">
                <div className="relative">
                  <input
                    type="text"
                    value={effectiveWishName}
                    onChange={(e) => onWishNameChange(e.target.value)}
                    placeholder="Nama Anda"
                    autoComplete="name"
                    className="min-h-[46px] w-full border-b border-brand-gold/30 bg-white/5 px-3 text-[14px] outline-none placeholder:text-white/40 focus:border-brand-gold"
                  />
                  {guestName && !wishName && (
                    <span className="absolute right-2 top-2.5 text-[10px] uppercase tracking-wider text-brand-gold/60">
                      Auto-filled
                    </span>
                  )}
                </div>

                <div>
                  <textarea
                    value={wishMessage}
                    onChange={(e) => onWishMessageChange(e.target.value)}
                    placeholder="Tulis ucapan terbaik Anda untuk AURORA..."
                    rows={4}
                    maxLength={280}
                    className="w-full resize-none rounded-none border border-brand-gold/20 bg-white/5 p-3.5 text-[14px] leading-[1.7] outline-none placeholder:text-white/30 focus:border-brand-gold/50"
                  />
                  <div className="mt-2 text-right text-[10px] uppercase tracking-[0.16em] opacity-40">
                    {wishMessage.length}/280
                  </div>
                </div>

                <button
                  onClick={onSubmit}
                  disabled={!effectiveWishName.trim() || !wishMessage.trim()}
                  className="min-h-[48px] w-full bg-brand-gold text-[11px] font-[600] uppercase tracking-[0.22em] text-brand-forest transition hover:bg-brand-gold-bright disabled:cursor-not-allowed disabled:opacity-40 sm:text-[12px]"
                >
                  Kirim Ucapan
                </button>

                <p className="text-center text-[11px] font-light leading-[1.6] opacity-50">
                  Ucapan bersifat publik dan akan tampil secara real-time.
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
              {stats.map((i) => (
                <div key={i.l} className="border border-white/10 bg-white/[0.03] p-2.5 text-center sm:p-3">
                  <div className="font-serif text-[14px] sm:text-[16px]">{i.v}</div>
                  <div className="mt-1 text-[8px] uppercase tracking-[0.18em] opacity-60 sm:text-[9px]">{i.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal order-1 lg:order-2" style={{ transitionDelay: "120ms" }}>
            <div className="columns-1 gap-3 space-y-3 [column-fill:_balance] sm:columns-2 sm:gap-4 sm:space-y-4 2xl:columns-3">
              {wishes.map((w, idx) => (
                <div
                  key={`${w.name}-${idx}`}
                  className="group relative break-inside-avoid overflow-hidden border border-brand-gold/25 bg-brand-cream p-4 text-brand-forest transition-shadow hover:shadow-[0_20px_60px_-30px_rgba(197,168,128,0.5)] sm:p-5 lg:p-6"
                >
                  <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-brand-gold to-brand-gold-bright" />
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-forest font-serif text-[12px] text-brand-cream">
                        {w.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-[13px] font-medium leading-[1.1]">{w.name}</div>
                        <div className="mt-0.5 text-[10px] uppercase tracking-[0.16em] opacity-60">
                          {w.date} • {w.time}
                        </div>
                      </div>
                    </div>
                    <span className="shrink-0 text-[14px] text-brand-gold">❧</span>
                  </div>
                  <p className="text-[13px] font-light leading-[1.7] opacity-80 sm:text-[13.5px] sm:leading-[1.75]">
                    “{w.message}”
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] opacity-50 sm:mt-4">
                    <span className="h-[1px] w-6 bg-brand-gold/40" /> Aurora Wishes
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}