import { useState } from "react";
import type { VIP } from "@/types/invitation";

type Props = {
  vipList: VIP[];
  onCreate: (name: string, phone: string) => void;
  onCopy: (link: string) => void;
  copiedLink: string | null;
};

export function VipGenerator({ vipList, onCreate, onCopy, copiedLink }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const submit = () => {
    if (!name.trim()) return;
    onCreate(name.trim(), phone.trim());
    setName("");
    setPhone("");
  };

  return (
    <div className="border border-brand-gold/20 bg-brand-forest p-5 text-brand-cream sm:p-6 lg:p-7">
      <h3 className="mb-1 font-serif text-[17px] tracking-wide sm:text-[18px]">Generator Link VIP</h3>
      <p className="mb-5 text-[12px] font-light leading-[1.6] opacity-70">
        Buat link personal: nama akan ter-prefill otomatis saat tamu membuka undangan di /
      </p>
      <div className="space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama Tamu VIP"
          className="min-h-[44px] w-full border-b border-brand-gold/40 bg-white/5 px-3 text-[14px] outline-none placeholder:text-white/40 focus:border-brand-gold"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Nomor WhatsApp (opsional)"
          className="min-h-[44px] w-full border-b border-brand-gold/30 bg-white/5 px-3 text-[14px] outline-none placeholder:text-white/30 focus:border-brand-gold"
        />
        <button
          onClick={submit}
          className="min-h-[46px] w-full bg-brand-gold text-[11px] font-medium uppercase tracking-[0.2em] text-brand-forest transition hover:bg-brand-gold-bright sm:text-[12px]"
        >
          Buat Link
        </button>
      </div>

      <div className="mt-6 max-h-[300px] space-y-3 overflow-auto pr-1">
        {vipList.map((v, i) => (
          <div key={`${v.name}-${i}`} className="border border-white/10 bg-white/[0.04] p-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-[13px] font-medium">{v.name}</div>
                <div className="text-[11px] opacity-60">{v.phone}</div>
              </div>
              <button
                onClick={() => onCopy(v.link)}
                className="min-h-[32px] min-w-[56px] shrink-0 border border-brand-gold/40 px-2.5 py-1.5 text-[10px] uppercase tracking-[0.16em] transition hover:bg-brand-gold hover:text-brand-forest"
              >
                {copiedLink === v.link ? "✓" : "Copy"}
              </button>
            </div>
            <div className="mt-2 break-all font-mono text-[10px] leading-[1.5] opacity-70 sm:text-[11px]">{v.link}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
