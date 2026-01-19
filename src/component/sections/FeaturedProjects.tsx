"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { SectionTitle } from "../atoms/SectionTitle";
import { Modal } from "../interactive/Modal";
import { MagneticButton } from "../interactive/MagneticButton";
import { TiltCard } from "../interactive/TiltCard";
import { Pill } from "../atoms/Pill";
import { useBodyScrollLock } from "../hooks";

const sectionReveal = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55 } },
};

type Project = {
  id: string;
  name: string;
  summary: string;
  tags: string[];
  stack: string[];
  highlights: string[];
  impact: { label: string; value: string }[];
  metrics?: { label: string; value: string }[];
  ownership?: string[];
  proof?: string[];
  links?: { label: string; href: string }[];
};

interface FeaturedProjectsProps {
  projects: Project[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const reduce = useReducedMotion();
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);

  const openProject = useMemo(
    () => projects.find((p) => p.id === openProjectId) || null,
    [openProjectId, projects]
  );

  useBodyScrollLock(!!openProject);

  const handleOpen = useCallback((id: string, el: HTMLElement) => {
    lastTriggerRef.current = el;
    setOpenProjectId(id);
  }, []);

  const handleClose = useCallback(() => {
    setOpenProjectId(null);
    window.setTimeout(() => lastTriggerRef.current?.focus?.(), 0);
  }, []);

