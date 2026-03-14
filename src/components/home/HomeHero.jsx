import { useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowDownIcon, PauseIcon, PlayIcon } from "@phosphor-icons/react";
import CtaLink from "../ui/CtaLink.jsx";

const HERO_EASE = [0.22, 1, 0.36, 1];
const POP_EASE = [0.16, 1, 0.3, 1];
const HERO_SHELL_CLASS =
  "relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 pb-24 pt-32 lg:grid-cols-2 lg:px-12";

function HeroMotion({
  as: Tag = motion.div,
  children,
  className = "",
  delay = 0,
  duration = 0.8,
  initial = { opacity: 0, y: 20 },
  animate = { opacity: 1, x: 0, y: 0, scale: 1 },
  transition,
  ...props
}) {
  return (
    <Tag
      initial={initial}
      animate={animate}
      transition={{
        duration,
        delay,
        ease: HERO_EASE,
        ...transition,
      }}
      className={className}
      {...props}
    >
      {children}
    </Tag>
  );
}

function FloatingPhoto({ src, alt, style, delay, initial }) {
  return (
    <HeroMotion
      className="absolute overflow-hidden rounded-full border-3 border-taupe-100"
      style={style}
      delay={delay}
      duration={0.9}
      initial={initial}
      transition={{ ease: POP_EASE }}
    >
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    </HeroMotion>
  );
}

export default function HomeHero({ copy, galleryCopy }) {
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

  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,var(--color-taupe-300)_0%,var(--color-taupe-50)_60%)]" />
      <div className={HERO_SHELL_CLASS}>
        <div>
          <HeroMotion
            as={motion.p}
            delay={0.2}
            className="mb-6 font-ui text-xs uppercase tracking-[0.4em] text-taupe-500"
          >
            {copy.tag}
          </HeroMotion>

          <HeroMotion
            as={motion.h1}
            delay={0.35}
            duration={1}
            initial={{ opacity: 0, y: 30 }}
            className="mb-6 whitespace-pre-line font-display text-6xl font-light text-taupe-900 lg:text-7xl xl:text-8xl"
          >
            {copy.h1}
          </HeroMotion>

          <HeroMotion
            as={motion.p}
            delay={0.6}
            className="mb-8 max-w-sm font-ui text-[15px] font-light leading-relaxed text-taupe-600 lg:text-base"
          >
            {copy.sub}
          </HeroMotion>

          <HeroMotion delay={0.75}>
            <CtaLink to="/menu" variant="dark">
              {copy.cta}
            </CtaLink>
          </HeroMotion>
        </div>

        <HeroMotion
          duration={1.2}
          delay={0.4}
          initial={{ opacity: 0, scale: 0.95 }}
          className="relative hidden lg:block"
        >
          <div
            className="relative w-full select-none"
            style={{ height: "600px" }}
          >
            <HeroMotion
              className="absolute left-1/2 top-10 z-10 h-117 w-117 -translate-x-[42%] cursor-pointer overflow-hidden rounded-full shadow-[0_20px_60px_rgba(60,46,31,0.25)]"
              delay={0.25}
              duration={1.1}
              initial={{ opacity: 0, scale: 0.9 }}
              transition={{ ease: POP_EASE }}
              onClick={toggleVideo}
              role="button"
              tabIndex={0}
              aria-label={playing ? copy.pauseVideo : copy.playVideo}
              onKeyDown={(e) => e.key === "Enter" && toggleVideo()}
            >
              <video
                ref={videoRef}
                src="https://www.pexels.com/download/video/6758573/"
                className="h-full w-full object-cover"
                loop
                muted
                playsInline
                preload="metadata"
              />
              <div className="pointer-events-none absolute inset-0 bg-taupe-900/20" />
            </HeroMotion>

            <HeroMotion
              as={motion.button}
              type="button"
              className="absolute"
              style={{ zIndex: 20, bottom: 65, left: "50%" }}
              delay={0.85}
              duration={0.6}
              initial={{ opacity: 0, y: 12 }}
              transition={{ ease: POP_EASE }}
              onClick={toggleVideo}
              aria-label={playing ? copy.pauseVideo : copy.playVideo}
            >
              <motion.div
                className="flex items-center gap-3 rounded-full bg-taupe-50 pl-2 pr-4 py-1 text-[11px] uppercase tracking-[0.2em] shadow-lg backdrop-blur-sm"
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
                  {playing ? copy.nowPlaying : copy.watchVideo}
                </span>
              </motion.div>
            </HeroMotion>

            <FloatingPhoto
              style={{
                width: 110,
                height: 110,
                top: 24,
                right: 20,
                zIndex: 12,
                boxShadow: "0 8px 24px rgba(60,46,31,0.18)",
              }}
              delay={0.55}
              initial={{ opacity: 0, scale: 0.7, y: -10 }}
              src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=85"
              alt={galleryCopy.photoAlts?.[0] ?? "Coffee"}
            />

            <FloatingPhoto
              style={{
                width: 130,
                height: 130,
                bottom: 150,
                left: 15,
                zIndex: 11,
                boxShadow: "0 8px 28px rgba(60,46,31,0.15)",
              }}
              delay={0.65}
              initial={{ opacity: 0, scale: 0.7, y: 10 }}
              src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=85"
              alt={galleryCopy.photoAlts?.[3] ?? "Cafe"}
            />

            <motion.svg
              className="pointer-events-none absolute text-taupe-500"
              style={{ bottom: 60, left: 30, zIndex: 5 }}
              width="80"
              height="70"
              viewBox="0 0 80 70"
              fill="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
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
        </HeroMotion>
      </div>

      <HeroMotion
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="font-ui text-[9px] uppercase tracking-[0.3em] text-taupe-500">
          {copy.scroll}
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          <ArrowDownIcon size={14} className="text-taupe-500" />
        </motion.div>
      </HeroMotion>
    </section>
  );
}
