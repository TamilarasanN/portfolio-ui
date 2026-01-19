"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Layers, 
  Zap, 
  Shield, 
  Code2, 
  Gauge, 
  Database,
  Globe,
  Lock,
  Rocket
} from "lucide-react";
import { TiltCard } from "../interactive/TiltCard";

interface SystemModeProps {
  open: boolean;
  onClose: () => void;
}

export function SystemMode({ open, onClose }: SystemModeProps) {
  const [mounted, setMounted] = useState(false);

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
          className="fixed inset-0 z-[10002] flex items-center justify-center p-4 cursor-pointer"
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
            className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl border-2 border-cyan-400/40 bg-zinc-950 shadow-[0_0_100px_rgba(56,189,248,0.4)] flex flex-col"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="System Architecture Mode"
          >
            {/* OASIS Header Bar */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-400 via-green-400 to-cyan-400" />

            {/* Scanline overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-10"
              style={{
                background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(56,189,248,0.3) 2px, rgba(56,189,248,0.3) 4px)",
              }}
            />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-cyan-400/20 bg-zinc-950/50 px-6 py-4 backdrop-blur-sm shrink-0">
              <div className="flex items-center gap-4">
                <div className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 p-2">
                  <Layers className="h-5 w-5 text-cyan-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-cyan-300">System Architecture Mode</h2>
                  <p className="text-sm text-white/60">Design principles, performance targets, and architecture decisions</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg border border-cyan-400/30 bg-cyan-400/10 p-2 text-cyan-300 hover:bg-cyan-400/20 transition cursor-pointer"
                aria-label="Close system mode"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Area - Scrollable */}
            <div className="relative z-10 flex-1 overflow-y-auto min-h-0">
              <div className="p-6 space-y-6">
                {/* Performance Metrics */}
                <TiltCard as="div" className="p-6 border-cyan-400/30 bg-cyan-400/5 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 opacity-20"
                    animate={{
                      background: [
                        "radial-gradient(circle at 20% 30%, rgba(56,189,248,0.3), transparent 50%)",
                        "radial-gradient(circle at 80% 70%, rgba(56,189,248,0.3), transparent 50%)",
                        "radial-gradient(circle at 20% 30%, rgba(56,189,248,0.3), transparent 50%)",
                      ],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <Gauge className="h-5 w-5 text-cyan-300" />
                      <h3 className="text-xl font-bold text-cyan-300">Performance Targets</h3>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      {[
                        { label: "LCP", value: "< 2.5s", target: "2.1s", icon: Rocket },
                        { label: "FID", value: "< 100ms", target: "45ms", icon: Zap },
                        { label: "CLS", value: "< 0.1", target: "0.05", icon: Layers },
                      ].map((metric) => {
                        const Icon = metric.icon;
                        return (
                          <div key={metric.label} className="rounded-xl border border-cyan-400/20 bg-zinc-950/40 p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Icon className="h-4 w-4 text-cyan-400" />
                              <span className="text-sm font-semibold text-white">{metric.label}</span>
                            </div>
                            <div className="text-2xl font-bold text-cyan-300">{metric.value}</div>
                            <div className="text-xs text-white/60 mt-1">Target: {metric.target}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </TiltCard>

                {/* Design Principles */}
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
                      <Code2 className="h-5 w-5 text-green-300" />
                      <h3 className="text-xl font-bold text-green-300">Design Principles</h3>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      {[
                        {
                          title: "Foundations First",
                          description: "Build scalable, maintainable architecture from the ground up. TypeScript-first, component-driven design.",
                          icon: Database,
                        },
                        {
                          title: "Security by Default",
                          description: "Zero-trust approach. Input validation, XSS prevention, secure authentication patterns.",
                          icon: Shield,
                        },
                        {
                          title: "Performance Critical",
                          description: "Optimize for Core Web Vitals. Code splitting, lazy loading, image optimization, minimal bundle size.",
                          icon: Zap,
                        },
                        {
                          title: "Accessibility Matters",
                          description: "WCAG 2.1 AA compliance. Keyboard navigation, screen reader support, semantic HTML.",
                          icon: Globe,
                        },
                      ].map((principle) => {
                        const Icon = principle.icon;
                        return (
                          <div key={principle.title} className="rounded-xl border border-green-400/20 bg-zinc-950/40 p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Icon className="h-4 w-4 text-green-400" />
                              <h4 className="font-semibold text-white">{principle.title}</h4>
                            </div>
                            <p className="text-sm text-white/70">{principle.description}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </TiltCard>

                {/* Architecture Stack */}
                <TiltCard as="div" className="p-6 border-purple-400/30 bg-purple-400/5 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 opacity-20"
                    animate={{
                      background: [
                        "radial-gradient(circle at 20% 30%, rgba(168,85,247,0.3), transparent 50%)",
                        "radial-gradient(circle at 80% 70%, rgba(168,85,247,0.3), transparent 50%)",
                        "radial-gradient(circle at 20% 30%, rgba(168,85,247,0.3), transparent 50%)",
                      ],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <Layers className="h-5 w-5 text-purple-300" />
                      <h3 className="text-xl font-bold text-purple-300">Architecture Stack</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="rounded-xl border border-purple-400/20 bg-zinc-950/40 p-4">
                        <h4 className="font-semibold text-white mb-2">Frontend</h4>
                        <p className="text-sm text-white/70">
                          Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion
                        </p>
                      </div>
                      <div className="rounded-xl border border-purple-400/20 bg-zinc-950/40 p-4">
                        <h4 className="font-semibold text-white mb-2">CMS & Data</h4>
                        <p className="text-sm text-white/70">
                          Strapi CMS, RESTful API, Server-side rendering, Static site generation
                        </p>
                      </div>
                      <div className="rounded-xl border border-purple-400/20 bg-zinc-950/40 p-4">
                        <h4 className="font-semibold text-white mb-2">Deployment & Monitoring</h4>
                        <p className="text-sm text-white/70">
                          Vercel Edge Network, Firebase Analytics, Performance monitoring, Error tracking
                        </p>
                      </div>
                    </div>
                  </div>
                </TiltCard>

                {/* Security Practices */}
                <TiltCard as="div" className="p-6 border-red-400/30 bg-red-400/5 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 opacity-20"
                    animate={{
                      background: [
                        "radial-gradient(circle at 20% 30%, rgba(248,113,113,0.3), transparent 50%)",
                        "radial-gradient(circle at 80% 70%, rgba(248,113,113,0.3), transparent 50%)",
                        "radial-gradient(circle at 20% 30%, rgba(248,113,113,0.3), transparent 50%)",
                      ],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <Lock className="h-5 w-5 text-red-300" />
                      <h3 className="text-xl font-bold text-red-300">Security Practices</h3>
                    </div>
                    <div className="space-y-3">
                      {[
                        "Environment variables for sensitive data",
                        "Content Security Policy (CSP) headers",
                        "XSS protection via React's built-in escaping",
                        "HTTPS-only communication",
                        "Input validation and sanitization",
                        "Rate limiting on API endpoints",
                      ].map((practice, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-white/70">
                          <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
                          {practice}
                        </div>
                      ))}
                    </div>
                  </div>
                </TiltCard>
              </div>
            </div>

            {/* Bottom glow accent */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-cyan-400/10 via-purple-400/5 to-transparent pointer-events-none" />
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

// Hook to detect Alt/Option + Click
export function useSystemModeTrigger() {
  const [isSystemModeOpen, setIsSystemModeOpen] = useState(false);

  useEffect(() => {
    const handleElementClick = (e: MouseEvent) => {
      // Check if Alt/Option key is pressed
      if (!e.altKey) return;

      const target = e.target as HTMLElement;
      
      // Check if clicking on Profile heading (h1 in Hero section with id="top")
      const heroSection = document.getElementById("top");
      const heroHeading = heroSection?.querySelector("h1");
      const isProfileHeading = heroHeading && (heroHeading.contains(target) || heroHeading === target);
      
      // Check if clicking on Experience section heading (h2 with "Work Experience" text)
      const experienceSection = document.getElementById("experience");
      const experienceTitle = experienceSection?.querySelector('h2');
      const isExperienceHeading = experienceTitle && (experienceTitle.contains(target) || experienceTitle === target);
      
      // Also check if clicking within the SectionTitle div area in Experience section
      const sectionTitleDiv = target.closest('[class*="mb-6"]');
      const isInExperienceSectionTitle = sectionTitleDiv && experienceSection?.contains(sectionTitleDiv);

      if (isProfileHeading || isExperienceHeading || isInExperienceSectionTitle) {
        e.preventDefault();
        e.stopPropagation();
        setIsSystemModeOpen(true);
      }
    };

    window.addEventListener("click", handleElementClick, true);
    return () => window.removeEventListener("click", handleElementClick, true);
  }, []);

  return { isSystemModeOpen, setIsSystemModeOpen };
}
