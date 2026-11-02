import { useState } from "react";
import type { VIP } from "@/types/invitation";

type Props = {
  vipList: VIP[];
  copiedLink: string | null;
  onCopy: (link: string) => void;
  onDeleteVip: (vip: VIP) => void;
};

export function VipListManager({
  vipList,
  copiedLink,
  onCopy,
  onDeleteVip,
}: Props) {
  const [search, setSearch] = useState("");

  const filteredVip = vipList.filter((v) => {
    const term = search.toLowerCase();
    return (
      v.name.toLowerCase().includes(term) ||
      (v.phone && v.phone.toLowerCase().includes(term))
    );
  });

  return (
    <div className="border border-brand-forest/15 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-serif text-[20px] text-brand-forest">
            Database Tamu VIP ({vipList.length})
          </h2>
          <p className="text-[12px] opacity-60">
            Daftar link VIP yang tersimpan di Supabase
          </p>
        </div>
        <input
          type="text"
          placeholder="Cari VIP..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-h-[38px] w-full border border-brand-forest/20 px-3 text-[13px] outline-none focus:border-brand-gold sm:w-60"
        />
      </div>

      <div className="max-h-[350px] overflow-y-auto border border-brand-forest/10">
        <table className="w-full text-left text-[13px]">
          <thead className="sticky top-0 bg-brand-cream/80 text-[11px] uppercase tracking-wider text-brand-forest/70 backdrop-blur-sm">
            <tr>
              <th className="p-3">Nama VIP</th>
              <th className="p-3">No. WhatsApp</th>
              <th className="p-3">Link Khusus</th>
              <th className="p-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-forest/10">
            {filteredVip.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-400">
                  {search ? "Tamu VIP tidak ditemukan" : "Belum ada data VIP"}
                </td>
              </tr>
            ) : (
              filteredVip.map((vip, idx) => (
                <tr key={vip.id || idx} className="hover:bg-brand-cream/30">
                  <td className="p-3 font-medium text-brand-forest">{vip.name}</td>
                  <td className="p-3 text-gray-600">{vip.phone || "-"}</td>
                  <td className="p-3 font-mono text-[11px] text-brand-gold">
                    <span className="max-w-[200px] truncate block">{vip.link}</span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => onCopy(vip.link || "")}
                      className="bg-brand-forest px-2.5 py-1 text-[10px] uppercase tracking-wider text-brand-cream transition hover:bg-black"
                    >
                      {copiedLink === vip.link ? "Disalin!" : "Copy"}
                    </button>
                    <button
                      onClick={() => onDeleteVip(vip)}
                      className="border border-red-200 px-2.5 py-1 text-[10px] uppercase tracking-wider text-red-600 transition hover:bg-red-50"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}