"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  velocity: number;
}

export function useClickParticleBurst() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdRef = useRef(0);

  const triggerBurst = (x: number, y: number) => {
    const newParticles: Particle[] = Array.from({ length: 12 }).map(() => ({
      id: particleIdRef.current++,
      x,
      y,
      angle: Math.random() * Math.PI * 2,
      velocity: 2 + Math.random() * 4,
    }));
    setParticles((prev) => [...prev, ...newParticles]);

    // Clean up after animation
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.includes(p)));
    }, 800);
  };

  return { particles, triggerBurst };
}

export function ClickParticleBurst({ particles }: { particles: Particle[] }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-[10000]">
      <AnimatePresence>
        {particles.map((particle) => {
          const distance = particle.velocity * 60;
          const endX = particle.x + Math.cos(particle.angle) * distance;
          const endY = particle.y + Math.sin(particle.angle) * distance;

          return (
            <motion.div
              key={particle.id}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: particle.x,
                top: particle.y,
                background: "radial-gradient(circle, rgba(56,189,248,0.9), rgba(168,85,247,0.7))",
                boxShadow: "0 0 10px rgba(56,189,248,0.8)",
              }}
              initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              animate={{
                opacity: [1, 0.8, 0],
                scale: [1, 1.5, 0.5],
                x: endX - particle.x,
                y: endY - particle.y,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
              }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}
