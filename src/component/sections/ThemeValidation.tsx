"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Zap, Gamepad2, Sparkles, Eye, MessageCircle, ChevronRight } from "lucide-react";
import { TiltCard } from "../interactive/TiltCard";

// Character dialogues from Ready Player One
const characters = [
  {
    id: "halliday",
    name: "James Halliday",
    avatar: "👓",
    color: "cyan",
    quote: "I created the OASIS because I never felt at home in the real world.",
    message:
      "The OASIS represents limitless possibility—where technology transcends boundaries. As a developer, I build digital experiences where users can be whoever they want to be, just like in the OASIS.",
    validation: {
      icon: Code2,
      title: "Virtual Reality & Innovation",
      description: "Ready Player One represents the pinnacle of virtual reality and digital innovation—core values in modern web development. I build immersive digital experiences that push boundaries.",
    },
  },
  {
    id: "parzival",
    name: "Parzival (Wade)",
    avatar: "🎮",
    color: "green",
    quote: "People come to the OASIS for all the things they can do, but they stay for all the things they can be.",
    message:
      "Every user interaction should feel like an adventure. I craft experiences that are not just functional, but transformative—where performance meets imagination.",
    validation: {
      icon: Gamepad2,
      title: "Gaming & Interactive Experiences",
      description: "The OASIS showcases interactive, engaging user experiences. My portfolio reflects this through interactive 3D effects, animations, and user-centric design patterns that make technology feel magical.",
    },
  },
  {
    id: "art3mis",
    name: "Art3mis",
    avatar: "💫",
    color: "purple",
    quote: "The OASIS was a place where the limits of reality were your own imagination.",
    message:
      "Seamless performance isn't optional—it's essential. Just as the OASIS runs flawlessly for millions, I optimize every aspect of my applications for speed and reliability.",
    validation: {
      icon: Zap,
      title: "Performance & Optimization",
      description: "In the OASIS, seamless performance is critical. I prioritize performance optimization, efficient rendering, and smooth animations—ensuring every interaction feels instant and fluid.",
    },
  },
  {
    id: "aech",
    name: "Aech",
    avatar: "🔧",
    color: "orange",
    quote: "You can be whoever you want to be in the OASIS.",
    message:
      "Creative problem-solving under pressure—that's what separates great developers. I tackle complex challenges with innovative solutions, just like navigating the OASIS quests.",
    validation: {
      icon: Sparkles,
      title: "Creative Problem Solving",
      description: "Wade Watts' journey demonstrates creative problem-solving under constraints. I tackle complex challenges with innovative solutions, balancing creativity with technical excellence.",
    },
  },
  {
    id: "shoto",
    name: "Shoto",
    avatar: "⚔️",
    color: "red",
    quote: "Reality is the only thing that's real.",
    message:
      "The best technology feels like magic but works reliably in reality. I stay current with cutting-edge frameworks while building solutions that are production-ready and future-proof.",
    validation: {
      icon: Eye,
      title: "Future-Forward Technology",
      description: "Ready Player One envisions the future of technology. I stay current with cutting-edge frameworks (Next.js, React, TypeScript) and patterns, building solutions that anticipate tomorrow's needs.",
    },
  },
];

const sectionReveal = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55 } },
};

const colorMap = {
  cyan: {
    border: "border-cyan-400/30",
    bg: "bg-cyan-400/10",
    text: "text-cyan-300",
    glow: "rgba(56,189,248,0.3)",
  },
  green: {
    border: "border-green-400/30",
    bg: "bg-green-400/10",
    text: "text-green-300",
    glow: "rgba(34,197,94,0.3)",
  },
  purple: {
    border: "border-purple-400/30",
    bg: "bg-purple-400/10",
    text: "text-purple-300",
    glow: "rgba(168,85,247,0.3)",
  },
  orange: {
    border: "border-orange-400/30",
    bg: "bg-orange-400/10",
    text: "text-orange-300",
    glow: "rgba(251,146,60,0.3)",
  },
  red: {
    border: "border-red-400/30",
    bg: "bg-red-400/10",
    text: "text-red-300",
    glow: "rgba(248,113,113,0.3)",
  },
};

