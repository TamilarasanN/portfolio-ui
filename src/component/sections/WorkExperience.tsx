"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
} from "framer-motion";
import { SectionTitle } from "../atoms/SectionTitle";

/** --------- Animations --------- */
const sectionReveal = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55 } },
};

const bulletStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03, delayChildren: 0.06 } },
};

const bulletItem = {
  hidden: { opacity: 0, y: 5, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.26 } },
};

/** --------- Types --------- */
type WorkExperience = {
  id?: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  summary: string;
  achievements: string[];
  stack: string[];
  tags: string[];
};

interface WorkExperienceProps {
  experiences: WorkExperience[];
}

/** --------- Helpers --------- */
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
function getYear(dateStr: string) {
  if (!dateStr) return 0;
  const year = dateStr.split("-")[0];
  return parseInt(year) || 0;
}

/** ---------------------------------------------
 *  WorkExperienceSection
 *  - Timeline fill based on scroll
 *  - Snap-to-active floating dot follows the most visible card
 *  - Snap dot pulses subtly on active card
 *  - Neon card effects (glow + gradient ring + sheen)
 * --------------------------------------------- */
export function WorkExperienceSection({ experiences }: WorkExperienceProps) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const setItemRef = (idx: number) => (el: HTMLDivElement | null) => {
    itemRefs.current[idx] = el;
  };

  const sortedExperiences = useMemo(() => {
    return [...experiences].sort((a, b) => getYear(b.startDate) - getYear(a.startDate));
  }, [experiences]);

  const [activeIdx, setActiveIdx] = useState(0);

  // Timeline fill line
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.86", "end 0.30"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 110, damping: 34, mass: 0.25 });

  // Snap dot Y (relative to listRef)
  const dotY = useMotionValue(24);
  const dotYSpring = useSpring(dotY, { stiffness: 220, damping: 28, mass: 0.28 });

  // Observe which item is most visible -> snap dot to it
  useEffect(() => {
    if (reduce) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let best: { idx: number; ratio: number } | null = null;
        for (const entry of entries) {
          const idxStr = (entry.target as HTMLElement).dataset["idx"];
          const idx = idxStr ? parseInt(idxStr, 10) : -1;
          if (idx < 0) continue;

          const ratio = entry.intersectionRatio;
          if (!best || ratio > best.ratio) best = { idx, ratio };
        }

        if (best && best.ratio > 0.15) setActiveIdx(best.idx);
      },
      {
        root: null,
        rootMargin: "-35% 0px -45% 0px",
        threshold: [0, 0.15, 0.25, 0.35, 0.5, 0.7, 0.9],
      }
    );

    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [reduce, sortedExperiences.length]);

  // Move snap dot to active card
  useEffect(() => {
    if (reduce) return;
    const list = listRef.current;
    const el = itemRefs.current[activeIdx];
    if (!list || !el) return;

    const listRect = list.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    // aligns with item node at top-6 (~24px)
    const y = elRect.top - listRect.top + 24;
    dotY.set(y);
  }, [activeIdx, dotY, reduce]);

  return (
    <motion.section
      ref={sectionRef as any}
      id="experience"
      className="mt-14 scroll-mt-24"
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
             <SectionTitle
               kicker="CAREER JOURNEY"
               title="Work Experience"
               desc="9+ years building scalable web and mobile experiences across government, enterprise, and SaaS platforms."
               kickerColor="cyan"
             />

      <div className="mt-8 relative">
        {/* Base line */}
        <div className="absolute left-3 top-0 h-full w-px bg-white/10" />

        {/* Fill line */}
        {!reduce && (
          <motion.div
            className="absolute left-3 top-0 w-px bg-white/25 origin-top"
            style={{ scaleY: fill, height: "100%" }}
          />
        )}

        {/* SNAP DOT (hero indicator) + PULSE */}
        {!reduce && (
          <>
            {/* Soft neon bloom behind the dot */}
            <motion.div
              className="absolute left-[6px] top-0 h-3 w-3 rounded-full"
              style={{ y: dotYSpring }}
              animate={{
                // subtle pulse
                scale: [1, 1.18, 1],
                opacity: [0.55, 0.85, 0.55],
              }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute inset-0 rounded-full bg-white/20 blur-md" />
            </motion.div>

            {/* Actual dot */}
            <motion.div
              className="absolute left-[6px] top-0 h-3 w-3 rounded-full bg-white border-2 border-zinc-950"
              style={{
                y: dotYSpring,
                boxShadow: "0 0 18px rgba(168,85,247,0.55), 0 0 26px rgba(59,130,246,0.35)",
              }}
              animate={{
                scale: [1, 1.08, 1],
              }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}

        <div ref={listRef} className="space-y-12 pl-10">
          {sortedExperiences.map((exp, i) => (
            <NeonTimelineItem
              key={exp.id || `${exp.company}-${exp.title}-${i}`}
              exp={exp}
              index={i}
              reduce={!!reduce}
              isActive={i === activeIdx}
              refSetter={setItemRef(i)}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

/** --------- Item (Neon Card) --------- */
function NeonTimelineItem({
  exp,
  index,
  reduce,
  isActive,
  refSetter,
}: {
  exp: WorkExperience;
  index: number;
  reduce: boolean;
  isActive: boolean;
  refSetter: (el: HTMLDivElement | null) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50 });

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const mxSpring = useSpring(mx, { stiffness: 240, damping: 24, mass: 0.26 });
  const mySpring = useSpring(my, { stiffness: 240, damping: 24, mass: 0.26 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;

    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;

    const x = (px / r.width) * 100;
    const y = (py / r.height) * 100;

    // keep tilt still tasteful even with neon
    const ry = clamp((x - 50) / 9.5, -5, 5);
    const rx = clamp(-(y - 50) / 10.5, -5, 5);

    setTilt({ rx, ry, mx: x, my: y });

    const dx = (px - r.width / 2) * 0.02;
    const dy = (py - r.height / 2) * 0.02;
    mx.set(dx);
    my.set(dy);
  };

  const onEnter = () => {
    if (reduce) return;
    setHovered(true);
  };
  const onLeave = () => {
    if (reduce) return;
    setHovered(false);
    setTilt({ rx: 0, ry: 0, mx: 50, my: 50 });
    mx.set(0);
    my.set(0);
  };

  const highlight = hovered || isActive;

  return (
    <motion.div
      ref={refSetter}
      data-idx={index}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={reduce ? { duration: 0 } : { duration: 0.5, delay: index * 0.07 }}
      className="relative"
    >
      {/* Static node remains subtle */}
      <motion.span
        className="absolute left-[-30px] top-6 block h-3 w-3 rounded-full bg-white/70 border-2 border-zinc-950"
        animate={
          reduce
            ? {}
            : highlight
              ? { scale: 1.08, opacity: 0.95 }
              : { scale: 1, opacity: 0.55 }
        }
        transition={{ type: "spring" as const, stiffness: 220, damping: 26 }}
      />

      {/* Neon ring wrapper (lets us do gradient ring without relying on tailwind gradients) */}
      <motion.div
        onMouseMove={onMove}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        style={
          reduce
            ? undefined
            : {
                x: mxSpring,
                y: mySpring,
                transformStyle: "preserve-3d",
                perspective: 1000,
              }
        }
        className="relative rounded-2xl p-[1px] overflow-hidden"
      >
        {/* Gradient ring (animated) */}
        {!reduce && (
          <motion.div
            aria-hidden="true"
            className="absolute inset-0"
            animate={highlight ? { opacity: 1 } : { opacity: 0.45 }}
            transition={{ duration: 0.2 }}
            style={{
              background:
                "conic-gradient(from 180deg, rgba(168,85,247,0.85), rgba(59,130,246,0.75), rgba(34,211,238,0.60), rgba(168,85,247,0.85))",
              filter: "blur(0px)",
            }}
          />
        )}

        {/* Outer glow */}
        {!reduce && (
          <motion.div
            aria-hidden="true"
            className="absolute -inset-8 opacity-0"
            animate={highlight ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{
              background:
                "radial-gradient(closest-side, rgba(168,85,247,0.25), rgba(59,130,246,0.16), rgba(0,0,0,0))",
              filter: "blur(10px)",
            }}
          />
        )}

        {/* Actual card surface */}
        <div className="relative rounded-2xl border border-white/10 bg-zinc-950/35 backdrop-blur-xl px-6 py-5 overflow-hidden">
          {/* Top wash */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] via-transparent to-transparent" />
          </div>

          {/* Sheen follows cursor */}
          {!reduce && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              animate={{
                opacity: highlight ? 1 : 0,
                background: `radial-gradient(700px circle at ${tilt.mx}% ${tilt.my}%, rgba(255,255,255,0.10), rgba(255,255,255,0.03) 40%, rgba(0,0,0,0) 72%)`,
              }}
              transition={{ duration: 0.18 }}
            />
          )}

          {/* 3D plane */}
          <motion.div
            style={
              reduce
                ? undefined
                : {
                    transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(0px)`,
                    transformStyle: "preserve-3d",
                  }
            }
          >
            <div style={reduce ? undefined : { transform: "translateZ(10px)" }} className="relative">
              <h3 className="text-xl font-semibold text-white">{exp.title}</h3>
              <p className="text-sm text-white/60 mt-1">
                {exp.company} · {exp.location}
              </p>
              <p className="text-sm text-white/50 mb-3">
                {exp.startDate} — {exp.endDate ?? "Present"}
              </p>
              <p className="text-white/80 mb-4">{exp.summary}</p>
            </div>

            <motion.ul
              variants={bulletStagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.45 }}
              className="list-disc ml-5 space-y-1 text-white/70"
              style={reduce ? undefined : { transform: "translateZ(6px)" }}
            >
              {exp.achievements.map((a, idx) => (
                <motion.li key={idx} variants={bulletItem} className="text-sm">
                  {a}
                </motion.li>
              ))}
            </motion.ul>

            <div
              className="flex flex-wrap gap-2 mt-4"
              style={reduce ? undefined : { transform: "translateZ(8px)" }}
            >
              {exp.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-1 rounded-full bg-zinc-950/30 border border-white/10 text-white/80"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-5 h-px w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
