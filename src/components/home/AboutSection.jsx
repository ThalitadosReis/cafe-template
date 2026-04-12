import { motion } from "motion/react";
import Reveal from "../Reveal.jsx";
import Label from "../ui/Label.jsx";

const EASE = [0.22, 1, 0.36, 1];

export default function AboutSection({ copy }) {
  return (
    <section className="relative overflow-hidden bg-taupe-200">
      <motion.div
        className="absolute inset-y-0 right-0 left-1/2 hidden lg:block"
        initial={{ opacity: 0, x: 48 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, delay: 0.2, ease: EASE }}
      >
        <img
          src="https://images.pexels.com/photos/4790046/pexels-photo-4790046.jpeg?w=1000&q=85"
          alt={copy.interiorAlt}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-taupe-900/45" />
      </motion.div>

      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid lg:grid-cols-2">
          <Reveal direction="left" className="py-32 lg:pr-16">
            <Label
              label={copy.tag}
              title={copy.h2}
              body={copy.p1}
              body2={copy.p2}
              showDivider
            />
          </Reveal>
          <div className="hidden lg:block" />
        </div>
      </div>

      <div className="relative h-80 overflow-hidden lg:hidden">
        <img
          src="https://images.pexels.com/photos/4790046/pexels-photo-4790046.jpeg?w=900&q=85"
          alt={copy.interiorAlt}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-taupe-900/45" />
      </div>
    </section>
  );
}
