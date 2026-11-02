import { useState } from "react";
import type { Guest } from "@/types/invitation";

type Props = {
  guests: Guest[];
  search: string;
  onSearchChange: (value: string) => void;
  onDeleteGuest?: (guest: Guest) => void;
  deletePassword?: string;
};

const EMPTY = "Belum ada konfirmasi. Tamu dari / akan muncul di sini.";

export function GuestList({
  guests,
  search,
  onSearchChange,
  onDeleteGuest,
  deletePassword = "GrandPanca2026!",
}: Props) {
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleOpenDeleteModal = (guest: Guest) => {
    setSelectedGuest(guest);
    setPasswordInput("");
    setErrorMsg("");
  };

  const handleCloseModal = () => {
    setSelectedGuest(null);
    setPasswordInput("");
    setErrorMsg("");
  };

  const handleConfirmDelete = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput !== deletePassword) {
      setErrorMsg("Password salah! Gagal menghapus.");
      return;
    }

    if (selectedGuest && onDeleteGuest) {
      onDeleteGuest(selectedGuest);
    }
    handleCloseModal();
  };

  return (
    <div className="overflow-hidden border border-brand-gold/20 bg-white">
      {/* Header & Search */}
      <div className="flex flex-col justify-between gap-3 border-b border-brand-gold/15 p-4 sm:flex-row sm:items-center sm:p-6 lg:p-7">
        <h3 className="font-serif text-[17px] tracking-wide sm:text-[18px]">
          Daftar Tamu
        </h3>
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nama / WA"
          className="min-h-[44px] w-full border border-brand-gold/30 bg-brand-cream px-3 text-[13px] outline-none placeholder:opacity-40 focus:border-brand-gold sm:w-[240px] lg:w-[260px]"
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden max-h-[520px] overflow-auto md:block">
        <table className="w-full text-left text-[13px]">
          <thead className="sticky top-0 border-b border-brand-gold/15 bg-brand-cream text-[10px] uppercase tracking-[0.18em] opacity-60">
            <tr>
              <th className="px-6 py-3 font-medium">Nama</th>
              <th className="px-4 py-3 font-medium">WA</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-3 py-3 font-medium">Sumber</th>
              <th className="px-6 py-3 font-medium">Waktu</th>
              <th className="px-6 py-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {guests.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-16 text-center text-[13px] opacity-40"
                >
                  {EMPTY}
                </td>
              </tr>
            )}
            {guests.map((g, i) => (
              <tr
                key={`${g.name}-${i}`}
                className="border-b border-brand-gold/10 hover:bg-brand-cream"
              >
                <td className="px-6 py-3.5 font-medium">{g.name}</td>
                <td className="px-4 py-3.5 opacity-70">{g.phone}</td>
                <td className="px-4 py-3.5">
                  <span
                    className={`border px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] ${
                      g.status === "hadir"
                        ? "border-brand-forest bg-brand-forest text-brand-cream"
                        : "border-brand-gold text-[#8a6a3f]"
                    }`}
                  >
                    {g.status === "hadir" ? "Hadir" : "Lain Kali"}
                  </span>
                </td>
                <td className="px-3 py-3.5">
                  <span
                    className={`border px-2 py-1 text-[9px] uppercase tracking-[0.16em] ${
                      g.source === "VIP"
                        ? "border-brand-gold bg-brand-gold/10 text-[#8a6a3f]"
                        : "border-black/10 opacity-60"
                    }`}
                  >
                    {g.source || "Public"}
                  </span>
                </td>
                <td className="px-6 py-3.5 text-[11px] opacity-60">
                  {g.date} {g.timeDetail ? `• ${g.timeDetail}` : ""}
                </td>
                <td className="px-6 py-3.5 text-right">
                  <button
                    onClick={() => handleOpenDeleteModal(g)}
                    className="border border-red-200 bg-red-50 px-2.5 py-1 text-[10px] uppercase tracking-wider text-red-600 transition-colors hover:bg-red-600 hover:text-white"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="max-h-[520px] space-y-3 overflow-auto p-3 md:hidden">
        {guests.length === 0 && (
          <div className="py-12 text-center text-[13px] opacity-40">
            {EMPTY}
          </div>
        )}
        {guests.map((g, i) => (
          <div
            key={`${g.name}-${i}`}
            className="border border-brand-gold/20 bg-brand-cream p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="text-[14px] font-medium">{g.name}</div>
              <div className="flex items-center gap-2">
                <span
                  className={`shrink-0 border px-2 py-1 text-[9px] uppercase tracking-[0.16em] ${
                    g.status === "hadir"
                      ? "border-brand-forest bg-brand-forest text-brand-cream"
                      : "border-brand-gold text-[#8a6a3f]"
                  }`}
                >
                  {g.status === "hadir" ? "Hadir" : "Lain Kali"}
                </span>
                <button
                  onClick={() => handleOpenDeleteModal(g)}
                  className="shrink-0 border border-red-200 bg-red-50 px-2 py-1 text-[9px] uppercase text-red-600 transition-colors hover:bg-red-600 hover:text-white"
                >
                  Hapus
                </button>
              </div>
            </div>
            <div className="mt-2 text-[12px] opacity-70">
              {g.phone} • {g.source || "Public"} • {g.date}{" "}
              {g.timeDetail || ""}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL CONFIRMATION & PASSWORD POPUP */}
      {selectedGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md border border-brand-gold/30 bg-white p-6 shadow-xl">
            <h4 className="font-serif text-[18px] text-brand-forest">
              Konfirmasi Hapus
            </h4>
            <p className="mt-2 text-[13px] text-gray-600">
              Apakah Anda yakin ingin menghapus data tamu{" "}
              <strong className="text-black">{selectedGuest.name}</strong>?
            </p>

            <form onSubmit={handleConfirmDelete} className="mt-4 space-y-3">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-gray-500">
                  Masukkan Password Admin
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Password"
                  autoFocus
                  required
                  className="mt-1 min-h-[40px] w-full border border-brand-gold/30 bg-brand-cream px-3 text-[13px] outline-none focus:border-brand-gold"
                />
              </div>

              {errorMsg && (
                <p className="text-[12px] font-medium text-red-600">
                  {errorMsg}
                </p>
              )}

              <div className="mt-6 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="border border-gray-300 px-4 py-2 text-[12px] uppercase tracking-wider text-gray-600 transition-colors hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-red-600 px-4 py-2 text-[12px] uppercase tracking-wider text-white transition-colors hover:bg-red-700"
                >
                  Hapus Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}