"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { TiltCard } from "./TiltCard";
import { MagneticButton } from "./MagneticButton";

interface ProfileCardModalProps {
  open: boolean;
  onClose: () => void;
  profile: {
    name: string;
    title: string;
    photoUrl?: string;
  };
}

export function ProfileCardModal({ open, onClose, profile }: ProfileCardModalProps) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const modalContent = (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.2 }}
        >
                <div
                  className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
                  onClick={onClose}
                  aria-hidden="true"
                />
          <motion.div
            className="relative w-full max-w-md"
            initial={reduce ? { opacity: 1, scale: 1 } : { scale: 0.9, opacity: 0 }}
            animate={reduce ? { opacity: 1, scale: 1 } : { scale: 1, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { scale: 0.9, opacity: 0 }}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 24 }}
            role="dialog"
            aria-modal="true"
            aria-label="Profile card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button - outside TiltCard to avoid event issues */}
            <div 
              className="absolute top-2 right-2 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <MagneticButton
                variant="ghost"
                onClick={() => onClose()}
                ariaLabel="Close profile card"
                className="rounded-full p-2 bg-zinc-950/80 backdrop-blur-sm border-white/20 hover:border-cyan-400/50"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </MagneticButton>
            </div>

            <TiltCard as="div" className="relative overflow-hidden p-8">
              {/* Enhanced neon border gradient */}
              <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-100">
                <div className="absolute -inset-[2px] rounded-3xl bg-[conic-gradient(from_180deg,rgba(56,189,248,0.8),rgba(168,85,247,0.8),rgba(34,197,94,0.6),rgba(56,189,248,0.8))] blur-[12px] animate-pulse" />
              </div>

              {/* Outer glow effect */}
              <div className="pointer-events-none absolute -inset-12 rounded-3xl opacity-60">
                <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(closest-side,rgba(56,189,248,0.3),rgba(168,85,247,0.2),rgba(0,0,0,0))] blur-xl" />
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center">
                {/* Profile Picture */}
                <div className="relative mb-6 h-48 w-48 overflow-hidden rounded-2xl border-4 border-white/20 bg-zinc-950/40 shadow-[0_0_40px_rgba(56,189,248,0.4)]">
                  {profile.photoUrl ? (
                    <Image
                      src={profile.photoUrl}
                      alt={`${profile.name} profile picture`}
                      fill
                      className="object-cover"
                      priority
                      unoptimized={true}
                      sizes="192px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-400/20 to-purple-400/20">
                      <div className="text-6xl font-bold text-white/40">
                        {profile.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  )}
                  {/* Inner glow on image */}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.15),transparent_70%)]" />
                </div>

                {/* Name */}
                <h2 className="mb-2 text-3xl font-bold text-white bg-gradient-to-r from-cyan-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                  {profile.name}
                </h2>

                {/* Job Title */}
                <p className="text-lg text-cyan-300/80 font-medium">{profile.title}</p>

                {/* Decorative neon line */}
                <div className="mt-6 h-px w-full max-w-xs bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
              </div>

              {/* Bottom glow accent */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 rounded-3xl bg-gradient-to-t from-cyan-400/10 via-transparent to-transparent" />
            </TiltCard>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  if (typeof window !== "undefined") {
    return createPortal(modalContent, document.body);
  }

  return null;
}
