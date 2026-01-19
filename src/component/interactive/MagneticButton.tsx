"use client";

import React, { useCallback, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "../utils";

interface MagneticButtonProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  variant?: "ghost" | "neon";
  ariaLabel?: string;
}

export function MagneticButton({
  className,
  children,
  onClick,
  href,
  target,
  rel,
  variant = "ghost",
  ariaLabel,
}: MagneticButtonProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null);
  const [xy, setXy] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      if (reduce) return;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const y = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      setXy({ x: x * 8, y: y * 8 });
    },
    [reduce]
  );

  const base =
    variant === "neon"
      ? "bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-purple-300 text-zinc-950 font-semibold shadow-[0_0_0_1px_rgba(255,255,255,0.14),0_18px_60px_-20px_rgba(56,189,248,0.55)]"
      : "border border-white/10 bg-white/5 text-white/80 hover:bg-white/10";

  const glowRamp =
    "relative overflow-hidden before:absolute before:inset-0 before:opacity-0 before:transition before:duration-300 before:bg-[radial-gradient(120px_90px_at_var(--mx)_var(--my),rgba(56,189,248,0.35),transparent_60%)] hover:before:opacity-100";

  const content = (
    <motion.div
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm cursor-pointer",
        glowRamp,
        base,
        className
      )}
      style={
        reduce
          ? undefined
          : ({
              transform: `translate3d(${xy.x}px, ${xy.y}px, 0)`,
              transition: hover ? "transform 80ms ease" : "transform 220ms ease",
            } as React.CSSProperties)
      }
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const mx = ((e.clientX - r.left) / r.width) * 100;
        const my = ((e.clientY - r.top) / r.height) * 100;
        (el as HTMLElement).style.setProperty("--mx", `${mx}%`);
        (el as HTMLElement).style.setProperty("--my", `${my}%`);
        onMove(e);
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setXy({ x: 0, y: 0 });
      }}
    >
      {children}
      <span className="pointer-events-none absolute -inset-10 opacity-40 blur-2xl bg-[conic-gradient(from_90deg,rgba(56,189,248,0.0),rgba(56,189,248,0.25),rgba(168,85,247,0.25),rgba(34,197,94,0.18),rgba(56,189,248,0.0))]" />
      
      {/* Holographic glitch effect on hover - minimal */}
      {!reduce && hover && (
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-xl opacity-0"
          animate={{
            opacity: [0, 0.1, 0],
            x: [0, -0.3, 0.3, 0],
          }}
          transition={{ duration: 0.2, repeat: 1 }}
          style={{
            background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.25), transparent)",
            mixBlendMode: "screen",
          }}
        />
      )}
    </motion.div>
  );

  if (href) {
    return (
      <a
        ref={(n) => { ref.current = n; }}
        href={href}
        target={target}
        rel={rel}
        className="inline-flex"
        aria-label={ariaLabel}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={(n) => { ref.current = n; }}
      type="button"
      onClick={onClick}
      className="inline-flex"
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
}
