import { useLang } from "../i18n/LangContext.jsx";
import HomeAboutSection from "../components/home/HomeAboutSection.jsx";
import HomeContactSection from "../components/home/HomeContactSection.jsx";
import HomeGallerySection from "../components/home/HomeGallerySection.jsx";
import HomeHero from "../components/home/HomeHero.jsx";
import HomeOfferSection from "../components/home/HomeOfferSection.jsx";

export default function Home() {
  const { t: lang } = useLang();
  const c = lang.home;

  return (
    <main className="min-h-screen bg-taupe-100">
      <HomeHero copy={c.hero} galleryCopy={c.gallery} />
      <HomeAboutSection copy={c.about} />
      <HomeOfferSection copy={c.offer} />
      <HomeGallerySection copy={c.gallery} />
      <HomeContactSection copy={c.contact} />
    </main>
  );
}
