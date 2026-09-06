import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from "react";
import { formatTime, type PaletteName, type PlateVariant } from "../lib/data";
import { IcClose, IcNext, IcPause, IcPlay, IcPrev, IslamicPlate } from "../lib/kit";

export interface Track {
  id: string;
  title: string;
  sub: string;
  variant: PlateVariant;
  palette: PaletteName;
  dur: number; /* ثوانٍ */
}

interface PlayerCtx {
  track: Track | null;
  playing: boolean;
  t: number;
  speed: number;
  queue: Track[];
  index: number;
  favs: string[];
  toggleFav: (id: string) => void;
  playQueue: (q: Track[], i: number) => void;
  toggle: () => void;
  seek: (sec: number) => void;
  cycleSpeed: () => void;
  next: () => void;
  prev: () => void;
  close: () => void;
}

const Ctx = createContext<PlayerCtx | null>(null);
export const usePlayer = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("player");
  return v;
};

const SPEEDS = [0.75, 1, 1.25, 1.5, 2];
const SPEED_LABELS = ["٠٫٧٥×", "١×", "١٫٢٥×", "١٫٥×", "٢×"];

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<Track[]>([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [favs, setFavs] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("sad-favs") || "[]");
    } catch {
      return [];
    }
  });
  const tRef = useRef(0);
  tRef.current = t;

  const track = queue[index] ?? null;

  useEffect(() => {
    try { localStorage.setItem("sad-favs", JSON.stringify(favs)); } catch { /* تجاهل */ }
  }, [favs]);

  useEffect(() => {
    if (!playing || !track) return;
    const id = window.setInterval(() => setT((p) => p + speed), 1000);
    return () => window.clearInterval(id);
  }, [playing, track, speed]);

  /* الانتقال التلقائي للحلقة التالية عند الانتهاء */
  useEffect(() => {
    if (!track || t < track.dur) return;
    if (index < queue.length - 1) {
      setIndex(index + 1);
      setT(0);
    } else {
      setPlaying(false);
      setT(0);
    }
  }, [t, track, index, queue.length]);

  /* Media Session */
  useEffect(() => {
    try {
      if ("mediaSession" in navigator && track) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: track.title,
          artist: "الشيخ أبو عمرو نور الدين السدعي",
          album: "المنصة العلمية",
        });
      }
    } catch { /* بيئات لا تدعمها */ }
  }, [track]);

  const playQueue = useCallback((q: Track[], i: number) => {
    setQueue(q);
    setIndex(i);
    setT(0);
    setPlaying(true);
  }, []);

  const value = useMemo<PlayerCtx>(
    () => ({
      track, playing, t, speed, queue, index, favs,
      toggleFav: (id) => setFavs((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id])),
      playQueue,
      toggle: () => { if (track) setPlaying((p) => !p); },
      seek: (sec) => setT(Math.max(0, Math.min(sec, track ? track.dur : 0))),
      cycleSpeed: () => setSpeed((s) => SPEEDS[(SPEEDS.indexOf(s) + 1) % SPEEDS.length]),
      next: () => {
        if (index < queue.length - 1) { setIndex(index + 1); setT(0); setPlaying(true); }
      },
      prev: () => {
        if (tRef.current > 4) { setT(0); return; }
        if (index > 0) { setIndex(index - 1); setT(0); setPlaying(true); }
      },
      close: () => { setPlaying(false); setQueue([]); setIndex(0); setT(0); },
    }),
    [track, playing, t, speed, queue, index, favs, playQueue],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <PlayerBar labels={SPEED_LABELS} />
    </Ctx.Provider>
  );
}

