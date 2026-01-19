"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export function DigitalRain() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (reduce || !mounted) return null;

  // Generate columns for digital rain
  const columns = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    left: (i * 100) / 30,
    delay: Math.random() * 5,
    speed: 2 + Math.random() * 3,
    chars: Array.from({ length: 20 }).map(() => 
      String.fromCharCode(0x30A0 + Math.random() * 96)
    ),
  }));

  return (
    <div className="fixed inset-0 pointer-events-none opacity-30 -z-10 overflow-hidden">
      {columns.map((col) => (
        <motion.div
          key={col.id}
          className="absolute top-0 text-xs font-mono text-cyan-400/40"
          style={{
            left: `${col.left}%`,
            writingMode: "vertical-rl",
            textOrientation: "upright",
          }}
          initial={{ y: "-100%", opacity: 0 }}
          animate={{
            y: "200%",
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: col.speed,
            delay: col.delay,
            repeat: Infinity,
            repeatDelay: Math.random() * 2,
            ease: "linear",
          }}
        >
          {col.chars.join("")}
        </motion.div>
      ))}
    </div>
  );
}
