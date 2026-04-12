import { useEffect, useState } from "react";
import { getInitialMenu, getMenu } from "../data/menu.js";
import Reveal from "../components/Reveal.jsx";
import PageHero from "../components/ui/PageHero.jsx";
import { useLang } from "../i18n/LangContext.jsx";

export default function MenuPage() {
  const [menu, setMenu] = useState(() => getInitialMenu());
  const { lang, t } = useLang();
  const c = t.menuPage;

  useEffect(() => {
    let active = true;
    const refreshMenu = () => {
      getMenu().then((nextMenu) => {
        if (active) setMenu(nextMenu);
      });
    };

    refreshMenu();
    window.addEventListener("boldbrew:menuUpdated", refreshMenu);

    return () => {
      active = false;
      window.removeEventListener("boldbrew:menuUpdated", refreshMenu);
    };
  }, []);

  return (
    <main className="min-h-screen bg-taupe-50">
      <PageHero
        tag={c.tag}
        title={c.title}
        src="https://images.pexels.com/photos/4790063/pexels-photo-4790063.jpeg?w=1400&q=85"
        alt="Barista at work"
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <section className="space-y-14 py-16">
          {menu.map((category, catIdx) => (
            <Reveal key={category.id} delay={catIdx * 0.04}>
              <article>
                {/* header */}
                <div className="mb-6 flex items-center gap-4">
                  <span className="font-mono text-xs uppercase tracking-[0.3em] text-taupe-500">
                    {String(catIdx + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-display text-3xl font-light italic text-taupe-900 md:text-4xl">
                    {category.label[lang] ?? category.label.en}
                  </h2>
                  <div className="h-px flex-1 bg-taupe-200" />
                </div>

                {/* items */}
                <div className="grid grid-cols-1 gap-x-12 md:grid-cols-2">
                  {category.items.map((item, i) => (
                    <Reveal key={item.id} delay={i * 0.03}>
                      <div className="flex items-baseline justify-between gap-6 border-b border-taupe-200 py-5">
                        <div className="min-w-0">
                          <p className="font-display text-lg font-light text-taupe-900">
                            {item.name[lang] ?? item.name.en}
                          </p>
                          <p className="mt-0.5 font-body text-xs font-light leading-relaxed text-taupe-600">
                            {item.desc[lang] ?? item.desc.en}
                          </p>
                        </div>
                        <span className="shrink-0 font-mono text-sm font-light text-taupe-500">
                          CHF {parseFloat(item.price).toFixed(2)}
                        </span>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </section>
      </div>
    </main>
  );
}
