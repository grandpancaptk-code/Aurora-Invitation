# Grand Panca Residence — AURORA

Undangan digital private launching cluster AURORA, lengkap dengan dashboard admin.

## Halaman

| Rute         | Isi                                                              |
| ------------ | ---------------------------------------------------------------- |
| `/`          | Undangan: hero, konfirmasi kehadiran (RSVP), papan ucapan, footer |
| `/dashboard` | Login admin, daftar tamu, kelola ucapan, link VIP, akun admin     |

## Struktur folder

```
src/
  routes/
    __root.tsx              layout global + font & metadata dasar
    index.tsx               halaman undangan
    dashboard.tsx           halaman dashboard admin
  components/
    common/                 komponen dipakai kedua halaman (BrandMark, ToastStack)
    invitation/             HeroSection, HeroOrnaments, RsvpSection,
                            WishesSection, ThankYouModal, SiteFooter
    dashboard/              LoginScreen, DashboardHeader, StatsGrid,
                            GuestList, WishesManager, VipGenerator, AdminAccounts
    ui/                     komponen dasar shadcn
  hooks/
    useToasts.tsx           antrean notifikasi
    useRevealOnScroll.ts    animasi muncul saat digulir
  lib/invitation/
    constants.ts            data acara, kredensial awal, contoh ucapan
    storage.ts              penyimpanan lokal yang aman untuk SSR
    admin.ts                aturan akun admin & pembuat link VIP
    guest-export.ts         ekspor tamu ke CSV / Excel
    wish-export.ts          ekspor ucapan ke PNG / JPG / PDF
  types/invitation.ts       tipe data bersama
  styles.css                design token + animasi (tidak ada CSS di dalam komponen)
```

## Catatan

- Tidak ada JavaScript yang ditulis langsung di dalam file HTML; seluruh logika berada di modul TypeScript.
- Data tamu, ucapan, link VIP, dan akun admin disimpan di `localStorage` browser.
- Kredensial awal dashboard: `admin@grandpanca.id` / alias `grandpanca`, password `GrandPanca2026!`.
