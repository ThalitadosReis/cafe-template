import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import { useLang } from "../i18n/LangContext.jsx";

const ADMIN_CLICKS = 5;
const ADMIN_TIMEOUT = 3000;
const DARK_HERO_PATHS = ["/", "/menu", "/contact"];

function Brand({ brand, subBrand, dark = false }) {
  return (
    <div className="flex flex-col leading-none">
      <span
        className={`font-display text-xl font-light uppercase tracking-[0.15em] ${dark ? "text-taupe-100" : "text-taupe-900"}`}
      >
        {brand}
      </span>
      <span
        className={`font-body text-[9px] font-light uppercase tracking-[0.35em] ${dark ? "text-taupe-400" : "text-taupe-500"}`}
      >
        {subBrand}
      </span>
    </div>
  );
}

export default function Navbar() {
  const { t, lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const clickTimerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isDarkHero =
    DARK_HERO_PATHS.includes(location.pathname) && !scrolled && !open;

  const navLinks = [
    { to: "/", label: t.nav.home },
    { to: "/menu", label: t.nav.menu },
    { to: "/contact", label: t.nav.contact },
  ];

  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  const linkCls = (path) => {
    const active = isActive(path);
    return `font-body text-[11px] uppercase tracking-[0.22em] ${
      active
        ? `transition-colors duration-500 ${isDarkHero ? "text-taupe-100 border-b border-taupe-100 pb-px" : "text-taupe-900 border-b border-taupe-900 pb-px"}`
        : `nav-underline ${isDarkHero ? "text-taupe-400 hover:text-taupe-100" : "text-taupe-600 hover:text-taupe-900"}`
    }`;
  };

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

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const handleNav = useCallback(() => {
    setOpen(false);
    scrollToTop();
  }, [scrollToTop]);

  const handleLangToggle = useCallback(() => {
    setOpen(false);
    setLang((l) => (l === "en" ? "de" : "en"));
  }, [setLang]);

  const handleLogoClick = useCallback(
    (e) => {
      handleNav();
      const next = clickCount + 1;
      if (next >= ADMIN_CLICKS) {
        e.preventDefault();
        setClickCount(0);
        clearTimeout(clickTimerRef.current);
        navigate("/admin");
        scrollToTop();
        return;
      }
      setClickCount(next);
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = setTimeout(() => setClickCount(0), ADMIN_TIMEOUT);
    },
    [clickCount, handleNav, navigate, scrollToTop],
  );

  useEffect(() => () => clearTimeout(clickTimerRef.current), []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled || open
            ? "border-b border-taupe-200 bg-taupe-50/95 backdrop-blur-sm"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-12">
          {/* logo */}
          <Link
            to="/"
            onClick={handleLogoClick}
            className="flex select-none flex-col leading-none"
          >
            <Brand
              brand={t.nav.brand}
              subBrand={t.nav.subBrand}
              dark={isDarkHero}
            />
          </Link>

          {/* desktop nav */}
          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={handleNav}
                className={linkCls(link.to)}
              >
                {link.label}
              </Link>
            ))}

            <div className="flex items-center gap-3">
              <span
                className={`select-none text-[11px] transition-colors duration-500 ${isDarkHero ? "text-taupe-600" : "text-taupe-300"}`}
              >
                |
              </span>
              <button
                onClick={handleLangToggle}
                className={`nav-underline font-body text-[11px] uppercase tracking-[0.22em] ${isDarkHero ? "text-taupe-400 hover:text-taupe-100" : "text-taupe-600 hover:text-taupe-900"}`}
              >
                {lang === "en" ? "DE" : "EN"}
              </button>
            </div>
          </div>

          {/* mobile toggle */}
          <button
            className={`transition-colors duration-500 md:hidden ${isDarkHero ? "text-taupe-200 hover:text-taupe-100" : "text-taupe-600 hover:text-taupe-900"}`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
          >
            <ListIcon size={22} />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.aside
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -24, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-70 flex flex-col overflow-hidden md:hidden"
            >
              {/* bg image */}
              <div className="absolute inset-0">
                <img
                  src="https://images.pexels.com/photos/4792698/pexels-photo-4792698.jpeg?w=1200&q=85"
                  alt=""
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-taupe-900/80" />
              </div>

              {/* header */}
              <div className="relative z-10 flex h-20 items-center justify-between px-6">
                <Brand brand={t.nav.brand} subBrand={t.nav.subBrand} dark />
                <button
                  onClick={() => setOpen(false)}
                  className="text-taupe-400 transition-colors duration-300 hover:text-taupe-100"
                  aria-label={t.nav.closeMenu}
                >
                  <XIcon size={20} />
                </button>
              </div>

              {/* links */}
              <nav className="relative z-10 flex flex-1 flex-col items-center justify-center gap-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.08 + i * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Link
                      to={link.to}
                      onClick={handleNav}
                      className={`block py-2 text-center font-display text-2xl font-light transition-colors duration-300 ${
                        isActive(link.to)
                          ? "text-taupe-100"
                          : "text-taupe-500 hover:text-taupe-100"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                {/* language */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.08 + navLinks.length * 0.08,
                  }}
                  className="mt-5 flex flex-col items-center gap-4"
                >
                  <div className="h-px w-8 bg-taupe-600/60" />
                  <button
                    onClick={handleLangToggle}
                    className="flex items-center gap-2 font-body text-[11px] uppercase tracking-[0.25em]"
                  >
                    <span
                      className={
                        lang === "en"
                          ? "text-taupe-100"
                          : "text-taupe-500 hover:text-taupe-300 transition-colors"
                      }
                    >
                      EN
                    </span>
                    <span className="text-taupe-500">·</span>
                    <span
                      className={
                        lang === "de"
                          ? "text-taupe-100"
                          : "text-taupe-500 hover:text-taupe-300 transition-colors"
                      }
                    >
                      DE
                    </span>
                  </button>
                </motion.div>
              </nav>

              {/* footer */}
              <div className="relative z-10 border-t border-taupe-700/60 px-6 py-6">
                <p className="mb-1.5 font-body text-[9px] uppercase tracking-[0.25em] text-taupe-500">
                  {t.nav.getInTouch}
                </p>
                <a
                  href="mailto:hello@boldbrew.ch"
                  className="font-body text-sm text-taupe-300 transition-colors duration-300 hover:text-taupe-100"
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
