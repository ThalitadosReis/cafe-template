import Reveal from "../Reveal.jsx";
import Label from "../ui/Label.jsx";

export default function TestimonialsSection({ copy }) {
  return (
    <section className="bg-taupe-100 py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <Reveal className="mb-12 text-center">
          <Label label={copy.tag} title={copy.h2} center />
        </Reveal>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          {copy.items.map((item, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <figure className="flex h-full flex-col justify-between border border-taupe-200 bg-taupe-50 p-8">
                <blockquote>
                  <span className="mb-4 block font-display text-5xl font-light leading-none text-taupe-300">
                    "
                  </span>
                  <p className="font-display text-lg font-light italic leading-relaxed text-taupe-700">
                    {item.quote}
                  </p>
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-3 border-t border-taupe-200 pt-6">
                  <div>
                    <p className="font-body text-sm font-medium text-taupe-900">
                      {item.name}
                    </p>
                    <p className="font-body text-[11px] uppercase tracking-[0.18em] text-taupe-500">
                      {item.source}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
