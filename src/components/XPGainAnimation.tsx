import { motion } from "framer-motion";

interface XPGainAnimationProps {
  xp: number;
}

export function XPGainAnimation({ xp }: XPGainAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0, scale: 0.5 }}
      animate={{ opacity: [0, 1, 1, 0], y: -60, scale: [0.5, 1.2, 1, 1] }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="absolute top-0 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
    >
      <div className="text-primary font-bold text-xl glow-text-green">
        +{xp} XP
      </div>
    </motion.div>
  );
}
