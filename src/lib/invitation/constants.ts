import type { AdminUser, VIP, Wish } from "@/types/invitation";

/** Keys used to persist invitation data in the browser. */
export const LS_KEYS = {
  admins: "grandpanca_admin_users",
  session: "grandpanca_admin_session",
  guests: "grandpanca_guests",
  wishes: "grandpanca_wishes",
  vip: "grandpanca_vip",
} as const;

export const EVENT_INFO = {
  brand: "GRAND PANCA RESIDENCE",
  cluster: "AURORA",
  date: "Sabtu, 18 Nov 2026",
  time: "09.00 WIB – Selesai",
  targetDate: "2026-11-18T09:00:00+07:00", // ISO String untuk 18 Nov 2026 09:00 WIB
  venue: "Aurora Block E1\nGrand Panca Residence",
  dresscode: "Dresscode: Bebas Rapi",
  address: "Jl. Gusti Hamzah No.168, Kota Pontianak, Kalimantan Barat",
} as const;

export const SUPER_ADMIN: AdminUser = {
  id: "super-1",
  email: "admin@grandpanca.id",
  password: "GrandPanca2026!",
  role: "Super Admin",
  createdAt: new Date(0).toISOString(),
  alias: "grandpanca",
};

export const SAMPLE_WISHES: Wish[] = [
  {
    name: "Anindya Putri",
    message:
      "Selamat atas launchingnya AURORA! Tak sabar melihat mahakarya Grand Panca Residence. Semoga menjadi hunian impian keluarga.",
    time: "09:24",
    date: "Hari ini",
  },
  {
    name: "Budi Santoso",
    message:
      "Desainnya sangat elegan. Grand Panca selalu memberikan yang terbaik. Sampai jumpa di hari launching!",
    time: "08:11",
    date: "Hari ini",
  },
  {
    name: "Clara Wijaya",
    message: "AURORA — nama yang indah untuk hunian seindah itu. Congratulations!",
    time: "Kemarin",
    date: "19:40",
  },
  {
    name: "Rendra & Maya",
    message: "Kami hadir dengan penuh antusias. Terima kasih atas undangannya yang sangat mewah.",
    time: "Kemarin",
    date: "16:02",
  },
];

export const SAMPLE_VIP: VIP[] = [
  { name: "Tuan Andika", phone: "0812xxxx", link: "" },
  { name: "Ibu Sari Lestari", phone: "0813xxxx", link: "" },
];
