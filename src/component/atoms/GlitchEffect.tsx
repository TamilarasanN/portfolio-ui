"use client";

import { motion, useReducedMotion } from "framer-motion";

interface GlitchEffectProps {
  children: React.ReactNode;
  intensity?: "low" | "medium" | "high";
  trigger?: "hover" | "always" | "random";
}

export function GlitchEffect({ 
  children, 
  intensity = "medium",
  trigger = "random" 
}: GlitchEffectProps) {
  const reduce = useReducedMotion();
  
  if (reduce) return <>{children}</>;

  const intensityMap = {
    low: { offset: 1, blur: 0 },
    medium: { offset: 2, blur: 1 },
    high: { offset: 3, blur: 2 },
  };

  const config = intensityMap[intensity];

  return (
    <motion.div
      className="relative inline-block"
      animate={
        trigger === "always" || trigger === "random"
          ? {
              x: [0, -config.offset, config.offset, -config.offset, 0],
              textShadow: [
                "0 0 0 transparent",
                `-${config.offset}px 0 0 rgba(59,130,246,0.8)`,
                `${config.offset}px 0 0 rgba(168,85,247,0.8)`,
                `-${config.offset}px 0 0 rgba(59,130,246,0.8)`,
                "0 0 0 transparent",
              ],
              clipPath: [
                "inset(0 0 0 0)",
                "inset(20% 0 60% 0)",
                "inset(60% 0 20% 0)",
                "inset(20% 0 60% 0)",
                "inset(0 0 0 0)",
              ],
            }
          : {}
      }
      transition={{
        duration: 0.3,
        repeat: trigger === "always" ? Infinity : 0,
        repeatDelay: trigger === "random" ? 3 + Math.random() * 4 : 0.5,
        ease: "linear",
      }}
      whileHover={
        trigger === "hover"
          ? {
              x: [0, -config.offset, config.offset, -config.offset, 0],
              textShadow: [
                "0 0 0 transparent",
                `-${config.offset}px 0 0 rgba(59,130,246,0.8)`,
                `${config.offset}px 0 0 rgba(168,85,247,0.8)`,
                "0 0 0 transparent",
              ],
            }
          : {}
      }
    >
      {/* Glitch overlay layers */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-0"
        animate={
          trigger === "always" || trigger === "random"
            ? {
                opacity: [0, 1, 0, 1, 0],
                x: [0, -config.offset * 2, config.offset * 2, -config.offset * 2, 0],
              }
            : {}
        }
        transition={{
          duration: 0.3,
          repeat: trigger === "always" ? Infinity : 0,
          repeatDelay: trigger === "random" ? 3 + Math.random() * 4 : 0.5,
        }}
        style={{
          background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.5), transparent)",
          mixBlendMode: "screen",
        }}
      />
      {children}
    </motion.div>
  );
}
