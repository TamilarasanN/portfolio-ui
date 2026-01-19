"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "../atoms/SectionTitle";
import { TiltCard } from "../interactive/TiltCard";
import { getIconByName } from "@/lib/data";

const sectionReveal = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55 } },
};

const cardReveal = {
  hidden: { opacity: 0, y: 18, scale: 0.985 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35 } },
};

interface HowIWorkProps {
  items: Array<{
    title: string;
    body: string;
    icon?: any;
    iconName?: string;
  }>;
}

export function HowIWork({ items }: HowIWorkProps) {
  return (
    <motion.section
      id="how"
      className="mt-14 scroll-mt-24"
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <SectionTitle
        kicker="WORKING STYLE"
        title="How I build"
        desc="Fast delivery — but with guardrails: reliability, performance, and scalable foundations."
        kickerColor="red"
      />

      <div className="grid gap-4 md:grid-cols-3">
        {items.map((c, index) => {
          // Handle both icon function (from static data) and iconName (from Strapi)
          // Check if c.icon is a function, otherwise use iconName
          const Icon = (typeof c.icon === 'function') 
            ? c.icon 
            : (c.iconName ? getIconByName(c.iconName) : getIconByName("Code2"));
          
          // Color rotation for each card
          const colors = [
            { border: "border-cyan-400/30", bg: "bg-cyan-400/10", text: "text-cyan-300", glow: "rgba(56,189,248,0.3)" },
            { border: "border-green-400/30", bg: "bg-green-400/10", text: "text-green-300", glow: "rgba(34,197,94,0.3)" },
            { border: "border-purple-400/30", bg: "bg-purple-400/10", text: "text-purple-300", glow: "rgba(168,85,247,0.3)" },
          ];
          const colorTheme = colors[index % colors.length];
          
          return (
            <motion.div
              key={`${c.title}-${c.iconName || index}`}
              variants={cardReveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.35 }}
            >
              <TiltCard as="div" className={`p-5 relative overflow-hidden ${colorTheme.border}`}>
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
                    <div className={`text-lg font-semibold ${colorTheme.text}`}>{c.title}</div>
                  </div>
                  <p className="mt-3 text-sm text-white/70">{c.body}</p>
                </div>
              </TiltCard>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
