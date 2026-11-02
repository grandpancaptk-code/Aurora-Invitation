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

export interface EventData {
  id?: string | number;
  title?: string;
  event_title?: string;
  event_date?: string;
  event_time?: string;
  location?: string;
  address?: string;
  brand_name?: string;
  description?: string;
}

function formatSlugToName(slug: string): string {
  if (!slug) return "Tamu Undangan";
  try {
    const decoded = decodeURIComponent(slug);
    return decoded
      .replace(/[-_]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  } catch {
    return slug;
  }
}

export const Route = createFileRoute("/$invitationSlug")({
  head: ({ params }) => {
    const rawName = params.invitationSlug || "";
    const formattedName = formatSlugToName(rawName);
    const title = `Undangan Spesial untuk ${formattedName} — AURORA Grand Panca Residence`;
    const description = `Kepada Yth. ${formattedName}, Anda diundang secara khusus dalam Private Launching cluster AURORA Grand Panca Residence.`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: InvitationSlugPage,
});

function InvitationSlugPage() {
  const { invitationSlug: slug } = Route.useParams();
  const formattedGuestName = formatSlugToName(slug || "");

  const [eventData, setEventData] = useState<EventData | null>(null);
  const [eventLoading, setEventLoading] = useState(true);

  const [guests, setGuests] = useState<Guest[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);

  const [guestName, setGuestName] = useState(formattedGuestName);
  const [guestPhone, setGuestPhone] = useState("");
  const [wishName, setWishName] = useState(formattedGuestName);
  const [wishMessage, setWishMessage] = useState("");

  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);
  const [heroOpened, setHeroOpened] = useState(false);
  const [thankYou, setThankYou] = useState<RsvpStatus | null>(null);

  const rsvpRef = useRef<HTMLElement>(null);
  const { toasts, showToast } = useToasts();

  useRevealOnScroll();

  // 1. Fetch Event
  const fetchEvent = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        setEventData(data as EventData);
      }
    } catch (err) {
      console.error("Gagal mengambil data event:", err);
    } finally {
      setEventLoading(false);
    }
  };

  // 2. Fetch Guests (Tanpa sortir kaku agar tidak error jika kolom created_at tidak ada)
  const fetchGuests = async () => {
    try {
      const { data, error } = await supabase.from("guests").select("*");

      if (error) {
        console.error("Gagal fetch guests:", error);
        return;
      }

      console.log("=== DEBUG GUESTS FROM SUPABASE ===", data);

      if (data && Array.isArray(data)) {
        const formattedGuests: Guest[] = data.map((item, index) => {
          const rawDate = item.created_at || item.createdat || item.date;
          const createdAtDate = rawDate ? new Date(rawDate) : new Date();

          return {
            id: item.id ? String(item.id) : `guest-${index}`,
            name: item.name || item.guest_name || item.nama || "Tamu Undangan",
            phone: item.phone || item.phone_number || item.telepon || "-",
            status: (item.status as RsvpStatus) || "hadir",
            date:
              item.date ||
              createdAtDate.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }),
            timeDetail:
              item.time_detail ||
              item.timeDetail ||
              createdAtDate.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            fullDate:
              item.full_date ||
              item.fullDate ||
              createdAtDate.toLocaleString("id-ID"),
            source: item.source || "VIP",
          };
        });
        setGuests(formattedGuests);
      }
    } catch (err) {
      console.error("Error pada fetchGuests:", err);
    }
  };

  // 3. Fetch Wishes
  const fetchWishes = async () => {
    try {
      const { data, error } = await supabase.from("wishes").select("*");

      if (error) {
        console.error("Gagal fetch wishes:", error);
        return;
      }

      console.log("=== DEBUG WISHES FROM SUPABASE ===", data);

      if (data && Array.isArray(data)) {
        const formattedWishes: Wish[] = data.map((item, index) => {
          const rawDate = item.created_at || item.createdat || item.date;
          const createdAtDate = rawDate ? new Date(rawDate) : new Date();

          return {
            id: item.id ? String(item.id) : `wish-${index}`,
            name: item.name || item.wish_name || item.nama || "Anonim",
            message: item.message || item.wish_message || item.ucapan || item.pesan || "",
            time:
              item.time ||
              createdAtDate.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            date:
              item.date ||
              createdAtDate.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
              }),
          };
        });
        setWishes(formattedWishes);
      }
    } catch (err) {
      console.error("Error pada fetchWishes:", err);
    }
  };

  useEffect(() => {
    void fetchEvent();
    void fetchGuests();
    void fetchWishes();

    if (formattedGuestName) {
      setGuestName(formattedGuestName);
      setWishName(formattedGuestName);
    }

    const channel = supabase
      .channel(`vip-landing-realtime-${slug}`)
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
  }, [slug, formattedGuestName]);

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

  const handleOpenInvitation = () => {
    setHeroOpened(true);
    rsvpRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleRsvp = async (status: RsvpStatus): Promise<boolean> => {
    if (!guestName.trim()) {
      showToast("Mohon masukkan nama Anda", "error");
      return false;
    }

    const now = new Date();

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
      source: "VIP",
    };

    const { error } = await supabase.from("guests").insert([newGuestData]);

    if (error) {
      console.error("Gagal simpan RSVP ke Supabase:", error);
      showToast("Gagal menyimpan konfirmasi. Silakan coba lagi.", "error");
      return false;
    }

    await fetchGuests();

    setThankYou(status);
    window.setTimeout(() => setThankYou(null), 4200);
    return true;
  };

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

  if (eventLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-forest text-brand-gold">
        <div className="animate-pulse text-xs uppercase tracking-[0.2em]">
          Memuat Informasi Undangan...
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-clip bg-brand-forest text-brand-cream selection:bg-brand-gold/30">
      {!isEnvelopeOpened && (
        <EnvelopeOpening
          guestName={formattedGuestName}
          onOpenComplete={() => setIsEnvelopeOpened(true)}
        />
      )}

      <div>
        <HeroSection
          opened={heroOpened}
          onOpen={handleOpenInvitation}
          eventDate={eventData?.event_date ?? ""}
        />

        <div className="relative z-20 flex justify-center bg-brand-cream">
          <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-6 lg:px-8">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
          </div>
        </div>

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