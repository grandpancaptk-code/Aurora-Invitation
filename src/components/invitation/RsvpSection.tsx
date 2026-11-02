import { useState, useRef, type RefObject, type FormEvent } from "react";
import { EVENT_INFO } from "@/lib/invitation/constants";
import type { Guest, RsvpStatus } from "@/types/invitation";

type Props = {
  sectionRef: RefObject<HTMLElement | null>;
  guestName: string;
  onGuestNameChange: (value: string) => void;
  guestPhone: string;
  onGuestPhoneChange: (value: string) => void;
  guests: Guest[];
  onSubmit: (status: RsvpStatus) => Promise<boolean> | boolean;
  onClearGuests: () => void;
};

export function RsvpSection({
  sectionRef,
  guestName,
  onGuestNameChange,
  guestPhone,
  onGuestPhoneChange,
  guests,
  onSubmit,
  onClearGuests,
}: Props) {
  const [focused, setFocused] = useState<"name" | "phone" | null>(null);
  const [nameError, setNameError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ref khusus untuk input nama (menggantikan document.getElementById)
  const nameInputRef = useRef<HTMLInputElement>(null);

  const handleRsvpSubmit = async (status: RsvpStatus, e?: FormEvent) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    if (!guestName.trim()) {
      setNameError(true);
      setFocused("name");
      nameInputRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      const ok = await onSubmit(status);
      if (!ok) {
        setNameError(true);
        setFocused("name");
        nameInputRef.current?.focus();
      } else {
        setNameError(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-brand-cream text-brand-forest">
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.04]" />
      <div className="relative mx-auto w-full max-w-[1280px] px-5 py-8 sm:px-6 sm:py-12 md:py-16 lg:px-8 lg:py-[92px]">
        <div className="grid grid-cols-1 items-start gap-8 sm:gap-10 md:gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          
          {/* Kolom Informasi Acara */}
          <div className="reveal order-1">
            <div className="mb-4 inline-flex items-center gap-2 sm:mb-6 sm:gap-3">
              <span className="h-[1px] w-8 bg-brand-gold sm:w-10" />
              <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-brand-gold sm:text-[11px] sm:tracking-[0.32em]">
                Konfirmasi Kehadiran
              </span>
            </div>
            <h2 className="font-serif text-[clamp(1.75rem,8vw,2.25rem)] leading-[0.95] tracking-[-0.02em] sm:text-[32px] md:text-[42px] lg:text-[52px]">
              Konfirmasi
              <br />
              Kehadiran Anda
            </h2>
            <div className="mt-4 h-[1px] w-[64px] bg-gradient-to-r from-brand-gold to-transparent sm:mt-6 sm:w-[88px]" />
            <p className="mt-4 max-w-[40ch] text-[14px] font-light leading-[1.7] opacity-70 sm:mt-6 sm:max-w-[38ch] sm:text-[14.5px] sm:leading-[1.85]">
              Sebuah kehormatan bagi kami untuk mengundang Bapak/Ibu dalam private launching cluster terbaru{" "}
              <span className="font-serif font-medium italic text-brand-forest">AURORA</span> — hunian modern tropis
              dengan sentuhan resort di jantung Grand Panca Residence.
            </p>
            <div className="mt-6 grid w-full grid-cols-1 gap-3 sm:mt-8">
              <div className="border border-brand-gold/25 bg-white p-3 sm:p-4">
                <div className="mb-1 text-[9px] uppercase tracking-[0.2em] opacity-60 sm:text-[10px]">Tanggal</div>
                <div className="font-serif text-[18px] sm:text-[22px]">{EVENT_INFO.date}</div>
                <div className="mt-1 text-[10px] opacity-60 sm:text-[11px]">{EVENT_INFO.time}</div>
              </div>
              <div className="border border-brand-gold/25 bg-white p-3 sm:p-4">
                <div className="mb-1 text-[9px] uppercase tracking-[0.2em] opacity-60 sm:text-[10px]">Lokasi</div>
                <div className="whitespace-pre-line font-serif text-[18px] leading-[1.2] sm:text-[22px]">
                  {EVENT_INFO.venue}
                </div>
                <div className="mt-1 text-[10px] opacity-60 sm:text-[11px]">{EVENT_INFO.dresscode}</div>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.16em] opacity-60 sm:mt-8 sm:text-[11px] sm:tracking-[0.18em]">
              <span className="grid h-5 w-5 place-items-center rounded-full border border-brand-gold/40 text-[10px] sm:h-6 sm:w-6" aria-hidden="true">
                ✦
              </span>
              Tempat terbatas • RSVP diperlukan
            </div>
          </div>

          {/* Kolom Form RSVP */}
          <div className="reveal order-2 w-full">
            <div className="relative w-full max-w-full overflow-hidden border border-brand-gold/20 bg-white p-5 shadow-[0_12px_40px_-16px_rgba(10,46,34,0.12)] sm:p-7 sm:shadow-[0_24px_80px_-32px_rgba(10,46,34,0.18)] md:p-8 lg:mx-auto lg:max-w-[500px] lg:p-9 xl:mx-0 xl:max-w-none">
              <div className="pointer-events-none absolute right-0 top-0 h-[72px] w-[72px] opacity-60 sm:h-[92px] sm:w-[92px]">
                <div className="absolute right-0 top-0 h-[1px] w-full bg-gradient-to-l from-brand-gold to-transparent" />
                <div className="absolute right-0 top-0 h-full w-[1px] bg-gradient-to-b from-brand-gold to-transparent" />
              </div>
              
              <div className="mb-6 flex flex-col justify-between gap-3 sm:mb-8 sm:flex-row sm:items-center">
                <h3 className="font-serif text-[18px] tracking-wide sm:text-[20px]">Formulir Kehadiran</h3>
                <span className="self-start border border-brand-gold/30 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-[#8a6a3f] sm:self-auto sm:text-[10px]">
                  Undangan Personal
                </span>
              </div>

              {/* Dibungkus dengan tag form agar support Submit via Enter Keyboard */}
              <form onSubmit={(e) => handleRsvpSubmit("hadir", e)} className="space-y-6 sm:space-y-7">
                <div className="relative">
                  <input
                    ref={nameInputRef}
                    id="guestName"
                    type="text"
                    value={guestName}
                    onChange={(e) => {
                      onGuestNameChange(e.target.value);
                      if (e.target.value.trim()) setNameError(false);
                    }}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused(null)}
                    autoComplete="name"
                    aria-invalid={nameError}
                    aria-describedby={nameError ? "name-error" : undefined}
                    className={`peer min-h-[52px] w-full border-b bg-transparent pt-4 text-[15px] placeholder-transparent outline-none transition-colors focus:border-brand-gold sm:text-[15.5px] ${
                      nameError ? "border-red-400" : "border-brand-gold/40"
                    }`}
                    placeholder="Nama Lengkap"
                  />
                  <label
                    htmlFor="guestName"
                    className={`pointer-events-none absolute left-0 font-light transition-all duration-300 ${
                      focused === "name" || guestName
                        ? "-top-1 text-[11px] uppercase tracking-[0.18em] text-brand-gold"
                        : "top-[18px] text-[14px] opacity-60 sm:text-[14.5px]"
                    }`}
                  >
                    Nama Lengkap *
                  </label>
                  {guestName && !nameError && (
                    <div className="absolute right-0 top-[18px] grid h-5 w-5 place-items-center rounded-full bg-brand-forest text-[10px] text-brand-cream" aria-hidden="true">
                      ✓
                    </div>
                  )}
                  {nameError && (
                    <p id="name-error" className="animate-fadeUp mt-2 text-[11px] tracking-wide text-red-500">
                      Mohon isi nama lengkap terlebih dahulu
                    </p>
                  )}
                </div>

                <div className="relative">
                  <input
                    id="guestPhone"
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => onGuestPhoneChange(e.target.value)}
                    onFocus={() => setFocused("phone")}
                    onBlur={() => setFocused(null)}
                    autoComplete="tel"
                    className="peer min-h-[52px] w-full border-b border-brand-gold/30 bg-transparent pt-4 text-[15px] placeholder-transparent outline-none transition-colors focus:border-brand-gold sm:text-[15.5px]"
                    placeholder="Nomor WhatsApp"
                  />
                  <label
                    htmlFor="guestPhone"
                    className={`pointer-events-none absolute left-0 font-light transition-all duration-300 ${
                      focused === "phone" || guestPhone
                        ? "-top-1 text-[11px] uppercase tracking-[0.18em] text-brand-gold"
                        : "top-[18px] text-[14px] opacity-50 sm:text-[14.5px]"
                    }`}
                  >
                    Nomor WhatsApp
                  </label>
                </div>

                <div className="flex flex-col gap-3 pt-2 sm:grid sm:grid-cols-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative order-1 min-h-[48px] w-full overflow-hidden border border-brand-forest bg-brand-forest text-brand-cream transition-colors hover:bg-black disabled:opacity-50 sm:min-h-[52px]"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] sm:text-[12px]">
                      {isSubmitting ? "Mengirim..." : "Saya Hadir"}{" "}
                      <span className="hidden text-brand-gold sm:inline" aria-hidden="true">—</span>{" "}
                      <span className="grid h-4 w-4 place-items-center rounded-full border border-brand-gold/60 text-[10px]" aria-hidden="true">
                        ♥
                      </span>
                    </span>
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => void handleRsvpSubmit("tidak")}
                    className="order-2 min-h-[48px] w-full border border-brand-gold/50 px-6 text-[11px] uppercase tracking-[0.22em] transition hover:border-brand-forest hover:bg-brand-cream disabled:opacity-50 sm:min-h-[52px] sm:text-[12px]"
                  >
                    Lain Kali
                  </button>
                </div>

                <div className="flex items-start gap-2.5 pt-1 sm:pt-2">
                  <span className="mt-[3px] grid h-4 w-4 shrink-0 place-items-center rounded-full border border-brand-gold/50 text-[9px]" aria-hidden="true">
                    i
                  </span>
                  <p className="text-[11px] font-light leading-[1.6] opacity-60 sm:text-[11.5px]">
                    Konfirmasi Anda membantu kami menyiapkan pengalaman terbaik. Data tersimpan secara real-time.
                  </p>
                </div>
              </form>
            </div>

            {guests.length > 0 && (
              <div className="mt-4 flex flex-col justify-between gap-2 border border-brand-gold/20 bg-brand-cream p-3 sm:mt-6 sm:flex-row sm:items-center sm:p-4">
                <div className="text-[12px]">
                  <span className="font-medium">{guests.length} konfirmasi</span>{" "}
                  <span className="opacity-60">
                    di sesi ini • {guests.filter((g) => String(g.status).toLowerCase() === "hadir").length} hadir
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onClearGuests}
                  className="min-h-[32px] text-left text-[11px] uppercase tracking-[0.16em] opacity-60 hover:opacity-100 transition"
                >
                  Bersihkan
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}