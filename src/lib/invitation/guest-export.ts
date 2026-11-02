import type { Guest } from "@/types/invitation";

const HEADER = ["No", "Nama Lengkap", "Nomor WA", "Status", "Tanggal Daftar", "Waktu Daftar", "Sumber"];

function guestRow(g: Guest, index: number) {
  return [
    index + 1,
    g.name,
    g.phone,
    g.status === "hadir" ? "Hadir" : "Lain Kali",
    g.date || g.fullDate || "",
    g.timeDetail || "",
    g.source || "Public",
  ];
}

function downloadBlob(content: string, mime: string, filename: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const today = () => new Date().toISOString().slice(0, 10);

/** Comma-separated export, quoted for Excel/Sheets compatibility. */
export function exportGuestsCSV(guests: Guest[]) {
  const rows = guests.map((g, i) =>
    guestRow(g, i).map((cell, idx) => (idx === 0 ? cell : `"${String(cell).replace(/"/g, '""')}"`)),
  );
  const csv = "\uFEFF" + [HEADER.join(","), ...rows.map((r) => r.join(","))].join("\n");
  downloadBlob(csv, "text/csv;charset=utf-8;", `grand-panca-tamu-${today()}.csv`);
}

/** Tab-separated export that Excel opens directly. */
export function exportGuestsExcel(guests: Guest[]) {
  const rows = guests.map((g, i) => guestRow(g, i));
  const tsv = "\uFEFF" + [HEADER.join("\t"), ...rows.map((r) => r.join("\t"))].join("\n");
  downloadBlob(tsv, "application/vnd.ms-excel", `grand-panca-tamu-${today()}.xlsx`);
}