// Export the content separately so it can be used in modal
export function ThemeValidationContent() {
  const [activeCharacter, setActiveCharacter] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const selectedChar = activeCharacter ? characters.find((c) => c.id === activeCharacter) : null;
  const colors = selectedChar ? colorMap[selectedChar.color as keyof typeof colorMap] : colorMap.cyan;

  return (
    <>
      <div className="mb-8 text-center">
        <div className="inline-block rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-1.5 text-xs font-semibold text-cyan-300">
          THEME INSPIRATION
        </div>
        <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
          Welcome to the OASIS
        </h2>
        <p className="mt-3 text-white/70 md:text-lg">
          Discover why Ready Player One inspires my work, through the{" "}
          <span className="text-cyan-300">characters</span> who built and explored the OASIS
        </p>
      </div>

      {/* Character selection grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {characters.map((char, index) => {
          const charColors = colorMap[char.color as keyof typeof colorMap];
          const isActive = activeCharacter === char.id;
          
          return (
            <motion.div
              key={char.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => setActiveCharacter(isActive ? null : char.id)}
              className="cursor-pointer"
            >
              <TiltCard
                as="div"
                className={`relative overflow-hidden p-4 transition-all ${
                  isActive
                    ? `${charColors.border} ${charColors.bg} ring-2 ring-opacity-50`
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                {/* Character glow effect when active */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 opacity-60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    style={{
                      background: `radial-gradient(circle at center, ${charColors.glow}, transparent 70%)`,
                    }}
                  />
                )}

                <div className="relative z-10 text-center">
                  <motion.div
                    className="text-5xl mb-2"
                    animate={isActive ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {char.avatar}
                  </motion.div>
                  <h3 className={`text-sm font-semibold ${isActive ? charColors.text : "text-white/80"}`}>
                    {char.name}
                  </h3>
                  <div className="mt-2 text-xs text-white/50 italic line-clamp-2">
                    "{char.quote}"
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          );
        })}
      </div>

      {/* Character detail panel */}
      <AnimatePresence mode="wait">
        {selectedChar && (
          <motion.div
            key={selectedChar.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <TiltCard
              as="div"
              className={`relative overflow-hidden p-6 md:p-8 border-2 ${colors.border} ${colors.bg}`}
            >
              {/* Animated background glow */}
              <motion.div
                className="absolute inset-0 opacity-40"
                animate={{
                  background: [
                    `radial-gradient(circle at 20% 30%, ${colors.glow}, transparent 50%)`,
                    `radial-gradient(circle at 80% 70%, ${colors.glow}, transparent 50%)`,
                    `radial-gradient(circle at 20% 30%, ${colors.glow}, transparent 50%)`,
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />

              <div className="relative z-10">
                {/* Character header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <motion.div
                      className="text-6xl"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {selectedChar.avatar}
                    </motion.div>
                    <div>
                      <h3 className={`text-2xl font-bold ${colors.text} mb-1`}>
                        {selectedChar.name}
                      </h3>
                      <p className="text-sm text-white/60 italic">
                        "{selectedChar.quote}"
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveCharacter(null)}
                    className={`rounded-lg ${colors.border} ${colors.bg} p-2 hover:opacity-80 transition cursor-pointer`}
                    aria-label="Close character view"
                  >
                    <svg className="h-5 w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Character message */}
                <div className="mb-6 p-4 rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <MessageCircle className={`h-5 w-5 ${colors.text} shrink-0 mt-0.5`} />
                    <p className="text-white/80 leading-relaxed">{selectedChar.message}</p>
                  </div>
                </div>

                {/* Validation point */}
                <div className="border-t border-white/10 pt-6">
                  <div
                    onClick={() => setExpandedIndex(expandedIndex === 0 ? null : 0)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {(() => {
                          const Icon = selectedChar.validation.icon;
                          return (
                            <div className={`rounded-xl ${colors.border} ${colors.bg} p-2`}>
                              <Icon className={`h-5 w-5 ${colors.text}`} />
                            </div>
                          );
                        })()}
                        <h4 className="text-lg font-semibold text-white">
                          {selectedChar.validation.title}
                        </h4>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedIndex === 0 ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className={`h-5 w-5 ${colors.text}`} />
                      </motion.div>
                    </div>
                    <AnimatePresence>
                      {expandedIndex === 0 && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-sm text-white/70 leading-relaxed overflow-hidden"
                        >
                          {selectedChar.validation.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OASIS connection footer */}
      {!activeCharacter && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-400/10 via-purple-400/10 to-fuchsia-400/10 p-6 backdrop-blur-sm"
        >
          <p className="text-center text-sm text-white/80 leading-relaxed">
            <span className="font-semibold text-white">The Connection:</span>{" "}
            Just as these characters navigated the OASIS with skill and creativity, I craft
            digital experiences that combine{" "}
            <span className="text-cyan-300">technical mastery</span> with{" "}
            <span className="text-purple-300">creative vision</span>. Every
            project transforms code into immersive experiences—where users can be whoever they want to be.
          </p>
          <div className="mt-4 text-center">
            <p className="text-xs text-white/50 italic">
              Click on any character above to explore their perspective on development and innovation
            </p>
          </div>
        </motion.div>
      )}
    </>
  );
}

// Main section component (kept for navigation/scroll spy compatibility)
export function ThemeValidation() {
  return (
    <motion.section
      id="theme"
      className="mt-14 scroll-mt-24"
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mb-8 text-center">
        <div className="inline-block rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-1.5 text-xs font-semibold text-cyan-300">
          THEME INSPIRATION
        </div>
        <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
          Welcome to the OASIS
        </h2>
        <p className="mt-3 text-white/70 md:text-lg">
          Click on Parzival (bottom right) to explore why Ready Player One inspires my work
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-400/10 via-purple-400/10 to-fuchsia-400/10 p-8 backdrop-blur-sm text-center"
      >
        <div className="text-6xl mb-4">🎮</div>
        <p className="text-white/80 leading-relaxed mb-4">
          <span className="font-semibold text-white">The Connection:</span>{" "}
          Just as these characters navigated the OASIS with skill and creativity, I craft
          digital experiences that combine{" "}
          <span className="text-cyan-300">technical mastery</span> with{" "}
          <span className="text-purple-300">creative vision</span>.
        </p>
        <p className="text-sm text-white/60 italic">
          "People come to the OASIS for all the things they can do, but they stay for all the things they can be"
        </p>
      </motion.div>
    </motion.section>
  );
}
