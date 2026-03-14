import Reveal from "../Reveal.jsx";
import { InstagramLogoIcon } from "@phosphor-icons/react";
import SectionTextBlock from "../ui/SectionTextBlock.jsx";

const INSTAGRAM_URL = "https://instagram.com";
const GALLERY_PHOTOS = [
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80",
  "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=600&q=80",
  "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=80",
  "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=600&q=80",
];

export default function HomeGallerySection({ copy }) {
  return (
    <section className="overflow-hidden py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-12 flex flex-col justify-between md:flex-row md:items-end">
          <Reveal>
            <SectionTextBlock label={copy.tag} title={copy.h2} />
          </Reveal>
          <Reveal delay={0.1}>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border-b border-dashed border-taupe-400 pb-1 font-ui text-[11px] uppercase tracking-[0.2em] text-taupe-700 transition-colors duration-300 hover:text-taupe-500"
            >
              <InstagramLogoIcon size={14} />
              {copy.cta}
            </a>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {GALLERY_PHOTOS.map((src, index) => (
            <Reveal key={index} delay={index * 0.07}>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group block aspect-square overflow-hidden rounded-2xl"
              >
                <img
                  src={src}
                  alt={copy.photoAlts?.[index] ?? `Gallery ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
