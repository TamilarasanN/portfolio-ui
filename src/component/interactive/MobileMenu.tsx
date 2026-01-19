"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Linkedin, X, ExternalLink } from "lucide-react";
import { MagneticButton } from "./MagneticButton";
interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  profile: {
    name: string;
    title: string;
    status: string;
    linkedin: string;
    resumeUrl: string;
    photoUrl?: string;
  };
  onProfileClick?: () => void;
}

export function MobileMenu({ open, onClose, profile, onProfileClick }: MobileMenuProps) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reduce ? { duration: 0 } : undefined}
        >
          <div className="absolute inset-0 bg-black/70 cursor-pointer" onClick={onClose} aria-hidden="true" />
          <motion.div
            className="absolute right-0 top-0 h-full w-[86%] max-w-sm border-l border-cyan-400/20 bg-[#070712] p-4 relative overflow-hidden"
            initial={reduce ? { x: 0 } : { x: 50, opacity: 0 }}
            animate={reduce ? { x: 0 } : { x: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { x: 50, opacity: 0 }}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 24 }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile menu"
          >
            {/* OASIS gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-purple-400/5 to-fuchsia-400/5 opacity-50" />
            {/* Top border glow */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="inline-block rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1 text-xs font-semibold text-cyan-300">
                  MENU
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-2 text-cyan-300 hover:bg-cyan-400/10 hover:border-cyan-400/30 transition cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Profile Section - Mobile */}
              <button
                type="button"
                onClick={() => {
                  if (onProfileClick) {
                    onProfileClick();
                  }
                  onClose();
                }}
                className="w-full mb-5 p-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 hover:bg-cyan-400/10 hover:border-cyan-400/30 transition cursor-pointer"
                aria-label="View profile"
              >
                <div className="flex items-center gap-3">
                  {profile.photoUrl ? (
                    <div className="relative h-14 w-14 overflow-hidden rounded-xl border-2 border-white/20 bg-zinc-950/40 transition-all">
                      <Image
                        src={profile.photoUrl}
                        alt={`${profile.name} profile picture`}
                        fill
                        className="object-cover"
                        priority
                        unoptimized={true}
                        sizes="56px"
                      />
                    </div>
                  ) : (
                    <div className="relative h-14 w-14 rounded-2xl border border-white/10 bg-white/5">
                      <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_35%_30%,rgba(56,189,248,0.35),transparent_55%)]" />
                    </div>
                  )}
                  <div className="flex-1 text-left">
                    <div className="text-base font-semibold text-white">{profile.name}</div>
                    <div className="text-sm text-cyan-300/70 font-medium">{profile.status}</div>
                    <div className="text-xs text-white/50 mt-0.5">{profile.title}</div>
                  </div>
                </div>
              </button>

              <div className="mt-5 grid gap-2">
                {[
                  ["Featured", "#featured-projects", "green"],
                  ["Projects", "#projects", "purple"],
                  ["Experience", "#experience", "cyan"],
                  ["Skills", "#skills", "orange"],
                  ["How I Work", "#how", "red"],
                  ["Theme", "#theme", "cyan"],
                  ["Contact", "#contact", "purple"],
                ].map(([label, href, color]) => {
                  const colorClasses = {
                    cyan: "border-cyan-400/20 bg-cyan-400/5 text-cyan-300 hover:bg-cyan-400/10 hover:border-cyan-400/30",
                    green: "border-green-400/20 bg-green-400/5 text-green-300 hover:bg-green-400/10 hover:border-green-400/30",
                    purple: "border-purple-400/20 bg-purple-400/5 text-purple-300 hover:bg-purple-400/10 hover:border-purple-400/30",
                    orange: "border-orange-400/20 bg-orange-400/5 text-orange-300 hover:bg-orange-400/10 hover:border-orange-400/30",
                    red: "border-red-400/20 bg-red-400/5 text-red-300 hover:bg-red-400/10 hover:border-red-400/30",
                  };
                  return (
                    <a
                      key={href}
                      href={href}
                      onClick={onClose}
                      className={`rounded-xl border px-3 py-2 text-sm font-medium transition cursor-pointer ${colorClasses[color as keyof typeof colorClasses] || colorClasses.cyan}`}
                    >
                      {label}
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 border-t border-cyan-400/20 pt-4 relative">
              {/* Divider glow */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
              
              <MagneticButton
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                variant="ghost"
                className="w-full border-cyan-400/20 bg-cyan-400/5 hover:border-cyan-400/30 hover:bg-cyan-400/10"
                ariaLabel="Open LinkedIn"
              >
                <Linkedin className="h-4 w-4" /> LinkedIn
              </MagneticButton>

              <div className="mt-3" />

              <MagneticButton
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                variant="neon"
                className="w-full"
                ariaLabel="Open resume"
              >
                <ExternalLink className="h-4 w-4" /> Resume
              </MagneticButton>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
