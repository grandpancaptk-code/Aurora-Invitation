import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EnvelopeOpeningProps {
  onOpenComplete?: () => void;
  guestName?: string;
}

export const EnvelopeOpening: React.FC<EnvelopeOpeningProps> = ({
  onOpenComplete,
  guestName = "Tamu Undangan",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Cubic Bezier standar untuk pergerakan lipatan yang mulus
  const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);

    // 1. Jalankan callback untuk menampilkan konten utama website
    setTimeout(() => {
      if (onOpenComplete) onOpenComplete();
    }, 1000);

    // 2. Beri jeda tuntas agar animasi exit selesai
    setTimeout(() => {
      setIsDone(true);
    }, 1500);
  };

  if (isDone) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{
          opacity: 0,
          scale: 1.03,
          filter: "blur(6px)",
          transition: { duration: 0.5, ease: "easeOut" },
        }}
        /* OVERLAY GELAP UNTUK LATAR BELAKANG */
        className="fixed inset-0 z-50 w-screen h-screen overflow-hidden select-none pointer-events-auto flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 sm:p-6 lg:p-8"
      >
        {/* WRAPPER AMPLOP */}
        <motion.div
          animate={{
            borderColor: isOpen ? "rgba(197, 160, 89, 0)" : "rgba(197, 160, 89, 0.3)",
            boxShadow: isOpen
              ? "0 0px 0px rgba(0,0,0,0)"
              : "0 20px 50px rgba(0,0,0,0.85)",
          }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          exit={{
            opacity: 0,
            y: -10,
            transition: { duration: 0.4, ease: "easeIn" },
          }}
          className="relative w-full max-w-[340px] sm:max-w-md md:max-w-3xl aspect-[3/4] md:aspect-[4/3] rounded-2xl md:rounded-3xl border border-[#c5a059]/30 overflow-hidden [perspective:1400px]"
        >
          <div className="relative w-full h-full [transform-style:preserve-3d]">
            
            {/* LIPATAN 1: Bawah (Bottom Flap) */}
            <motion.div
              initial={{ rotateX: 0 }}
              animate={{ rotateX: isOpen ? -180 : 0 }}
              transition={{ duration: 1.1, delay: isOpen ? 0.08 : 0, ease: smoothEase }}
              style={{ originY: "100%" }}
              className="absolute inset-x-0 bottom-0 h-1/2 z-20 [transform-style:preserve-3d] filter drop-shadow-[0_-6px_16px_rgba(0,0,0,0.6)]"
            >
              <div
                className="w-full h-full bg-[#0d3b2e] bg-cover bg-center [clip-path:polygon(0%_100%,_100%_100%,_50%_0%)]"
                style={{ backgroundImage: `url('/images/Emerald-Envelope-LQ.jpg')` }}
              >
                <div className="w-full h-full bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              </div>
            </motion.div>

            {/* LIPATAN 4: Atas (Top Flap) */}
            <motion.div
              initial={{ rotateX: 0 }}
              animate={{ rotateX: isOpen ? 180 : 0 }}
              transition={{ duration: 1.1, delay: 0, ease: smoothEase }}
              style={{ originY: "0%" }}
              className="absolute inset-x-0 top-0 h-1/2 z-30 [transform-style:preserve-3d] filter drop-shadow-[0_10px_22px_rgba(0,0,0,0.7)]"
            >
              <div
                className="w-full h-full bg-[#0d3b2e] bg-cover bg-center [clip-path:polygon(0%_0%,_100%_0%,_50%_100%)]"
                style={{ backgroundImage: `url('/images/Emerald-Envelope-LQ.jpg')` }}
              >
                <div className="w-full h-full bg-gradient-to-b from-white/10 via-transparent to-black/40" />
              </div>
            </motion.div>

            {/* LIPATAN 2: Kiri (Left Flap) */}
            <motion.div
              initial={{ rotateY: 0 }}
              animate={{ rotateY: isOpen ? -180 : 0 }}
              transition={{ duration: 1.1, delay: isOpen ? 0.04 : 0, ease: smoothEase }}
              style={{ originX: "0%" }}
              className="absolute inset-y-0 left-0 w-1/2 z-20 [transform-style:preserve-3d] filter drop-shadow-[6px_0_16px_rgba(0,0,0,0.5)]"
            >
              <div
                className="w-full h-full bg-[#0d3b2e] bg-cover bg-center [clip-path:polygon(0%_0%,_100%_50%,_0%_100%)]"
                style={{ backgroundImage: `url('/images/Emerald-Envelope-LQ.jpg')` }}
              >
                <div className="w-full h-full bg-gradient-to-r from-black/40 via-black/10 to-black/30" />
              </div>
            </motion.div>

            {/* LIPATAN 3: Kanan (Right Flap) */}
            <motion.div
              initial={{ rotateY: 0 }}
              animate={{ rotateY: isOpen ? 180 : 0 }}
              transition={{ duration: 1.1, delay: isOpen ? 0.04 : 0, ease: smoothEase }}
              style={{ originX: "100%" }}
              className="absolute inset-y-0 right-0 w-1/2 z-20 [transform-style:preserve-3d] filter drop-shadow-[-6px_0_16px_rgba(0,0,0,0.5)]"
            >
              <div
                className="w-full h-full bg-[#0d3b2e] bg-cover bg-center [clip-path:polygon(100%_0%,_0%_50%,_100%_100%)]"
                style={{ backgroundImage: `url('/images/Emerald-Envelope-LQ.jpg')` }}
              >
                <div className="w-full h-full bg-gradient-to-l from-black/40 via-black/10 to-black/30" />
              </div>
            </motion.div>

            {/* SEAL EMAS */}
            <motion.div
              initial={{ scale: 1, opacity: 1 }}
              animate={
                isOpen
                  ? { scale: 0, opacity: 0, transition: { duration: 0.35, ease: "easeIn" } }
                  : { scale: [1, 1.05, 1] }
              }
              {...(!isOpen && {
                transition: {
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                whileTap: {
                  scale: [0.82, 1.15, 1],
                  transition: {
                    duration: 0.4,
                    times: [0, 0.6, 1],
                    ease: "easeOut",
                  },
                },
              })}
              onClick={handleOpen}
              className="absolute inset-0 m-auto z-40 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 cursor-pointer flex items-center justify-center filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.75)] select-none"
            >
              <img
                src="/images/Seal-Grand-Panca-300.png"
                alt="Grand Panca Wax Seal"
                className="w-full h-full object-contain pointer-events-none"
              />
            </motion.div>

            {/* TEKS PETUNJUK */}
            {!isOpen && (
              <p className="absolute bottom-8 md:bottom-10 left-0 right-0 text-center z-40 text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#c5a059] font-medium drop-shadow-md pointer-events-none">
                Ketuk Seal Emas Untuk Membuka
              </p>
            )}

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};