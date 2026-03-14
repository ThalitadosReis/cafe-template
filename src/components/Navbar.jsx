import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ListIcon, XIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { useLang } from "../i18n/LangContext.jsx";
import CtaLink from "./ui/CtaLink.jsx";

const ADMIN_CLICKS = 5;
const ADMIN_TIMEOUT = 3000;

export default function Navbar() {
  const { t, lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const clickTimerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { to: "/", label: t.nav.home },
    { to: "/menu", label: t.nav.menu },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  const scrollToPageTop = useCallback(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const handleNavInteraction = useCallback(() => {
    setOpen(false);
    scrollToPageTop();
  }, [scrollToPageTop]);

  const handleLangToggle = useCallback(() => {
    setOpen(false);
    setLang((currentLang) => (currentLang === "en" ? "de" : "en"));
  }, [setLang]);

  const handleLogoClick = useCallback(
    (e) => {
      handleNavInteraction();
      const next = clickCount + 1;
      if (next >= ADMIN_CLICKS) {
        e.preventDefault();
        setClickCount(0);
        clearTimeout(clickTimerRef.current);
        navigate("/admin");
        scrollToPageTop();
        return;
      }

      setClickCount(next);
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = setTimeout(() => setClickCount(0), ADMIN_TIMEOUT);
    },
    [clickCount, handleNavInteraction, navigate, scrollToPageTop],
  );

  useEffect(
    () => () => {
      clearTimeout(clickTimerRef.current);
    },
    [],
  );

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
          scrolled || open
            ? "bg-taupe-100/95 backdrop-blur-sm"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-12">
          <Link
            to="/"
            onClick={handleLogoClick}
            className="flex select-none flex-col leading-none"
          >
            <span className="font-display text-xl font-light uppercase tracking-[0.15em] text-taupe-900">
              {t.nav.brand}
            </span>
            <span className="font-ui text-[9px] font-light uppercase tracking-[0.35em] text-taupe-500">
              {t.nav.subBrand}
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={handleNavInteraction}
                className={`text-[11px] uppercase tracking-[0.22em] transition-colors duration-300 ${
                  isActive(link.to)
                    ? "text-taupe-900"
                    : "text-taupe-600 hover:text-taupe-900"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <CtaLink
              to="/contact"
              onClick={handleNavInteraction}
              variant="outline"
              showIcon={false}
              className="px-6 py-2.5"
            >
              {t.nav.contact}
            </CtaLink>

            <button
              onClick={handleLangToggle}
              className="border-b border-dashed border-taupe-500 text-[11px] uppercase tracking-[0.22em] text-taupe-600 transition-colors duration-300 hover:text-taupe-900"
            >
              {lang === "en" ? "DE" : "EN"}
            </button>
          </div>

          <button
            className="text-taupe-700 transition-colors duration-300 hover:text-taupe-900 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
          >
            {open ? <XIcon size={22} /> : <ListIcon size={22} />}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-60 bg-taupe-900/45 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-70 flex flex-col bg-taupe-100 md:hidden"
            >
              <div className="flex h-20 items-center justify-between border-b border-taupe-300 px-6">
                <div className="flex flex-col leading-none">
                  <span className="font-display text-lg font-light uppercase tracking-[0.15em] text-taupe-900">
                    {t.nav.brand}
                  </span>
                  <span className="font-ui text-[9px] font-light uppercase tracking-[0.3em] text-taupe-500">
                    {t.nav.subBrand}
                  </span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-taupe-700 transition-colors duration-300 hover:text-taupe-900"
                  aria-label={t.nav.closeMenu}
                >
                  <XIcon size={22} />
                </button>
              </div>

              <nav className="flex flex-1 flex-col justify-center px-6">
                {[...navLinks, { to: "/contact", label: t.nav.contact }].map(
                  (link, i) => (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.08 + i * 0.07,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Link
                        to={link.to}
                        onClick={handleNavInteraction}
                        className={`group flex items-center justify-between border-b border-taupe-300 py-5 ${
                          isActive(link.to)
                            ? "text-taupe-900"
                            : "text-taupe-700 hover:text-taupe-900"
                        }`}
                      >
                        <span className="font-display text-2xl font-light">
                          {link.label}
                        </span>
                        <ArrowRightIcon
                          size={18}
                          className="text-taupe-500 transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </Link>
                    </motion.div>
                  ),
                )}

                <button
                  onClick={handleLangToggle}
                  className="mt-8 w-fit border-b border-dashed border-taupe-500 text-left text-xs uppercase tracking-[0.25em] text-taupe-600 transition-colors duration-300 hover:text-taupe-900"
                >
                  {lang === "en" ? "Deutsch" : "English"}
                </button>
              </nav>

              <div className="border-t border-taupe-300 px-6 py-6">
                <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-taupe-500">
                  {t.nav.getInTouch}
                </p>
                <a
                  href="mailto:hello@boldbrew.ch"
                  className="text-sm text-taupe-700 transition-colors duration-300 hover:text-taupe-900"
                >
                  {t.nav.contactEmail}
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
