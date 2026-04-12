import { motion } from "motion/react";

export const EASE = [0.22, 1, 0.36, 1];

export default function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  distance = 36,
  once = true,
  threshold = 0.12,
  className = "",
}) {
  const offset = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  }[direction] ?? { y: distance };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount: threshold }}
      transition={{
        duration,
        delay,
        ease: EASE,
      }}
    >
      {children}
    </motion.div>
  );
}
