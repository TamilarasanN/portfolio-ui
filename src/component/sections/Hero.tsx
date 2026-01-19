"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MapPin, Briefcase, ShieldCheck, Rocket, Sparkles,Layers } from "lucide-react";
import { MagneticButton } from "../interactive/MagneticButton";
import { TiltCard } from "../interactive/TiltCard";
import { CopyButton } from "../atoms/CopyButton";
import { Pill } from "../atoms/Pill";
interface HeroProps {
  profile: {
    location: string;
    status: string;
    email: string;
    phone: string | string[]; // Phone can be a single string or array
  };
}

export function Hero({ profile }: HeroProps) {
  const reduce = useReducedMotion();

  return (
    <header id="top" className="mx-auto max-w-6xl px-4 py-12 md:py-16 relative">
      {/* OASIS-themed gradient background */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-3xl opacity-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-purple-400/10 to-fuchsia-400/10 rounded-3xl blur-3xl" />
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2 md:items-center">
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.5 }}
            className="inline-block rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-1.5 text-xs font-semibold text-cyan-300 mb-4"
          >
            WELCOME TO THE OASIS
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.5, delay: 0.1 }}
            className="text-4xl font-semibold leading-[1.06] md:text-6xl relative"
          >
            Building scalable, secure, high-performance
            <motion.span 
              className="bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-purple-300 bg-clip-text text-transparent relative inline-block"
              animate={{
                textShadow: [
                  "0 0 0 transparent",
                  "0 0 20px rgba(56,189,248,0.3)",
                  "0 0 30px rgba(168,85,247,0.3)",
                  "0 0 20px rgba(56,189,248,0.3)",
                  "0 0 0 transparent",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {" "}
              web & mobile experiences
            </motion.span>
          </motion.h1>

          <p className="mt-4 text-white/70">
            Senior Software Engineer with 9+ years of experience delivering production-grade systems across government, enterprise, and fintech-style platforms.
            Specialized in React, Next.js, TypeScript, and React Native, with a strong focus on clean architecture, performance optimization, and secure, reliable UI systems that scale.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Pill variant="cyan">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span>{profile.location}</span>
            </Pill>
            <Pill variant="green">
              <Briefcase className="h-3.5 w-3.5 shrink-0" />
              <span>{profile.status}</span>
            </Pill>
            <Pill variant="red">
              <Layers className="h-3.5 w-3.5 shrink-0" />
              <span>Enterprise-Grade</span>
            </Pill>
            <Pill variant="blue">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              <span>Scalable Systems</span>
            </Pill>
            <Pill variant="purple">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
              <span>Security-Focused</span>
            </Pill>
            <Pill variant="orange">
              <Rocket className="h-3.5 w-3.5 shrink-0" />
              <span>Performance-driven</span>
            </Pill>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <MagneticButton variant="neon" href="#contact" ariaLabel="Go to contact">
              <Sparkles className="h-4 w-4" /> Contact
            </MagneticButton>
            <CopyButton value={profile.email} label="email" />
            {(Array.isArray(profile.phone) ? profile.phone : [profile.phone]).map((phone, index) => (
              <CopyButton 
                key={index}
                value={phone} 
                label={index > 0 ? `phone ${index + 1}` : "phone"} 
              />
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <TiltCard as="div" className="p-5 shadow-[0_0_0_1px_rgba(56,189,248,0.12),0_30px_120px_-70px_rgba(168,85,247,0.65)] relative overflow-hidden">
            {/* Animated background glow */}
            <motion.div
              className="absolute inset-0 opacity-40"
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
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { t: "Primary", h: "React • Next.js • TypeScript • Node.js", d: "Designing scalable component systems, high-performance UIs, and SEO-ready SSR applications.", color: "cyan" as const },
                  { t: "Mobile", h: "React Native • Android (Java)", d: "Building secure mobile experiences with biometric auth, native integrations, and reliable store releases.", color: "green" as const },
                  { t: "State & Data", h: "Redux Toolkit • Zustand", d: "Clear separation of client and server state with predictable, maintainable data flows.", color: "purple" as const },
                  { t: "Quality", h: "Jest • React Testing Library • CI/CD", d: "Strong testing culture, automated pipelines, and confidence in production releases.", color: "orange" as const },
                ].map((x) => {
                  const colorClassMap: Record<string, string> = {
                    cyan: "border-cyan-400/20 bg-cyan-400/5",
                    green: "border-green-400/20 bg-green-400/5",
                    purple: "border-purple-400/20 bg-purple-400/5",
                    orange: "border-orange-400/20 bg-orange-400/5",
                  };
                  const colorClass = colorClassMap[x.color] || colorClassMap.cyan;
                  
                  return (
                    <div key={x.t} className={`rounded-2xl border ${colorClass} p-4 backdrop-blur-sm transition-all hover:border-opacity-40`}>
                      <div className={`text-xs font-semibold ${
                        x.color === "cyan" ? "text-cyan-300" :
                        x.color === "green" ? "text-green-300" :
                        x.color === "purple" ? "text-purple-300" :
                        "text-orange-300"
                      }`}>{x.t}</div>
                      <div className="mt-1 font-semibold text-white">{x.h}</div>
                      <div className="mt-2 text-sm text-white/70">{x.d}</div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-400/10 via-purple-400/10 to-fuchsia-400/10 p-4 backdrop-blur-sm">
                <div className="text-xs font-semibold text-cyan-300">Quick pitch</div>
                <div className="mt-1 text-sm text-white/80">
                  I specialize in building strong foundations: simple, well-defined systems that scale with product and team growth. I mentor engineers through code reviews, shared patterns, and clear documentation, while delivering features quickly with guardrails for performance, security, and reliability.
                </div>
              </div>
            </div>
          </TiltCard>
        </div>
      </div>
    </header>
  );
}
