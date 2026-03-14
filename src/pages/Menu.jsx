import { useEffect, useState } from "react";
import { getInitialMenu, getMenu } from "../data/menu.js";
import Reveal from "../components/Reveal.jsx";
import SectionTextBlock from "../components/ui/SectionTextBlock.jsx";
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
    <main className="min-h-screen bg-taupe-50 pt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <section className="relative overflow-hidden py-20">
          <Reveal>
            <SectionTextBlock
              label={c.tag}
              title={c.title}
              titleClassName="text-6xl lg:text-8xl"
            />
          </Reveal>
        </section>

        <section className="pb-24 space-y-12">
            {menu.map((category, catIdx) => (
              <Reveal key={category.id} delay={catIdx * 0.04}>
                <article>
                  <div className="mb-4 flex items-center gap-4">
                    <span className="text-xs font-mono text-taupe-500">
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
                        <div className="flex items-baseline justify-between gap-4 border-b border-taupe-300 py-4">
                          <div className="min-w-0">
                            <p className="font-ui text-sm font-medium leading-snug text-taupe-900">
                              {item.name[lang] ?? item.name.en}
                            </p>
                            <p className="mt-1 font-ui text-xs leading-relaxed text-taupe-600">
                              {item.desc[lang] ?? item.desc.en}
                            </p>
                          </div>
                          <span className="font-mono text-sm font-semibold tracking-wider text-taupe-700">
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
