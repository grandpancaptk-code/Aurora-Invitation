import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { ToastStack } from "@/components/common/ToastStack";
import { EnvelopeOpening } from "@/components/invitation/EnvelopeOpening";
import { HeroSection } from "@/components/invitation/HeroSection";
import { RsvpSection } from "@/components/invitation/RsvpSection";
import { SiteFooter } from "@/components/invitation/SiteFooter";
import { ThankYouModal } from "@/components/invitation/ThankYouModal";
import { WishesSection } from "@/components/invitation/WishesSection";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { useToasts } from "@/hooks/useToasts";
import { supabase } from "@/lib/supabase";
import type { Guest, RsvpStatus, Wish } from "@/types/invitation";

const TITLE = "AURORA — Undangan Private Launching Grand Panca Residence";
const DESCRIPTION =
  "Undangan private launching cluster AURORA di Grand Panca Residence. Konfirmasi kehadiran dan kirim ucapan Anda.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InvitationPage,
});

function InvitationPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);

  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [wishName, setWishName] = useState("");
  const [wishMessage, setWishMessage] = useState("");

  // State melacak keterbukaan amplop dan hero
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);
  const [heroOpened, setHeroOpened] = useState(false);
  const [thankYou, setThankYou] = useState<RsvpStatus | null>(null);

  const rsvpRef = useRef<HTMLElement>(null);
  const { toasts, showToast } = useToasts();

  useRevealOnScroll();

  // 1. Ambil data Guest & Wishes dari Supabase
  const fetchGuests = async () => {
    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      const formattedGuests: Guest[] = data.map((item) => ({
        id: item.id,
        name: item.name,
        phone: item.phone || "-",
        status: item.status as RsvpStatus,
        date: item.date || new Date(item.created_at).toLocaleDateString("id-ID"),
        timeDetail:
          item.time_detail ||
          new Date(item.created_at).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        fullDate: item.full_date || new Date(item.created_at).toLocaleString("id-ID"),
        source: item.source || "Public",
      }));
      setGuests(formattedGuests);
    }
  };

  const fetchWishes = async () => {
    const { data, error } = await supabase
      .from("wishes")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      const formattedWishes: Wish[] = data.map((item) => ({
        id: item.id,
        name: item.name,
        message: item.message,
        time:
          item.time ||
          new Date(item.created_at).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        date: item.date || "Baru saja",
      }));
      setWishes(formattedWishes);
    }
  };

  useEffect(() => {
    fetchGuests();
    fetchWishes();

    const to = new URLSearchParams(window.location.search).get("to");
    if (to) {
      setGuestName(to);
      setWishName(to);
    }

    const channel = supabase
      .channel("public-landing-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "guests" },
        () => void fetchGuests()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wishes" },
        () => void fetchWishes()
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  // Lock scroll layar selama amplop belum ditutup/di-dismiss
  useEffect(() => {
    if (!isEnvelopeOpened) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isEnvelopeOpened]);

  // Handler saat tombol 'Buka Undangan' di HeroSection diklik
  const handleOpenInvitation = () => {
    setHeroOpened(true);
    rsvpRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // 2. Handler submit RSVP ke Supabase
  const handleRsvp = async (status: RsvpStatus): Promise<boolean> => {
    if (!guestName.trim()) {
      showToast("Mohon masukkan nama Anda", "error");
      return false;
    }

    const now = new Date();
    const isVip = new URLSearchParams(window.location.search).has("to");

    const newGuestData = {
      name: guestName.trim(),
      phone: guestPhone.trim() || "-",
      status: status,
      date: now.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time_detail: now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      full_date: now.toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      source: isVip ? "VIP" : "Public",
    };

    const { error } = await supabase.from("guests").insert([newGuestData]);

    if (error) {
      console.error("Gagal simpan RSVP ke Supabase:", error);
      showToast("Gagal menyimpan konfirmasi. Silakan coba lagi.", "error");
      return false;
    }

    await fetchGuests();

    setThankYou(status);
    setGuestName("");
    setGuestPhone("");
    window.setTimeout(() => setThankYou(null), 4200);
    return true;
  };

  // 3. Handler submit Ucapan (Wish) ke Supabase
  const handleWish = async () => {
    if (!wishMessage.trim() || !wishName.trim()) {
      showToast("Nama dan ucapan wajib diisi.", "error");
      return;
    }

    const now = new Date();
    const newWishData = {
      name: wishName.trim(),
      message: wishMessage.trim(),
      time: now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      date: now.toLocaleDateString("id-ID", { day: "2-digit", month: "short" }),
    };

    const { error } = await supabase.from("wishes").insert([newWishData]);

    if (error) {
      console.error("Gagal mengirim ucapan:", error);
      showToast("Gagal mengirim ucapan.", "error");
      return;
    }

    await fetchWishes();

    setWishMessage("");
    showToast("Ucapan berhasil dikirim", "success");
  };

  return (
    <div className="relative min-h-screen overflow-x-clip bg-brand-forest text-brand-cream selection:bg-brand-gold/30">
      
      {/* 1. OVERLAY ANIMASI AMPLOP (Melayang di Atas Hero) */}
      {!isEnvelopeOpened && (
        <EnvelopeOpening
          guestName={guestName || "Tamu Undangan"}
          onOpenComplete={() => setIsEnvelopeOpened(true)}
        />
      )}

      {/* 2. KONTEN HALAMAN UTAMA (HeroSection langsung tampil di balik amplop) */}
      <div>
        {/* HERO SECTION DIRENDER LANGSUNG TANPA OPACITY-0 */}
        <HeroSection opened={heroOpened} onOpen={handleOpenInvitation} />

        <div className="relative z-20 flex justify-center bg-brand-cream">
          <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-6 lg:px-8">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
          </div>
        </div>

        {/* RSVP & WISHES SECTION */}
        <RsvpSection
          sectionRef={rsvpRef}
          guestName={guestName}
          onGuestNameChange={setGuestName}
          guestPhone={guestPhone}
          onGuestPhoneChange={setGuestPhone}
          guests={guests}
          onSubmit={async (status) => await handleRsvp(status)}
          onClearGuests={() => {}}
        />

        <WishesSection
          wishes={wishes}
          guestCount={guests.length}
          wishName={wishName}
          onWishNameChange={setWishName}
          wishMessage={wishMessage}
          onWishMessageChange={setWishMessage}
          onSubmit={handleWish}
        />

        <SiteFooter />
      </div>

      {thankYou && (
        <ThankYouModal
          status={thankYou}
          guestName={guestName}
          onClose={() => setThankYou(null)}
        />
      )}
      <ToastStack toasts={toasts} />
    </div>
  );
}