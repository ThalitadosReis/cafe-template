import { motion } from 'motion/react'

/**
 * <Reveal> — scroll-triggered entrance animation via motion/react
 *
 * Props:
 *   direction  'up' | 'down' | 'left' | 'right'  (default: 'up')
 *   delay      number in seconds                  (default: 0)
 *   duration   number in seconds                  (default: 0.7)
 *   distance   pixels to travel                   (default: 36)
 *   once       animate only the first time        (default: true)
 *   threshold  viewport fraction before trigger   (default: 0.12)
 *   className  forwarded to wrapper div
 *   children
 */
export default function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.7,
  distance = 36,
  once = true,
  threshold = 0.12,
  className = '',
}) {
  const offset = {
    up:    { y:  distance },
    down:  { y: -distance },
    left:  { x:  distance },
    right: { x: -distance },
  }[direction] ?? { y: distance }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount: threshold }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // expo out — fast-settle, feels snappy
      }}
    >
      {children}
    </motion.div>
  )
}
