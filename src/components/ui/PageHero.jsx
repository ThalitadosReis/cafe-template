import { motion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1];

export default function PageHero({ tag, title, sub, src, alt }) {
  return (
    <section className="relative flex min-h-[56vh] flex-col pt-20 md:min-h-[48vh]">
      <div className="absolute inset-0">
        <img src={src} alt={alt} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-taupe-900/65" />
      </div>

      <div className="relative z-10 flex flex-1 items-end">
        <div className="mx-auto w-full max-w-7xl px-6 pb-14 lg:px-12">
          {tag && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
              className="font-body font-medium text-[10px] uppercase tracking-[0.35em] text-taupe-400 mb-2"
            >
              {tag}
            </motion.p>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: EASE }}
            className="font-display font-light italic leading-[1.05] text-taupe-100"
            style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
          >
            {title}
          </motion.h1>
          {sub && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
              className="mt-4 max-w-sm font-body text-sm font-light leading-relaxed text-taupe-400"
            >
              {sub}
            </motion.p>
          )}
        </div>
      </div>
    </section>
  );
}
