import { InstagramLogoIcon } from "@phosphor-icons/react";
import Reveal from "../Reveal.jsx";
import Label from "../ui/Label.jsx";

const GALLERY_PHOTOS = [
  "https://images.pexels.com/photos/4792692/pexels-photo-4792692.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/4792693/pexels-photo-4792693.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/4790072/pexels-photo-4790072.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/4790054/pexels-photo-4790054.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/4787608/pexels-photo-4787608.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/4790057/pexels-photo-4790057.jpeg?auto=compress&cs=tinysrgb&w=800",
];

export default function GallerySection({ copy }) {
  return (
    <section className="bg-taupe-50 py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <Label label={copy.tag} title={copy.h2} />
          </Reveal>
          <Reveal delay={0.1}>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border-b border-dashed border-taupe-400 pb-1 font-body text-[11px] uppercase tracking-[0.2em] text-taupe-700 transition-colors duration-300 hover:text-taupe-500"
            >
              <InstagramLogoIcon size={16} />
              {copy.cta}
            </a>
          </Reveal>
        </div>

        <Reveal threshold={0.05}>
          <div className="grid grid-cols-2 gap-2 md:hidden">
            {GALLERY_PHOTOS.map((src, index) => (
              <div key={src} className="relative">
                <img
                  src={src}
                  alt={copy.photoAlts?.[index] ?? `Gallery ${index + 1}`}
                  className="aspect-square w-full object-cover"
                />
                <div className="absolute inset-0 bg-taupe-900/45" />
              </div>
            ))}
          </div>

          <div className="hidden md:grid md:grid-cols-2 md:gap-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="relative col-span-2">
                <img
                  src={GALLERY_PHOTOS[0]}
                  alt={copy.photoAlts?.[0] ?? "Gallery 1"}
                  className="col-span-2 aspect-16/10 object-cover"
                />
                <div className="absolute inset-0 bg-taupe-900/45" />
              </div>
              <div className="relative">
                <img
                  src={GALLERY_PHOTOS[1]}
                  alt={copy.photoAlts?.[1] ?? "Gallery 2"}
                  className="aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-taupe-900/45" />
              </div>
              <div className="relative">
                <img
                  src={GALLERY_PHOTOS[2]}
                  alt={copy.photoAlts?.[2] ?? "Gallery 3"}
                  className="aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-taupe-900/45" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <img
                  src={GALLERY_PHOTOS[3]}
                  alt={copy.photoAlts?.[3] ?? "Gallery 4"}
                  className="aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-taupe-900/45" />
              </div>
              <div className="relative">
                <img
                  src={GALLERY_PHOTOS[4]}
                  alt={copy.photoAlts?.[4] ?? "Gallery 5"}
                  className="aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-taupe-900/45" />
              </div>
              <div className="relative col-span-2">
                <img
                  src={GALLERY_PHOTOS[5]}
                  alt={copy.photoAlts?.[5] ?? "Gallery 6"}
                  className="col-span-2 aspect-16/10 object-cover"
                />
                <div className="absolute inset-0 bg-taupe-900/45" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
