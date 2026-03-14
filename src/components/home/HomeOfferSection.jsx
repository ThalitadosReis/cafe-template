import { CoffeeIcon, LeafIcon, UsersIcon } from "@phosphor-icons/react";
import Reveal from "../Reveal.jsx";
import CtaLink from "../ui/CtaLink.jsx";
import SectionTextBlock from "../ui/SectionTextBlock.jsx";

const OFFER_ICONS = [CoffeeIcon, LeafIcon, UsersIcon];

export default function HomeOfferSection({ copy }) {
  return (
    <section className="overflow-hidden bg-taupe-200 py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-20 text-center">
          <Reveal>
            <SectionTextBlock label={copy.tag} title={copy.h2} />
          </Reveal>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {copy.items.map((item, index) => {
            const Icon = OFFER_ICONS[index];
            return (
              <Reveal key={item.title} delay={index * 0.1}>
                <div className="h-full rounded-2xl bg-taupe-50 p-8">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-taupe-200">
                    <Icon size={20} className="text-taupe-500" />
                  </div>
                  <h3 className="mb-3 font-display text-2xl font-light text-taupe-900">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-taupe-700">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.3} className="mt-14 text-center">
          <CtaLink to="/menu" variant="outline">
            {copy.cta}
          </CtaLink>
        </Reveal>
      </div>
    </section>
  );
}
