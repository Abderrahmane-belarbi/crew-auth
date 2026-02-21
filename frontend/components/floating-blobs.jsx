import { motion } from "framer-motion";

export default function FloatingBlobs({
  color,
  size,
  top,
  left,
  delay = 0,
  duration = 28,
  opacity = 0.12,
  blur = "blur-3xl",
  animateX = [0, 100, 0],
  animateY = [0, 80, 0],
  animateRotation = [0, 12, 0],
}) {
  return (
    <motion.div
      className={`absolute rounded-full ${color} ${size} ${blur}`}
      style={{ top, left, opacity }}
      animate={{ x: animateX, y: animateY, rotate: animateRotation }}
      transition={{
        duration,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror",
        delay,
      }}
      aria-hidden="true"
    />
  );
}
