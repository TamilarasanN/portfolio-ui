"use client";

import { useEffect, useState, useMemo } from "react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const OASIS_SEQUENCE = ["o", "a", "s", "i", "s"];
const SEQUENCE_TIMEOUT = 3000; // 3 seconds to complete sequence

export function useOasisEasterEgg() {
  const [sequence, setSequence] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showBreaking, setShowBreaking] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Show subtle hint after 60 seconds if user hasn't found it
  useEffect(() => {
    const timer = setTimeout(() => {
      if (sequence.length === 0 && !isActive) {
        setShowHint(true);
        // Hide hint after 10 seconds
        setTimeout(() => setShowHint(false), 10000);
      }
    }, 60000); // 60 seconds

    return () => clearTimeout(timer);
  }, [sequence.length, isActive]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      
      // Hide hint when user starts typing
      if (key && showHint) {
        setShowHint(false);
      }

      // Reset sequence if wrong key
      if (key !== OASIS_SEQUENCE[sequence.length]) {
        setSequence([]);
        return;
      }

      // Add to sequence
      const newSequence = [...sequence, key];
      setSequence(newSequence);

      // Check if sequence is complete
      if (newSequence.length === OASIS_SEQUENCE.length) {
        setIsActive(true);
        
        // Only trigger breaking animation on desktop (not mobile)
        const isMobile = window.innerWidth < 768;
        if (!isMobile) {
          setShowBreaking(true);
          document.body.classList.add("oasis-breaking");
          
          // Remove breaking class after animation
          setTimeout(() => {
            document.body.classList.remove("oasis-breaking");
            setShowBreaking(false);
          }, 2000);
        }
        
        // Show message (after breaking animation on desktop, immediately on mobile)
        setTimeout(() => {
          setShowMessage(true);
        }, isMobile ? 0 : 1500);

        // Hide message after 5 seconds
        setTimeout(() => {
          setShowMessage(false);
        }, 6500);

        // Reset after 7 seconds
        setTimeout(() => {
          setIsActive(false);
          setSequence([]);
        }, 7000);
      }
    };

    // Reset sequence if user stops typing
    const resetTimeout = setTimeout(() => {
      if (sequence.length > 0 && sequence.length < OASIS_SEQUENCE.length) {
        setSequence([]);
      }
    }, SEQUENCE_TIMEOUT);

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      clearTimeout(resetTimeout);
    };
  }, [sequence, showHint]);

  return { isActive, showMessage, showBreaking, showHint };
}

// Breaking particles for the animation
function BreakingParticles() {
  const particles = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / 30;
      const distance = 50 + Math.random() * 200;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      const size = 2 + Math.random() * 4;
      const delay = Math.random() * 0.5;
      return { id: i, x, y, size, delay };
    });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[10000] overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-cyan-400"
          style={{
            left: "50%",
            top: "50%",
            width: `${p.size}px`,
            height: `${p.size}px`,
            boxShadow: `0 0 ${p.size * 2}px rgba(56, 189, 248, 0.8)`,
          }}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            x: p.x,
            y: p.y,
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            delay: p.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

// Simple text effect (no glitch on mobile)
function GlitchText({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block">
      <span className="relative">{children}</span>
    </span>
  );
}

export function OasisEasterEgg() {
  const { showMessage, showBreaking, showHint } = useOasisEasterEgg();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      {/* Breaking animation overlay - Desktop only */}
      <AnimatePresence>
        {showBreaking && !isMobile && (
          <>
            <BreakingParticles />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="fixed inset-0 z-[9998] pointer-events-none"
              style={{
                background: "radial-gradient(circle at center, rgba(56, 189, 248, 0.4), transparent 70%)",
              }}
            />
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.5, 1],
                opacity: [0, 1, 0],
                rotate: [0, 180, 360],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center"
            >
              <div className="relative">
                <motion.div
                  className="text-6xl md:text-8xl font-bold"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    background: "linear-gradient(90deg, #38bdf8, #a855f7, #38bdf8, #22c55e, #38bdf8)",
                    backgroundSize: "300% 100%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 0 20px rgba(56, 189, 248, 0.8))",
                  }}
                >
                  OASIS
                </motion.div>
                <motion.div
                  className="absolute inset-0 blur-xl opacity-50"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{
                    background: "linear-gradient(90deg, #38bdf8, #a855f7, #38bdf8)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  OASIS
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Success message */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10001] pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="rounded-2xl border-2 border-cyan-400/50 bg-zinc-950/95 backdrop-blur-sm px-6 py-4 shadow-[0_0_40px_rgba(56,189,248,0.5)] relative overflow-hidden"
            >
              {/* Animated border glow */}
              <motion.div
                className="absolute -inset-[2px] rounded-2xl opacity-50"
                animate={{
                  background: [
                    "conic-gradient(from 0deg, rgba(56,189,248,0.8), rgba(168,85,247,0.8), rgba(56,189,248,0.8))",
                    "conic-gradient(from 180deg, rgba(56,189,248,0.8), rgba(168,85,247,0.8), rgba(56,189,248,0.8))",
                    "conic-gradient(from 360deg, rgba(56,189,248,0.8), rgba(168,85,247,0.8), rgba(56,189,248,0.8))",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                style={{ filter: "blur(8px)" }}
              />
              
              <div className="relative z-10">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center text-cyan-300 font-semibold text-sm md:text-base"
                >
                  <GlitchText>You found the OASIS.</GlitchText>
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-center text-cyan-400/70 text-xs md:text-sm mt-1"
                >
                  Built with intention.
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle hint for OASIS sequence */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[10000] pointer-events-none"
          >
            <div className="bg-zinc-950/90 border border-purple-400/30 rounded-lg px-4 py-2 text-xs text-purple-300 flex items-center gap-2 shadow-lg backdrop-blur-sm">
              <span>🔍</span>
              <span>Try typing the theme word...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
