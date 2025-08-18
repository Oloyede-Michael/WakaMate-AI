// components/PageTransition.jsx
import { motion } from "framer-motion";

export default function PageTransition({ children, direction = "vertical" }) {
  // vertical = top→bottom, horizontal = right→left
  const variants = {
    vertical: {
      initial: { y: "-100%", opacity: 0 },
      animate: { y: 0, opacity: 1, transition: { duration: 0.6 } },
      exit: { y: "100%", opacity: 0, transition: { duration: 0.6 } },
    },
    horizontal: {
      initial: { x: "100%", opacity: 0 },
      animate: { x: 0, opacity: 1, transition: { duration: 0.6 } },
      exit: { x: "-100%", opacity: 0, transition: { duration: 0.6 } },
    },
  };

  return (
    <motion.div
      initial={variants[direction].initial}
      animate={variants[direction].animate}
      exit={variants[direction].exit}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}
