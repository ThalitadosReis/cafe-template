import { motion } from "motion/react";
import CtaLink from "../ui/CtaLink.jsx";
import Label from "../ui/Label.jsx";
import { useLang } from "../../i18n/LangContext.jsx";
import { EASE } from "../../components/Reveal.jsx";

function FadeIn({
  as: Tag = motion.div,
  delay = 0,
  duration = 0.9,
  y = 20,
  className = "",
  children,
  ...props
}) {
  return (
    <Tag
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: EASE }}
      className={className}
      {...props}
    >
      {children}
    </Tag>
  );
}

export default function Hero({ copy }) {
  const { t } = useLang();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/4790059/pexels-photo-4790059.jpeg?w=1600&q=85"
          alt="Café atmosphere"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-taupe-900/65" />
      </div>

      <div className="relative z-10 flex min-h-[56vh] flex-col items-center justify-center px-6 pb-28 pt-32 text-center md:min-h-[48vh] md:pb-36">
        <FadeIn as={motion.div} delay={0.3} duration={1.1} y={36}>
          <Label
            as="h1"
            center
            tone="light"
            label={copy.tag}
            title={copy.h1}
            titleSize="hero"
          />
        </FadeIn>
      </div>

      <div className="relative z-10 bg-taupe-50 px-6 pb-8 md:pb-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
          className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="h-32 w-32 overflow-hidden">
            <img
              src="/boldbrew-logo.png"
              alt="BoldBrew logo"
              className="h-full w-full"
            />
          </div>
        </motion.div>

        {/* mobile */}
        <div className="flex flex-col items-center pt-20 md:hidden">
          <FadeIn delay={0.9}>
            <CtaLink to="/menu" variant="secondary" className="justify-center">
              {copy.cta}
            </CtaLink>
          </FadeIn>
        </div>

        {/* desktop */}
        <div className="mx-auto hidden items-end justify-between gap-12 md:flex">
          <FadeIn delay={0.9} className="flex flex-1 justify-end">
            <CtaLink
              to="/menu"
              variant="secondary"
              className="min-w-44 justify-center"
            >
              {copy.cta}
            </CtaLink>
          </FadeIn>

          <div className="h-16 w-32 shrink-0" aria-hidden="true" />

          <FadeIn delay={0.9} className="hidden flex-1 md:block">
            <CtaLink
              to="/contact"
              variant="outline"
              className="min-w-44 justify-center"
            >
              {t.nav.contact}
            </CtaLink>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
