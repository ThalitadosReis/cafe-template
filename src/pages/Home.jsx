import { useRef, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowDownIcon,
  CoffeeIcon,
  InstagramLogoIcon,
  LeafIcon,
  PauseIcon,
  PlayIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import Reveal from "../components/Reveal.jsx";
import { useLang } from "../i18n/LangContext.jsx";
import CtaLink from "../components/ui/CtaLink.jsx";
import SectionTextBlock from "../components/ui/SectionTextBlock.jsx";
import { GALLERY_PHOTOS } from "../data/galleryPhotos.js";

export default function Home() {
  const { t: lang } = useLang();
  const t = lang.home;
  const h = t.hero;
  const a = t.about;
  const o = t.offer;
  const g = t.gallery;
  const c = t.contact;

  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    if (playing) {
      video.pause();
      setPlaying(false);
      return;
    }

    video.play();
    setPlaying(true);
  };

  const offerIcons = [CoffeeIcon, LeafIcon, UsersIcon];

  return (
    <main className="bg-taupe-100 min-h-screen">
      {/* hero */}
      <section className="relative flex min-h-screen flex-col justify-center overflow-hidden">
        {/* gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,var(--color-taupe-300)_0%,var(--color-taupe-50)_60%)]" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 pb-24 pt-32 lg:grid-cols-2 lg:px-12">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6 font-ui text-xs uppercase tracking-[0.4em] text-taupe-500"
            >
              {h.tag}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                delay: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mb-6 whitespace-pre-line font-display text-6xl font-light text-taupe-900 lg:text-7xl xl:text-8xl"
            >
              {h.h1}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mb-8 max-w-sm font-ui text-[15px] font-light leading-relaxed text-taupe-600 lg:text-base"
            >
              {h.sub}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.75 }}
            >
              <CtaLink to="/menu" variant="dark">
                {h.cta}
              </CtaLink>
            </motion.div>
          </div>

          {/* hero image/video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block"
          >
            <div
              className="relative w-full select-none"
              style={{ height: "600px" }}
            >
              <motion.div
                className="absolute left-1/2 top-10 z-10 h-117 w-117 -translate-x-[42%] cursor-pointer overflow-hidden rounded-full shadow-[0_20px_60px_rgba(60,46,31,0.25)]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                onClick={toggleVideo}
                role="button"
                tabIndex={0}
                aria-label={playing ? h.pauseVideo : h.playVideo}
                onKeyDown={(e) => e.key === "Enter" && toggleVideo()}
              >
                <video
                  ref={videoRef}
                  src="https://www.pexels.com/download/video/9046229/"
                  className="h-full w-full object-cover"
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />
                <div className="pointer-events-none absolute inset-0 bg-taupe-700/20" />
              </motion.div>

              <motion.button
                type="button"
                className="absolute"
                style={{ zIndex: 20, bottom: 65, left: "50%" }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
                onClick={toggleVideo}
                aria-label={playing ? h.pauseVideo : h.playVideo}
              >
                <motion.div
                  className="flex items-center gap-3 rounded-full bg-taupe-50 px-4 py-1 text-[11px] uppercase tracking-[0.2em] shadow-lg backdrop-blur-sm"
                  animate={playing ? { scale: 0.95 } : { scale: 1 }}
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-taupe-900">
                    {playing ? (
                      <PauseIcon
                        size={14}
                        weight="fill"
                        className="text-taupe-50"
                      />
                    ) : (
                      <PlayIcon
                        size={14}
                        weight="fill"
                        className="ml-0.5 text-taupe-50"
                      />
                    )}
                  </div>
                  <span className="text-[10px] font-ui text-taupe-700">
                    {playing ? h.nowPlaying : h.watchVideo}
                  </span>
                </motion.div>
              </motion.button>

              <motion.div
                className="absolute overflow-hidden rounded-full border-3 border-taupe-100"
                style={{
                  width: 110,
                  height: 110,
                  top: 24,
                  right: 20,
                  zIndex: 12,
                  boxShadow: "0 8px 24px rgba(60,46,31,0.18)",
                }}
                initial={{ opacity: 0, scale: 0.7, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <img
                  src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=85"
                  alt={g.photoAlts?.[0] ?? "Coffee"}
                  className="h-full w-full object-cover"
                />
              </motion.div>

              <motion.div
                className="absolute overflow-hidden rounded-full border-3 border-taupe-100"
                style={{
                  width: 130,
                  height: 130,
                  bottom: 150,
                  left: 15,
                  zIndex: 11,
                  boxShadow: "0 8px 28px rgba(60,46,31,0.15)",
                }}
                initial={{ opacity: 0, scale: 0.7, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
              >
                <img
                  src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=85"
                  alt={g.photoAlts?.[3] ?? "Cafe"}
                  className="h-full w-full object-cover"
                />
              </motion.div>

              <motion.svg
                className="pointer-events-none absolute text-taupe-500"
                style={{ bottom: 60, left: 30, zIndex: 5 }}
                width="80"
                height="70"
                viewBox="0 0 80 70"
                fill="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                <motion.path
                  d="M 70 10 C 40 10, 10 30, 20 60 M 12 52 L 20 62 L 28 54"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  opacity="0.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 1.1, ease: "easeInOut" }}
                />
              </motion.svg>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        >
          <span className="font-ui text-[9px] uppercase tracking-[0.3em] text-taupe-500">
            {h.scroll}
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            <ArrowDownIcon size={14} className="text-taupe-500" />
          </motion.div>
        </motion.div>
      </section>

      {/* about */}
      <section className="py-32 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid items-center gap-20 lg:grid-cols-2">
            <Reveal direction="right" className="relative">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=700&q=85"
                  alt={a.interiorAlt}
                  className="relative z-10 aspect-square w-full rounded-full object-cover"
                />
              </div>
            </Reveal>

            <Reveal direction="left" delay={0.15}>
              <SectionTextBlock
                label={a.tag}
                title={a.h2}
                body={a.p1}
                body2={a.p2}
                showDivider
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* what we offer */}
      <section className="py-32 bg-taupe-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <Reveal>
              <SectionTextBlock label={o.tag} title={o.h2} />
            </Reveal>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {o.items.map((item, i) => {
              const Icon = offerIcons[i];
              return (
                <Reveal key={item.title} delay={i * 0.1}>
                  <div className="h-full rounded-2xl bg-taupe-50 p-8">
                    <div className="w-12 h-12 rounded-full bg-taupe-200 flex items-center justify-center mb-2">
                      <Icon size={20} className="text-taupe-500" />
                    </div>
                    <h3 className="mb-3 font-display text-2xl font-light text-taupe-900">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-taupe-700">
                      {item.desc}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.3} className="text-center mt-14">
            <CtaLink to="/menu" variant="outline">
              {o.cta}
            </CtaLink>
          </Reveal>
        </div>
      </section>

      {/* gallery */}
      <section className="py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <Reveal>
              <SectionTextBlock
                label={g.tag}
                title={g.h2}
                labelClassName="mb-3 text-xs tracking-[0.25em]"
                titleClassName="mb-0 text-4xl md:text-5xl"
              />
            </Reveal>

            <Reveal delay={0.1}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-ui text-taupe-700 border-b border-dashed border-taupe-400 pb-1 hover:text-taupe-500 transition-colors duration-300"
              >
                <InstagramLogoIcon size={14} />
                {g.cta}
              </a>
            </Reveal>
          </div>

          {/* image grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {GALLERY_PHOTOS.map((src, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block aspect-square overflow-hidden rounded-2xl group"
                >
                  <img
                    src={src}
                    alt={g.photoAlts?.[i] ?? `Gallery ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* contact */}
      <section className="py-32 bg-taupe-200 relative overflow-hidden ">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative text-center">
          <Reveal>
            <SectionTextBlock
              label={c.tag}
              title={c.h2}
              body={c.sub}
              bodyClassName="mb-8"
            />
          </Reveal>
          <CtaLink to="/contact" variant="accent">
            {c.cta}
          </CtaLink>
        </div>
      </section>
    </main>
  );
}
