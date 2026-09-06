import { articles, books, diary, khutbahs, lectures, toAr } from "../lib/data";
import {
  Chip, DownloadBtn, FavBtn, IcPlay, IcQuill, IslamicPlate, Reveal,
  SectionHeader, useToast,
} from "../lib/kit";
import { MiniTrack, usePlayer, type Track } from "./Player";

const khutbahQueue: Track[] = khutbahs.map((k) => ({
  id: k.id, title: k.title, sub: `${k.mosque} — ${k.hijri}`,
  variant: k.variant, palette: k.palette, dur: k.minutes * 60,
}));

const lectureQueue: Track[] = lectures.map((l) => ({
  id: l.id, title: l.title, sub: `${l.venue} — ${l.hijri}`,
  variant: l.variant, palette: l.palette, dur: l.minutes * 60,
}));

/* ==================================================================
   ٥) الخطب — بطاقات عريضة بشريط تشغيل عامل
================================================================== */
export function KhutbahSection() {
  const { favs, toggleFav } = usePlayer();
  return (
    <section id="khutbah" className="relative py-16 md:py-20 bg-gradient-to-b from-transparent via-ink-850/60 to-transparent">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeader
          eyebrow="منبر الجمعة"
          title="الخطب"
          sub="خطب الجمعة والعيدين — استمع من البطاقة مباشرة، أو نزّل الصوت بلا فتح الصفحة."
        />
        <div className="grid lg:grid-cols-2 gap-6">
          {khutbahs.map((k, i) => (
            <Reveal key={k.id} delay={(i % 2) * 120 + Math.floor(i / 2) * 60}>
              <article id={k.id} className="orn-frame card-lift group flex h-full bg-ink-800/80 border border-ivory-700/15 hover:border-gold-500/40 rounded-lg overflow-hidden">
                <div className="relative w-32 md:w-44 shrink-0">
                  <IslamicPlate variant={k.variant} palette={k.palette} className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-l from-ink-800/80 to-transparent" />
                </div>
                <div className="flex-1 p-5 flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Chip tone="gold">{k.topic}</Chip>
                    <span className="font-kufi text-[11px] text-ivory-500">{toAr(k.minutes)} دقيقة</span>
                  </div>
                  <h3 className="mt-2.5 font-kufi font-bold text-lg md:text-xl text-ivory-100 group-hover:text-gold-300 transition-colors leading-snug">
                    {k.title}
                  </h3>
                  <p className="mt-1.5 font-naskh text-[13px] text-ivory-500">
                    {k.mosque} · <span className="text-gold-400/90">{k.hijri}</span>
                  </p>
                  <p className="mt-2.5 font-naskh text-sm leading-relaxed text-ivory-400">{k.excerpt}</p>
                  <div className="mt-auto pt-4 space-y-3">
                    <MiniTrack track={khutbahQueue[i]} list={khutbahQueue} index={i} />
                    <div className="flex items-center justify-between">
                      <DownloadBtn label="تحميل الصوت" />
                      <FavBtn id={k.id} favs={favs} toggle={toggleFav} />
                    </div>
                  </div>
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
   ٦) المقالات — تخطيط مجلة
================================================================== */
export function ArticlesSection() {
  const { favs, toggleFav } = usePlayer();
  const { push } = useToast();
  const main = articles[0];
  const rest = articles.slice(1);

  return (
    <section id="articles" className="relative py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeader
          eyebrow="مدادُ الأقلام"
          title="المقالات العلمية"
          sub="تأصيلات ومعالجات مكتوبة — المقال الرئيس في الواجهة، والبقية في فهرس مرقّم."
        />
        <div className="grid lg:grid-cols-5 gap-6">
          {/* المقال الرئيس */}
          <Reveal className="lg:col-span-3">
            <article id={main.id} className="orn-frame card-lift group h-full bg-ink-800/80 border border-ivory-700/15 hover:border-gold-500/40 rounded-lg overflow-hidden flex flex-col">
              <div className="relative h-56 md:h-72 overflow-hidden">
                <IslamicPlate variant={main.variant} palette={main.palette} className="w-full h-full transition-transform duration-[1.2s] group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/30 to-transparent" />
                <div className="absolute bottom-4 right-5 left-5 flex items-center gap-2 flex-wrap">
                  <Chip tone="gold">{main.topic}</Chip>
                  <Chip tone="olive">{toAr(main.readMin)} دقائق قراءة</Chip>
                  <span className="font-naskh text-xs text-ivory-400">{main.hijri}</span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-kufi font-bold text-xl md:text-2xl text-ivory-50 group-hover:text-gold-300 transition-colors leading-relaxed">
                  {main.title}
                </h3>
                <p className="mt-3 font-naskh text-[15px] leading-loose text-ivory-400">{main.excerpt}</p>
                <div className="mt-auto pt-5 flex items-center gap-3">
                  <button
                    onClick={() => push(`«${main.title}» — يفتح في وضع القارئ (نسخة العرض)`)}
                    className="btn-press inline-flex items-center gap-2 font-kufi text-sm font-bold text-ink-900 bg-gradient-to-b from-gold-300 to-gold-600 rounded-md px-5 py-2.5 shadow-[var(--shadow-gold)]"
                  >
                    اقرأ المقال
                  </button>
                  <DownloadBtn label="PDF" />
                  <span className="flex-1" />
                  <FavBtn id={main.id} favs={favs} toggle={toggleFav} />
                </div>
              </div>
            </article>
          </Reveal>

          {/* الفهرس المرقّم */}
          <div className="lg:col-span-2 flex flex-col">
            {rest.map((a, i) => (
              <Reveal key={a.id} delay={120 + i * 110} className="flex-1">
                <button
                  id={a.id}
                  onClick={() => push(`«${a.title}» — يفتح في وضع القارئ (نسخة العرض)`)}
                  className="orn-frame group w-full h-full text-right flex items-center gap-5 bg-ink-850/70 border border-ivory-700/12 hover:border-gold-500/35 rounded-lg px-5 py-4 transition-all duration-300 hover:bg-ink-800/80"
                >
                  <span className="font-kufi font-bold text-4xl md:text-5xl text-ivory-700/50 group-hover:text-gold-500/80 transition-colors leading-none select-none">
                    {toAr(String(i + 1).padStart(2, "0"))}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-naskh font-semibold text-[15px] text-ivory-200 group-hover:text-gold-200 transition-colors leading-relaxed">
                      {a.title}
                    </span>
                    <span className="mt-1.5 flex items-center gap-2 flex-wrap">
                      <Chip tone={i % 2 ? "lapis" : "olive"}>{a.topic}</Chip>
                      <span className="font-naskh text-[11px] text-ivory-600">{a.readMin.toLocaleString("ar-EG")} د قراءة · {a.hijri}</span>
                    </span>
                  </span>
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-ivory-700 group-hover:text-gold-400 group-hover:-translate-x-1 transition-all shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M14 6l-6 6 6 6" />
                  </svg>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==================================================================
   ٧) المكتبة — رفّ كتب بأغلفة هندسية
================================================================== */
export function LibraryShelf() {
  const { favs, toggleFav } = usePlayer();
  const { push } = useToast();
  return (
    <section id="library" className="relative py-16 md:py-20 bg-gradient-to-b from-transparent via-lapis-900/25 to-transparent">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeader
          eyebrow="الرفّ العالي"
          title="المكتبة"
          sub="مصنَّفات الشيخ وبحوثه وتحقيقاته — بأغلفةٍ من الهندسة الإسلامية، وبتحميلٍ مباشر من الرفّ."
        />
      </div>
      <div className="relative">
        <div className="flex gap-7 md:gap-9 overflow-x-auto no-scrollbar snap-x px-4 md:px-[max(1rem,calc((100vw-80rem)/2+1.5rem))] pt-2">
          {books.map((b, i) => (
            <Reveal key={b.id} delay={i * 90} className="snap-start shrink-0 w-40 md:w-44">
              <div id={b.id} className="group">
                <button
                  onClick={() => push(`«${b.title}» — صفحة الكتاب (نسخة العرض)`)}
                  className="orn-frame card-lift relative block w-full aspect-[2/3] rounded-[3px] overflow-hidden text-right hover:-translate-y-2 hover:-rotate-1"
                  aria-label={`فتح كتاب ${b.title}`}
                >
                  <IslamicPlate variant={b.variant} palette={b.palette} className="absolute inset-0 w-full h-full" />
                  {/* كعب الكتاب */}
                  <span className="absolute inset-y-0 right-0 w-[7px] bg-black/40" />
                  <span className="absolute inset-y-0 right-[7px] w-px bg-white/15" />
                  <span className="absolute top-2 left-2">
                    <Chip tone={b.kind === "مطبوع" ? "gold" : b.kind === "مخطوط" ? "lapis" : "olive"}>{b.kind}</Chip>
                  </span>
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/95 via-ink-950/60 to-transparent pt-10 pb-3 px-3">
                    <span className="block font-kufi font-bold text-[13px] leading-relaxed text-ivory-50">{b.title}</span>
                  </span>
                </button>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between font-naskh text-[11px] text-ivory-500">
                    <span>{toAr(b.pages)} صفحة · {b.yearH}هـ</span>
                    {b.downloads > 0 && <span className="text-gold-400/90">{toAr(b.downloads)} تحميل</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    {b.kind === "مطبوع" ? (
                      <DownloadBtn label="PDF" />
                    ) : (
                      <span className="font-kufi text-xs text-ivory-600 border border-dashed border-ivory-700/40 rounded-[5px] px-4 py-2">
                        {b.kind === "مخطوط" ? "قيد التحقيق" : "قريبًا بإذن الله"}
                      </span>
                    )}
                    <FavBtn id={b.id} favs={favs} toggle={toggleFav} className="w-9 h-9" />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        {/* لوح الرفّ */}
        <div className="mx-4 md:mx-[max(1rem,calc((100vw-80rem)/2+1.5rem))] mt-1 h-3.5 rounded-[3px] bg-gradient-to-b from-[#5a4326] via-[#46331e] to-[#2b1f10] shadow-[0_22px_38px_-12px_rgba(0,0,0,.75)]" aria-hidden="true" />
        <div className="mx-4 md:mx-[max(1rem,calc((100vw-80rem)/2+1.5rem))] h-1 bg-black/30 blur-[2px]" aria-hidden="true" />
      </div>
    </section>
  );
}

/* ==================================================================
   ٨) المحاضرات — خط زمني بالتاريخ الهجري
================================================================== */
export function LecturesTimeline() {
  const { playQueue, track, playing, toggle } = usePlayer();
  return (
    <section id="lectures" className="relative py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeader
          eyebrow="لقاءاتٌ ومجالس"
          title="المحاضرات"
          sub="محاضرات ولقاءات مفردة على خطٍّ زمنيٍّ هجري — الأحدث في الأعلى."
        />
        <div className="relative">
          <span className="absolute right-[21px] md:right-1/2 md:translate-x-1/2 top-2 bottom-6 w-px bg-gradient-to-b from-gold-500/50 via-gold-500/20 to-transparent" aria-hidden="true" />
          <div className="space-y-9">
            {lectures.map((l, i) => {
              const active = track?.id === l.id;
              return (
                <Reveal key={l.id} delay={i * 80}>
                  <div className="relative md:grid md:grid-cols-2 md:gap-16">
                    {/* العقدة النجمية */}
                    <span className={`absolute right-[10px] md:right-1/2 md:translate-x-1/2 top-2 grid place-items-center w-6 h-6 ${active ? "text-gold-300" : "text-gold-500"}`}>
                      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden="true">
                        <path d="M12 1l2.5 6.5L21 5l-2.5 6.5L25 12l-6.5 2.5L21 21l-6.5-2.5L12 25l-2.5-6.5L3 21l2.5-6.5L-1 12l6.5-2.5L3 5l6.5 2.5z" transform="scale(0.92) translate(1,0)" />
                      </svg>
                      {active && playing && (
                        <span className="absolute inset-0 rounded-full border border-gold-400" style={{ animation: "pulseRing 1.6s ease-out infinite" }} />
                      )}
                    </span>
                    <div className={`pr-14 md:pr-0 ${i % 2 ? "md:col-start-2" : "md:col-start-1"}`}>
                      <article id={l.id} className={`orn-frame card-lift group flex gap-4 bg-ink-800/80 border border-ivory-700/15 hover:border-gold-500/40 rounded-lg p-4 ${i % 2 ? "" : "md:flex-row-reverse md:text-left"}`}>
                        <div className="relative w-24 h-24 md:w-28 md:h-28 shrink-0 rounded-md overflow-hidden border border-gold-500/20">
                          <IslamicPlate variant={l.variant} palette={l.palette} className="w-full h-full transition-transform duration-700 group-hover:scale-110" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-kufi text-[11px] font-semibold text-gold-300 border border-gold-500/40 bg-gold-500/10 rounded px-2 py-0.5">
                              {l.hijri}
                            </span>
                            <Chip tone="lapis">{l.topic}</Chip>
                            <span className="font-kufi text-[11px] text-ivory-500">{toAr(l.minutes)} د</span>
                          </div>
                          <h3 className="mt-2 font-kufi font-bold text-lg text-ivory-100 group-hover:text-gold-300 transition-colors leading-snug">{l.title}</h3>
                          <p className="mt-1 font-naskh text-[13px] text-ivory-500">{l.venue}</p>
                          <div className="mt-3 flex items-center gap-2.5">
                            <button
                              onClick={() => (active ? toggle() : playQueue(lectureQueue, i))}
                              className={`btn-press inline-flex items-center gap-2 font-kufi text-xs font-bold rounded-full px-4 py-2 transition-colors ${
                                active && playing
                                  ? "bg-gold-400 text-ink-900 shadow-[0_0_16px_rgba(224,194,126,.5)]"
                                  : "border border-gold-500/40 text-gold-300 hover:bg-gold-500/10"
                              }`}
                            >
                              <IcPlay className="w-3.5 h-3.5" />
                              {active && playing ? "يُشغَّل الآن" : "استمع"}
                            </button>
                            <DownloadBtn label="الصوت" />
                          </div>
                        </div>
                      </article>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==================================================================
   ٩) اليوميات — خواطر كثيفة بلا صور
================================================================== */
export function DiarySection() {
  const { favs, toggleFav } = usePlayer();
  return (
    <section id="diary" className="relative py-16 md:py-20 bg-gradient-to-b from-transparent via-olive-900/25 to-transparent">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeader
          eyebrow="خواطرُ القلم"
          title="اليوميات"
          sub="كلمات قصيرة تُكتب على هامش الأيام — بلا صور ولا تكلّف."
        />
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [&>*]:mb-5">
          {diary.map((d, i) => (
            <Reveal key={d.id} delay={(i % 3) * 110} className="break-inside-avoid">
              <article id={d.id} className="card-lift group relative bg-ink-850/85 border border-ivory-700/15 hover:border-gold-500/40 rounded-md p-5 overflow-hidden">
                <span className="absolute -top-4 right-3 font-ruqaa text-6xl text-gold-500/15 select-none leading-none" aria-hidden="true">«</span>
                <div className="flex items-center gap-2 text-gold-400/90 mb-3">
                  <IcQuill className="w-4 h-4" />
                  <span className="font-kufi text-[11px] font-semibold">{d.hijri}</span>
                </div>
                <p className="relative font-naskh text-[15px] leading-[2.05] text-ivory-300">{d.text}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="h-px flex-1 bg-gradient-to-l from-gold-500/30 to-transparent" />
                  <FavBtn id={d.id} favs={favs} toggle={toggleFav} className="w-8 h-8 mr-3" />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
