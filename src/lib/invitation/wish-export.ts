import type { Wish } from "@/types/invitation";

const JSPDF_CDN = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";

const slug = (name: string) => name.replace(/\s+/g, "-").toLowerCase();
const today = () => new Date().toISOString().slice(0, 10);

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = [];
  let current = "";
  for (const word of text.split(" ")) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function downloadCanvas(canvas: HTMLCanvasElement, filename: string, format: "png" | "jpg" | "jpeg" = "png") {
  const mime = format === "png" ? "image/png" : "image/jpeg";
  const a = document.createElement("a");
  a.href = canvas.toDataURL(mime, 0.92);
  a.download = filename;
  a.click();
}

/** Renders a single wish as a branded card on a canvas. */
export function createWishCanvas(wish: Wish, width = 700) {
  const padding = 36;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  ctx.font = '400 15px Inter, sans-serif';
  const lines = wrapText(ctx, wish.message, width - padding * 2);
  const lineHeight = 24;
  const height = 200 + lines.length * lineHeight + 60;

  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = "#FFFEF9";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#C5A880";
  ctx.fillRect(0, 0, width, 4);
  ctx.strokeStyle = "rgba(197,168,128,0.35)";
  ctx.lineWidth = 1;
  ctx.strokeRect(0.5, 0.5, width - 1, height - 1);
  ctx.fillStyle = "#D4AF37";
  ctx.fillRect(padding, 62, 48, 1);
  ctx.fillStyle = "#C5A880";
  ctx.font = '600 10px Inter, sans-serif';
  ctx.fillText("GRAND PANCA RESIDENCE • AURORA", padding, 32);
  ctx.fillStyle = "#0A2E22";
  ctx.font = '600 22px "Playfair Display", serif';
  ctx.fillText(wish.name, padding, 92);
  ctx.fillStyle = "rgba(10,46,34,0.55)";
  ctx.font = '400 11px Inter, sans-serif';
  ctx.fillText(`${wish.date} • ${wish.time}`, padding, 112);
  ctx.fillStyle = "#0A2E22";
  ctx.font = '300 15px Inter, sans-serif';
  let y = 150;
  lines.forEach((line) => {
    ctx.fillText(line, padding, y);
    y += lineHeight;
  });
  ctx.fillStyle = "rgba(197,168,128,0.9)";
  ctx.font = '400 10px Inter, sans-serif';
  ctx.fillText("— Aurora Wishes —", padding, height - 28);
  ctx.fillStyle = "rgba(10,46,34,0.35)";
  ctx.fillRect(padding, height - 36, width - padding * 2, 1);

  return canvas;
}

export function exportWishImage(wish: Wish, format: "png" | "jpg") {
  downloadCanvas(createWishCanvas(wish), `ucapan-${slug(wish.name)}.${format}`, format);
}

/** Loads jsPDF from CDN once and returns the constructor. */
async function loadJsPDF(): Promise<any> {
  const w = window as any;
  if (w.jspdf?.jsPDF) return w.jspdf.jsPDF;
  if (w.jsPDF) return w.jsPDF;

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = JSPDF_CDN;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load jsPDF"));
    document.head.appendChild(script);
  });

  const lib = (window as any).jspdf?.jsPDF || (window as any).jsPDF;
  if (!lib) throw new Error("jsPDF not available");
  return lib;
}

/** Single wish as PDF. Returns false when jsPDF failed and a PNG was saved instead. */
export async function exportWishPDF(wish: Wish) {
  try {
    const JsPDF = await loadJsPDF();
    const canvas = createWishCanvas(wish);
    const doc = new JsPDF({ orientation: "portrait", unit: "pt", format: [canvas.width, canvas.height] });
    doc.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, canvas.width, canvas.height);
    doc.save(`ucapan-${slug(wish.name)}.pdf`);
    return true;
  } catch {
    downloadCanvas(createWishCanvas(wish), `ucapan-${slug(wish.name)}.png`, "png");
    return false;
  }
}

