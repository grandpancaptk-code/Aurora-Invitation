import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { ToastStack } from "@/components/common/ToastStack";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { GuestList } from "@/components/dashboard/GuestList";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { WishesManager } from "@/components/dashboard/WishesManager";
import { useToasts } from "@/hooks/useToasts";
import { buildVipLink } from "@/lib/invitation/admin";
import { exportGuestsCSV, exportGuestsExcel } from "@/lib/invitation/guest-export";
import { exportAllWishesImage, exportWishImage } from "@/lib/invitation/wish-export";
import { supabase } from "@/lib/supabase";
import type { Guest, VIP, Wish } from "@/types/invitation";

const TITLE = "Dashboard Tamu — AURORA Grand Panca Residence";
const DESCRIPTION = "Kelola konfirmasi kehadiran, ucapan, dan link VIP undangan AURORA.";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});

// Perbaikan: Menghapus kata 'export' di depan fungsi untuk optimasi code-splitting
function DashboardPage() {
  // State Autentikasi Supabase
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<"admin" | "staff" | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // State Form Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Data State
  const [guests, setGuests] = useState<Guest[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [vipList, setVipList] = useState<VIP[]>([]);

  // State VIP Form
  const [vipName, setVipName] = useState("");
  const [vipPhone, setVipPhone] = useState("");
  const [isCreatingVip, setIsCreatingVip] = useState(false);

  // State Panel User Role Generator
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState<"admin" | "staff">("staff");
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const [search, setSearch] = useState("");
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const { toasts, showToast } = useToasts();

  // State Modal Hapus Ucapan
  const [wishToDelete, setWishToDelete] = useState<Wish | null>(null);

  // 1. Cek & Dengar Perubahan Session Auth
  useEffect(() => {
    void supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch User Role dari Database
  const fetchUserRole = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Gagal mengambil role:", error);
    }
    if (data) {
      setUserRole(data.role as "admin" | "staff");
    } else {
      setUserRole("staff");
    }
  }, []);

  // Fetch Data Dashboard
  const fetchGuests = useCallback(async () => {
    const { data } = await supabase.from("guests").select("*").order("created_at", { ascending: false });
    if (data) setGuests(data as Guest[]);
  }, []);

  const fetchWishes = useCallback(async () => {
    const { data } = await supabase.from("wishes").select("*").order("created_at", { ascending: false });
    if (data) setWishes(data as Wish[]);
  }, []);

  const fetchVipGuests = useCallback(async () => {
    const { data } = await supabase.from("vip_guests").select("*").order("created_at", { ascending: false });
    if (data) setVipList(data as VIP[]);
  }, []);

  // 2. Load Realtime Data Saat User Autentikasi
  useEffect(() => {
    if (!user) return;

    void fetchUserRole(user.id);
    void fetchGuests();
    void fetchWishes();
    void fetchVipGuests();

    const channel = supabase
      .channel("dashboard-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "guests" }, () => void fetchGuests())
      .on("postgres_changes", { event: "*", schema: "public", table: "wishes" }, () => void fetchWishes())
      .on("postgres_changes", { event: "*", schema: "public", table: "vip_guests" }, () => void fetchVipGuests())
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [user, fetchUserRole, fetchGuests, fetchWishes, fetchVipGuests]);

  // Login Handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (error) {
      setLoginError("Email atau password salah.");
    } else {
      showToast("Login berhasil");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserRole(null);
    showToast("Logout berhasil", "info");
  };

  const filteredGuests = useMemo(
    () =>
      guests.filter((g) => {
        const name = g?.name ? String(g.name).toLowerCase() : "";
        const phone = g?.phone ? String(g.phone) : "";
        return name.includes(search.toLowerCase()) || phone.includes(search);
      }),
    [guests, search],
  );

  // VIP Generator Handler
  const handleCreateVip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vipName.trim()) return showToast("Nama VIP wajib diisi", "error");

    setIsCreatingVip(true);
    const { error } = await supabase.from("vip_guests").insert([
      { name: vipName.trim(), phone: vipPhone.trim() || "-", link: buildVipLink(vipName.trim()) },
    ]);
    setIsCreatingVip(false);

    if (error) {
      showToast("Gagal menyimpan VIP", "error");
    } else {
      setVipName("");
      setVipPhone("");
      showToast("Link VIP tersimpan");
      void fetchVipGuests();
    }
  };

  // Handler Tambah User Baru
  const handleCreateUserWithRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail.trim() || !newUserPassword.trim()) {
      showToast("Email dan password wajib diisi", "error");
      return;
    }
    if (newUserPassword.length < 6) {
      showToast("Password minimal 6 karakter", "error");
      return;
    }

    setIsCreatingUser(true);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: newUserEmail.trim(),
      password: newUserPassword,
    });

    if (authError) {
      console.error("Gagal mendaftarkan user:", authError);
      showToast(`Gagal: ${authError.message}`, "error");
      setIsCreatingUser(false);
      return;
    }

    if (authData.user) {
      const { error: roleError } = await supabase.from("user_roles").insert([
        {
          user_id: authData.user.id,
          role: newUserRole,
        },
      ]);

      if (roleError) {
        console.error("Gagal menyimpan role:", roleError);
        showToast("User dibuat, tetapi gagal menyimpan role", "error");
      } else {
        showToast(`User (${newUserRole.toUpperCase()}) berhasil dibuat!`, "success");
        setNewUserEmail("");
        setNewUserPassword("");
        setNewUserRole("staff");
      }
    }

    setIsCreatingUser(false);
  };

  const handleCopyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      /* clipboard unavailable */
    }
    setCopiedLink(link);
    window.setTimeout(() => setCopiedLink(null), 1800);
    showToast("Link disalin");
  };

  // Delete Handlers
  const handleDeleteVip = async (id: number | string) => {
    if (userRole !== "admin") return showToast("Akses ditolak: Khusus Admin", "error");
    if (!window.confirm("Hapus link VIP ini dari database?")) return;
    
    const { error } = await supabase.from("vip_guests").delete().eq("id", id);
    if (error) showToast("Gagal menghapus VIP", "error");
    else void fetchVipGuests();
  };

  const handleDeleteGuest = async (guest: Guest) => {
    if (userRole !== "admin") return showToast("Akses ditolak: Khusus Admin", "error");
    
    const { error } = await supabase.from("guests").delete().eq("id", guest.id);
    if (error) showToast("Gagal menghapus tamu", "error");
    else void fetchGuests();
  };

  const handleConfirmDeleteWish = async () => {
    if (userRole !== "admin") {
      showToast("Akses ditolak: Khusus Admin", "error");
      setWishToDelete(null);
      return;
    }
    if (wishToDelete) {
      const { error } = await supabase.from("wishes").delete().eq("id", wishToDelete.id);
      if (error) showToast("Gagal menghapus ucapan", "error");
      else setWishes((prev) => prev.filter((w) => w.id !== wishToDelete.id));
    }
    setWishToDelete(null);
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-cream text-brand-forest">
        Memuat session...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-cream p-4 text-brand-forest">
        <form onSubmit={handleLoginSubmit} className="w-full max-w-md border border-brand-forest/10 bg-white p-8 shadow-xl">
          <h2 className="font-serif text-2xl text-brand-forest">Admin Login</h2>
          <p className="mt-1 text-xs opacity-70">Masuk untuk mengelola dashboard undangan</p>

          {loginError && <div className="mt-4 border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-500">{loginError}</div>}

          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-[10px] font-medium uppercase tracking-wider opacity-70">Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="mt-1 min-h-[42px] w-full border border-brand-forest/15 bg-white px-3 text-xs text-brand-forest outline-none focus:border-brand-gold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium uppercase tracking-wider opacity-70">Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="mt-1 min-h-[42px] w-full border border-brand-forest/15 bg-white px-3 text-xs text-brand-forest outline-none focus:border-brand-gold"
              />
            </div>
            <button type="submit" className="mt-2 min-h-[44px] w-full bg-brand-forest text-xs uppercase tracking-wider text-white transition hover:bg-black">
              Masuk
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream text-brand-forest selection:bg-brand-gold/30">
      <DashboardHeader
        session={{
          id: user.id,
          email: user.email ?? "User",
          role: userRole ? userRole.toUpperCase() : "STAFF",
          loginAt: new Date().toISOString(),
        }}
        onLogout={() => void handleLogout()}
      />

      <main className="mx-auto w-full max-w-[1280px] px-5 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] opacity-70">
            <Link to="/">Invitation /</Link>
            <span>Dashboard</span>
          </div>
        </div>

        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="mb-2 text-[10px] font-medium uppercase tracking-[0.28em] text-brand-gold">
              Grand Panca Residence • Aurora Launch
            </div>
            <h1 className="font-serif text-3xl">Dashboard Tamu</h1>
            <p className="mt-1 text-xs opacity-70">
              Role Anda: <strong className="uppercase text-brand-gold">{userRole}</strong> {userRole === "staff" && "(Akses Terbatas: Tanpa Izin Hapus)"}
            </p>
          </div>
          <div className="flex gap-2.5">
            <button onClick={() => exportGuestsCSV(guests)} className="bg-brand-forest px-4 py-2 text-[11px] uppercase text-white transition hover:bg-black">
              Export CSV
            </button>
            <button onClick={() => exportGuestsExcel(guests)} className="bg-brand-gold px-4 py-2 text-[11px] font-medium uppercase text-brand-forest transition">
              Export Excel
            </button>
          </div>
        </div>

        <StatsGrid
          stats={[
            { label: "Total Konfirmasi", value: guests.length },
            { label: "Hadir", value: guests.filter((g) => String(g.status).toLowerCase() === "hadir").length },
            { label: "Lain Kali", value: guests.filter((g) => String(g.status).toLowerCase() !== "hadir").length },
            { label: "Ucapan", value: wishes.length },
          ]}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          {/* Kolom Kiri */}
          <div className="space-y-6">
            <GuestList
              guests={filteredGuests}
              search={search}
              onSearchChange={setSearch}
              onDeleteGuest={handleDeleteGuest}
            />

            {/* Database Link VIP */}
            <div className="border border-brand-forest/10 bg-[#fbf9f4] p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-[18px]">Database Link VIP</h2>
                  <p className="text-[12px] opacity-70">Daftar link khusus tamu VIP tersimpan di Supabase.</p>
                </div>
                <span className="bg-brand-forest/10 px-2.5 py-1 text-[11px] font-medium text-brand-forest">
                  {vipList.length} Link
                </span>
              </div>

              {vipList.length === 0 ? (
                <div className="border border-dashed border-brand-forest/20 p-8 text-center text-[13px] opacity-60">
                  Belum ada link VIP tersimpan.
                </div>
              ) : (
                <div className="max-h-[380px] space-y-3 overflow-y-auto pr-1">
                  {vipList.map((item) => (
                    <div key={item.id} className="flex flex-col gap-2 border border-brand-forest/10 bg-white p-3.5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[13.5px] font-medium">{item.name}</span>
                          <span className="text-[11px] opacity-60">({item.phone})</span>
                        </div>
                        <div className="mt-1 truncate text-[11px] text-brand-gold">{item.link}</div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() => void handleCopyLink(item.link)}
                          className="bg-brand-forest/5 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-brand-forest transition hover:bg-brand-forest hover:text-white"
                        >
                          {copiedLink === item.link ? "Tersalin!" : "Salin Link"}
                        </button>
                        {userRole === "admin" && (
                          <button
                            type="button"
                            onClick={() => void handleDeleteVip(item.id)}
                            className="px-2 py-1.5 text-[11px] uppercase tracking-[0.1em] text-red-500 transition hover:bg-red-50"
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <WishesManager
              wishes={wishes}
              onExportAllImage={() => exportAllWishesImage(wishes, "png")}
              onExportWishImage={(w) => exportWishImage(w, "png")}
              onDeleteWish={(w) => setWishToDelete(w)}
            />
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-6">
            {/* VIP GENERATOR */}
            <div className="border border-brand-forest/20 bg-brand-forest p-5 text-white shadow-md sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-[18px] text-amber-300 sm:text-[20px]">
                  VIP Generator
                </h2>
                <span className="border border-amber-400/30 bg-amber-400/20 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-amber-300">
                  Khusus VIP
                </span>
              </div>
              <p className="mt-1 text-[12px] opacity-80">
                Buat link nama VIP otomatis dan simpan ke database Supabase.
              </p>

              <form onSubmit={handleCreateVip} className="mt-5 space-y-3.5">
                <div>
                  <label htmlFor="vipName" className="block text-[10px] font-medium uppercase tracking-[0.16em] text-amber-200">
                    NAMA TAMU VIP
                  </label>
                  <input
                    id="vipName"
                    type="text"
                    value={vipName}
                    onChange={(e) => setVipName(e.target.value)}
                    placeholder="Contoh: Bpk. Hendra & Keluarga"
                    disabled={isCreatingVip}
                    className="mt-1 min-h-[42px] w-full border border-emerald-600/40 bg-[#041a13] px-3 text-[13px] text-white placeholder-emerald-400/40 outline-none focus:border-amber-400 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label htmlFor="vipPhone" className="block text-[10px] font-medium uppercase tracking-[0.16em] text-amber-200">
                    NO. WHATSAPP / TELEPON (OPSIONAL)
                  </label>
                  <input
                    id="vipPhone"
                    type="text"
                    value={vipPhone}
                    onChange={(e) => setVipPhone(e.target.value)}
                    placeholder="08123456789"
                    disabled={isCreatingVip}
                    className="mt-1 min-h-[42px] w-full border border-emerald-600/40 bg-[#041a13] px-3 text-[13px] text-white placeholder-emerald-400/40 outline-none focus:border-amber-400 disabled:opacity-50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isCreatingVip}
                  className="mt-2 min-h-[44px] w-full bg-brand-gold text-[11px] font-medium uppercase tracking-[0.16em] text-brand-forest shadow-lg transition hover:bg-amber-300 disabled:opacity-50"
                >
                  {isCreatingVip ? "Menyimpan..." : "Generate & Simpan VIP"}
                </button>
              </form>
            </div>

            {/* PANEL USER ROLE GENERATOR */}
            <div className="border border-brand-forest/10 bg-[#fbf9f4] p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-[18px] sm:text-[20px]">
                  Tambah User & Role
                </h2>
                <span className="bg-brand-forest/10 px-2 py-0.5 text-[10px] font-medium uppercase text-brand-forest">
                  Supabase Auth
                </span>
              </div>
              <p className="mt-1 text-[12px] opacity-70">
                Buat akun pengguna baru dan tentukan hak aksesnya (Admin / Staff).
              </p>

              {userRole !== "admin" ? (
                <div className="mt-4 border border-brand-forest/20 bg-brand-forest/5 p-3 text-[12px] text-brand-forest">
                  Hanya pengguna dengan role <strong>Admin</strong> yang dapat menambah user baru.
                </div>
              ) : (
                <form onSubmit={handleCreateUserWithRole} className="mt-4 space-y-3">
                  <div>
                    <label htmlFor="newUserEmail" className="block text-[10px] font-medium uppercase tracking-[0.16em] opacity-70">
                      EMAIL USER BARU
                    </label>
                    <input
                      id="newUserEmail"
                      type="email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="operator@aurora.com"
                      disabled={isCreatingUser}
                      className="mt-1 min-h-[42px] w-full border border-brand-forest/15 bg-white px-3 text-[13px] text-brand-forest outline-none focus:border-brand-gold disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label htmlFor="newUserPassword" className="block text-[10px] font-medium uppercase tracking-[0.16em] opacity-70">
                      PASSWORD (MIN. 6 KARAKTER)
                    </label>
                    <input
                      id="newUserPassword"
                      type="password"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={isCreatingUser}
                      className="mt-1 min-h-[42px] w-full border border-brand-forest/15 bg-white px-3 text-[13px] text-brand-forest outline-none focus:border-brand-gold disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label htmlFor="newUserRole" className="block text-[10px] font-medium uppercase tracking-[0.16em] opacity-70">
                      ROLE AKUN
                    </label>
                    <select
                      id="newUserRole"
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as "admin" | "staff")}
                      disabled={isCreatingUser}
                      className="mt-1 min-h-[42px] w-full border border-brand-forest/15 bg-white px-3 text-[13px] text-brand-forest outline-none focus:border-brand-gold disabled:opacity-50"
                    >
                      <option value="staff">Staff (Tidak Bisa Hapus Data)</option>
                      <option value="admin">Admin (Akses Penuh)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isCreatingUser}
                    className="min-h-[44px] w-full bg-brand-forest text-[11px] font-medium uppercase tracking-[0.16em] text-white transition hover:bg-black disabled:opacity-50"
                  >
                    {isCreatingUser ? "Mendaftarkan..." : "Buat User & Role"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* MODAL KONFIRMASI HAPUS UCAPAN */}
      {wishToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-[460px] bg-white p-6 text-brand-forest shadow-2xl sm:p-8">
            <h3 className="font-serif text-[24px]">
              Konfirmasi Hapus Ucapan
            </h3>
            
            <p className="mt-3 text-[14px] opacity-80">
              Apakah Anda yakin ingin menghapus ucapan dari{" "}
              <strong className="font-semibold underline">
                {wishToDelete.name}
              </strong>
              ?
            </p>

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setWishToDelete(null)}
                className="min-h-[42px] border border-gray-300 px-6 text-[12px] font-medium uppercase tracking-[0.14em] text-gray-600 transition hover:bg-gray-50"
              >
                BATAL
              </button>
              <button
                type="button"
                onClick={() => void handleConfirmDeleteWish()}
                className="min-h-[42px] bg-red-600 px-6 text-[12px] font-medium uppercase tracking-[0.14em] text-white transition hover:bg-red-700"
              >
                HAPUS DATA
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastStack toasts={toasts} />
    </div>
  );
}