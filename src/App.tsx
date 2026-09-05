import { useEffect, useState } from "react";
import BackgroundFX from "./components/BackgroundFX";
import { AccountSheet, Footer, Header, MobileNav, SECTION_IDS, SearchOverlay } from "./components/Chrome";
import { PlayerProvider } from "./components/Player";
import { FatwaSection, Hero, RaddSection, SeriesRail } from "./components/SectionsA";
import { ArticlesSection, DiarySection, KhutbahSection, LecturesTimeline, LibraryShelf } from "./components/SectionsB";
import { ToastProvider } from "./lib/kit";

/* شريط تقدّم القراءة الذهبي */
function ReadingProgress() {
  useEffect(() => {
    const bar = document.getElementById("reading-progress");
    if (!bar) return;
    const on = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? (h.scrollTop / max) * 100 : 0;
      bar.style.width = `${p}%`;
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);
  return <div id="reading-progress" />;
}

/* تتبّع القسم النشط للرأس وشريط الجوال */
function useActiveSection(): string {
  const [active, setActive] = useState("home");
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-38% 0px -55% 0px", threshold: 0 },
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return active;
}

function Site() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const active = useActiveSection();

  const mobileActive = searchOpen ? "search" : accountOpen ? "account" : active;

  return (
    <div className="relative min-h-screen">
      <BackgroundFX />
      <ReadingProgress />

      <Header active={active} onSearch={() => setSearchOpen(true)} onAccount={() => setAccountOpen(true)} />

      <main className="relative z-10">
        <Hero />
        <SeriesRail />
        <RaddSection />
        <FatwaSection />
        <KhutbahSection />
        <ArticlesSection />
        <LibraryShelf />
        <LecturesTimeline />
        <DiarySection />
      </main>

      <Footer />

      <MobileNav active={mobileActive} onSearch={() => setSearchOpen(true)} onAccount={() => setAccountOpen(true)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <AccountSheet open={accountOpen} onClose={() => setAccountOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <PlayerProvider>
        <Site />
      </PlayerProvider>
    </ToastProvider>
  );
}
