import { useEffect, useState } from "react";

type FairyDot = {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
};

/** Decorative foliage + sparkles framing the hero section. */
export function HeroOrnaments() {
  const [leftDots, setLeftDots] = useState<FairyDot[]>([]);
  const [rightDots, setRightDots] = useState<FairyDot[]>([]);

  useEffect(() => {
    // Generate titik acak untuk ornamen sebelah kiri
    const generatedLeftDots: FairyDot[] = Array.from({ length: 9 }).map((_, i) => ({
      id: i,
      left: Math.random() * 80 + 10, // 10% - 90%
      top: Math.random() * 80 + 10,  // 10% - 90%
      size: Math.random() * 4 + 2,   // 2px - 6px
      delay: Math.random() * 3,      // 0s - 3s
      duration: Math.random() * 4 + 4, // 4s - 8s
    }));

    // Generate titik acak untuk ornamen sebelah kanan
    const generatedRightDots: FairyDot[] = Array.from({ length: 9 }).map((_, i) => ({
      id: i,
      left: Math.random() * 80 + 10,
      top: Math.random() * 80 + 10,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 3 + 0.5,
      duration: Math.random() * 4 + 4,
    }));

    setLeftDots(generatedLeftDots);
    setRightDots(generatedRightDots);
  }, []);

  return (
    <>
      {/* Ornamen Kiri */}
      <div className="pointer-events-none absolute bottom-0 left-0 z-10 aspect-[3/4] w-[42vw] max-w-[180px] -translate-x-[8%] translate-y-[6%] select-none opacity-[0.55] sm:w-[38%] sm:max-w-[300px] sm:-translate-x-[6%] sm:translate-y-[8%] sm:opacity-80 md:w-[30%] md:opacity-[0.92] lg:w-[28%] lg:opacity-[0.96] xl:w-[26%] 2xl:w-[24%]">
        <div className="plant-grow-left absolute inset-0">
          <svg
            viewBox="0 0 380 520"
            className="absolute inset-0 h-full w-full"
            fill="none"
            preserveAspectRatio="xMidYMax meet"
          >
            <defs>
              <linearGradient id="leafGradM" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1e4d3a" />
                <stop offset="100%" stopColor="#0e2f22" />
              </linearGradient>
              <linearGradient id="goldLeafM" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#C5A880" />
              </linearGradient>
            </defs>
            <g className="float-slow" opacity="0.96">
              <path
                d="M60 420 C 20 300, 10 180, 80 90 C 110 60, 140 50, 170 80 C 200 110, 210 160, 180 200 C 260 180, 300 120, 310 70 C 320 40, 300 20, 270 20 C 240 20, 200 50, 190 90 C 150 30, 90 10, 50 40 C 10 70, 0 150, 60 420 Z"
                fill="url(#leafGradM)"
                stroke="#C5A880"
                strokeOpacity="0.18"
                strokeWidth="1"
              />
            </g>
          </svg>
        </div>

        {/* Fairy Dots Acak Kiri */}
        <div className="absolute inset-0">
          {leftDots.map((dot) => (
            <span
              key={dot.id}
              className="fairy-dot absolute rounded-full bg-brand-gold/80 blur-[0.5px]"
              style={{
                left: `${dot.left}%`,
                top: `${dot.top}%`,
                width: `${dot.size}px`,
                height: `${dot.size}px`,
                animationDelay: `${dot.delay}s`,
                animationDuration: `${dot.duration}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Ornamen Kanan */}
      <div className="pointer-events-none absolute bottom-0 right-0 z-10 aspect-[3/4] w-[44vw] max-w-[190px] translate-x-[8%] translate-y-[8%] select-none opacity-[0.55] sm:w-[40%] sm:max-w-[320px] sm:translate-y-[10%] sm:opacity-80 md:w-[32%] md:opacity-[0.92] lg:w-[30%] lg:opacity-[0.96] xl:w-[28%] 2xl:w-[26%]">
        <div className="plant-grow-right absolute inset-0">
          <svg
            viewBox="0 0 400 540"
            className="absolute inset-0 h-full w-full"
            fill="none"
            preserveAspectRatio="xMidYMax meet"
          >
            <g className="float-slow" opacity="0.96">
              <path
                d="M320 440 C 360 320, 370 200, 300 110 C 270 80, 240 70, 210 100 C 180 130, 170 180, 200 220 C 120 200, 80 140, 70 90 C 60 60, 80 40, 110 40 C 140 40, 180 70, 190 110 C 230 50, 290 30, 330 60 C 370 90, 380 170, 320 440 Z"
                fill="#12372A"
                stroke="#C5A880"
                strokeOpacity="0.18"
                strokeWidth="1"
              />
            </g>
          </svg>
        </div>

        {/* Fairy Dots Acak Kanan */}
        <div className="absolute inset-0">
          {rightDots.map((dot) => (
            <span
              key={dot.id}
              className="fairy-dot absolute rounded-full bg-brand-gold/80 blur-[0.5px]"
              style={{
                left: `${dot.left}%`,
                top: `${dot.top}%`,
                width: `${dot.size}px`,
                height: `${dot.size}px`,
                animationDelay: `${dot.delay}s`,
                animationDuration: `${dot.duration}s`,
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}