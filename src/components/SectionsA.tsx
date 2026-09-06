import { useRef, useState } from "react";
import { fatawa, rudud, seriesList, toAr, topics } from "../lib/data";
import {
  Chip, CountUp, FavBtn, IcArrow, IcChevD, IcPlay, IslamicPlate,
  Ornament, Reveal, SectionHeader, StarProgress, Tilt, flashEl, useToast,
} from "../lib/kit";
import { MiniTrack, usePlayer, type Track } from "./Player";

/* ==================================================================
   ١) الواجهة الافتتاحية — السلسلة الجارية
================================================================== */
const bukhariQueue: Track[] = [
  { id: "bl-84", title: "الدرس ٨٤ — الاغتباط في العلم والحكمة", sub: "شرح صحيح البخاري", variant: "khatam", palette: "lapis", dur: 32 * 60 },
  { id: "bl-85", title: "الدرس ٨٥ — بابُ من سئل علمًا وهو مشتغل", sub: "شرح صحيح البخاري", variant: "khatam", palette: "lapis", dur: 35 * 60 },
  { id: "bl-86", title: "الدرس ٨٦ — قول النبي ﷺ: اللهم علّمه الكتاب", sub: "شرح صحيح البخاري", variant: "khatam", palette: "lapis", dur: 30 * 60 },
];

