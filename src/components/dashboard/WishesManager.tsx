import { useEffect, useState } from "react";
import type { Wish } from "@/types/invitation";

type Props = {
  wishes: Wish[];
  onExportAllImage: () => void;
  onExportWishImage: (wish: Wish) => void;
  onDeleteWish: (wish: Wish) => void; // <-- Pastikan namanya onDeleteWish
};

export function WishesManager({
  wishes,
  onExportAllImage,
  onExportWishImage,
  onDeleteWish, // <-- Sesuaikan variabelnya di sini
}: Props) {
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-wish-menu]")) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  function onRequestDeleteWish(w: Wish) {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="overflow-hidden border border-brand-gold/20 bg-white">
      <div className="flex flex-col justify-between gap-3 border-b border-brand-gold/15 p-4 sm:flex-row sm:items-center sm:p-6">
        <h3 className="font-serif text-[17px]">Papan Ucapan — Kelola &amp; Ekspor</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onExportAllImage}
            className="min-h-[36px] bg-brand-forest px-4 text-[10px] uppercase tracking-[0.16em] text-brand-cream transition hover:bg-black"
          >
            Export PNG Semua
          </button>
        </div>
      </div>

      <div className="max-h-[560px] space-y-3 overflow-auto p-3 sm:p-4">
        {wishes.length === 0 && (
          <div className="py-10 text-center text-[13px] opacity-40">Belum ada ucapan</div>
        )}
        {wishes.map((w, idx) => (
          <div key={w.id || `${w.name}-${idx}`} className="relative border border-brand-gold/20 bg-brand-cream p-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-forest font-serif text-[11px] text-brand-cream">
                  {w.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-[12px] font-medium">{w.name}</div>
                  <div className="text-[10px] opacity-60">
                    {w.date} • {w.time}
                  </div>
                </div>
              </div>
              <div className="relative" data-wish-menu>
                <button
                  onClick={() => setOpenMenu(openMenu === idx ? null : idx)}
                  className="grid h-7 w-7 place-items-center border border-brand-gold/30 text-[14px] transition hover:bg-brand-forest hover:text-brand-cream"
                >
                  ⋯
                </button>
                {openMenu === idx && (
                  <div className="absolute right-0 top-[32px] z-20 w-[160px] border border-brand-gold/30 bg-white p-1.5 shadow-[0_16px_32px_rgba(0,0,0,0.16)]">
                    <button
                      onClick={() => {
                        onExportWishImage(w);
                        setOpenMenu(null);
                      }}
                      className="w-full border-b border-brand-gold/10 px-3 py-2 text-left text-[11px] uppercase tracking-[0.12em] hover:bg-brand-cream"
                    >
                      Export PNG
                    </button>
                    <button
                      onClick={() => {
                        setOpenMenu(null);
                        onDeleteWish(w);
                      }}
                      className="w-full px-3 py-2 text-left text-[11px] uppercase tracking-[0.12em] text-red-600 hover:bg-red-50"
                    >
                      Hapus
                    </button>
                  </div>
                )}
              </div>
            </div>
            <p className="mt-2 text-[12.5px] leading-[1.6] opacity-75">“{w.message}”</p>
          </div>
        ))}
      </div>
    </div>
  );
}