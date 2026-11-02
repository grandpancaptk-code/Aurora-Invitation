import type { RsvpStatus } from "@/types/invitation";

type Props = {
  status: RsvpStatus;
  guestName: string;
  onClose: () => void;
};

export function ThankYouModal({ status, guestName, onClose }: Props) {
  const attending = status === "hadir";

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-5 sm:p-6">
      <div className="absolute inset-0 bg-brand-forest/80 backdrop-blur-[10px]" onClick={onClose} />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="confetti"
            style={{
              left: `${5 + Math.random() * 90}%`,
              animationDelay: `${Math.random() * 0.6}s`,
              background: i % 2 === 0 ? "#C5A880" : "#D4AF37",
              transform: `rotate(${Math.random() * 180}deg)`,
            }}
          />
        ))}
      </div>
      <div className="animate-modalIn relative w-full max-w-[440px] border border-brand-gold/30 bg-brand-cream p-6 text-center shadow-[0_32px_96px_rgba(0,0,0,0.28)] sm:p-8 lg:p-10">
        <div className="mx-auto mb-4 grid h-11 w-11 place-items-center rounded-full bg-brand-forest text-[18px] text-brand-gold sm:mb-5 sm:h-12 sm:w-12 sm:text-[20px]">
          ✦
        </div>
        <div className="mb-2 text-[10px] uppercase tracking-[0.32em] text-brand-gold sm:mb-3 sm:text-[11px]">
          Terima Kasih
        </div>
        <h3 className="font-serif text-[22px] leading-[1.05] text-brand-forest sm:text-[28px]">
          {attending ? "Sampai Jumpa di AURORA" : "Terima Kasih Atas Responsnya"}
        </h3>
        <p className="mt-3 text-[13px] font-light leading-[1.65] opacity-70 sm:mt-4 sm:text-[13.5px] sm:leading-[1.75]">
          {attending
            ? `Konfirmasi kehadiran ${guestName || "Anda"} telah tercatat. Tim kami akan menghubungi untuk detail akses private launching.`
            : `Terima kasih, ${guestName || "Bapak/Ibu"}. Kami akan tetap menyimpan undangan Anda untuk kesempatan berikutnya.`}
        </p>
        <div className="mt-6 h-[1px] w-full bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent sm:mt-7" />
        <button
          onClick={onClose}
          className="mt-6 min-h-[44px] bg-brand-forest px-8 text-[11px] uppercase tracking-[0.22em] text-brand-cream sm:mt-7"
        >
          Tutup
        </button>
        <div className="mt-3 text-[10px] uppercase tracking-[0.18em] opacity-50 sm:mt-4">
          Grand Panca Residence • Aurora
        </div>
      </div>
    </div>
  );
}
