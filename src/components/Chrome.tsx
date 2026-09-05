import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  articles, books, commonSearches, diary, fatawa, khutbahs, lectures,
  normalizeAr, rudud, seriesList, toAr,
} from "../lib/data";
import {
  Chip, FavBtn, IcBook, IcClose, IcHome, IcMic, IcQuill, IcScroll, IcSearch,
  IcShield, IcStack, IcStar8, IcUser, Ornament, Reveal, flashEl,
} from "../lib/kit";
import { usePlayer } from "./Player";

/* ---------- شعار الاسم (البديل النصي الفاخر) ---------- */
export function NameMark({ compact = false }: { compact?: boolean }) {
  return (
    <a href="#home" className="flex items-center gap-3 group" aria-label="الرئيسية">
      <svg viewBox="0 0 44 44" className={`shrink-0 text-gold-400 transition-transform duration-700 group-hover:rotate-45 ${compact ? "w-8 h-8" : "w-10 h-10"}`} fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M22 4l4.2 11L37 10.8l-4.2 11L44 22l-11.2 4.2L37 37l-10.8-4.2L22 44l-4.2-11.2L7 37l4.2-10.8L0 22l11.2-4.2L7 10.8l10.8 4.2z" transform="translate(0,-2) scale(0.95)" />
        <circle cx="22" cy="20" r="4" fill="currentColor" stroke="none" />
      </svg>
      <span className="leading-none">
        <span className={`block font-kufi text-[10px] font-semibold text-gold-400 ${compact ? "mb-0.5" : "mb-1"}`}>فضيلة الشيخ</span>
        <span className={`block font-ruqaa text-ivory-100 ${compact ? "text-lg" : "text-xl md:text-2xl"}`}>
          أبو عمرو نور الدين السدعي
        </span>
      </span>
    </a>
  );
}

const NAV = [
  { id: "series", label: "السلاسل" },
  { id: "khutbah", label: "الخطب" },
  { id: "fatwa", label: "الفتاوى" },
  { id: "radd", label: "الردود" },
  { id: "library", label: "المكتبة" },
  { id: "articles", label: "المقالات" },
];

export const SECTION_IDS = ["home", "series", "khutbah", "fatwa", "radd", "library", "articles", "lectures", "diary"];

