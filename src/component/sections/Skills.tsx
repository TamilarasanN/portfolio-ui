"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SectionTitle } from "../atoms/SectionTitle";
import { TiltCard } from "../interactive/TiltCard";
import { getIconByName } from "@/lib/data";

const sectionReveal = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55 } },
};

interface SkillsProps {
  skills: Record<string, { icon?: any; iconName?: string; items: string[] }>;
}

export function Skills({ skills }: SkillsProps) {
  const reduce = useReducedMotion();

  return (
    <motion.section
      id="skills"
      className="mt-14 scroll-mt-24"
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <SectionTitle
        kicker="CAPABILITIES"
        title="Skills"
        desc="Hover the chips — neon lift + ring outline."
        kickerColor="orange"
      />

      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(skills).map(([k, v], index) => {
          // Handle both icon function (from static data) and iconName (from Strapi)
          const Icon = v.icon || (v.iconName ? getIconByName(v.iconName) : getIconByName("Code2"));
          
          // Color rotation for each skill card
          const colors = [
            { border: "border-cyan-400/30", bg: "bg-cyan-400/10", text: "text-cyan-300", glow: "rgba(56,189,248,0.3)" },
            { border: "border-purple-400/30", bg: "bg-purple-400/10", text: "text-purple-300", glow: "rgba(168,85,247,0.3)" },
            { border: "border-green-400/30", bg: "bg-green-400/10", text: "text-green-300", glow: "rgba(34,197,94,0.3)" },
            { border: "border-orange-400/30", bg: "bg-orange-400/10", text: "text-orange-300", glow: "rgba(251,146,60,0.3)" },
          ];
          const colorTheme = colors[index % colors.length];
          
          return (
            <TiltCard key={k} as="div" className={`p-5 relative overflow-hidden ${colorTheme.border}`}>
              {/* Subtle animated glow */}
              <motion.div
                className="absolute inset-0 opacity-20"
                animate={{
                  background: [
                    `radial-gradient(circle at 20% 30%, ${colorTheme.glow}, transparent 50%)`,
                    `radial-gradient(circle at 80% 70%, ${colorTheme.glow}, transparent 50%)`,
                    `radial-gradient(circle at 20% 30%, ${colorTheme.glow}, transparent 50%)`,
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-3">
                  <div className={`rounded-2xl border ${colorTheme.border} ${colorTheme.bg} p-2`}>
                    <Icon className={`h-5 w-5 ${colorTheme.text}`} />
                  </div>
                  <div className={`text-lg font-semibold ${colorTheme.text}`}>
                    {k.replace(/([A-Z])/g, " $1").trim()}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                {v.items.map((x) => (
                  <motion.span
                    key={x}
                    whileHover={reduce ? undefined : { y: -3, scale: 1.02 }}
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 22 }}
                    className="relative rounded-full border border-white/10 bg-zinc-950/40 px-3 py-1 text-xs text-white/80"
                  >
                    {/* neon ring */}
                    <span className="pointer-events-none absolute -inset-[2px] rounded-full opacity-0 transition duration-200 hover:opacity-100 bg-[conic-gradient(from_180deg,rgba(56,189,248,0.0),rgba(56,189,248,0.6),rgba(168,85,247,0.6),rgba(34,197,94,0.45),rgba(56,189,248,0.0))] blur-[6px]" />
                    <span className="relative">{x}</span>
                  </motion.span>
                ))}
                </div>
              </div>
            </TiltCard>
          );
        })}
      </div>
    </motion.section>
  );
}
