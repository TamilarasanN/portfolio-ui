"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Eye, Lightbulb } from "lucide-react";

/**
 * Subtle hints for easter eggs throughout the portfolio
 * These appear as small, tasteful UI elements that reward curiosity
 */
export function EasterEggHints() {
  const [hoveredDot, setHoveredDot] = useState(false);
  const [showKonamiHint, setShowKonamiHint] = useState(false);

  // Show konami hint after user has been on page for 30 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowKonamiHint(true);
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Hint for Timeline Deep Dive - appears as tooltip on hover over first dot */}
      <EasterEggTooltip
        visible={hoveredDot}
        message="Triple click me"
        icon={<Lightbulb className="h-3 w-3" />}
      />

      {/* Hint for OASIS sequence - subtle console message after time */}
      {showKonamiHint && (
        <SubtleKonamiHint />
      )}
    </>
  );
}

// Tooltip component for timeline dot hint
function EasterEggTooltip({ 
  visible, 
  message, 
  icon 
}: { 
  visible: boolean; 
  message: string; 
  icon: React.ReactNode;
}) {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="fixed z-[10004] pointer-events-none"
      style={{
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="bg-zinc-950/95 border border-cyan-400/30 rounded-lg px-3 py-2 text-xs text-cyan-300 flex items-center gap-2 shadow-lg backdrop-blur-sm">
        {icon}
        <span>{message}</span>
      </div>
    </motion.div>
  );
}

// Subtle hint in console for OASIS sequence
function SubtleKonamiHint() {
  useEffect(() => {
    // Only log once
    if (typeof window !== "undefined" && !window.localStorage.getItem("konami-hint-shown")) {
      console.log(
        "%c🔍 Easter Egg Hint",
        "color: #38bdf8; font-size: 14px; font-weight: bold;"
      );
      console.log(
        "%cTry typing a special word that represents this portfolio's theme...",
        "color: #a855f7; font-size: 12px;"
      );
      window.localStorage.setItem("konami-hint-shown", "true");
    }
  }, []);

  return null;
}

// Hook to expose hover state for timeline dot
export function useTimelineDotHint() {
  const [isHovered, setIsHovered] = useState(false);

  return {
    isHovered,
    setIsHovered,
    hoverProps: {
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
    },
  };
}