export function Hero() {
  const { playQueue, track, playing, toggle } = usePlayer();
  const isBukhari = track?.id.startsWith("bl-");

  return (
    <section id="home" className="relative pt-28 md:pt-36 pb-10">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* البسملة */}
        <Reveal y={14} className="flex items-center justify-center gap-4 mb-8">
          <span className="hidden sm:block h-px w-16 bg-gradient-to-l from-transparent to-gold-500/60" />
          <p className="font-naskh text-lg md:text-xl text-gold-300/90">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
          <span className="hidden sm:block h-px w-16 bg-gradient-to-r from-transparent to-gold-500/60" />
        </Reveal>

        <div className="grid lg:grid-cols-[1.12fr_0.88fr] gap-12 lg:gap-10 items-center">
          {/* النص التعريفي */}
          <div>
            <Reveal y={18}>
              <p className="flex items-center gap-2.5 font-kufi font-semibold text-gold-400 text-sm md:text-base">
                <svg viewBox="0 0 12 12" className="w-3 h-3" fill="currentColor" aria-hidden="true">
                  <path d="M6 0l1.4 4.6L12 6l-4.6 1.4L6 12 4.6 7.4 0 6l4.6-1.4z" />
                </svg>
                المنصّة العلمية الرسمية
              </p>
            </Reveal>

            <h1 className="mt-4 font-ruqaa text-ivory-50 leading-[1.5] text-[2.25rem] sm:text-6xl lg:text-[4.4rem]">
              <Reveal y={30} delay={100} className="rv-mask"><span>أبو عمرو نورُ الدين</span></Reveal>
              <Reveal y={30} delay={260} className="rv-mask">
                <span className="text-shimmer">السدعيُّ</span>
              </Reveal>
            </h1>

            <Reveal delay={420} className="mt-2 text-gold-500/80">
              <Ornament className="w-64" />
            </Reveal>

            <Reveal delay={500}>
              <p className="mt-5 max-w-xl font-naskh text-base md:text-lg leading-loose text-ivory-400">
                سلاسلُ شرحٍ متينة تُبنى درسًا فدرسًا، وخطبٌ وفتاوى محقَّقة، ومكتبةُ مصنَّفاتٍ
                كاملة — صُنعت لطالبِ علمٍ يريد أن يسلك الطريقَ من أوّله، ويتابع من حيث توقف.
              </p>
            </Reveal>

            {/* أرقام المنصة */}
            <Reveal delay={620}>
              <div className="mt-8 flex flex-wrap items-stretch gap-x-8 gap-y-5">
                {[
                  { n: 6, s: "", l: "سلاسل جارية" },
                  { n: 228, s: "", l: "درسًا وخطبة" },
                  { n: 96, s: "", l: "فتوى محقَّقة" },
                  { n: 6, s: "", l: "مصنَّفات" },
                ].map((st, i) => (
                  <div key={i} className="relative pr-6">
                    {i > 0 && <span className="absolute right-0 top-1 bottom-1 w-px bg-gradient-to-b from-transparent via-gold-500/40 to-transparent" />}
                    <p className="font-kufi font-bold text-3xl md:text-4xl text-gold-300">
                      <CountUp to={st.n} />
                    </p>
                    <p className="font-naskh text-sm text-ivory-500 mt-0.5">{st.l}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={740}>
              <div className="mt-9 flex flex-wrap items-center gap-3.5">
                <button
                  onClick={() => flashEl("series")}
                  className="btn-press group inline-flex items-center gap-3 font-kufi font-bold text-ink-900 bg-gradient-to-b from-gold-300 to-gold-600 px-7 py-3.5 rounded-md shadow-[var(--shadow-gold)]"
                >
                  <IcPlay className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                  ابدأ السلسلة الجارية
                </button>
                <button
                  onClick={() => (isBukhari ? toggle() : playQueue(bukhariQueue, 1))}
                  className="btn-press inline-flex items-center gap-2.5 font-kufi font-semibold text-gold-300 border border-gold-500/45 hover:bg-gold-500/10 px-6 py-3.5 rounded-md transition-colors"
                >
                  <span className="relative flex w-2.5 h-2.5">
                    <span className="absolute inline-flex w-full h-full rounded-full bg-olive-300 opacity-70" style={{ animation: "pulseRing 1.8s ease-out infinite" }} />
                    <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-olive-300" />
                  </span>
                  {isBukhari && playing ? "إيقاف الدرس ٨٥" : "تابِع الدرس ٨٥ الآن"}
                </button>
              </div>
            </Reveal>
          </div>

          {/* بطاقة السلسلة الجارية */}
          <Reveal delay={300} y={34}>
            <div className="relative">
              {/* نجم دوّار خلفي */}
              <svg viewBox="0 0 200 200" className="absolute -top-12 -left-10 w-48 h-48 text-gold-500/15 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" style={{ animation: "spinSlow 70s linear infinite" }}>
                <path d="M100 8l21 55 55-21-21 55 55 21-55 21 21 55-55-21-21 55-21-55-55 21 21-55L8 118l55-21L42 42l55 21z" />
                <circle cx="100" cy="100" r="34" />
              </svg>

              <Tilt max={5}>
                <div id="hero-series" className="orn-frame relative bg-ink-800/85 border border-gold-500/25 rounded-lg overflow-hidden shadow-[var(--shadow-plate)]">
                  <div className="relative h-44">
                    <IslamicPlate variant="khatam" palette="lapis" className="w-full h-full" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-transparent to-transparent" />
                    <span className="absolute top-3 right-3"><Chip tone="olive">جارية الآن</Chip></span>
                    <span className="absolute top-3 left-3"><Chip tone="gold">متقدّم</Chip></span>
                    <p className="absolute bottom-3 right-4 font-kufi text-[11px] text-ivory-400">السلسلة الأمّ في المنصة</p>
                  </div>
                  <div className="p-5 md:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-kufi font-bold text-xl md:text-2xl text-ivory-50">شرح صحيح البخاري</h2>
                        <p className="font-naskh text-sm text-ivory-500 mt-1">صحيح الإمام البخاري — كتاب العلم</p>
                      </div>
                      <div className="flex flex-col items-center shrink-0">
                        <StarProgress progress={84 / 128} size={64} />
                        <span className="font-kufi text-[11px] text-gold-400 mt-1">{toAr(66)}٪</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-4 text-[13px] font-naskh text-ivory-500">
                      <span>{toAr(84)} من {toAr(128)} درسًا</span>
                      <span className="w-1 h-1 rounded-full bg-gold-500/60" />
                      <span>٨٦ ساعة</span>
                      <span className="w-1 h-1 rounded-full bg-gold-500/60" />
                      <span>تفريغ كامل</span>
                    </div>

                    {/* شريط تقدّم السلسلة */}
                    <div className="mt-3 h-1.5 rounded-full bg-ivory-200/10 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-l from-gold-300 to-gold-600" style={{ width: "66%", transition: "width 1.4s cubic-bezier(.22,.9,.3,1)" }} />
                    </div>

                    <div className="mt-5">
                      <MiniTrack track={bukhariQueue[0]} list={bukhariQueue} index={0} />
                    </div>
                  </div>
                </div>
              </Tilt>

              {/* شريط «تابع من حيث توقفت» */}
              <Reveal delay={550} y={16}>
                <div className="relative z-10 -mt-4 mx-5 md:mx-8 bg-olive-900/90 border border-olive-500/30 rounded-md px-4 py-3 flex items-center gap-3 shadow-[0_16px_40px_-16px_rgba(0,0,0,.7)]">
                  <span className="relative flex w-2 h-2 shrink-0">
                    <span className="absolute w-full h-full rounded-full bg-olive-300 opacity-70" style={{ animation: "pulseRing 1.8s ease-out infinite" }} />
                    <span className="relative w-2 h-2 rounded-full bg-olive-300" />
                  </span>
                  <p className="font-naskh text-sm text-ivory-200 flex-1">
                    تابِع من حيث توقفت: <span className="text-olive-300">عند الدقيقة ١٨:٤٢ من الدرس ٨٥</span>
                  </p>
                  <button onClick={() => playQueue(bukhariQueue, 1)} className="btn-press font-kufi text-xs font-bold text-ink-900 bg-olive-300 hover:bg-gold-300 rounded px-3 py-1.5 transition-colors">
                    استئناف
                  </button>
                </div>
              </Reveal>
            </div>
          </Reveal>
        </div>
      </div>

      {/* شريط الموضوعات المتحرك */}
      <Reveal delay={800} y={10}>
        <div className="marquee mt-16 border-y border-gold-500/12 py-3.5 overflow-hidden" dir="rtl">
          <div className="marquee-track flex w-max items-center gap-7 px-4">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center gap-7" aria-hidden={copy === 1}>
                {topics.map((t) => (
                  <span key={`${copy}-${t}`} className="flex items-center gap-7">
                    <span className="font-kufi text-sm text-ivory-500 whitespace-nowrap">{t}</span>
                    <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-gold-500/70" fill="currentColor" aria-hidden="true">
                      <path d="M6 0l1.4 4.6L12 6l-4.6 1.4L6 12 4.6 7.4 0 6l4.6-1.4z" />
                    </svg>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ==================================================================
   ٢) السلاسل والدورات — مسار أفقي بالسحب
================================================================== */
export function SeriesRail() {
  const { playQueue, favs, toggleFav } = usePlayer();
  const railRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: number) => railRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });

  return (
    <section id="series" className="relative py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex items-end justify-between gap-4">
          <SectionHeader
            eyebrow="البناء العلمي"
            title="السلاسل والدورات"
            sub="مناهج متكاملة تُشرح درسًا فدرسًا — يكتمل نجمُ السلسلة ضلعًا فضلعًا كلما أتممتَ درسًا."
          />
        </div>

        <div className="hidden md:flex items-center gap-2 mb-6">
          <button onClick={() => scrollBy(1)} className="btn-press w-11 h-11 grid place-items-center rounded-md border border-gold-500/30 text-gold-300 hover:bg-gold-500/10" aria-label="تمرير لليسار">
            <IcArrow className="w-5 h-5 rotate-180" />
          </button>
          <button onClick={() => scrollBy(-1)} className="btn-press w-11 h-11 grid place-items-center rounded-md border border-gold-500/30 text-gold-300 hover:bg-gold-500/10" aria-label="تمرير لليمين">
            <IcArrow className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={railRef}
        className="flex gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 md:px-[max(1rem,calc((100vw-80rem)/2+1.5rem))] pb-4 cursor-grab active:cursor-grabbing"
      >
        {seriesList.map((s, i) => {
          const pct = Math.round((s.done / s.lessons) * 100);
          const q: Track[] = [{ id: `${s.id}-t`, title: `أحدث دروس ${s.title}`, sub: s.book, variant: s.variant, palette: s.palette, dur: 34 * 60 }];
          return (
            <Reveal key={s.id} delay={i * 90} className="snap-start shrink-0 w-[290px] md:w-[330px]">
              <article id={s.id} className="orn-frame card-lift group relative bg-ink-800/80 border border-ivory-700/15 hover:border-gold-500/40 rounded-lg overflow-hidden h-full flex flex-col">
                <div className="relative h-40 overflow-hidden">
                  <IslamicPlate variant={s.variant} palette={s.palette} className="w-full h-full transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/20 to-transparent" />
                  <span className="absolute top-3 right-3">
                    <Chip tone={s.status === "جارية" ? "olive" : s.status === "مكتملة" ? "gold" : "madder"}>{s.status}</Chip>
                  </span>
                  <div className="absolute bottom-2.5 left-3 bg-ink-950/70 rounded-full p-1">
                    <StarProgress progress={s.done / s.lessons} size={44} />
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-kufi font-bold text-lg text-ivory-100 group-hover:text-gold-300 transition-colors">{s.title}</h3>
                  <p className="font-naskh text-[13px] text-ivory-500 mt-1">{s.book} · {s.level}</p>
                  <div className="mt-3 flex items-center gap-3 text-xs font-naskh text-ivory-500">
                    <span>{toAr(s.lessons)} درسًا</span>
                    <span className="w-1 h-1 rounded-full bg-gold-500/50" />
                    <span>{s.hours}</span>
                    <span className="w-1 h-1 rounded-full bg-gold-500/50" />
                    <span className="text-gold-400 font-kufi font-semibold">{toAr(pct)}٪</span>
                  </div>
                  <div className="mt-2.5 h-1 rounded-full bg-ivory-200/10 overflow-hidden">
                    <div className="h-full bg-gradient-to-l from-gold-300 to-gold-600 rounded-full transition-[width] duration-1000" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {s.axes.slice(0, 3).map((a) => (
                      <span key={a} className="font-kufi text-[11px] text-ivory-400 bg-ink-900/70 border border-ivory-700/20 rounded px-2 py-0.5">{a}</span>
                    ))}
                  </div>
                  <div className="mt-auto pt-4 flex items-center gap-2">
                    <button
                      onClick={() => playQueue(q, 0)}
                      className="btn-press flex-1 inline-flex items-center justify-center gap-2 font-kufi text-sm font-bold text-ink-900 bg-gradient-to-b from-gold-300 to-gold-600 rounded-md py-2.5 shadow-[var(--shadow-gold)]"
                    >
                      <IcPlay className="w-4 h-4" />
                      {s.status === "مكتملة" ? "استمع للسلسلة" : `تابِع الدرس ${toAr(s.done + 1)}`}
                    </button>
                    <FavBtn id={s.id} favs={favs} toggle={toggleFav} />
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ==================================================================
   ٣) الردود العلمية — هيئة الوثيقة
================================================================== */
export function RaddSection() {
  const { favs, toggleFav } = usePlayer();
  return (
    <section id="radd" className="relative py-16 md:py-24 parchment-bg">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeader
          light
          eyebrow="وثائقُ الردود"
          title="الردود العلمية"
          sub="دعوى في سطر، وردٌّ موثَّق في سطور — على طريقة أهل العلم في النقض والتحرير."
        />
        <div className="grid md:grid-cols-3 gap-7 md:gap-6">
          {rudud.map((r, i) => (
            <Reveal key={r.id} delay={i * 130}>
              <article
                id={r.id}
                className={`paper-card orn-frame relative rounded-[4px] p-6 pt-7 h-full flex flex-col transition-transform duration-500 hover:rotate-0 hover:-translate-y-2 ${
                  i % 2 ? "rotate-1" : "-rotate-1"
                }`}
                style={{ transformOrigin: "center" }}
              >
                {/* طيّة الورقة */}
                <span className="absolute top-0 left-0 w-9 h-9 bg-gradient-to-br from-transparent from-50% to-[#c9b588] to-50% border-l border-b border-[#b39a67]/60" style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }} aria-hidden="true" />
                {/* الختم */}
                <svg viewBox="0 0 80 80" className="stamp absolute -top-3 left-8 w-16 h-16 text-madder-500/75" fill="none" stroke="currentColor" aria-hidden="true">
                  <circle cx="40" cy="40" r="34" strokeWidth="2.5" />
                  <circle cx="40" cy="40" r="27" strokeWidth="1.2" strokeDasharray="3 4" />
                  <path d="M40 22l4.6 12L57 29.4l-4.6 12L64.8 46l-12.4 4.6L57 63l-12.4-4.6L40 70.8l-4.6-12.4L23 63l4.6-12.4L15.2 46l12.4-4.6L23 29.4l12.4 4.6z" strokeWidth="1.4" />
                  <text x="40" y="45" textAnchor="middle" className="font-kufi" fontSize="11" fontWeight="700" fill="currentColor" stroke="none">رُدّ</text>
                </svg>

                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="font-kufi text-xs font-bold text-madder-700 border border-madder-500/50 bg-madder-500/10 rounded px-2.5 py-1">{r.stage}</span>
                  <span className="font-naskh text-xs text-olive-700">{r.hijri}</span>
                </div>

                <p className="font-naskh font-bold text-lg leading-relaxed text-ink-800">
                  <span className="bg-[linear-gradient(transparent_62%,rgba(168,67,47,0.32)_0)]">{r.claim}</span>
                </p>
                <p className="font-naskh text-xs text-madder-700/90 mt-2">{r.claimer}</p>

                <div className="my-4 flex items-center gap-2 text-olive-500" aria-hidden="true">
                  <span className="h-px flex-1 bg-olive-500/30" />
                  <svg viewBox="0 0 12 12" className="w-2 h-2" fill="currentColor"><path d="M6 0l1.4 4.6L12 6l-4.6 1.4L6 12 4.6 7.4 0 6l4.6-1.4z" /></svg>
                  <span className="h-px flex-1 bg-olive-500/30" />
                </div>

                <p className="font-naskh text-[15px] leading-loose text-[#3c3325] flex-1">{r.reply}</p>

                <div className="mt-5 pt-4 border-t border-[#b39a67]/40 flex items-center justify-between">
                  <button className="btn-press font-kufi text-sm font-bold text-madder-700 hover:text-madder-500 inline-flex items-center gap-2">
                    قراءة الردّ كاملًا
                    <IcArrow className="w-4 h-4" />
                  </button>
                  <FavBtn id={r.id} favs={favs} toggle={toggleFav} />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==================================================================
   ٤) الفتاوى — سؤال وجواب قابل للطي
================================================================== */
export function FatwaSection() {
  const [open, setOpen] = useState<string | null>(fatawa[0].id);
  const { favs, toggleFav } = usePlayer();
  const { push } = useToast();

  return (
    <section id="fatwa" className="relative py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6 grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-14 items-start">
        <div className="lg:sticky lg:top-28">
          <SectionHeader
            eyebrow="اسألوا أهل الذكر"
            title="الفتاوى والأسئلة"
            sub="أسئلةُ الناس كما وردت، وأجوبةُ الشيخ كما حُرِّرت — تُفتح هنا في الصفحة دون مغادرتها."
          />
          <Reveal delay={200}>
            <div className="orn-frame relative bg-olive-900/60 border border-olive-500/25 rounded-lg p-6">
              <p className="font-naskh leading-loose text-ivory-300 text-[15px]">
                «فَاسْأَلُوا أَهْلَ الذِّكْرِ إِنْ كُنْتُمْ لَا تَعْلَمُونَ» — بابُ السؤال مفتوح،
                وتُرَتَّب الأسئلةُ حسب الأولوية العلمية، ويصلك الجوابُ بإذن الله.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <button onClick={() => push("يصل سؤالُك كمسودّة فتوى لفضيلته — نسخة العرض")} className="btn-press font-kufi text-sm font-bold text-olive-300 border border-olive-500/40 hover:bg-olive-500/15 rounded-md px-5 py-2.5 transition-colors">
                  أرسل سؤالك
                </button>
                <span className="font-naskh text-xs text-ivory-600">يصل كمسودّة لفضيلته</span>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="space-y-3.5">
          {fatawa.map((f, i) => {
            const on = open === f.id;
            return (
              <Reveal key={f.id} delay={i * 100}>
                <div
                  id={f.id}
                  className={`rounded-md border overflow-hidden transition-colors duration-400 ${
                    on ? "border-gold-500/45 bg-ink-800/90 shadow-[0_18px_50px_-20px_rgba(0,0,0,.7)]" : "border-ivory-700/15 bg-ink-850/70 hover:border-gold-500/25"
                  }`}
                >
                  <button
                    onClick={() => setOpen(on ? null : f.id)}
                    className="w-full flex items-center gap-4 px-5 py-4 text-right"
                    aria-expanded={on}
                  >
                    <span className={`shrink-0 w-10 h-10 grid place-items-center rounded-full font-ruqaa text-xl transition-all duration-400 ${on ? "bg-gold-400 text-ink-900 shadow-[0_0_18px_rgba(224,194,126,.45)]" : "bg-ink-700 text-gold-400 border border-gold-500/30"}`}>
                      س
                    </span>
                    <span className={`flex-1 font-naskh font-semibold text-[15px] md:text-base leading-relaxed transition-colors ${on ? "text-gold-200" : "text-ivory-200"}`}>
                      {f.q}
                    </span>
                    <IcChevD className={`w-5 h-5 shrink-0 text-gold-400 transition-transform duration-400 ${on ? "rotate-180" : ""}`} />
                  </button>
                  <div className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.22,.9,.3,1)]" style={{ gridTemplateRows: on ? "1fr" : "0fr" }}>
                    <div className="overflow-hidden">
                      <div className="px-5 pb-5">
                        <div className="gold-hair mb-4" />
                        <div className="flex gap-3.5">
                          <span className="shrink-0 w-10 h-10 grid place-items-center rounded-full bg-olive-700 text-olive-300 font-ruqaa text-xl border border-olive-500/40">ج</span>
                          <p className="font-naskh text-[15px] leading-[2.1] text-ivory-300 pt-1.5">{f.a}</p>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <Chip tone="gold">{f.topic}</Chip>
                            <span className="font-naskh text-xs text-ivory-600">{f.hijri}</span>
                          </div>
                          <FavBtn id={f.id} favs={favs} toggle={toggleFav} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}