/* ---------- الرأس ---------- */
export function Header({
  active, onSearch, onAccount,
}: {
  active: string;
  onSearch: () => void;
  onAccount: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const { favs } = usePlayer();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 36);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-ink-900/92 shadow-[0_10px_40px_-18px_rgba(0,0,0,.8)]" : "bg-transparent"
      }`}
    >
      <div className={`h-px gold-hair transition-opacity duration-500 ${scrolled ? "opacity-100" : "opacity-0"}`} />
      <div className={`mx-auto max-w-7xl px-4 md:px-6 flex items-center justify-between gap-4 transition-all duration-500 ${scrolled ? "py-2.5" : "py-4 md:py-5"}`}>
        <NameMark compact={scrolled} />
        <nav className="hidden lg:flex items-center gap-1" aria-label="التنقل الرئيسي">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className={`relative font-kufi text-sm font-medium px-3.5 py-2 rounded-md transition-colors ${
                active === n.id ? "text-gold-300" : "text-ivory-400 hover:text-ivory-100"
              }`}
            >
              {n.label}
              <span
                className={`absolute bottom-0.5 right-3.5 left-3.5 h-[2px] rounded-full bg-gold-400 transition-transform duration-300 origin-center ${
                  active === n.id ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={onSearch}
            className="btn-press flex items-center gap-2 font-kufi text-sm text-ivory-300 hover:text-gold-300 border border-ivory-700/30 hover:border-gold-500/50 rounded-md px-3 py-2 transition-colors"
            aria-label="فتح البحث"
          >
            <IcSearch className="w-4 h-4" />
            <span className="hidden md:inline text-ivory-600">ابحث في المنصة…</span>
          </button>
          <button
            onClick={onAccount}
            className="btn-press relative grid place-items-center w-10 h-10 rounded-md border border-ivory-700/30 hover:border-gold-500/50 text-ivory-300 hover:text-gold-300 transition-colors"
            aria-label={`حسابي — ${favs.length} في المفضلة`}
          >
            <IcStar8 className="w-4.5 h-4.5" />
            {favs.length > 0 && (
              <span className="absolute -top-1.5 -left-1.5 min-w-4.5 h-4.5 px-1 grid place-items-center rounded-full bg-gold-400 text-ink-900 font-kufi text-[10px] font-bold">
                {toAr(favs.length)}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

/* ---------- شريط الجوال السفلي ---------- */
export function MobileNav({
  active, onSearch, onAccount,
}: {
  active: string;
  onSearch: () => void;
  onAccount: () => void;
}) {
  const go = (id: string) => {
    if (id === "home") window.scrollTo({ top: 0, behavior: "smooth" });
    else flashEl(id);
  };
  const items = [
    { id: "home", label: "الرئيسية", icon: IcHome, act: () => go("home") },
    { id: "series", label: "السلاسل", icon: IcStack, act: () => go("series") },
    { id: "search", label: "بحث", icon: IcSearch, act: onSearch },
    { id: "library", label: "المكتبة", icon: IcBook, act: () => go("library") },
    { id: "account", label: "حسابي", icon: IcUser, act: onAccount },
  ];
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-ink-850/95 border-t border-gold-500/15 pb-[env(safe-area-inset-bottom)]" aria-label="التنقل السفلي">
      <div className="grid grid-cols-5">
        {items.map((it) => {
          const on = active === it.id;
          const I = it.icon;
          return (
            <button
              key={it.id}
              onClick={it.act}
              className="relative flex flex-col items-center gap-1 py-2.5 min-h-[52px] btn-press"
              aria-current={on ? "page" : undefined}
            >
              <span className={`absolute top-1 h-8 w-12 rounded-full transition-all duration-400 ${on ? "bg-gold-500/15 scale-100" : "scale-50 opacity-0"}`} />
              <I className={`w-5 h-5 relative transition-all duration-300 ${on ? "text-gold-300 -translate-y-0.5" : "text-ivory-500"}`} />
              <span className={`relative font-kufi text-[10px] font-semibold transition-colors ${on ? "text-gold-300" : "text-ivory-600"}`}>{it.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* ---------- البحث الفوري ---------- */
interface Hit { id: string; title: string; sec: string; secId: string; extra?: string }

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  const index = useMemo<Hit[]>(
    () => [
      ...seriesList.map((s) => ({ id: s.id, title: `سلسلة ${s.title}`, sec: "السلاسل", secId: "series", extra: s.book })),
      ...khutbahs.map((k) => ({ id: k.id, title: k.title, sec: "الخطب", secId: "khutbah", extra: k.mosque })),
      ...fatawa.map((f) => ({ id: f.id, title: f.q, sec: "الفتاوى", secId: "fatwa", extra: f.topic })),
      ...rudud.map((r) => ({ id: r.id, title: r.claim.replace(/[«»]/g, ""), sec: "الردود", secId: "radd", extra: r.stage })),
      ...articles.map((a) => ({ id: a.id, title: a.title, sec: "المقالات", secId: "articles", extra: a.topic })),
      ...books.map((b) => ({ id: b.id, title: b.title, sec: "المكتبة", secId: "library", extra: b.kind })),
      ...lectures.map((l) => ({ id: l.id, title: l.title, sec: "المحاضرات", secId: "lectures", extra: l.venue })),
      ...diary.map((d) => ({ id: d.id, title: d.text.slice(0, 60) + "…", sec: "اليوميات", secId: "diary", extra: d.hijri })),
    ],
    [],
  );

  useEffect(() => {
    if (open) {
      setQ("");
      const t = window.setTimeout(() => inputRef.current?.focus(), 120);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    setMounted(open);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const nq = normalizeAr(q);
  const hits = nq ? index.filter((h) => normalizeAr(h.title + " " + (h.extra ?? "")).includes(nq)) : [];
  const groups = hits.reduce<Record<string, Hit[]>>((acc, h) => {
    (acc[h.sec] = acc[h.sec] || []).push(h);
    return acc;
  }, {});

  const pick = (h: Hit) => {
    onClose();
    window.setTimeout(() => flashEl(h.id), 320);
  };

  return (
    <div className={`fixed inset-0 z-[75] flex justify-center transition-opacity duration-300 ${mounted ? "opacity-100" : "opacity-0"}`} role="dialog" aria-modal="true" aria-label="البحث">
      <button className="absolute inset-0 bg-ink-950/82 backdrop-blur-[6px]" onClick={onClose} aria-label="إغلاق البحث" />
      <div className={`relative w-full max-w-2xl mx-4 mt-20 md:mt-28 h-fit transition-transform duration-400 ${mounted ? "translate-y-0" : "translate-y-6"}`} style={{ transitionTimingFunction: "cubic-bezier(.22,.9,.3,1)" }}>
        <div className="bg-ink-850 border border-gold-500/25 rounded-lg shadow-[var(--shadow-plate)] overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-ivory-700/15">
            <IcSearch className="w-5 h-5 text-gold-400 shrink-0" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث في الخطب والدروس والفتاوى والكتب… (بلا تشكيل)"
              className="flex-1 bg-transparent font-naskh text-lg text-ivory-100 placeholder:text-ivory-700 outline-none"
            />
            <button onClick={onClose} className="btn-press text-ivory-500 hover:text-ivory-200 p-1.5" aria-label="إغلاق">
              <IcClose className="w-5 h-5" />
            </button>
          </div>
          <div className="max-h-[56vh] overflow-y-auto p-3">
            {!nq && (
              <div className="p-4">
                <p className="font-kufi text-sm text-ivory-500 mb-3">عباراتٌ شائعة:</p>
                <div className="flex flex-wrap gap-2">
                  {commonSearches.map((c) => (
                    <button key={c} onClick={() => setQ(c)} className="btn-press font-naskh text-sm text-gold-300 border border-gold-500/30 hover:bg-gold-500/10 rounded-full px-4 py-1.5">
                      {c}
                    </button>
                  ))}
                </div>
                <p className="mt-5 text-sm text-ivory-600 leading-relaxed">
                  البحث يتجاهل التشكيل ويوحّد الهمزات — جرّب «الايمان» وستجد «الإيمان».
                </p>
              </div>
            )}
            {nq && hits.length === 0 && (
              <div className="p-10 text-center">
                <svg viewBox="0 0 100 100" className="w-20 h-20 mx-auto text-gold-500/50 draw rv-in" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M50 6l10.5 27L88 22.5 77.5 50 88 77.5 60.5 67 50 94 39.5 67 12 77.5 22.5 50 12 22.5 39.5 33z" pathLength={1} />
                  <circle cx="50" cy="50" r="9" pathLength={1} />
                </svg>
                <p className="mt-4 font-kufi text-ivory-300">لا نتائج عن «{q}»</p>
                <p className="mt-1 text-sm text-ivory-600">جرّب كلمة أعمّ أو تصفّح الأقسام من الصفحة الرئيسية.</p>
              </div>
            )}
            {Object.entries(groups).map(([sec, list]) => (
              <div key={sec} className="mb-2">
                <p className="font-kufi text-xs font-semibold text-gold-400 px-2 py-1.5">{sec} · {toAr(list.length)}</p>
                {list.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => pick(h)}
                    className="w-full text-right flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-gold-500/10 transition-colors group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-500/70 group-hover:bg-gold-300 shrink-0" />
                    <span className="min-w-0 flex-1">
                      <span className="block font-naskh text-[15px] text-ivory-100 truncate">{h.title}</span>
                      {h.extra && <span className="block text-xs text-ivory-600 truncate">{h.extra}</span>}
                    </span>
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-ivory-600 group-hover:text-gold-300 transition-colors shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M14 6l-6 6 6 6" />
                    </svg>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- ورقة «حسابي» ---------- */
export function AccountSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { favs, toggleFav } = usePlayer();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(open), [open]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;

  const all: Hit[] = [
    ...seriesList.map((s) => ({ id: s.id, title: `سلسلة ${s.title}`, sec: "السلاسل", secId: "series" })),
    ...khutbahs.map((k) => ({ id: k.id, title: k.title, sec: "الخطب", secId: "khutbah" })),
    ...fatawa.map((f) => ({ id: f.id, title: f.q, sec: "الفتاوى", secId: "fatwa" })),
    ...articles.map((a) => ({ id: a.id, title: a.title, sec: "المقالات", secId: "articles" })),
    ...books.map((b) => ({ id: b.id, title: b.title, sec: "المكتبة", secId: "library" })),
    ...lectures.map((l) => ({ id: l.id, title: l.title, sec: "المحاضرات", secId: "lectures" })),
  ];
  const mine = all.filter((h) => favs.includes(h.id));

  return (
    <div className="fixed inset-0 z-[75]" role="dialog" aria-modal="true" aria-label="حسابي">
      <button className={`absolute inset-0 bg-ink-950/70 transition-opacity duration-300 ${mounted ? "opacity-100" : "opacity-0"}`} onClick={onClose} aria-label="إغلاق" />
      <div
        className={`absolute bottom-0 inset-x-0 md:inset-x-auto md:left-6 md:bottom-6 md:w-96 bg-ink-850 border border-gold-500/25 md:rounded-lg rounded-t-xl shadow-[var(--shadow-plate)] transition-transform duration-500 ${mounted ? "translate-y-0" : "translate-y-full"}`}
        style={{ transitionTimingFunction: "cubic-bezier(.22,.9,.3,1)" }}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <p className="font-kufi font-bold text-lg text-ivory-100">حسابي</p>
            <p className="text-xs text-ivory-600 font-naskh">طالبُ علمٍ — حفظ التقدّم محليًا (نسخة عرض)</p>
          </div>
          <button onClick={onClose} className="btn-press text-ivory-500 hover:text-ivory-200 p-2" aria-label="إغلاق">
            <IcClose className="w-5 h-5" />
          </button>
        </div>
        <div className="h-px gold-hair mx-5" />
        <div className="max-h-[46vh] overflow-y-auto p-4">
          <p className="font-kufi text-sm font-semibold text-gold-400 mb-3">المفضّلة · {toAr(mine.length)}</p>
          {mine.length === 0 && (
            <div className="text-center py-8">
              <IcStar8 className="w-10 h-10 mx-auto text-ivory-700" />
              <p className="mt-3 font-naskh text-sm text-ivory-500 leading-relaxed">
                لم تحفظ شيئًا بعد.<br />اضغط على النجمة في أي بطاقة لتحفظها هنا.
              </p>
            </div>
          )}
          <div className="space-y-2">
            {mine.map((h) => (
              <div key={h.id} className="flex items-center gap-3 bg-ink-900/60 border border-ivory-700/15 rounded-md px-3 py-2.5 group">
                <button
                  className="min-w-0 flex-1 text-right"
                  onClick={() => { onClose(); window.setTimeout(() => flashEl(h.id), 320); }}
                >
                  <span className="block font-naskh text-sm text-ivory-100 truncate group-hover:text-gold-300 transition-colors">{h.title}</span>
                  <span className="block text-[11px] text-ivory-600 font-kufi">{h.sec}</span>
                </button>
                <FavBtn id={h.id} favs={favs} toggle={toggleFav} className="w-8 h-8" />
              </div>
            ))}
          </div>
        </div>
        <div className="px-5 pb-5 pt-1">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-ink-900/60 border border-ivory-700/15 rounded-md p-3 text-center">
              <p className="font-kufi text-xl font-bold text-gold-300">{toAr(mine.length)}</p>
              <p className="text-[11px] text-ivory-600 font-kufi">محفوظات</p>
            </div>
            <div className="bg-ink-900/60 border border-ivory-700/15 rounded-md p-3 text-center">
              <p className="font-kufi text-xl font-bold text-olive-300">{toAr(84)}</p>
              <p className="text-[11px] text-ivory-600 font-kufi">درسًا مُتمًّا</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- التذييل ---------- */
export function Footer() {
  return (
    <footer className="relative mt-24 pb-28 md:pb-10">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <Reveal>
          <div className="flex justify-center text-gold-500/70 mb-10">
            <Ornament className="w-72" />
          </div>
        </Reveal>
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <Reveal>
            <p className="font-ruqaa text-3xl md:text-4xl text-ivory-100 leading-relaxed">أبو عمرو نور الدين السدعي</p>
            <p className="mt-3 max-w-md font-naskh text-[15px] leading-loose text-ivory-500">
              المنصة العلمية الرسمية: سلاسل شرح متينة، وخطب ودروس، وفتاوى محقَّقة، ومكتبة مصنَّفات — لطالب علمٍ يريد الطريق من أوله.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {["X", "ت", "ي"].map((s, i) => (
                <a
                  key={i}
                  href="#home"
                  onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="btn-press w-10 h-10 grid place-items-center rounded-md border border-ivory-700/30 text-ivory-400 hover:text-gold-300 hover:border-gold-500/50 font-kufi text-sm font-bold transition-colors"
                  aria-label={`قناة ${s}`}
                >
                  {s}
                </a>
              ))}
              <a
                href="#lectures"
                className="btn-press flex items-center gap-2 font-kufi text-sm text-gold-300 border border-gold-500/40 hover:bg-gold-500/10 rounded-md px-4 py-2 transition-colors"
              >
                <IcMic className="w-4 h-4" />
                تغذية البودكاست RSS
              </a>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p className="font-kufi font-bold text-ivory-200 mb-4">الأقسام</p>
            <ul className="space-y-2.5 font-naskh text-[15px]">
              {NAV.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} className="text-ivory-500 hover:text-gold-300 transition-colors inline-flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-gold-500/70" />
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={220}>
            <p className="font-kufi font-bold text-ivory-200 mb-4">للطالب</p>
            <ul className="space-y-2.5 font-naskh text-[15px] text-ivory-500">
              <li className="flex items-center gap-2"><IcScroll className="w-4 h-4 text-gold-500" /> تفريغات نصية لكل المواد</li>
              <li className="flex items-center gap-2"><IcBook className="w-4 h-4 text-gold-500" /> ملحقات PDF لكل درس</li>
              <li className="flex items-center gap-2"><IcShield className="w-4 h-4 text-gold-500" /> ردود علمية موثّقة</li>
              <li className="flex items-center gap-2"><IcQuill className="w-4 h-4 text-gold-500" /> إرسال سؤال لفضيلته</li>
            </ul>
          </Reveal>
        </div>
        <div className="mt-12 pt-6 border-t border-ivory-700/15 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-kufi text-xs text-ivory-600">
            جميع الحقوق محفوظة · {toAr(1447)}هـ — {toAr(2026)}م
          </p>
          <p className="font-naskh text-xs text-ivory-700 flex items-center gap-2">
            <Chip tone="gold">نسخة عرض تصميمية</Chip>
            صُنعت بإتقانٍ وحبّ
          </p>
        </div>
      </div>
    </footer>
  );
}
