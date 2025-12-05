import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Award } from "lucide-react";
import { Achievement } from "@/types";

interface AchievementModalProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export function AchievementModal({ achievement, onClose }: AchievementModalProps) {
  useEffect(() => {
    if (achievement) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="terminal-card border-foreground p-8 max-w-sm mx-4 text-center relative"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Achievement badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-24 h-24 mx-auto mb-4 rounded-full bg-foreground/10 border-2 border-foreground flex items-center justify-center"
            >
              <span className="text-5xl">{achievement.icon}</span>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1 flex items-center justify-center gap-2">
                <Award className="w-4 h-4" />
                Achievement Unlocked!
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {achievement.name}
              </h3>
              <p className="text-muted-foreground text-sm">
                {achievement.description}
              </p>
            </motion.div>

            {/* Particles effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-sm">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    opacity: 0,
                    x: "50%",
                    y: "50%",
                    scale: 0,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    x: `${50 + (Math.random() - 0.5) * 150}%`,
                    y: `${50 + (Math.random() - 0.5) * 150}%`,
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    delay: 0.3 + i * 0.05,
                    duration: 1,
                    ease: "easeOut",
                  }}
                  className="absolute w-2 h-2 bg-foreground rounded-full"
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
