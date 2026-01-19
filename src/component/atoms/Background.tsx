"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * Ready Player One–inspired whole-site background (OASIS vibe)
 * - Subtle parallax grid + perspective
 * - Scanlines + noise
 * - Slow "energy sweep" + floating particles
 * - GPU-friendly (no canvas), respects reduced motion
 *
 * Usage:
 *  - Put <OasisSiteBackground /> once in app/layout.tsx (or your root Layout component)
 *  - Keep it above everything else with -z-10 and pointer-events-none
 */
export function Background() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const [isMounted, setIsMounted] = useState(false);

  // Parallax layers (calm)
  const gridY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -160]);
  const glowY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -80]);

  // Only generate particles after mount to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Generate floating particles (only on client side after mount)
  const particles = useMemo(() => {
    if (!isMounted) return [];
    
    const count = 18;
    return Array.from({ length: count }).map((_, i) => {
      const left = Math.round(Math.random() * 100);
      const top = Math.round(Math.random() * 100);
      const size = 1 + Math.random() * 2.4; // px
      const duration = 6 + Math.random() * 10; // seconds
      const delay = Math.random() * 2.5;
      const driftX = (Math.random() - 0.5) * 40;
      const driftY = 30 + Math.random() * 70;
      return { i, left, top, size, duration, delay, driftX, driftY };
    });
  }, [isMounted]);

  // Generate data stream columns (falling code effect)
  const dataStreams = useMemo(() => {
    if (!isMounted) return [];
    
    const count = 8;
    return Array.from({ length: count }).map((_, i) => {
      const left = (i * 12.5) + Math.random() * 5; // Spread across width
      const speed = 0.5 + Math.random() * 1.5; // Different speeds
      const opacity = 0.15 + Math.random() * 0.25;
      const delay = Math.random() * 2;
      const height = 20 + Math.random() * 40; // Stream height
      return { i, left, speed, opacity, delay, height };
    });
  }, [isMounted]);

  // Generate energy orbs (larger glowing particles)
  const energyOrbs = useMemo(() => {
    if (!isMounted) return [];
    
    const count = 6;
    return Array.from({ length: count }).map((_, i) => {
      const left = Math.round(Math.random() * 100);
      const top = Math.round(Math.random() * 100);
      const size = 3 + Math.random() * 4; // Larger than regular particles
      const duration = 8 + Math.random() * 12;
      const delay = Math.random() * 3;
      const pulse = 1 + Math.random() * 0.5; // Pulse intensity
      return { i, left, top, size, duration, delay, pulse };
    });
  }, [isMounted]);

  // Ready Player One quotes/dialog (subtle background elements)
  const quotes = useMemo(() => {
    if (!isMounted) return [];
    
    const movieQuotes = [
      "Welcome to the OASIS",
      "People come to the OASIS for all the things they can do, but they stay for all the things they can be",
      "Reality is the only thing that's real",
      "You can be whoever you want to be",
      "The OASIS was a place where the limits of reality were your own imagination",
      "I created the OASIS because I never felt at home in the real world",
    ];
    
    return movieQuotes.map((quote, i) => {
      const left = 10 + Math.random() * 80; // Spread across width
      const top = 10 + Math.random() * 80; // Spread across height
      const rotation = (Math.random() - 0.5) * 15; // Slight rotation
      const duration = 15 + Math.random() * 10;
      const delay = Math.random() * 5;
      return { i, quote, left, top, rotation, duration, delay };
    });
  }, [isMounted]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base dark */}
      <div className="absolute inset-0 bg-black" />

      {/* Subtle ambient glows */}
      <motion.div
        style={{ y: glowY }}
        className="absolute inset-0 opacity-100"
        aria-hidden="true"
      >
        <div className="absolute -top-48 left-1/2 h-[720px] w-[720px] -translate-x-1/2 rounded-full bg-white/6 blur-3xl" />
        <div className="absolute top-1/3 right-[-180px] h-[520px] w-[520px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-[-260px] left-[-220px] h-[640px] w-[640px] rounded-full bg-white/5 blur-3xl" />
      </motion.div>

      {/* Scanlines (very subtle) */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        aria-hidden="true"
        style={{
          background:
            "repeating-linear-gradient(to bottom, rgba(255,255,255,0.14) 0px, rgba(255,255,255,0.14) 1px, transparent 2px, transparent 7px)",
        }}
      />

      {/* Film grain / noise (CSS-only) */}
      <div
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
        aria-hidden="true"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='.25'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Perspective grid (parallax) */}
      <motion.div
        style={{ y: gridY }}
        className="absolute inset-[-40%] opacity-[0.12]"
        aria-hidden="true"
      >
        {/* A "floor" grid with slight perspective */}
        <div
          className="absolute left-1/2 top-1/2 h-[160%] w-[160%] -translate-x-1/2 -translate-y-1/2"
          style={{
            transform: "translate(-50%, -50%) rotateX(70deg) rotateZ(20deg)",
            transformOrigin: "center",
          }}
        >
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
              backgroundSize: "70px 70px",
            }}
          />
        </div>

        {/* A softer "vertical" grid behind */}
        <div
          className="absolute inset-0 opacity-[0.55]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.09) 1px, transparent 1px)",
            backgroundSize: "96px 96px",
          }}
        />
      </motion.div>

      {/* Energy sweep (slow, classy) */}
      {!reduce && (
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 opacity-60"
          initial={{ x: "-20%" }}
          animate={{ x: "20%" }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(600px circle at 50% 50%, rgba(168,85,247,0.10), rgba(59,130,246,0.08), rgba(0,0,0,0) 70%)",
          }}
        />
      )}

      {/* Data streams (falling code effect) */}
      {!reduce && isMounted && (
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          {dataStreams.map((stream) => (
            <motion.div
              key={`stream-${stream.i}`}
              className="absolute top-0 w-px"
              style={{
                left: `${stream.left}%`,
                height: `${stream.height}%`,
                background: `linear-gradient(to bottom, 
                  rgba(56,189,248,${stream.opacity}) 0%, 
                  rgba(168,85,247,${stream.opacity * 0.7}) 50%, 
                  transparent 100%)`,
                boxShadow: `0 0 ${stream.height / 2}px rgba(56,189,248,${stream.opacity * 0.5})`,
              }}
              initial={{ y: "-100%", opacity: 0 }}
              animate={{
                y: "200%",
                opacity: [0, stream.opacity, stream.opacity, 0],
              }}
              transition={{
                duration: stream.speed * 10,
                delay: stream.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}

      {/* Energy orbs (larger glowing particles) */}
      {!reduce && isMounted && (
        <div className="absolute inset-0" aria-hidden="true">
          {energyOrbs.map((orb) => (
            <motion.div
              key={`orb-${orb.i}`}
              className="absolute rounded-full"
              style={{
                left: `${orb.left}%`,
                top: `${orb.top}%`,
                width: `${orb.size}px`,
                height: `${orb.size}px`,
                background: "radial-gradient(circle, rgba(56,189,248,0.4), rgba(168,85,247,0.2), transparent)",
                boxShadow: `0 0 ${orb.size * 2}px rgba(56,189,248,0.4), 0 0 ${orb.size * 3}px rgba(168,85,247,0.3)`,
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: [0, 0.6, 0.3, 0.6],
                scale: [0.5, orb.pulse, 0.8, orb.pulse],
                x: [0, (Math.random() - 0.5) * 20, 0],
                y: [0, (Math.random() - 0.5) * 20, 0],
              }}
              transition={{
                duration: orb.duration,
                delay: orb.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Floating particles - only render after mount to avoid hydration mismatch */}
      {!reduce && isMounted && (
        <div className="absolute inset-0" aria-hidden="true">
          {particles.map((p) => (
            <motion.span
              key={p.i}
              className="absolute rounded-full bg-white/60"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                boxShadow:
                  "0 0 10px rgba(168,85,247,0.30), 0 0 16px rgba(59,130,246,0.20)",
              }}
              initial={{ opacity: 0.0, y: 0, x: 0 }}
              animate={{
                opacity: [0.0, 0.55, 0.25],
                y: [-p.driftY, 0],
                x: [p.driftX, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Holographic glitch overlay (subtle scan lines that flicker) */}
      {!reduce && isMounted && (
        <motion.div
          className="absolute inset-0 opacity-20"
          aria-hidden="true"
          animate={{
            opacity: [0.15, 0.25, 0.18, 0.22, 0.15],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(56,189,248,0.03) 2px,
              rgba(56,189,248,0.03) 4px
            )`,
            mixBlendMode: "screen",
          }}
        />
      )}

      {/* Hexagonal grid overlay (circuit board pattern) */}
      {!reduce && (
        <div
          className="absolute inset-0 opacity-[0.04]"
          aria-hidden="true"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z' fill='none' stroke='rgba(56,189,248,0.3)' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "120px 120px",
          }}
        />
      )}

      {/* Ready Player One quotes/dialog (subtle floating text) */}
      {!reduce && isMounted && (
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          {quotes.map((q) => (
            <motion.div
              key={`quote-${q.i}`}
              className="absolute text-cyan-300/10 font-mono text-xs md:text-sm pointer-events-none select-none"
              style={{
                left: `${q.left}%`,
                top: `${q.top}%`,
                transform: `rotate(${q.rotation}deg)`,
                textShadow: "0 0 10px rgba(56,189,248,0.3)",
                whiteSpace: "nowrap",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: [0, 0.08, 0.12, 0.08, 0],
                scale: [0.8, 1, 1.05, 1, 0.9],
              }}
              transition={{
                duration: q.duration,
                delay: q.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {q.quote}
            </motion.div>
          ))}
        </div>
      )}

      {/* Character silhouettes (abstract geometric representations) */}
      {!reduce && isMounted && (
        <div className="absolute inset-0" aria-hidden="true">
          {/* Parzival silhouette (abstract avatar representation) */}
          <motion.div
            className="absolute top-1/4 right-[5%] opacity-[0.03]"
            animate={{
              opacity: [0.02, 0.04, 0.02],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="relative w-32 h-40">
              {/* Abstract avatar shape */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border border-cyan-400/20" />
              <div className="absolute top-12 left-1/2 -translate-x-1/2 w-20 h-24 border border-cyan-400/15 rounded-lg" />
              <div className="absolute top-32 left-1/2 -translate-x-1/2 w-8 h-8 border border-cyan-400/15 rounded-full" />
            </div>
          </motion.div>

          {/* Art3mis silhouette */}
          <motion.div
            className="absolute bottom-1/4 left-[8%] opacity-[0.03]"
            animate={{
              opacity: [0.02, 0.04, 0.02],
              y: [0, 10, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          >
            <div className="relative w-28 h-36">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full border border-purple-400/20" />
              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-16 h-20 border border-purple-400/15 rounded-lg" />
            </div>
          </motion.div>

          {/* IOI logo abstraction (geometric pattern) */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02]"
            animate={{
              opacity: [0.015, 0.025, 0.015],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-40 h-40 relative">
              <div className="absolute inset-0 border-2 border-red-400/10 rotate-45 rounded-lg" />
              <div className="absolute inset-4 border border-red-400/10 -rotate-45" />
            </div>
          </motion.div>
        </div>
      )}

             {/* Holographic Glitch Artifacts - Random glitch lines */}
             {!reduce && isMounted && (
               <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                 {Array.from({ length: 4 }).map((_, i) => (
                   <motion.div
                     key={i}
                     className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
                     initial={{
                       y: Math.random() * window.innerHeight,
                       opacity: 0,
                       scaleX: 0,
                     }}
                     animate={{
                       opacity: [0, 0.8, 0],
                       scaleX: [0, 1, 0],
                       y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
                     }}
                     transition={{
                       duration: 0.4,
                       repeat: Infinity,
                       repeatDelay: 5 + Math.random() * 10,
                       ease: "linear",
                     }}
                   />
                 ))}
               </div>
             )}

             {/* Digital Grid Distortion - Interactive grid that warps */}
             {!reduce && isMounted && (
               <motion.div
                 className="absolute inset-0 opacity-[0.04]"
                 aria-hidden="true"
                 animate={{
                   backgroundImage: [
                     "radial-gradient(circle at 20% 50%, rgba(56,189,248,0.1) 0%, transparent 50%)",
                     "radial-gradient(circle at 80% 50%, rgba(168,85,247,0.1) 0%, transparent 50%)",
                     "radial-gradient(circle at 50% 20%, rgba(34,197,94,0.1) 0%, transparent 50%)",
                     "radial-gradient(circle at 20% 50%, rgba(56,189,248,0.1) 0%, transparent 50%)",
                   ],
                 }}
                 transition={{
                   duration: 8,
                   repeat: Infinity,
                   ease: "easeInOut",
                 }}
                 style={{
                   backgroundSize: "200% 200%",
                 }}
               />
             )}

             {/* Terminal-Style Code Fragments */}
             {!reduce && isMounted && (
               <div className="absolute inset-0 pointer-events-none opacity-[0.04]" aria-hidden="true">
                 {Array.from({ length: 12 }).map((_, i) => {
                   const fragments = [
                     "const oasis = { universe: true }",
                     "function exploreOASIS() { return 'infinite' }",
                     "import { Parzival } from './players'",
                     "class VRExperience extends Reality {}",
                     "const quest = new EasterEgg()",
                     "interface OASIS { dimensions: Infinity }",
                     "type Player = { avatar: string, skills: number[] }",
                     "export default class OASISEngine",
                     "const matrix = new VirtualReality()",
                     "function login(user: Player) { enterOASIS() }",
                     "const world = createVirtualUniverse()",
                     "interface Character { id: string, power: number }",
                   ];
                   
                   return (
                     <motion.p
                       key={i}
                       className="absolute font-mono text-xs text-cyan-300/30"
                       style={{
                         left: `${10 + Math.random() * 80}%`,
                         top: `${10 + Math.random() * 80}%`,
                         rotate: Math.random() * 5 - 2.5,
                       }}
                       initial={{ opacity: 0 }}
                       animate={{
                         opacity: [0, 0.6, 0.6, 0],
                       }}
                       transition={{
                         duration: 4 + Math.random() * 6,
                         delay: Math.random() * 8,
                         repeat: Infinity,
                         repeatDelay: 10 + Math.random() * 15,
                         ease: "easeInOut",
                       }}
                     >
                       {fragments[i % fragments.length]}
                     </motion.p>
                   );
                 })}
               </div>
             )}

             {/* Energy Burst Particles - Appear on scroll */}
             {!reduce && isMounted && (
               <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                 {Array.from({ length: 8 }).map((_, i) => (
                   <motion.div
                     key={i}
                     className="absolute rounded-full"
                     style={{
                       left: `${Math.random() * 100}%`,
                       top: `${Math.random() * 100}%`,
                       width: `${4 + Math.random() * 8}px`,
                       height: `${4 + Math.random() * 8}px`,
                       background: "radial-gradient(circle, rgba(56,189,248,0.8), transparent)",
                       boxShadow: "0 0 20px rgba(56,189,248,0.6)",
                     }}
                     initial={{ opacity: 0, scale: 0 }}
                     animate={{
                       opacity: [0, 1, 1, 0],
                       scale: [0, 1.5, 1, 0],
                       x: [(Math.random() - 0.5) * 100],
                       y: [(Math.random() - 0.5) * 100],
                     }}
                     transition={{
                       duration: 2 + Math.random() * 2,
                       delay: Math.random() * 5,
                       repeat: Infinity,
                       repeatDelay: 8 + Math.random() * 12,
                       ease: "easeOut",
                     }}
                   />
                 ))}
               </div>
             )}

             {/* Holographic Scan Lines - Moving horizontal scan */}
             {!reduce && (
               <motion.div
                 className="absolute inset-0 pointer-events-none opacity-20"
                 aria-hidden="true"
                 animate={{
                   y: ["-100%", "100%"],
                 }}
                 transition={{
                   duration: 4,
                   repeat: Infinity,
                   repeatDelay: 2,
                   ease: "linear",
                 }}
                 style={{
                   background: "linear-gradient(to bottom, transparent 0%, rgba(56,189,248,0.4) 50%, transparent 100%)",
                   height: "2px",
                 }}
               />
             )}

             {/* Vignette for focus */}
             <div
               className="absolute inset-0"
               aria-hidden="true"
               style={{
                 background:
                   "radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.75) 100%)",
               }}
             />
           </div>
         );
       }
