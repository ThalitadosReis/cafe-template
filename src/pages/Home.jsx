import { useLang } from "../i18n/LangContext.jsx";
import Hero from "../components/home/Hero.jsx";
import OfferSection from "../components/home/OfferSection.jsx";
import AboutSection from "../components/home/AboutSection.jsx";
import GallerySection from "../components/home/GallerySection.jsx";
import TestimonialsSection from "../components/home/TestimonialsSection.jsx";
import ContactSection from "../components/home/ContactSection.jsx";

export default function Home() {
  const { t: lang } = useLang();
  const c = lang.home;

  return (
    <main className="min-h-screen bg-taupe-50">
      <Hero copy={c.hero} />
      <OfferSection copy={c.offer} />
      <AboutSection copy={c.about} />
      <GallerySection copy={c.gallery} />
      <TestimonialsSection copy={c.testimonials} />
      <ContactSection copy={c.contact} />
    </main>
  );
}
