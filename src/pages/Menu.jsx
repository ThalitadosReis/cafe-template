import { useEffect, useState } from "react";
import { getMenu } from "../data/menu.js";
import Reveal from "../components/Reveal.jsx";
import SectionTextBlock from "../components/ui/SectionTextBlock.jsx";
import { useLang } from "../i18n/LangContext.jsx";

export default function MenuPage() {
  const { lang, t } = useLang();
  const copy = t.menuPage;
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    let active = true;

    getMenu().then((nextMenu) => {
      if (active) setMenu(nextMenu);
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const handler = () => {
      getMenu().then((nextMenu) => setMenu(nextMenu));
    };
    window.addEventListener("boldbrew:menuUpdated", handler);
    return () => window.removeEventListener("boldbrew:menuUpdated", handler);
  }, []);

  return (
    <main className="min-h-screen bg-taupe-50 pt-24">
      <section className="relative overflow-hidden py-20">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
          <Reveal>
            <SectionTextBlock
              label={copy.tag}
              title={copy.title}
              titleClassName="mb-8 text-6xl lg:text-8xl"
            />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex items-center gap-4">
              <div className="h-px w-16 bg-taupe-500" />
              <span className="font-ui text-[10px] uppercase tracking-[0.2em] text-taupe-600">
                {copy.location}
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-7xl space-y-12 px-6 lg:px-12">
          {menu.map((category, catIdx) => (
            <Reveal key={category.id} delay={catIdx * 0.04}>
              <article>
                <div className="mb-7 flex items-center gap-4">
                  <span className="font-ui text-[11px] tabular-nums text-taupe-500">
                    {String(catIdx + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-display text-3xl font-light text-taupe-900 md:text-4xl">
                    {category.label[lang] ?? category.label.en}
                  </h2>
                  <div className="h-px flex-1 self-center bg-taupe-300" />
                </div>

                <div className="grid grid-cols-1 gap-x-12 md:grid-cols-2">
                  {category.items.map((item, i) => (
                    <Reveal key={item.id} delay={i * 0.03}>
                      <div className="flex items-baseline justify-between gap-4 border-b border-taupe-300 py-5">
                        <div className="min-w-0">
                          <p className="font-ui text-sm font-medium leading-snug text-taupe-900">
                            {item.name[lang] ?? item.name.en}
                          </p>
                          <p className="mt-1 font-ui text-xs leading-relaxed text-taupe-600">
                            {item.desc[lang] ?? item.desc.en}
                          </p>
                        </div>
                        <span className="shrink-0 whitespace-nowrap font-ui text-xs font-semibold uppercase tracking-[0.12em] text-taupe-700">
                          CHF {parseFloat(item.price).toFixed(2)}
                        </span>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