  return (
    <motion.section
      id="featured-projects"
      className="mt-14 scroll-mt-24"
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <SectionTitle
        kicker="FEATURED WORK"
        title="Featured Projects"
        desc="High-impact projects delivering scalable solutions for government and enterprise platforms."
        kickerColor="green"
      />

      <motion.div
        className="grid gap-4 md:grid-cols-2"
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: 0.07, delayChildren: 0.08 },
          },
        }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        {projects.map((p) => (
          <motion.div
            key={p.id}
            variants={{
              hidden: { opacity: 0, y: 18, scale: 0.985 },
              show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35 } },
            }}
            className="overflow-visible"
          >
            <TiltCard
              onClick={(e) => handleOpen(p.id, e.currentTarget)}
              className="group"
            >

              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs text-white/60">Featured Project</div>
                    <div className="mt-1 text-lg font-semibold text-white">{p.name}</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-zinc-950/40 px-3 py-2 text-xs text-white/70 transition group-hover:border-cyan-400/50 group-hover:text-white group-hover:shadow-[0_0_15px_rgba(56,189,248,0.5)]">
                    View
                  </div>
                </div>

                <p className="mt-3 text-sm text-white/70">{p.summary}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {(Array.isArray(p.tags) ? p.tags : []).slice(0, 5).map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2.5 py-1 rounded-full border border-white/10 bg-zinc-950/40 text-white/80 transition group-hover:border-cyan-400/30 group-hover:text-white"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/70">
                  {(Array.isArray(p.stack) ? p.stack : []).slice(0, 7).map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-white/10 bg-zinc-950/40 px-3 py-1 transition group-hover:border-purple-400/30 group-hover:text-white"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </motion.div>

      <Modal open={!!openProject} onClose={handleClose} title={openProject?.name || ""}>
        {openProject ? (
          <div className="space-y-6">
            <p className="text-white/80 leading-relaxed">{openProject.summary}</p>

            {openProject.metrics && Array.isArray(openProject.metrics) && openProject.metrics.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-3">
                {openProject.metrics.map((m, idx) => {
                  const colors = [
                    { border: "border-cyan-400/30", bg: "bg-cyan-400/10", text: "text-cyan-300", glow: "rgba(56,189,248,0.3)" },
                    { border: "border-green-400/30", bg: "bg-green-400/10", text: "text-green-300", glow: "rgba(34,197,94,0.3)" },
                    { border: "border-purple-400/30", bg: "bg-purple-400/10", text: "text-purple-300", glow: "rgba(168,85,247,0.3)" },
                  ];
                  const colorTheme = colors[idx % colors.length];
                  return (
                    <TiltCard key={m.label} as="div" className={`p-4 rounded-2xl border-2 ${colorTheme.border} ${colorTheme.bg} relative overflow-hidden`}>
                      {/* Subtle glow */}
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
                        <div className={`text-xs font-semibold ${colorTheme.text} uppercase tracking-wider`}>{m.label}</div>
                        <div className="mt-1 font-bold text-white text-lg">{m.value}</div>
                      </div>
                    </TiltCard>
                  );
                })}
              </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-3">
              {(Array.isArray(openProject.impact) ? openProject.impact : []).map((x, idx) => {
                const colors = [
                  { border: "border-purple-400/30", bg: "bg-purple-400/10", text: "text-purple-300", glow: "rgba(168,85,247,0.3)" },
                  { border: "border-orange-400/30", bg: "bg-orange-400/10", text: "text-orange-300", glow: "rgba(251,146,60,0.3)" },
                  { border: "border-cyan-400/30", bg: "bg-cyan-400/10", text: "text-cyan-300", glow: "rgba(56,189,248,0.3)" },
                ];
                const colorTheme = colors[idx % colors.length];
                return (
                  <TiltCard key={x.label} as="div" className={`p-4 rounded-2xl border-2 ${colorTheme.border} ${colorTheme.bg} relative overflow-hidden`}>
                    {/* Subtle glow */}
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
                      <div className={`text-xs font-semibold ${colorTheme.text} uppercase tracking-wider`}>{x.label}</div>
                      <div className="mt-1 font-bold text-white text-lg">{x.value}</div>
                    </div>
                  </TiltCard>
                );
              })}
            </div>

            {openProject.ownership && Array.isArray(openProject.ownership) && openProject.ownership.length > 0 ? (
              <TiltCard as="div" className="p-5 rounded-2xl border-2 border-cyan-400/30 bg-gradient-to-br from-cyan-400/10 via-purple-400/5 to-transparent relative overflow-hidden">
                {/* Animated glow */}
                <motion.div
                  className="absolute inset-0 opacity-30"
                  animate={{
                    background: [
                      "radial-gradient(circle at 20% 30%, rgba(56,189,248,0.3), transparent 50%)",
                      "radial-gradient(circle at 80% 70%, rgba(168,85,247,0.3), transparent 50%)",
                      "radial-gradient(circle at 20% 30%, rgba(56,189,248,0.3), transparent 50%)",
                    ],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="relative z-10">
                  <div className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-cyan-400"></span>
                    What I owned
                  </div>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/80">
                    {openProject.ownership.map((x) => (
                      <li key={x} className="leading-relaxed">{x}</li>
                    ))}
                  </ul>
                </div>
              </TiltCard>
            ) : null}

            {openProject.proof && Array.isArray(openProject.proof) && openProject.proof.length > 0 ? (
              <TiltCard as="div" className="p-5 rounded-2xl border-2 border-green-400/30 bg-gradient-to-br from-green-400/10 via-cyan-400/5 to-transparent relative overflow-hidden">
                {/* Animated glow */}
                <motion.div
                  className="absolute inset-0 opacity-30"
                  animate={{
                    background: [
                      "radial-gradient(circle at 20% 30%, rgba(34,197,94,0.3), transparent 50%)",
                      "radial-gradient(circle at 80% 70%, rgba(56,189,248,0.3), transparent 50%)",
                      "radial-gradient(circle at 20% 30%, rgba(34,197,94,0.3), transparent 50%)",
                    ],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="relative z-10">
                  <div className="text-sm font-bold text-green-300 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-green-400"></span>
                    Proof / outcomes
                  </div>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/80">
                    {openProject.proof.map((x) => (
                      <li key={x} className="leading-relaxed">{x}</li>
                    ))}
                  </ul>
                </div>
              </TiltCard>
            ) : null}

            <div>
              <div className="text-sm font-bold text-purple-300 mb-3 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-purple-400"></span>
                Tech Stack
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {(Array.isArray(openProject.stack) ? openProject.stack : []).map((s, idx) => {
                  const colors = ["cyan", "green", "purple", "orange"];
                  const variant = colors[idx % colors.length] as "cyan" | "green" | "purple" | "orange";
                  return (
                    <Pill key={s} variant={variant}>
                      {s}
                    </Pill>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <TiltCard as="div" className="p-5 rounded-2xl border-2 border-purple-400/30 bg-gradient-to-br from-purple-400/10 via-cyan-400/5 to-transparent relative overflow-hidden">
                {/* Animated glow */}
                <motion.div
                  className="absolute inset-0 opacity-20"
                  animate={{
                    background: [
                      "radial-gradient(circle at 20% 30%, rgba(168,85,247,0.3), transparent 50%)",
                      "radial-gradient(circle at 80% 70%, rgba(56,189,248,0.3), transparent 50%)",
                      "radial-gradient(circle at 20% 30%, rgba(168,85,247,0.3), transparent 50%)",
                    ],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="relative z-10">
                  <div className="text-sm font-bold text-purple-300 flex items-center gap-2 mb-3">
                    <span className="w-1 h-1 rounded-full bg-purple-400"></span>
                    Key highlights
                  </div>
                  <ul className="list-disc space-y-2 pl-5 text-sm text-white/80">
                    {(Array.isArray(openProject.highlights) ? openProject.highlights : []).map((h) => (
                      <li key={h} className="leading-relaxed">{h}</li>
                    ))}
                  </ul>
                </div>
              </TiltCard>
              <TiltCard as="div" className="p-5 rounded-2xl border-2 border-orange-400/30 bg-gradient-to-br from-orange-400/10 via-purple-400/5 to-transparent relative overflow-hidden">
                {/* Animated glow */}
                <motion.div
                  className="absolute inset-0 opacity-20"
                  animate={{
                    background: [
                      "radial-gradient(circle at 20% 30%, rgba(251,146,60,0.3), transparent 50%)",
                      "radial-gradient(circle at 80% 70%, rgba(168,85,247,0.3), transparent 50%)",
                      "radial-gradient(circle at 20% 30%, rgba(251,146,60,0.3), transparent 50%)",
                    ],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="relative z-10">
                  <div className="text-sm font-bold text-orange-300 flex items-center gap-2 mb-3">
                    <span className="w-1 h-1 rounded-full bg-orange-400"></span>
                    Tags
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(openProject.tags) ? openProject.tags : []).map((t, idx) => {
                      const colors = ["cyan", "green", "purple"] as const;
                      const variant = colors[idx % colors.length];
                      return (
                        <Pill key={t} variant={variant}>
                          {t}
                        </Pill>
                      );
                    })}
                  </div>
                </div>
              </TiltCard>
            </div>

            {openProject.links && Array.isArray(openProject.links) && openProject.links.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {openProject.links.map((l) => (
                  <MagneticButton
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    variant="ghost"
                    ariaLabel={l.label}
                  >
                    <ExternalLink className="h-4 w-4" />
                    {l.label}
                  </MagneticButton>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </motion.section>
  );
}
