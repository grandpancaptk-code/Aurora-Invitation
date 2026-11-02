import { useEffect, useState } from "react";
import { BrandMark } from "@/components/common/BrandMark";
import { HeroOrnaments } from "@/components/invitation/HeroOrnaments";

type Props = {
  opened?: boolean;
  onOpen?: () => void;
  // Props Dinamis dari Supabase
  title?: string;
  eventDate?: string;
  eventTime?: string;
  brand?: string;
  primaryColor?: string;
  accentColor?: string;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

// Fungsi pembantu konversi tanggal dinamis ke Date Object
function parseEventDate(dateStr?: string, timeStr?: string): Date {
  if (!dateStr) return new Date();

  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, Mei: 4, Jun: 5,
    Jul: 6, Ags: 7, Sep: 8, Okt: 9, Nov: 10, Des: 11
  };

  const dateParts = dateStr.replace(/^[^,]+,\s*/, "").split(" ");
  const day = parseInt(dateParts[0] ?? "18", 10);
  const monthStr = dateParts[1] ?? "Nov";
  const year = parseInt(dateParts[2] ?? "2026", 10);

  const timeMatch = (timeStr || "09.00").match(/(\d{2})[:.](\d{2})/);
  const hours = timeMatch && timeMatch[1] ? parseInt(timeMatch[1], 10) : 9;
  const minutes = timeMatch && timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;

  const monthIndex = months[monthStr] ?? 10;
  return new Date(year, monthIndex, day, hours, minutes, 0);
}

export function HeroSection({
  opened = false,
  onOpen,
  title = "AURORA", // Fallback jika title kosong
  eventDate = "Sabtu, 18 Nov 2026",
  eventTime = "09.00 WIB",
  brand = "GRAND PANCA RESIDENCE",
  primaryColor = "#0d3b2e",
  accentColor = "#c5a059",
}: Props) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = parseEventDate(eventDate, eventTime).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [eventDate, eventTime]);

  return (
    <section 
      style={{ backgroundColor: primaryColor }}
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden p-5 pt-[max(1rem,env(safe-area-inset-top))] sm:p-6 md:p-8 lg:p-10"
    >
      {/* Background Container */}
      <div className="absolute inset-0">
        <img
          src="/images/Aurora-Red-Electric-Car.jpg"
          alt="Perumahan Aurora"
          className="h-full w-full object-cover object-center"
        />
        {/* Dynamic Gradient overlay menggunakan primaryColor */}
        <div 
          style={{
            background: `linear-gradient(to bottom, ${primaryColor}E6, ${primaryColor}D9, ${primaryColor}F2)`
          }}
          className="absolute inset-0" 
        />
        <div className="hero-glow absolute inset-0 opacity-[0.18]" />
        <div className="noise-overlay absolute inset-0 opacity-[0.04] mix-blend-overlay" />
      </div>

      <div className="relative z-20 mx-auto flex w-full max-w-[1280px] items-center justify-between">
        <BrandMark subtitle={`EST. 2026 • ${title.toUpperCase()}`} />
        <div className="hidden items-center gap-3 text-[10px] uppercase tracking-[0.22em] opacity-70 sm:flex sm:gap-6">
          <span style={{ backgroundColor: accentColor }} className="hidden h-[1px] w-6 opacity-40 md:block lg:w-10" />
          <span className="hidden md:inline">Private Launch</span>
          <span className="md:hidden">Launch</span>
        </div>
      </div>

      <HeroOrnaments />

      <div className="relative z-20 mx-auto flex w-full max-w-[1280px] flex-1 flex-col items-center justify-center px-3 py-8 text-center sm:px-6 sm:py-10 md:px-8">
        <img
          src="/images/GP-Logo.png"
          alt="Logo Brand"
          className="h-[150px] w-auto sm:h-[120px] md:h-[140px] lg:h-[160px] p-3 sm:p-3 md:p-4.5 lg:p-6"
        />
        <div className="w-full max-w-[320px] space-y-2.5 sm:max-w-[640px] sm:space-y-3 md:space-y-4 lg:max-w-[760px]">
          <div className="overflow-hidden">
            <p
              style={{ color: accentColor }}
              className="animate-fadeUp text-[10px] font-medium uppercase tracking-[0.32em] sm:text-[11px] sm:tracking-[0.42em] md:text-[12px]"
            >
              You Are Invited
            </p>
          </div>
          <div className="overflow-hidden">
            <h2 className="animate-fadeUp font-serif text-[clamp(1.25rem,6vw,1.75rem)] font-[300] leading-[1.15] tracking-[0.02em] text-brand-cream/90 sm:text-[28px] md:text-[32px] lg:text-[42px]">
              The Wait is Over
            </h2>
          </div>
          <div className="relative overflow-hidden pt-1 sm:pt-2 md:pt-3">
            {/* H1 JUDUL DINAMIS */}
            <h1
              style={{ color: accentColor }}
              className="animate-fadeUp aurora-title font-serif leading-[0.85] tracking-[0.04em] sm:tracking-[0.06em]"
            >
              {title}
            </h1>
          </div>

          <div className="animate-fadeUp pt-3 sm:pt-4 md:pt-6">
            <p className="max-w-[28ch] text-center text-[10px] font-light uppercase leading-[1.6] tracking-[0.18em] opacity-80 sm:max-w-none sm:text-[11px] sm:leading-[1.8] sm:tracking-[0.28em] md:text-[12.5px]">
              <span className="sm:hidden">Private Launching <br /> Limited Cluster</span>
              <span className="hidden sm:inline">Private Launching • Limited Cluster • {brand}</span>
            </p>
          </div>

          {/* COUNTDOWN TIMER */}
          <div className="animate-fadeUp pt-4 sm:pt-5">
            <div className="mx-auto flex max-w-sm items-center justify-center gap-3 rounded-xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm sm:max-w-xl sm:gap-6 sm:p-6">
              {[
                { label: "Hari", val: timeLeft.days },
                { label: "Jam", val: timeLeft.hours },
                { label: "Menit", val: timeLeft.minutes },
                { label: "Detik", val: timeLeft.seconds },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 sm:gap-6">
                  {idx > 0 && <span style={{ color: accentColor }} className="text-2xl opacity-40 sm:text-4xl -translate-y-2">:</span>}
                  <div className="flex flex-col items-center min-w-[50px] sm:min-w-[80px]">
                    <span style={{ color: accentColor }} className="font-serif text-4xl font-light sm:text-6xl md:text-7xl">
                      {String(item.val).padStart(2, "0")}
                    </span>
                    <span className="mt-1 text-[9px] uppercase tracking-[0.2em] opacity-70 sm:text-[11px]">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TOMBOL BUKA UNDANGAN */}
          <div className="animate-fadeUp flex flex-col items-center gap-3 pt-5 sm:pt-7 md:pt-9">
            <button
              onClick={onOpen}
              style={{ backgroundColor: accentColor }}
              className="group relative min-h-[48px] w-[570px] max-w-[300px] overflow-hidden px-6 text-[11px] font-[600] uppercase tracking-[0.22em] text-black sm:h-[48px] sm:max-w-none sm:px-8 sm:text-[11.5px] md:h-[52px] md:px-10"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {opened ? "Membuka Undangan..." : "Buka Undangan"}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}