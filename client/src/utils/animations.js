/**
 * Reusable Framer Motion animation variants.
 */

// Stagger container variant for animating child components sequentially
export const staggerContainer = (
  staggerChildren = 0.15,
  delayChildren = 0,
) => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

// Fade up and slide variant, commonly used for text, buttons, and cards
export const fadeUp = (duration = 0.5, yOffset = 25) => ({
  hidden: {
    opacity: 0,
    y: yOffset,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration,
    },
  },
});

// Clean fade-in variant (opacity only)
export const fadeIn = (duration = 0.5, delay = 0) => ({
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      type: "tween",
      ease: "easeOut",
      duration,
      delay,
    },
  },
});