/** All wishes in one multi-page PDF. Falls back to a PNG collage. */
export async function exportAllWishesPDF(wishes: Wish[]) {
  try {
    const JsPDF = await loadJsPDF();
    const doc = new JsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 40;

    doc.setFillColor(10, 46, 34);
    doc.rect(0, 0, pageW, 78, "F");
    doc.setTextColor(197, 168, 128);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("GRAND PANCA RESIDENCE • AURORA • PRIVATE LAUNCH", margin, 28);
    doc.setTextColor(255, 254, 249);
    doc.setFont("times", "bold");
    doc.setFontSize(20);
    doc.text("Papan Ucapan & Doa", margin, 52);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Total ${wishes.length} ucapan • Dicetak ${new Date().toLocaleString("id-ID")}`, margin, 68);

    let y = 110;
    wishes.forEach((w) => {
      const needed = 70 + Math.ceil(w.message.length / 60) * 14;
      if (y + needed > pageH - 40) {
        doc.addPage();
        y = 40;
      }
      doc.setDrawColor(197, 168, 128);
      doc.setLineWidth(0.6);
      doc.setFillColor(255, 254, 249);
      doc.roundedRect(margin, y, pageW - margin * 2, needed, 2, 2, "FD");
      doc.setFillColor(197, 168, 128);
      doc.rect(margin, y, pageW - margin * 2, 3, "F");
      doc.setTextColor(10, 46, 34);
      doc.setFont("times", "bold");
      doc.setFontSize(12);
      doc.text(w.name, margin + 12, y + 22);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`${w.date} • ${w.time}`, margin + 12, y + 34);
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(10);
      doc.text(doc.splitTextToSize(`"${w.message}"`, pageW - margin * 2 - 24), margin + 12, y + 50);
      y += needed + 12;
    });

    doc.save(`grand-panca-ucapan-semua-${today()}.pdf`);
    return true;
  } catch {
    exportAllWishesImage(wishes, "png");
    return false;
  }
}

/** All wishes rendered as one tall image. */
export function exportAllWishesImage(wishes: Wish[], format: "png" | "jpg") {
  const W = 860;
  const padding = 32;
  const gap = 18;

  const measure = document.createElement("canvas").getContext("2d")!;
  measure.font = '300 15px Inter, sans-serif';
  const cards = wishes.map((wish) => {
    const lines = wrapText(measure, wish.message, W - padding * 2 - 24);
    return { wish, lines, h: 96 + lines.length * 22 + 24 };
  });

  const totalH = 140 + cards.reduce((acc, c) => acc + c.h + gap, 0) + 40;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = Math.min(totalH, 16000);
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#FFFEF9";
  ctx.fillRect(0, 0, W, canvas.height);
  ctx.fillStyle = "#0A2E22";
  ctx.fillRect(0, 0, W, 88);
  ctx.fillStyle = "#C5A880";
  ctx.font = '600 11px Inter, sans-serif';
  ctx.fillText("GRAND PANCA RESIDENCE • AURORA • PRIVATE LAUNCH", padding, 28);
  ctx.fillStyle = "#FFFEF9";
  ctx.font = '600 26px "Playfair Display", serif';
  ctx.fillText("Papan Ucapan & Doa", padding, 58);
  ctx.fillStyle = "rgba(255,254,249,0.7)";
  ctx.font = '400 11px Inter, sans-serif';
  ctx.fillText(`Total ${wishes.length} ucapan • ${new Date().toLocaleString("id-ID")}`, padding, 76);

  let y = 116;
  cards.forEach(({ wish, lines, h }) => {
    if (y + h > canvas.height - 20) return;
    const cardW = W - padding * 2;
    const r = 6;
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "rgba(197,168,128,0.28)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding + r, y);
    ctx.lineTo(padding + cardW - r, y);
    ctx.quadraticCurveTo(padding + cardW, y, padding + cardW, y + r);
    ctx.lineTo(padding + cardW, y + h - r);
    ctx.quadraticCurveTo(padding + cardW, y + h, padding + cardW - r, y + h);
    ctx.lineTo(padding + r, y + h);
    ctx.quadraticCurveTo(padding, y + h, padding, y + h - r);
    ctx.lineTo(padding, y + r);
    ctx.quadraticCurveTo(padding, y, padding + r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#C5A880";
    ctx.fillRect(padding, y, cardW, 3);
    ctx.fillStyle = "#0A2E22";
    ctx.font = '600 14px Inter, sans-serif';
    ctx.fillText(wish.name, padding + 16, y + 28);
    ctx.fillStyle = "rgba(10,46,34,0.55)";
    ctx.font = '400 10px Inter, sans-serif';
    ctx.fillText(`${wish.date} • ${wish.time}`, padding + 16, y + 44);
    ctx.fillStyle = "#0A2E22";
    ctx.font = '300 13px Inter, sans-serif';
    let ly = y + 66;
    lines.forEach((line) => {
      ctx.fillText(line, padding + 16, ly);
      ly += 20;
    });
    y += h + gap;
  });

  downloadCanvas(canvas, `grand-panca-ucapan-collage-${today()}.${format}`, format);
}
