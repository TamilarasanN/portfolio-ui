"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { ThemeValidationContent } from "../sections/ThemeValidation";

export function ParzivalNPC() {
  const reduce = useReducedMotion();
  const [modalOpen, setModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setModalOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen]);

  const modalContent = (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            className="relative w-full max-w-6xl max-h-[95vh] overflow-hidden rounded-3xl border-2 border-cyan-400/30 bg-zinc-950 shadow-[0_0_100px_rgba(56,189,248,0.3)] flex flex-col"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="OASIS Theme Validation"
          >
            {/* OASIS Header Bar */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400" />

            {/* Scanline overlay - Disabled on mobile to prevent blinking */}
            <div
              className="absolute inset-0 pointer-events-none opacity-10 hidden md:block"
              style={{
                background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(56,189,248,0.3) 2px, rgba(56,189,248,0.3) 4px)",
              }}
            />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-cyan-400/20 bg-zinc-950/50 px-6 py-4 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <motion.div
                  className="text-4xl"
                  animate={reduce || isMobile ? {} : { rotate: [0, 10, -10, 0] }}
                  transition={reduce || isMobile ? {} : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  🎮
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-cyan-300">Parzival</h2>
                  <p className="text-sm text-white/60">Welcome to the OASIS</p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg border border-cyan-400/30 bg-cyan-400/10 p-2 text-cyan-300 hover:bg-cyan-400/20 transition cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Area - Scrollable */}
            <div className="relative z-10 flex-1 overflow-y-auto min-h-0">
              <div className="p-6">
                <ThemeValidationContent />
              </div>
            </div>

            {/* Bottom glow accent */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-cyan-400/10 to-transparent pointer-events-none" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Floating Parzival NPC Button */}
            <motion.button
              onClick={() => setModalOpen(true)}
              className="fixed bottom-6 right-6 z-40 group cursor-pointer"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Talk to Parzival"
            >
        {/* Glow effect - Disabled on mobile to prevent blinking */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-green-400/30 blur-xl hidden md:block"
          animate={reduce || isMobile ? {} : {
            opacity: [0.4, 0.7, 0.4],
            scale: [1, 1.2, 1],
          }}
          transition={reduce || isMobile ? {} : {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* NPC Avatar - Parzival Character from Ready Player One */}
        <motion.div
          className="relative w-24 h-24 rounded-2xl border-2 border-green-400/50 bg-gradient-to-br from-green-500/20 via-cyan-500/20 to-green-500/20 backdrop-blur-sm flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.5)] overflow-hidden"
          animate={reduce || isMobile ? {} : {
            y: [0, -8, 0],
          }}
          transition={reduce || isMobile ? {} : {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Parzival Avatar Image */}
          {!imageError ? (
            <div className="relative w-full h-full">
              <Image
                src="/parzival-avatar.jpeg"
                alt="Parzival - Ready Player One Character"
                fill
                className="object-cover rounded-2xl"
                priority
                unoptimized={true}
                sizes="96px"
                onError={() => setImageError(true)}
              />
              {/* Overlay glow effect - enhanced for 3D character */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-400/10 via-cyan-400/5 to-transparent pointer-events-none" />
              {/* Blue lightning glow effect to match character markings */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-cyan-400/15 via-transparent to-green-400/10 pointer-events-none mix-blend-overlay" />
            </div>
          ) : (
            /* Fallback: CSS-based Parzival representation */
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Head with helmet */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full border-2 border-green-400/70 bg-gradient-to-b from-green-500/30 to-green-600/20">
                {/* VR Visor - iconic rectangular visor */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-8 h-4 rounded-sm border border-green-400/90 bg-gradient-to-b from-green-400/40 to-green-600/30">
                  {/* Visor reflection */}
                  <div className="absolute top-1 left-2 w-2 h-1 rounded-sm bg-green-300/60" />
                </div>
                {/* Head detail */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-5 h-2 rounded-full bg-green-400/40" />
              </div>
              
              {/* Body/Torso */}
              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-12 h-8 rounded-sm border border-green-400/60 bg-gradient-to-b from-green-500/25 to-green-600/15">
                {/* Chest detail */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-7 h-1.5 rounded-full bg-green-400/30" />
              </div>
              
              {/* Left Arm */}
              <div className="absolute top-11 left-1 w-3.5 h-7 rounded-sm border border-green-400/60 bg-green-500/20 rotate-12 origin-top" />
              
              {/* Right Arm */}
              <div className="absolute top-11 right-1 w-3.5 h-7 rounded-sm border border-green-400/60 bg-green-500/20 -rotate-12 origin-top" />
              
              {/* Glowing energy effect */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-green-400/20 blur-sm" />
            </div>
          )}
          
          {/* Pulse indicator - Disabled on mobile to prevent blinking */}
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-zinc-950 z-10 hidden md:block"
            animate={reduce || isMobile ? {} : {
              scale: [1, 1.3, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={reduce || isMobile ? {} : {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Animated glow effect - Disabled on mobile to prevent blinking */}
          <motion.div
            className="absolute inset-0 rounded-2xl hidden md:block"
            animate={reduce || isMobile ? {} : {
              boxShadow: [
                "0 0 20px rgba(34,197,94,0.5)",
                "0 0 40px rgba(34,197,94,0.8)",
                "0 0 20px rgba(34,197,94,0.5)",
              ],
            }}
            transition={reduce || isMobile ? {} : {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Tooltip */}
        <motion.div
          className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          initial={{ x: 10, opacity: 0 }}
          whileHover={{ x: 0, opacity: 1 }}
        >
          <div className="bg-zinc-950 border border-green-400/30 rounded-lg px-3 py-2 text-xs text-white whitespace-nowrap shadow-xl">
            Talk to Parzival
            <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-green-400/30" />
          </div>
        </motion.div>
      </motion.button>

      {/* Render modal using portal */}
      {mounted && typeof window !== "undefined" && createPortal(modalContent, document.body)}
    </>
  );
}