/* ---------- موازِن الصوت ---------- */
export function Equalizer({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-end gap-[2.5px] h-4 ${className}`} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className="eq-bar w-[3px] h-full rounded-full bg-gold-400" style={{ animationDelay: `${i * 0.12}s` }} />
      ))}
    </span>
  );
}

/* ---------- الشريط الثابت ---------- */
function PlayerBar({ labels }: { labels: string[] }) {
  const { track, playing, t, speed, toggle, seek, cycleSpeed, next, prev, close, queue, index } = usePlayer();
  const barRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (track) {
      const id = requestAnimationFrame(() => setMounted(true));
      return () => cancelAnimationFrame(id);
    }
    setMounted(false);
  }, [!!track]);

  if (!track) return null;
  const pct = track.dur ? (t / track.dur) * 100 : 0;
  const sIdx = [0.75, 1, 1.25, 1.5, 2].indexOf(speed);

  const onSeek = (e: React.PointerEvent) => {
    const el = barRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const frac = Math.min(1, Math.max(0, (r.right - e.clientX) / r.width)); /* RTL */
    seek(frac * track.dur);
  };

  return (
    <div className="fixed bottom-[4.7rem] md:bottom-4 inset-x-2 md:inset-x-0 z-[60] flex justify-center pointer-events-none">
      <div
        className={`pointer-events-auto w-full md:w-[min(780px,94vw)] bg-ink-850/95 border border-gold-500/25 rounded-lg shadow-[0_24px_70px_-18px_rgba(0,0,0,.8)] transition-all duration-500 ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(.22,.9,.3,1)" }}
        role="region"
        aria-label="مشغّل الصوت"
      >
        <div className="h-[2px] gold-hair rounded-t-lg" />
        <div className="flex items-center gap-3 p-2.5 md:p-3">
          <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-md overflow-hidden shrink-0 border border-gold-500/30">
            <IslamicPlate variant={track.variant} palette={track.palette} className="w-full h-full" />
            {playing && (
              <span className="absolute inset-0 border border-gold-400/70 rounded-md" style={{ animation: "pulseRing 1.6s ease-out infinite" }} />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="font-kufi font-semibold text-sm md:text-[15px] text-ivory-100 truncate">{track.title}</p>
              {playing && <Equalizer className="hidden sm:inline-flex" />}
            </div>
            <p className="text-xs text-ivory-600 truncate font-naskh">{track.sub}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="font-kufi text-[11px] text-gold-400 tabular-nums">{formatTime(t)}</span>
              <div
                ref={barRef}
                onPointerDown={onSeek}
                className="relative flex-1 h-[7px] rounded-full bg-ivory-200/10 cursor-pointer group"
                role="slider"
                aria-label="موضع التشغيل"
                aria-valuenow={Math.round(t)}
                aria-valuemin={0}
                aria-valuemax={Math.round(track.dur)}
              >
                <div className="absolute inset-y-0 right-0 rounded-full bg-gradient-to-l from-gold-400 to-gold-600" style={{ width: `${pct}%` }} />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gold-300 shadow-[0_0_10px_rgba(224,194,126,.8)] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ right: `calc(${pct}% - 6px)` }}
                />
              </div>
              <span className="font-kufi text-[11px] text-ivory-600 tabular-nums">{formatTime(track.dur)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
            <button onClick={cycleSpeed} className="btn-press font-kufi text-xs font-semibold text-ivory-400 hover:text-gold-300 w-10 h-9 rounded-md border border-transparent hover:border-gold-500/30" aria-label="سرعة التشغيل">
              {labels[sIdx]}
            </button>
            <button onClick={prev} className="btn-press text-ivory-300 hover:text-gold-300 w-9 h-9 grid place-items-center" aria-label="السابق">
              <IcNext className="w-5 h-5" />
            </button>
            <button
              onClick={toggle}
              className="btn-press relative w-11 h-11 md:w-12 md:h-12 grid place-items-center rounded-full bg-gradient-to-b from-gold-300 to-gold-600 text-ink-900 shadow-[var(--shadow-gold)]"
              aria-label={playing ? "إيقاف مؤقت" : "تشغيل"}
            >
              {playing && <span className="absolute inset-0 rounded-full border-2 border-gold-400" style={{ animation: "pulseRing 1.8s ease-out infinite" }} />}
              {playing ? <IcPause className="w-5 h-5" /> : <IcPlay className="w-5 h-5" />}
            </button>
            <button onClick={next} disabled={index >= queue.length - 1} className="btn-press text-ivory-300 hover:text-gold-300 disabled:opacity-30 w-9 h-9 grid place-items-center" aria-label="التالي">
              <IcPrev className="w-5 h-5" />
            </button>
            <button onClick={close} className="btn-press text-ivory-600 hover:text-madder-400 w-8 h-8 grid place-items-center" aria-label="إغلاق المشغّل">
              <IcClose className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- شريط تشغيل مصغّر داخل البطاقات ---------- */
export function MiniTrack({ track: tr, list, index: idx }: { track: Track; list: Track[]; index: number }) {
  const { track, playing, t, toggle, playQueue } = usePlayer();
  const active = track?.id === tr.id;
  const pct = active && tr.dur ? (t / tr.dur) * 100 : 0;

  return (
    <div className={`relative overflow-hidden rounded-[6px] border transition-colors ${active ? "border-gold-500/50 bg-gold-500/8" : "border-ivory-700/20 bg-ink-900/50 hover:border-gold-500/30"}`}>
      <div className="absolute inset-y-0 right-0 bg-gold-500/15 transition-[width] duration-500" style={{ width: `${pct}%` }} />
      <div className="relative flex items-center gap-2.5 px-2.5 py-2">
        <button
          onClick={() => (active ? toggle() : playQueue(list, idx))}
          className={`btn-press w-9 h-9 shrink-0 grid place-items-center rounded-full transition-colors ${
            active ? "bg-gold-400 text-ink-900 shadow-[0_0_16px_rgba(224,194,126,.55)]" : "bg-ivory-200/10 text-gold-300 hover:bg-gold-500/25"
          }`}
          aria-label={active && playing ? "إيقاف مؤقت" : "تشغيل من البطاقة"}
        >
          {active && playing ? <IcPause className="w-4 h-4" /> : <IcPlay className="w-4 h-4" />}
        </button>
        <div className="min-w-0 flex-1">
          {active && playing ? (
            <div className="flex items-center gap-2">
              <Equalizer />
              <span className="font-kufi text-xs text-gold-300">{formatTime(t)} / {formatTime(tr.dur)}</span>
            </div>
          ) : (
            <span className="font-kufi text-xs text-ivory-500">
              استماع مباشر · {Math.round(tr.dur / 60).toLocaleString("ar-EG")} دقيقة
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
