"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MagneticButton } from "./MagneticButton";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Use portal to render modal at body level, ensuring it's always positioned relative to viewport
  const modalContent = (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-end justify-center p-4 md:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reduce ? { duration: 0 } : undefined}
        >
          <div 
            className="absolute inset-0 bg-black/70 cursor-pointer" 
            onClick={onClose} 
            aria-hidden="true"
          />
          <motion.div
            className="relative w-full max-w-3xl max-h-[80vh] overflow-hidden rounded-3xl border-2 border-cyan-400/30 bg-zinc-950 shadow-[0_0_100px_rgba(56,189,248,0.3)] flex flex-col"
            initial={reduce ? { opacity: 1 } : { y: 24, scale: 0.98, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { y: 0, scale: 1, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { y: 24, scale: 0.98, opacity: 0 }}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 24 }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            {/* OASIS neon header bar */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 via-purple-400 via-fuchsia-400/50 to-transparent" />
            
            {/* Outer glow effect */}
            <div className="pointer-events-none absolute -inset-8 rounded-3xl opacity-40">
              <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(closest-side,rgba(56,189,248,0.25),rgba(168,85,247,0.15),rgba(0,0,0,0))] blur-xl" />
            </div>
            
            {/* Scanline overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.08]"
              style={{
                background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(56,189,248,0.3) 2px, rgba(56,189,248,0.3) 4px)",
              }}
            />
            
            {/* Animated background glow */}
            <motion.div
              className="absolute inset-0 opacity-20"
              animate={{
                background: [
                  "radial-gradient(circle at 20% 30%, rgba(56,189,248,0.15), transparent 50%)",
                  "radial-gradient(circle at 80% 70%, rgba(168,85,247,0.15), transparent 50%)",
                  "radial-gradient(circle at 20% 30%, rgba(56,189,248,0.15), transparent 50%)",
                ],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative z-10 flex items-center justify-between border-b border-cyan-400/20 bg-zinc-950/50 backdrop-blur-sm px-6 py-4 shrink-0">
              <div>
                <div className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">Project Details</div>
                <div className="text-xl font-bold bg-gradient-to-r from-cyan-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent mt-1">
                  {title}
                </div>
              </div>
              <MagneticButton 
                variant="ghost" 
                onClick={onClose} 
                ariaLabel="Close modal"
                className="border-cyan-400/20 bg-cyan-400/5 hover:border-cyan-400/30 hover:bg-cyan-400/10 text-cyan-300"
              >
                Close
              </MagneticButton>
            </div>

            <div className="relative z-10 px-6 py-5 overflow-y-auto flex-1">
              {/* Bottom glow accent */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-cyan-400/10 via-purple-400/5 to-transparent pointer-events-none" />
              <div className="relative">{children}</div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  // Render modal using portal at document.body level to ensure it's always on top
  if (typeof window !== "undefined") {
    return createPortal(modalContent, document.body);
  }

  return null;
}
