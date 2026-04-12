import Reveal from "../Reveal.jsx";
import Label from "../ui/Label.jsx";

export default function OfferSection({ copy }) {
  return (
    <section className="pb-32 pt-24 md:pt-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-12">
          <Reveal>
            <Label label={copy.tag} title={copy.h2} center />
          </Reveal>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:gap-2">
          {copy.items.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.1} className="flex-1">
              <div className="relative h-full overflow-hidden bg-taupe-200 px-10 py-12 lg:px-14 lg:py-16">
                <span className="pointer-events-none absolute -bottom-4 -right-2 select-none font-display text-[9rem] font-light leading-none tracking-tighter text-taupe-300/70">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mb-4 font-display text-2xl font-light leading-snug text-taupe-900 lg:text-3xl">
                  {item.title}
                </h3>
                <p className="font-body text-sm font-light leading-relaxed text-taupe-700">
                  {item.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
