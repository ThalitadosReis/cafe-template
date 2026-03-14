import Reveal from "../Reveal.jsx";
import CtaLink from "../ui/CtaLink.jsx";
import SectionTextBlock from "../ui/SectionTextBlock.jsx";

export default function HomeContactSection({ copy }) {
  return (
    <section className="relative overflow-hidden bg-taupe-200 py-32">
      <div className="relative mx-auto max-w-7xl px-6 text-center lg:px-12">
        <Reveal>
          <SectionTextBlock
            label={copy.tag}
            title={copy.h2}
            body={copy.sub}
            bodyClassName="mb-8"
          />
        </Reveal>
        <CtaLink to="/contact" variant="accent">
          {copy.cta}
        </CtaLink>
      </div>
    </section>
  );
}
