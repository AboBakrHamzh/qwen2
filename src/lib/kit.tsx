import React, {
  createContext, useCallback, useContext, useEffect, useId, useRef, useState,
} from "react";
import type { PaletteName, PlateVariant } from "./data";

/* ============================================================
   أدوات الحركة والتفاعل
============================================================ */

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return reduced;
}

export function useFinePointer(): boolean {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setFine(mq.matches);
  }, []);
  return fine;
}

/* الظهور عند التمرير */
export function Reveal({
  children, className = "", delay = 0, y = 26,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("rv-in");
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`rv ${className}`}
      style={{ "--rv-y": `${y}px`, "--rv-d": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

/* عدّاد رقمي */
export function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || started.current) return;
        started.current = true;
        const t0 = performance.now();
        const dur = 1400;
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(to * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return (
    <span ref={ref}>
      {val.toLocaleString("ar-EG")}
      {suffix}
    </span>
  );
}

/* ميلان البطاقة مع الماوس */
export function Tilt({
  children, className = "", max = 6,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const onMove = (e: React.PointerEvent) => {
    if (!fine || reduced) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg) translateY(-4px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return (
    <div ref={ref} className={`tilt-wrap ${className}`} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </div>
  );
}

/* وميض الهدف عند القفز إليه */
export function flashEl(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.remove("flash-ring");
  requestAnimationFrame(() => el.classList.add("flash-ring"));
  window.setTimeout(() => el.classList.remove("flash-ring"), 1800);
}

/* ============================================================
   التنبيهات (توست)
============================================================ */
interface ToastItem { id: number; msg: string }
const ToastCtx = createContext<{ push: (msg: string) => void }>({ push: () => {} });
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const push = useCallback((msg: string) => {
    const id = Date.now() + Math.random();
    setItems((p) => [...p.slice(-2), { id, msg }]);
    window.setTimeout(() => setItems((p) => p.filter((t) => t.id !== id)), 2800);
  }, []);
  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-24 md:bottom-28 left-1/2 -translate-x-1/2 z-[80] flex flex-col items-center gap-2 pointer-events-none px-4">
        {items.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto bg-ink-800/95 border border-gold-500/30 text-ivory-100 text-sm font-naskh px-4 py-2.5 rounded-md shadow-[0_12px_40px_-10px_rgba(0,0,0,.6)]"
            style={{ animation: "toastIn .35s cubic-bezier(.34,1.4,.44,1) both" }}
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold-400 ml-2 align-middle" />
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

/* ============================================================
   أيقونات SVG مضمّنة
============================================================ */
type IconProps = { className?: string };
const S = (p: IconProps & { children: React.ReactNode; vb?: string; fill?: boolean }) => (
  <svg
    viewBox={p.vb ?? "0 0 24 24"}
    className={p.className ?? "w-5 h-5"}
    fill={p.fill ? "currentColor" : "none"}
    stroke={p.fill ? "none" : "currentColor"}
    strokeWidth={p.fill ? 0 : 1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {p.children}
  </svg>
);

export const IcPlay = (p: IconProps) => (
  <S {...p} fill><path d="M8 5.5v13a1 1 0 0 0 1.5.87l10.2-6.5a1 1 0 0 0 0-1.7L9.5 4.63A1 1 0 0 0 8 5.5Z" transform="scale(-1,1) translate(-24,0)" /></S>
);
export const IcPause = (p: IconProps) => (
  <S {...p} fill><rect x="6" y="5" width="4" height="14" rx="1.2" /><rect x="14" y="5" width="4" height="14" rx="1.2" /></S>
);
export const IcDownload = (p: IconProps) => (
  <S {...p}><path d="M12 4v10" /><path d="m8 10 4 4 4-4" /><path d="M5 19h14" /></S>
);
export const IcSearch = (p: IconProps) => (
  <S {...p}><circle cx="11" cy="11" r="6.5" /><path d="m20 20-3.4-3.4" /></S>
);
export const IcClose = (p: IconProps) => <S {...p}><path d="m6 6 12 12M18 6 6 18" /></S>;
export const IcCheck = (p: IconProps) => <S {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></S>;
export const IcClock = (p: IconProps) => <S {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></S>;
export const IcChevD = (p: IconProps) => <S {...p}><path d="m6 9.5 6 6 6-6" /></S>;
export const IcArrow = (p: IconProps) => <S {...p}><path d="M19 12H5" /><path d="m11 6-6 6 6 6" /></S>;
export const IcHome = (p: IconProps) => (
  <S {...p}><path d="M4 11 12 4l8 7" /><path d="M6 10v9h12v-9" /><path d="M10 19v-5h4v5" /></S>
);
export const IcStack = (p: IconProps) => (
  <S {...p}><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m4.5 12.8 7.5 4.2 7.5-4.2" /><path d="m4.5 16.8 7.5 4.2 7.5-4.2" /></S>
);
export const IcBook = (p: IconProps) => (
  <S {...p}><path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H19v17.5H7.5A2.5 2.5 0 0 0 5 22V4.5Z" /><path d="M5 19.5A2.5 2.5 0 0 1 7.5 17H19" /></S>
);
export const IcMic = (p: IconProps) => (
  <S {...p}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0" /><path d="M12 17.5V21" /></S>
);
export const IcUser = (p: IconProps) => (
  <S {...p}><circle cx="12" cy="8" r="4" /><path d="M4.5 20.5c1.5-3.6 4.2-5 7.5-5s6 1.4 7.5 5" /></S>
);
export const IcStar8 = (p: IconProps) => (
  <S {...p}><path d="M12 2.5l1.9 5 5-1.9-1.9 5 5 1.9-5 1.9 1.9 5-5-1.9-1.9 5-1.9-5-5 1.9 1.9-5-5-1.9 5-1.9-1.9-5 5 1.9z" /></S>
);
export const IcScroll = (p: IconProps) => (
  <S {...p}><path d="M7 4h11a2 2 0 0 1 2 2v1H9" /><path d="M7 4a2 2 0 0 0-2 2v12a2 2 0 0 1-2 2h13a2 2 0 0 0 2-2V6" /><path d="M9 11h7M9 15h5" /></S>
);
export const IcShield = (p: IconProps) => (
  <S {...p}><path d="M12 3 5 5.8v5.4c0 4.4 3 7.7 7 9.8 4-2.1 7-5.4 7-9.8V5.8L12 3Z" /><path d="m9 11.5 2.2 2.2L15.5 9" /></S>
);
export const IcNext = (p: IconProps) => (
  <S {...p}><path d="M17 6v12" /><path d="M15 12 7 6.5v11L15 12Z" transform="scale(-1,1) translate(-24,0)" fill="currentColor" stroke="none" /></S>
);
export const IcPrev = (p: IconProps) => (
  <S {...p}><path d="M7 6v12" /><path d="M9 12l8-5.5v11L9 12Z" fill="currentColor" stroke="none" /></S>
);
export const IcQuill = (p: IconProps) => (
  <S {...p}><path d="M19 4c-6 0-11 4-12.5 10.5L5 20l5.5-1.5C17 17 20 11 20 5c0-.4 0-.7-.1-1h-.9Z" /><path d="M5 20 15 9" /></S>
);

/* زخرفة فاصلة تُرسم عند الظهور */
export function Ornament({ className = "w-56" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 24" className={className} fill="none" aria-hidden="true">
      <g className="draw" stroke="currentColor" strokeWidth="1.1">
        <path d="M6 12h82" pathLength={1} />
        <path d="M152 12h82" pathLength={1} />
        <path d="M120 2.5 126.5 9 133 12l-6.5 3-6.5 6.5L113.5 15l-6.5-3 6.5-3 6.5-6.5Z" pathLength={1} transform="translate(0,-3)" />
        <circle cx="120" cy="12" r="1.8" pathLength={1} />
        <circle cx="94" cy="12" r="1.6" pathLength={1} />
        <circle cx="146" cy="12" r="1.6" pathLength={1} />
      </g>
    </svg>
  );
}

/* ترويسة قسم موحّدة */
export function SectionHeader({
  eyebrow, title, sub, light = false,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  light?: boolean;
}) {
  return (
    <Reveal className="mb-8 md:mb-10">
      <div className="flex items-center gap-3 mb-2">
        <svg viewBox="0 0 12 12" className={`w-2.5 h-2.5 ${light ? "text-madder-500" : "text-gold-500"}`} fill="currentColor" aria-hidden="true">
          <path d="M6 0l1.4 4.6L12 6l-4.6 1.4L6 12 4.6 7.4 0 6l4.6-1.4z" />
        </svg>
        <span className={`font-kufi text-sm font-semibold ${light ? "text-madder-700" : "text-gold-400"}`}>{eyebrow}</span>
        <div className={`h-px flex-1 max-w-24 ${light ? "bg-madder-500/30" : "bg-gold-500/25"}`} />
      </div>
      <h2 className={`font-kufi font-bold text-3xl md:text-[2.6rem] leading-[1.25] ${light ? "text-ink-800" : "text-ivory-100"}`}>
        {title}
      </h2>
      {sub && (
        <p className={`mt-2 max-w-2xl text-base md:text-lg leading-relaxed ${light ? "text-olive-700" : "text-ivory-600"}`}>{sub}</p>
      )}
      <div className={`mt-4 ${light ? "text-madder-700" : "text-gold-500/80"}`}>
        <Ornament />
      </div>
    </Reveal>
  );
}

/* نجم التقدم — العنصر المميّز: يكتمل ضلعًا فضلع */
const STAR_PTS: Array<[number, number]> = (() => {
  const cx = 50, cy = 50, R = 46, r = 24;
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < 16; i++) {
    const rad = ((i * 22.5 - 90) * Math.PI) / 180;
    const rr = i % 2 === 0 ? R : r;
    pts.push([+(cx + rr * Math.cos(rad)).toFixed(1), +(cy + rr * Math.sin(rad)).toFixed(1)]);
  }
  return pts;
})();

export function StarProgress({
  progress, size = 64, className = "",
}: {
  progress: number; /* 0..1 */
  size?: number;
  className?: string;
}) {
  const lit = Math.round(progress * 16);
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-label={`الإنجاز ${Math.round(progress * 100)}٪`}>
      {STAR_PTS.map((p, i) => {
        const n = STAR_PTS[(i + 1) % 16];
        const on = i < lit;
        return (
          <line
            key={i}
            x1={p[0]} y1={p[1]} x2={n[0]} y2={n[1]}
            stroke={on ? "#e0c27e" : "rgba(216,201,164,0.18)"}
            strokeWidth={on ? 4.4 : 3}
            strokeLinecap="round"
            style={{
              transition: "stroke .5s, stroke-width .5s",
              filter: on && i === lit - 1 ? "drop-shadow(0 0 5px rgba(224,194,126,.9))" : undefined,
            }}
          />
        );
      })}
      <circle cx="50" cy="50" r="7" fill={progress >= 1 ? "#e0c27e" : "none"} stroke="#e0c27e" strokeWidth="2.4" opacity={progress > 0 ? 1 : 0.4} style={{ transition: "fill .6s" }} />
    </svg>
  );
}

/* ============================================================
   اللوحات الهندسية الإسلامية — بديل صور البطاقات
============================================================ */
const PALS: Record<PaletteName, { bg: string; deep: string; a: string; b: string; gold: string; ivory: string }> = {
  lapis:   { bg: "#152639", deep: "#1d3550", a: "#2e5f8a", b: "#4a7fad", gold: "#e0c27e", ivory: "#f1e7d0" },
  olive:   { bg: "#1c2a22", deep: "#26382c", a: "#33493a", b: "#5c7350", gold: "#c9a458", ivory: "#e9e0c8" },
  saffron: { bg: "#33270f", deep: "#453416", a: "#9c7128", b: "#d9a13f", gold: "#f2e3ba", ivory: "#fbeed3" },
  madder:  { bg: "#331510", deep: "#45201a", a: "#7e2f22", b: "#a8432f", gold: "#e0c27e", ivory: "#f5e3d5" },
  turq:    { bg: "#0f2b28", deep: "#163a35", a: "#1f5f57", b: "#2f8f83", gold: "#e3b45c", ivory: "#e6efe2" },
  night:   { bg: "#101820", deep: "#182430", a: "#224052", b: "#3a5f77", gold: "#c9a458", ivory: "#e8e4d8" },
};

function PlateFrame({ gold }: { gold: string }) {
  return (
    <g stroke={gold} strokeWidth="1.4" fill="none" opacity="0.55">
      <rect x="10" y="10" width="380" height="280" />
      <path d="M10 26V10h16M374 10h16v16M390 274v16h-16M26 290H10v-16" strokeWidth="2.2" />
    </g>
  );
}

export function IslamicPlate({
  variant, palette, className = "", spin = false,
}: {
  variant: PlateVariant;
  palette: PaletteName;
  className?: string;
  spin?: boolean;
}) {
  const uid = useId().replace(/[:]/g, "");
  const c = PALS[palette];
  const star = "200,58 219,104 265,85 246,131 292,150 246,169 265,215 219,196 200,242 181,196 135,215 154,169 108,150 154,131 135,85 181,104";

  return (
    <svg viewBox="0 0 400 300" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id={`g${uid}`} cx="50%" cy="38%" r="80%">
          <stop offset="0%" stopColor={c.deep} />
          <stop offset="100%" stopColor={c.bg} />
        </radialGradient>
        <pattern id={`p${uid}`} width="62" height="62" patternUnits="userSpaceOnUse">
          <polygon points="31,4 38,24 58,31 38,38 31,58 24,38 4,31 24,24" fill="none" stroke={c.gold} strokeWidth="0.8" opacity="0.35" />
          <circle cx="31" cy="31" r="2" fill={c.gold} opacity="0.3" />
          <circle cx="0" cy="0" r="2" fill={c.b} opacity="0.4" />
          <circle cx="62" cy="62" r="2" fill={c.b} opacity="0.4" />
        </pattern>
      </defs>
      <rect width="400" height="300" fill={`url(#g${uid})`} />

      {variant === "khatam" && (
        <g>
          <rect width="400" height="300" fill={`url(#p${uid})`} opacity="0.5" />
          <g className={spin ? "" : ""}>
            <circle cx="200" cy="150" r="112" fill="none" stroke={c.b} strokeWidth="1.6" opacity="0.6" />
            <circle cx="200" cy="150" r="122" fill="none" stroke={c.gold} strokeWidth="1" strokeDasharray="3 7" opacity="0.7" />
            <polygon points={star} fill={c.a} stroke={c.gold} strokeWidth="2" opacity="0.95" />
            <rect x="146" y="96" width="108" height="108" fill="none" stroke={c.ivory} strokeWidth="1.6" opacity="0.55" />
            <rect x="146" y="96" width="108" height="108" fill="none" stroke={c.ivory} strokeWidth="1.6" opacity="0.55" transform="rotate(45 200 150)" />
            <circle cx="200" cy="150" r="30" fill={c.deep} stroke={c.gold} strokeWidth="2" />
            <polygon points="200,128 206,144 222,150 206,156 200,172 194,156 178,150 194,144" fill={c.gold} />
            {[0, 90, 180, 270].map((r) => (
              <circle key={r} cx={200 + 96 * Math.cos((r * Math.PI) / 180)} cy={150 + 96 * Math.sin((r * Math.PI) / 180)} r="4.5" fill={c.gold} opacity="0.85" />
            ))}
          </g>
          <PlateFrame gold={c.gold} />
        </g>
      )}

      {variant === "rosette" && (
        <g>
          {Array.from({ length: 24 }).map((_, i) => (
            <ellipse key={i} cx="200" cy="150" rx="10" ry="58" fill="none" stroke={i % 2 ? c.b : c.gold} strokeWidth="1.4" opacity={i % 2 ? 0.65 : 0.8} transform={`rotate(${i * 7.5} 200 150)`} />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <ellipse key={`f${i}`} cx="200" cy="150" rx="16" ry="44" fill={c.a} opacity="0.75" transform={`rotate(${i * 15} 200 150)`} />
          ))}
          <circle cx="200" cy="150" r="92" fill="none" stroke={c.gold} strokeWidth="1.8" />
          <circle cx="200" cy="150" r="104" fill="none" stroke={c.gold} strokeWidth="1" strokeDasharray="2 6" opacity="0.8" />
          <circle cx="200" cy="150" r="24" fill={c.deep} stroke={c.gold} strokeWidth="2" />
          <circle cx="200" cy="150" r="8" fill={c.gold} />
          {Array.from({ length: 12 }).map((_, i) => {
            const rad = ((i * 30 - 90) * Math.PI) / 180;
            return <circle key={`d${i}`} cx={200 + 112 * Math.cos(rad)} cy={150 + 112 * Math.sin(rad)} r="3.4" fill={c.ivory} opacity="0.8" />;
          })}
          <PlateFrame gold={c.gold} />
        </g>
      )}

      {variant === "girih" && (
        <g>
          <rect width="400" height="300" fill={`url(#p${uid})`} />
          <g stroke={c.gold} fill="none">
            {[70, 200, 330].map((x) =>
              [65, 150, 235].map((y) => (
                <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
                  <polygon points="0,-40 11,-11 40,0 11,11 0,40 -11,11 -40,0 -11,-11" stroke={c.b} strokeWidth="1.6" />
                  <polygon points="0,-20 20,0 0,20 -20,0" strokeWidth="1.2" opacity="0.8" />
                  <circle r="4" fill={c.gold} stroke="none" opacity="0.9" />
                </g>
              )),
            )}
            <path d="M20 65h360M20 150h360M20 235h360" strokeWidth="0.8" opacity="0.35" strokeDasharray="4 6" />
            <path d="M70 20v260M200 20v260M330 20v260" strokeWidth="0.8" opacity="0.35" strokeDasharray="4 6" />
          </g>
          <PlateFrame gold={c.gold} />
        </g>
      )}

      {variant === "zellij" && (
        <g>
          {[[0, 0], [400, 0], [0, 300], [400, 300]].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="150" fill="none" stroke={c.b} strokeWidth="10" opacity="0.28" />
              <circle cx={x} cy={y} r="110" fill="none" stroke={c.a} strokeWidth="14" opacity="0.4" />
              <circle cx={x} cy={y} r="70" fill="none" stroke={c.b} strokeWidth="8" opacity="0.5" />
              <circle cx={x} cy={y} r="34" fill="none" stroke={c.gold} strokeWidth="2.4" opacity="0.9" />
            </g>
          ))}
          <g transform="translate(200 150)">
            <rect x="-46" y="-46" width="92" height="92" fill={c.a} stroke={c.gold} strokeWidth="2" transform="rotate(45)" />
            <polygon points={star} transform="scale(0.42)" fill={c.deep} stroke={c.gold} strokeWidth="3" />
            <circle r="10" fill={c.gold} />
          </g>
          <g stroke={c.ivory} strokeWidth="1" opacity="0.35">
            <path d="M0 0 400 300M400 0 0 300" />
          </g>
          <PlateFrame gold={c.gold} />
        </g>
      )}

      {variant === "arabesque" && (
        <g fill="none" strokeLinecap="round">
          {[1, -1].map((m) => (
            <g key={m} transform={`translate(200 150) scale(${m} 1)`}>
              <path d="M0 0C30 -60 90 -84 132 -62 168 -44 172 -4 146 16 122 34 92 24 88 0 85 -18 100 -30 116 -26" stroke={c.gold} strokeWidth="2.6" opacity="0.95" />
              <path d="M0 0C44 -18 66 14 108 12 142 10 158 -14 150 -36" stroke={c.b} strokeWidth="2" opacity="0.85" />
              <path d="M0 6C20 40 60 66 104 58 136 52 150 28 140 8" stroke={c.b} strokeWidth="2" opacity="0.85" />
              <ellipse cx="66" cy="-46" rx="16" ry="8" fill={c.a} stroke="none" transform="rotate(-32 66 -46)" />
              <ellipse cx="128" cy="-40" rx="15" ry="7" fill={c.a} stroke="none" transform="rotate(18 128 -40)" />
              <ellipse cx="102" cy="40" rx="16" ry="8" fill={c.a} stroke="none" transform="rotate(24 102 40)" />
              <circle cx="150" cy="-38" r="4" fill={c.gold} stroke="none" />
              <circle cx="142" cy="8" r="3.4" fill={c.ivory} stroke="none" opacity="0.9" />
            </g>
          ))}
          <g transform="translate(200 150)">
            {Array.from({ length: 8 }).map((_, i) => (
              <ellipse key={i} rx="7" ry="17" fill={c.gold} opacity="0.9" transform={`rotate(${i * 45}) translate(0 -16)`} stroke="none" />
            ))}
            <circle r="9" fill={c.deep} stroke={c.gold} strokeWidth="2" />
          </g>
          <PlateFrame gold={c.gold} />
        </g>
      )}

      {variant === "shamsa" && (
        <g>
          <circle cx="200" cy="150" r="120" fill="none" stroke={c.b} strokeWidth="1.4" opacity="0.6" />
          {Array.from({ length: 16 }).map((_, i) => {
            const rad = ((i * 22.5 - 90) * Math.PI) / 180;
            const x1 = 200 + 44 * Math.cos(rad), y1 = 150 + 44 * Math.sin(rad);
            const x2 = 200 + 118 * Math.cos(rad), y2 = 150 + 118 * Math.sin(rad);
            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={i % 2 ? c.b : c.gold} strokeWidth={i % 2 ? 2.4 : 1.4} opacity={i % 2 ? 0.8 : 0.95} />
                <circle cx={200 + 128 * Math.cos(rad)} cy={150 + 128 * Math.sin(rad)} r={i % 2 ? 3.4 : 2.2} fill={i % 2 ? c.gold : c.ivory} opacity="0.85" />
              </g>
            );
          })}
          <polygon points={star} transform="translate(200 150) scale(0.52) translate(-200 -150)" fill={c.a} stroke={c.gold} strokeWidth="2.4" />
          <circle cx="200" cy="150" r="22" fill={c.deep} stroke={c.gold} strokeWidth="2" />
          <polygon points="200,134 204,146 216,150 204,154 200,166 196,154 184,150 196,146" fill={c.gold} />
          <PlateFrame gold={c.gold} />
        </g>
      )}
    </svg>
  );
}

/* ============================================================
   أزرار تفاعلية بحالات
============================================================ */
export function DownloadBtn({
  label = "تحميل", light = false, onDone,
}: {
  label?: string;
  light?: boolean;
  onDone?: () => void;
}) {
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const toast = useToast();
  const click = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (state !== "idle") return;
    setState("busy");
    window.setTimeout(() => {
      setState("done");
      toast.push("جارٍ تجهيز الملف — نسخة العرض");
      onDone?.();
      window.setTimeout(() => setState("idle"), 1800);
    }, 900);
  };
  return (
    <button
      onClick={click}
      className={`btn-press inline-flex items-center gap-2 font-kufi text-sm font-semibold px-4 py-2 rounded-[5px] border ${
        light
          ? "border-madder-700/40 text-madder-700 hover:bg-madder-500/10"
          : "border-gold-500/40 text-gold-300 hover:bg-gold-500/10 hover:border-gold-400"
      }`}
    >
      {state === "idle" && <IcDownload className="w-4 h-4" />}
      {state === "busy" && (
        <svg viewBox="0 0 24 24" className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" strokeDasharray="40 20" strokeLinecap="round" />
        </svg>
      )}
      {state === "done" && <IcCheck className="w-4 h-4 text-olive-300" />}
      <span>{state === "done" ? "تمّ" : label}</span>
    </button>
  );
}

export function FavBtn({
  id, favs, toggle, className = "",
}: {
  id: string;
  favs: string[];
  toggle: (id: string) => void;
  className?: string;
}) {
  const on = favs.includes(id);
  const [burst, setBurst] = useState(0);
  return (
    <button
      aria-pressed={on}
      aria-label={on ? "إزالة من المفضّلة" : "أضف إلى المفضّلة"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
        if (!on) setBurst((b) => b + 1);
      }}
      className={`btn-press relative grid place-items-center w-9 h-9 rounded-full border transition-colors ${
        on
          ? "text-gold-900 bg-gold-400 border-gold-300 shadow-[0_0_18px_rgba(224,194,126,.5)]"
          : "text-ivory-500 border-ivory-700/40 hover:text-gold-300 hover:border-gold-500/60 bg-ink-900/40"
      } ${className}`}
    >
      <IcStar8 className="w-4.5 h-4.5" />
      {burst > 0 && on && (
        <span key={burst} className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => {
            const ang = (i * Math.PI) / 4;
            return (
              <i
                key={i}
                className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-gold-400"
                style={{
                  ["--px" as string]: `${Math.cos(ang) * 26}px`,
                  ["--py" as string]: `${Math.sin(ang) * 26}px`,
                  animation: "particleFly .65s cubic-bezier(.22,.9,.3,1) forwards",
                }}
              />
            );
          })}
        </span>
      )}
    </button>
  );
}

/* شارة صغيرة */
export function Chip({ children, tone = "gold" }: { children: React.ReactNode; tone?: "gold" | "olive" | "madder" | "lapis" }) {
  const tones: Record<string, string> = {
    gold: "text-gold-300 border-gold-500/40 bg-gold-500/10",
    olive: "text-olive-300 border-olive-500/40 bg-olive-500/10",
    madder: "text-madder-400 border-madder-500/40 bg-madder-500/10",
    lapis: "text-lapis-400 border-lapis-500/50 bg-lapis-500/15",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 font-kufi text-xs font-semibold px-2.5 py-1 rounded-[4px] border ${tones[tone]}`}>
      {children}
    </span>
  );
}
