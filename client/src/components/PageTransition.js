import { motion } from "framer-motion";

const variants = {
  initial: {
    opacity: 0,
    y: 30,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -30,
  },
};

export default function PageTransition({ children }) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        duration: 0.45,
        ease: "easeInOut",
      }}
      style={{ width: "100%" }}
    >
      {children}
    </motion.div>
  );
}
