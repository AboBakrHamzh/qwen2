import { useEffect, useRef } from "react";
import { useFinePointer, useReducedMotion } from "../lib/kit";

/* ---------- نقش گِره خافت في الخلفية مع بارالاكس ---------- */
function GirihLayer() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    let mx = 0, my = 0, cx = 0, cy = 0, sy = 0, raf = 0;
    const onMove = (e: PointerEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 22;
      my = (e.clientY / window.innerHeight - 0.5) * 14;
    };
    const onScroll = () => { sy = window.scrollY * -0.045; };
    const loop = () => {
      cx += (mx - cx) * 0.045;
      cy += (my - cy) * 0.045;
      el.style.transform = `translate3d(${cx.toFixed(2)}px, ${(cy + sy).toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div ref={ref} className="fixed -inset-[7%] z-[1] pointer-events-none" aria-hidden="true">
      <svg width="100%" height="100%" className="opacity-[0.16]">
        <defs>
          <pattern id="girih-tile" width="104" height="104" patternUnits="userSpaceOnUse">
            <g fill="none" stroke="#c9a458" strokeWidth="1">
              <polygon points="52,10 63,41 94,52 63,63 52,94 41,63 10,52 41,41" opacity="0.55" />
              <path d="M52 0v14M52 90v14M0 52h14M90 52h14" opacity="0.4" />
              <path d="M0 0l16 16M104 0L88 16M0 104l16-16M104 104L88 88" opacity="0.3" />
              <circle cx="52" cy="52" r="3.2" opacity="0.5" />
              <circle cx="0" cy="0" r="2" opacity="0.4" />
              <circle cx="104" cy="0" r="2" opacity="0.4" />
              <circle cx="0" cy="104" r="2" opacity="0.4" />
              <circle cx="104" cy="104" r="2" opacity="0.4" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#girih-tile)" />
      </svg>
    </div>
  );
}

/* ---------- توهّجات محيطية حيّة ---------- */
function AmbientGlow() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <div
        className="absolute -top-40 -left-40 w-[640px] h-[640px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(201,164,88,0.13), transparent 62%)",
          animation: "glowDrift 16s ease-in-out infinite",
        }}
      />
      <div
        className="absolute top-1/3 -right-52 w-[720px] h-[720px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(92,115,80,0.16), transparent 60%)",
          animation: "glowDrift 21s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute bottom-[-260px] left-1/4 w-[680px] h-[680px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(46,95,138,0.14), transparent 60%)",
          animation: "glowDrift 19s ease-in-out 3s infinite",
        }}
      />
    </div>
  );
}

/* ---------- المطر الذهبي الخفيف ---------- */
function RainCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, dpr = 1, raf = 0;
    interface Drop { x: number; y: number; len: number; sp: number; a: number; gold: boolean }
    interface Ripple { x: number; y: number; r: number; a: number }
    let drops: Drop[] = [];
    const ripples: Ripple[] = [];

    const makeDrop = (anywhere: boolean): Drop => ({
      x: Math.random() * (w + 120) - 60,
      y: anywhere ? Math.random() * h : -20 - Math.random() * 80,
      len: 12 + Math.random() * 16,
      sp: 5 + Math.random() * 6,
      a: 0.06 + Math.random() * 0.2,
      gold: Math.random() < 0.3,
    });

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = window.innerWidth;
      h = window.innerHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      c.style.width = `${w}px`;
      c.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(170, Math.round((w * h) / 11000));
      drops = Array.from({ length: n }, () => makeDrop(true));
    };

    let running = true;
    const loop = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";
      for (const d of drops) {
        d.y += d.sp;
        d.x -= d.sp * 0.12;
        ctx.strokeStyle = d.gold
          ? `rgba(224,194,126,${d.a})`
          : `rgba(205,222,232,${d.a * 0.8})`;
        ctx.lineWidth = d.gold ? 1.1 : 0.9;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y - d.len);
        ctx.lineTo(d.x + d.len * 0.12, d.y);
        ctx.stroke();
        if (d.y > h + 10) {
          if (ripples.length < 26 && Math.random() < 0.5) {
            ripples.push({ x: d.x, y: h - 4 - Math.random() * 26, r: 1, a: 0.22 });
          }
          Object.assign(d, makeDrop(false));
        }
      }
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.r += 0.9;
        r.a -= 0.006;
        if (r.a <= 0) { ripples.splice(i, 1); continue; }
        ctx.strokeStyle = `rgba(224,194,126,${r.a})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.ellipse(r.x, r.y, r.r * 1.9, r.r * 0.55, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      raf = requestAnimationFrame(loop);
    };

    const onVis = () => {
      running = document.visibilityState === "visible";
      if (running) raf = requestAnimationFrame(loop);
      else cancelAnimationFrame(raf);
    };

    resize();
    raf = requestAnimationFrame(loop);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduced]);

  if (reduced) return null;
  return <canvas ref={ref} className="fixed inset-0 z-[2] pointer-events-none" aria-hidden="true" />;
}

