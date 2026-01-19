"use client";

import { useEffect } from "react";

/**
 * Console welcome message with easter egg hints
 * Only shows once per session
 */
export function ConsoleWelcome() {
  useEffect(() => {
    // Only log once per session
    const hasShownWelcome = sessionStorage.getItem("console-welcome-shown");
    if (hasShownWelcome) return;

    // Delay to ensure console is ready
    const timer = setTimeout(() => {
      console.log(
        "%c🎮 Welcome to the OASIS Portfolio",
        "color: #38bdf8; font-size: 16px; font-weight: bold; padding: 4px;"
      );
      console.log(
        "%c🔍 There are hidden easter eggs waiting to be discovered...",
        "color: #a855f7; font-size: 12px; padding: 2px;"
      );
      console.log(
        "%c💡 Hints: Try typing the theme word, Alt+Click headings, or triple-click the timeline dot",
        "color: #22c55e; font-size: 11px; font-style: italic; padding: 2px;"
      );
      console.log(
        "%cBuilt with Next.js, TypeScript, and Framer Motion",
        "color: #94a3b8; font-size: 10px; padding: 2px;"
      );
      
      sessionStorage.setItem("console-welcome-shown", "true");
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
