import Reveal from "../Reveal.jsx";
import CtaLink from "../ui/CtaLink.jsx";
import Label from "../ui/Label.jsx";

export default function ContactSection({ copy }) {
  return (
    <section className="relative overflow-hidden bg-taupe-900 py-36">
      <div className="relative mx-auto max-w-7xl px-6 text-center lg:px-12">
        <Reveal>
          <Label
            center
            tone="light"
            label={copy.tag}
            title={copy.h2}
            body={copy.sub}
            titleSize="xl"
            titleClassName="mb-6 italic leading-[1.1]"
          />
        </Reveal>
        <Reveal delay={0.15} className="mt-8">
          <CtaLink to="/contact" variant="secondary">
            {copy.cta}
          </CtaLink>
        </Reveal>
      </div>
    </section>
  );
}
