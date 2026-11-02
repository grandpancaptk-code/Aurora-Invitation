import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { BrandMark } from "@/components/common/BrandMark";

type Props = {
  onLogin: (identifier: string, password: string) => string | null;
};

/** Credential screen shown when no dashboard session exists. */
export function LoginScreen({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = () => {
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Email/Username dan password wajib diisi");
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      const message = onLogin(email, password);
      if (message) setError(message);
      else {
        setEmail("");
        setPassword("");
      }
      setLoading(false);
    }, 300);
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-brand-forest text-brand-cream selection:bg-brand-gold/30">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#12372A] via-brand-forest to-[#081E17]" />
        <div className="login-glow absolute inset-0 opacity-[0.16]" />
      </div>

      <header className="relative z-10 mx-auto flex h-[56px] w-full max-w-[1280px] items-center justify-between px-5 sm:px-6 lg:px-8">
        <BrandMark subtitle="AURORA • DASHBOARD" />
        <Link
          to="/"
          className="min-h-[36px] border border-white/15 px-4 py-2 text-[10px] uppercase tracking-[0.18em] transition hover:bg-white hover:text-brand-forest"
        >
          Lihat Invitation
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-5 py-8 sm:px-6 sm:py-12">
        <div className="w-full max-w-[420px]">
          <div className="animate-modalIn relative overflow-hidden border border-brand-gold/30 bg-brand-cream p-6 text-brand-forest shadow-[0_32px_80px_rgba(0,0,0,0.28)] sm:p-8">
            <div className="absolute left-0 top-0 h-[3px] w-full bg-gradient-to-r from-brand-gold to-brand-gold-bright" />
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-brand-forest text-[18px] text-brand-gold">
                ◍
              </div>
              <div className="text-[10px] font-medium uppercase tracking-[0.32em] text-brand-gold">
                Secure Access • /dashboard
              </div>
              <h1 className="mt-2 font-serif text-[26px] leading-[1.05] sm:text-[28px]">Dashboard Login</h1>
              <p className="mt-2 text-[12.5px] font-light leading-[1.6] opacity-60">
                Akses terpisah dari halaman undangan. Login untuk mengelola tamu &amp; ucapan.
              </p>
            </div>

            <div className="mb-6 border border-brand-gold/20 bg-brand-forest p-3.5 text-brand-cream">
              <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-brand-gold">
                <span className="grid h-4 w-4 place-items-center rounded-full border border-brand-gold/40 text-[9px]">
                  i
                </span>{" "}
                Kredensial Awal
              </div>
              <div className="space-y-1 font-mono text-[11px] leading-[1.6]">
                <div>
                  Email: <span className="text-brand-gold">admin@grandpanca.id</span>
                </div>
                <div>
                  Username alias: <span className="text-brand-gold">grandpanca</span>
                </div>
                <div>
                  Password: <span className="text-brand-gold">GrandPanca2026!</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[11px] uppercase tracking-[0.18em] opacity-70">
                  Email / Username
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@grandpanca.id atau grandpanca"
                  className="min-h-[48px] w-full border border-brand-gold/30 bg-white px-3.5 text-[14px] outline-none placeholder:opacity-40 focus:border-brand-gold"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] uppercase tracking-[0.18em] opacity-70">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") submit();
                    }}
                    placeholder="••••••••"
                    className="min-h-[48px] w-full border border-brand-gold/30 bg-white px-3.5 pr-11 text-[14px] outline-none focus:border-brand-gold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-0 top-0 grid h-[48px] w-11 place-items-center text-[14px] opacity-60 hover:opacity-100"
                  >
                    {showPass ? "🙈" : "👁"}
                  </button>
                </div>
              </div>
              {error && (
                <div className="border border-red-200 bg-red-50 px-3 py-2.5 text-[12px] text-red-600">{error}</div>
              )}
              <button
                onClick={submit}
                disabled={loading}
                className="flex min-h-[50px] w-full items-center justify-center gap-2 bg-brand-forest text-[11px] font-medium uppercase tracking-[0.22em] text-brand-cream transition hover:bg-black disabled:opacity-60"
              >
                {loading ? "Memproses..." : "Login ke Dashboard"} <span>→</span>
              </button>
            </div>
          </div>
          <div className="mt-5 text-center text-[11px] uppercase tracking-[0.16em] opacity-60">
            Grand Panca Residence • Aurora • Private Dashboard
          </div>
        </div>
      </main>
    </div>
  );
}
