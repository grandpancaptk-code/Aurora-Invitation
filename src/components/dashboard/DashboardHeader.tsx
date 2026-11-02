import { Link } from "@tanstack/react-router";
import type { AdminSession } from "@/types/invitation";

type Props = {
  session: AdminSession;
  onLogout: () => void;
};

export function DashboardHeader({ session, onLogout }: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-brand-gold/20 bg-brand-cream/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[56px] w-full max-w-[1280px] items-center justify-between gap-3 px-5 sm:h-[64px] sm:px-6 lg:h-[68px] lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-brand-gold font-serif text-[14px] text-brand-gold sm:h-9 sm:w-9">
            G
          </div>
          <div className="min-w-0 leading-[1.1]">
            <div className="truncate font-serif text-[10px] font-[600] tracking-[0.18em] sm:text-[11px]">
              GRAND PANCA RESIDENCE - DASHBOARD
            </div>
            <div className="truncate text-[9px] font-[300] tracking-[0.22em] opacity-70 sm:text-[10px]">
              AURORA • /dashboard
            </div>
          </div>
          <span className="ml-3 hidden border border-brand-gold/30 bg-brand-forest px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-brand-cream md:inline-flex">
            {session.role}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="mr-1 hidden min-w-0 text-right leading-[1.1] sm:block">
            <div className="max-w-[160px] truncate text-[11px] font-medium">{session.email}</div>
            <div className="text-[10px] opacity-60">
              Login {new Date(session.loginAt).toLocaleTimeString("id-ID")}
            </div>
          </div>
          <button
            onClick={onLogout}
            className="min-h-[40px] border border-brand-forest/15 px-3 py-2 text-[10px] uppercase tracking-[0.18em] transition hover:bg-brand-forest hover:text-brand-cream sm:px-4 sm:text-[11px]"
          >
            Logout
          </button>
          <Link
            to="/"
            className="hidden min-h-[40px] items-center bg-brand-gold px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-brand-forest transition hover:bg-brand-gold-bright sm:inline-flex"
          >
            Lihat Invitation
          </Link>
        </div>
      </div>
    </header>
  );
}
