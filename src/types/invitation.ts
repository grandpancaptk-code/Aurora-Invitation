export type RsvpStatus = "hadir" | "tidak";

export type Guest = {
  id?: string;
  name: string;
  phone: string;
  status: RsvpStatus;
  source?: string;
  date: string;
  timeDetail?: string;
};

export type Wish = {
  id: any;
  name: string;
  message: string;
  time: string;
  date: string;
};

export type VIP = {
  id: number;
  name: string;
  phone: string;
  link: string;
};

export type AdminRole = "Super Admin" | "Admin";

export type AdminUser = {
  id: string;
  email: string;
  password: string;
  role: AdminRole;
  createdAt: string;
  alias?: string;
};

export type AdminSession = {
  id: string;
  email: string;
  role: string;
  loginAt: string;
};

export type ToastType = "success" | "error" | "info";

export type Toast = {
  id: string;
  msg: string;
  type: ToastType;
};

export interface ThemeConfig {
  primaryColor: string; // e.g., '#0d3b2e' (Emerald)
  accentColor: string;  // e.g., '#c5a059' (Gold)
  bgPattern?: string;
  sealImage?: string;
}

export interface EventData {
  id: string;
  slug: string;           // URL path (misal: 'launching-aurora')
  title: string;          // Nama Acara
  event_date: string;     // Tanggal Acara
  event_time: string;     // Waktu Acara
  venue_name: string;     // Nama Tempat/Venue
  venue_address: string;  // Alamat Lengkap
  google_maps_url: string;
  theme_config: ThemeConfig;
}