/* ---------- أوراق الشجر المتطايرة ---------- */
const LEAF_COLORS = ["#a9bd97", "#c9a458", "#d9a13f", "#6d8459", "#b98d5a"];

function Leaf({ i }: { i: number }) {
  const left = (i * 71 + 13) % 100;
  const dur = 21 + ((i * 37) % 15);
  const sway = 3.4 + ((i * 13) % 22) / 10;
  const size = 13 + ((i * 17) % 12);
  const color = LEAF_COLORS[i % LEAF_COLORS.length];
  const delay = -((i * dur) / 14);
  return (
    <span
      className="leaf"
      style={{
        left: `${left}%`,
        animationDuration: `${dur}s`,
        animationDelay: `${delay}s`,
        opacity: 0.34 + ((i * 23) % 30) / 100,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        style={{ animationDuration: `${sway}s`, animationDelay: `${delay / 2}s` }}
      >
        <path
          d="M12 2.5C17.5 6 20 13 16.5 20.5 9.5 19 5 12.5 6.8 5.5 7.6 3.4 9.8 2.2 12 2.5Z"
          fill={color}
          opacity="0.9"
        />
        <path d="M11.5 4.5c.4 5.5 1.8 10.5 4.2 14.6" stroke="#3a4a30" strokeWidth="0.9" opacity="0.55" />
      </svg>
    </span>
  );
}

function Leaves() {
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <div aria-hidden="true">
      {Array.from({ length: 13 }).map((_, i) => (
        <Leaf key={i} i={i} />
      ))}
    </div>
  );
}

/* ---------- توهّج يتبع المؤشر ---------- */
function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!fine || reduced) return;
    const el = ref.current;
    if (!el) return;
    let tx = -600, ty = -600, x = tx, y = ty, raf = 0;
    const onMove = (e: PointerEvent) => { tx = e.clientX; ty = e.clientY; };
    const loop = () => {
      x += (tx - x) * 0.09;
      y += (ty - y) * 0.09;
      el.style.transform = `translate3d(${x - 260}px, ${y - 260}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [fine, reduced]);

  if (!fine || reduced) return null;
  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 w-[520px] h-[520px] z-[3] pointer-events-none rounded-full"
      style={{
        background: "radial-gradient(circle, rgba(201,164,88,0.085), rgba(201,164,88,0.03) 42%, transparent 62%)",
        mixBlendMode: "screen",
      }}
      aria-hidden="true"
    />
  );
}

/* ---------- إطار تعتيم حوافّ ---------- */
function Vignette() {
  return (
    <div
      className="fixed inset-0 z-[4] pointer-events-none"
      style={{
        background:
          "radial-gradient(ellipse 120% 90% at 50% 40%, transparent 55%, rgba(7,15,22,0.55) 100%)",
      }}
      aria-hidden="true"
    />
  );
}

export default function BackgroundFX() {
  return (
    <>
      <AmbientGlow />
      <GirihLayer />
      <RainCanvas />
      <Leaves />
      <CursorGlow />
      <Vignette />
    </>
  );
}
