import Reveal from "../Reveal.jsx";
import SectionTextBlock from "../ui/SectionTextBlock.jsx";

export default function HomeAboutSection({ copy }) {
  return (
    <section className="overflow-hidden py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid items-center gap-20 lg:grid-cols-2">
          <Reveal direction="right">
            <img
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=700&q=85"
              alt={copy.interiorAlt}
              className="aspect-square w-full rounded-full object-cover"
            />
          </Reveal>

          <Reveal direction="left" delay={0.15}>
            <SectionTextBlock
              label={copy.tag}
              title={copy.h2}
              body={copy.p1}
              body2={copy.p2}
              showDivider
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
