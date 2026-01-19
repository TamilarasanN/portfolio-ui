"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, Target, Lightbulb, Code2 } from "lucide-react";
import { TiltCard } from "../interactive/TiltCard";

interface TimelineDeepDiveProps {
  open: boolean;
  onClose: () => void;
  experience?: {
    title: string;
    company: string;
    startDate: string;
    endDate?: string;
  };
}

export function TimelineDeepDive({ open, onClose, experience }: TimelineDeepDiveProps) {
  const [mounted, setMounted] = useState(false);

  console.log("experience", experience);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const modalContent = (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[10003] flex items-center justify-center p-4 cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl border-2 border-orange-400/40 bg-zinc-950 shadow-[0_0_100px_rgba(251,146,60,0.4)] flex flex-col"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Project Deep Dive"
          >
            {/* Header Bar */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400" />

            {/* Scanline overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-10"
              style={{
                background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(251,146,60,0.3) 2px, rgba(251,146,60,0.3) 4px)",
              }}
            />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-orange-400/20 bg-zinc-950/50 px-6 py-4 backdrop-blur-sm shrink-0">
              <div className="flex items-center gap-4">
                <div className="rounded-xl border border-orange-400/30 bg-orange-400/10 p-2">
                  <Target className="h-5 w-5 text-orange-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-orange-300">Why This Project Mattered</h2>
                  <p className="text-sm text-white/60">
                    {experience ? `${experience.title} @ ${experience.company}` : "Deep dive reflection"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg border border-orange-400/30 bg-orange-400/10 p-2 text-orange-300 hover:bg-orange-400/20 transition cursor-pointer"
                aria-label="Close deep dive"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Area - Scrollable */}
            <div className="relative z-10 flex-1 overflow-y-auto min-h-0">
              <div className="p-6 space-y-6">
                {/* Introduction */}
                <div className="rounded-2xl border border-orange-400/20 bg-orange-400/5 p-6">
                  <p className="text-white/80 leading-relaxed">
                    This wasn't just another project, it was a foundational experience that shaped how I approach 
                    engineering problems. Here's an honest reflection on the constraints, trade-offs, and lessons learned.
                  </p>
                </div>

                {/* Constraints */}
                <TiltCard as="div" className="p-6 border-orange-400/30 bg-orange-400/5 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 opacity-20"
                    animate={{
                      background: [
                        "radial-gradient(circle at 20% 30%, rgba(251,146,60,0.3), transparent 50%)",
                        "radial-gradient(circle at 80% 70%, rgba(251,146,60,0.3), transparent 50%)",
                        "radial-gradient(circle at 20% 30%, rgba(251,146,60,0.3), transparent 50%)",
                      ],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <AlertCircle className="h-5 w-5 text-orange-300" />
                      <h3 className="text-xl font-bold text-orange-300">Constraints We Faced</h3>
                    </div>
                    <ul className="space-y-3">
                      {[
                        "Tight deadlines requiring rapid iteration while maintaining quality standards",
                        "Limited resources, small team, budget constraints, and competing priorities",
                        "Legacy system integration challenges, working with outdated APIs and technical debt",
                        "Stakeholder expectations balancing feature velocity with long-term maintainability",
                        "Learning curve, new technologies and domain knowledge acquired under pressure",
                      ].map((constraint, index) => (
                        <li key={index} className="flex items-start gap-3 text-white/80">
                          <div className="h-1.5 w-1.5 rounded-full bg-orange-400 mt-2 shrink-0" />
                          <span className="leading-relaxed">{constraint}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TiltCard>

                {/* Trade-offs */}
                <TiltCard as="div" className="p-6 border-yellow-400/30 bg-yellow-400/5 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 opacity-20"
                    animate={{
                      background: [
                        "radial-gradient(circle at 20% 30%, rgba(234,179,8,0.3), transparent 50%)",
                        "radial-gradient(circle at 80% 70%, rgba(234,179,8,0.3), transparent 50%)",
                        "radial-gradient(circle at 20% 30%, rgba(234,179,8,0.3), transparent 50%)",
                      ],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <Code2 className="h-5 w-5 text-yellow-300" />
                      <h3 className="text-xl font-bold text-yellow-300">Trade-offs We Made</h3>
                    </div>
                    <div className="space-y-4">
                      {[
                        {
                          decision: "Speed vs. Perfection",
                          detail: "Chose iterative delivery over comprehensive upfront design. This allowed us to ship value quickly and gather feedback, but required careful refactoring later.",
                        },
                        {
                          decision: "Custom vs. Off-the-shelf",
                          detail: "Built custom solutions where needed for specific requirements, but leveraged existing libraries for common patterns to maintain velocity.",
                        },
                        {
                          decision: "Feature Rich vs. Simple",
                          detail: "Prioritized core functionality first, then layered on enhancements. Some 'nice-to-haves' were deferred to later iterations.",
                        },
                        {
                          decision: "Technical Debt vs. Clean Architecture",
                          detail: "Accepted some technical debt for faster delivery, with a plan to refactor. This required discipline to actually address debt later.",
                        },
                      ].map((tradeoff, index) => (
                        <div key={index} className="rounded-xl border border-yellow-400/20 bg-zinc-950/40 p-4">
                          <h4 className="font-semibold text-yellow-300 mb-2">{tradeoff.decision}</h4>
                          <p className="text-sm text-white/70 leading-relaxed">{tradeoff.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TiltCard>

                {/* What I'd Do Differently */}
                <TiltCard as="div" className="p-6 border-green-400/30 bg-green-400/5 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 opacity-20"
                    animate={{
                      background: [
                        "radial-gradient(circle at 20% 30%, rgba(34,197,94,0.3), transparent 50%)",
                        "radial-gradient(circle at 80% 70%, rgba(34,197,94,0.3), transparent 50%)",
                        "radial-gradient(circle at 20% 30%, rgba(34,197,94,0.3), transparent 50%)",
                      ],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <Lightbulb className="h-5 w-5 text-green-300" />
                      <h3 className="text-xl font-bold text-green-300">What I'd Do Differently Today</h3>
                    </div>
                    <div className="space-y-4">
                      {[
                        {
                          improvement: "Earlier Testing Strategy",
                          reflection: "I'd invest more upfront in comprehensive testing infrastructure. While we had tests, starting with better test coverage would have caught issues earlier and reduced debugging time.",
                        },
                        {
                          improvement: "More Design System Thinking",
                          reflection: "I'd establish a design system earlier. We built components ad-hoc initially, which required more consolidation work later. Starting with a component library mindset would have been more efficient.",
                        },
                        {
                          improvement: "Better Documentation as We Go",
                          reflection: "Documentation was often an afterthought. I'd implement 'docs as code' practices from day one, making documentation part of the development workflow rather than a separate task.",
                        },
                        {
                          improvement: "Stakeholder Communication Cadence",
                          reflection: "I'd establish more regular check-ins with stakeholders. Better communication earlier would have prevented some scope changes and rework mid-project.",
                        },
                        {
                          improvement: "Performance Budget from Start",
                          reflection: "I'd set performance budgets from the beginning. Monitoring performance early would have prevented the need for optimization sprints later.",
                        },
                      ].map((item, index) => (
                        <div key={index} className="rounded-xl border border-green-400/20 bg-zinc-950/40 p-4">
                          <h4 className="font-semibold text-green-300 mb-2">{item.improvement}</h4>
                          <p className="text-sm text-white/70 leading-relaxed">{item.reflection}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TiltCard>

                {/* Key Takeaway */}
                <div className="rounded-2xl border-2 border-orange-400/30 bg-gradient-to-br from-orange-400/10 via-yellow-400/10 to-orange-400/10 p-6">
                  <h4 className="font-bold text-orange-300 mb-3 text-lg">Key Takeaway</h4>
                  <p className="text-white/90 leading-relaxed">
                    Every project teaches you something. The real value isn't in getting everything perfect the first time—it's in 
                    reflecting honestly on what worked, what didn't, and how that knowledge makes you a better engineer today. 
                    This experience reinforced that engineering is about making informed decisions under constraints, 
                    learning continuously, and always striving to improve.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom glow accent */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-orange-400/10 via-yellow-400/5 to-transparent pointer-events-none" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (mounted && typeof window !== "undefined") {
    return createPortal(modalContent, document.body);
  }

  return null;
}

// Hook to detect triple click on first experience dot
export function useTimelineDeepDiveTrigger() {
  const [isOpen, setIsOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleDotClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Find the first experience dot (the first timeline dot element)
      const experienceSection = document.getElementById("experience");
      if (!experienceSection) return;

      // Find the snap dot using data attribute (the floating indicator dot)
      const snapDot = experienceSection.querySelector('[data-easter-egg-dot="first"]');
      
      // Check if click is on the snap dot
      const clickedDot = snapDot && (snapDot.contains(target) || snapDot === target);
      
      if (clickedDot) {
        e.preventDefault();
        e.stopPropagation();
        
        const newCount = clickCount + 1;
        setClickCount(newCount);

        // Reset click count after 1 second
        if (clickTimeout) {
          clearTimeout(clickTimeout);
        }

        const timeout = setTimeout(() => {
          setClickCount(0);
        }, 1000);

        setClickTimeout(timeout);

        // If triple clicked
        if (newCount >= 3) {
          setIsOpen(true);
          setClickCount(0);
          if (timeout) clearTimeout(timeout);
        }
      }
    };

    // Use capture phase to catch clicks before they bubble
    window.addEventListener("click", handleDotClick, true);
    
    return () => {
      window.removeEventListener("click", handleDotClick, true);
      if (clickTimeout) {
        clearTimeout(clickTimeout);
      }
    };
  }, [clickCount, clickTimeout]);

  // Get first experience for modal
  const firstExperience = (() => {
    if (typeof window === "undefined") return undefined;
    const experienceSection = document.getElementById("experience");
    if (!experienceSection) return undefined;
    
    // Try to find the first experience card
    const firstCard = experienceSection.querySelector('[data-idx="0"]');
    if (!firstCard) return undefined;
    
    // Extract basic info (this is a fallback - ideally we'd pass experience data as prop)
    return {
      title: "Senior Software Engineer",
      company: "Bahwan Cybertek FZ LLC",
      startDate: new Date().toISOString().split('T')[0],
    };
  })();

  return { isOpen, setIsOpen, firstExperience };
}
