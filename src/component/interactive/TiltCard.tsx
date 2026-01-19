"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "../utils";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  as?: "button" | "div";
}

export function TiltCard({ children, className, onClick, as }: TiltCardProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLButtonElement | HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [state, setState] = useState({ rx: 0, ry: 0, sx: 50, sy: 50, hover: false });
  const Element = onClick || as === "button" ? "button" : "div";

  const setFromEvent = (e: React.MouseEvent) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width; // 0..1
    const py = (e.clientY - r.top) / r.height;

    const ry = (px - 0.5) * 12; // tilt
    const rx = -(py - 0.5) * 12;

    const sx = px * 100;
    const sy = py * 100;

    // rAF to avoid over-rendering
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() =>
      setState((s) => ({ ...s, rx, ry, sx, sy }))
    );
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const transform = reduce
    ? undefined
    : `perspective(900px) rotateX(${state.rx}deg) rotateY(${state.ry}deg) translateZ(0)`;

  const baseClasses = cn(
    "relative text-left rounded-3xl border border-white/10 bg-white/5 p-5 transition tilt-card",
    "hover:bg-white/10 hover:shadow-[0_0_0_1px_rgba(56,189,248,0.35),0_30px_120px_-80px_rgba(168,85,247,0.65)]",
    (onClick || Element === "button") && "cursor-pointer",
    Element === "button" && "focus:outline-none focus:ring-2 focus:ring-cyan-300/40",
    className
  );

  const commonProps = {
    ref: ref as any,
    onMouseMove: setFromEvent,
    onMouseEnter: () => setState((s) => ({ ...s, hover: true })),
    onMouseLeave: () => setState({ rx: 0, ry: 0, sx: 50, sy: 50, hover: false }),
    className: baseClasses,
    style:
      reduce
        ? undefined
        : ({
            transform,
            transformStyle: "preserve-3d",
            transition: state.hover ? "transform 80ms ease" : "transform 220ms ease",
          } as React.CSSProperties),
  };

  return (
    <Element
      {...commonProps}
      {...(Element === "button" ? { type: "button", onClick } : {})}
    >
      {/* neon border pulse */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition duration-300 hover:opacity-100">
        <div className="absolute -inset-[1px] rounded-3xl bg-[conic-gradient(from_180deg,rgba(56,189,248,0.0),rgba(56,189,248,0.35),rgba(168,85,247,0.35),rgba(34,197,94,0.22),rgba(56,189,248,0.0))] blur-[10px]" />
      </div>

      {/* Holographic glitch on hover */}
      {!reduce && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-0"
          animate={state.hover ? {
            opacity: [0, 0.3, 0],
            x: [0, -2, 2, -2, 0],
          } : {}}
          transition={{ duration: 0.3, repeat: state.hover ? Infinity : 0, repeatDelay: 2 }}
          style={{
            background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.5), transparent)",
            mixBlendMode: "screen",
          }}
        />
      )}

      {/* moving neon sheen (tracks cursor) */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition duration-200"
        style={{
          opacity: state.hover ? 1 : 0,
          background:
            "radial-gradient(260px 220px at var(--x) var(--y), rgba(56,189,248,0.22), transparent 60%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl"
        style={
          reduce
            ? undefined
            : ({
                ["--x" as any]: `${state.sx}%`,
                ["--y" as any]: `${state.sy}%`,
              } as React.CSSProperties)
        }
      />

      {/* subtle inner shine */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(70%_60%_at_50%_0%,rgba(255,255,255,0.10),transparent_65%)]" />

      <div className="relative" style={reduce ? undefined : { transform: "translateZ(24px)" }}>
        {children}
      </div>
    </Element>
  );
}
