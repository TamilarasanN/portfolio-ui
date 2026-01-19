"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Linkedin } from "lucide-react";
import { SectionTitle } from "../atoms/SectionTitle";
import { TiltCard } from "../interactive/TiltCard";
import { CopyButton } from "../atoms/CopyButton";
import { MagneticButton } from "../interactive/MagneticButton";
const sectionReveal = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55 } },
};

interface ContactProps {
  profile: {
    email: string;
    phone: string | string[]; // Phone can be a single string or array
    linkedin: string;
    name: string;
  };
}

export function Contact({ profile }: ContactProps) {
  return (
    <motion.section
      id="contact"
      className="mt-14 scroll-mt-24"
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <SectionTitle
        kicker="LET'S CONNECT"
        title="Contact"
        desc="Fastest way: email or LinkedIn."
        kickerColor="purple"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <TiltCard as="div" className="p-6 relative overflow-hidden border-cyan-400/30">
          {/* Animated background glow */}
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
            <div className="text-xs font-semibold text-cyan-300">Email</div>
            <div className="mt-1 text-lg font-semibold text-white">{profile.email}</div>
            <div className="mt-4 flex flex-wrap gap-3">
              <MagneticButton
                href={`mailto:${profile.email}?subject=${encodeURIComponent(
                  "Opportunity – Frontend / Full-Stack / Mobile"
                )}`}
                variant="neon"
                ariaLabel="Email me"
              >
                <Mail className="h-4 w-4" />
                Email me
              </MagneticButton>
              <CopyButton value={profile.email} label="email" />
            </div>
          </div>
        </TiltCard>

        <TiltCard as="div" className="p-6 relative overflow-hidden border-green-400/30">
          {/* Animated background glow */}
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
            <div className="text-xs font-semibold text-green-300">Phone</div>
            <div className="mt-1 space-y-1">
              {(Array.isArray(profile.phone) ? profile.phone : [profile.phone]).map((phone, index) => {
                const phoneStr = typeof phone === "string" ? phone : String(phone);
                return (
                  <div key={index} className="text-lg font-semibold text-white">
                    {phoneStr}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {(Array.isArray(profile.phone) ? profile.phone : [profile.phone]).map((phone, index) => {
                const phoneStr = typeof phone === "string" ? phone : String(phone);
                return (
                  <React.Fragment key={index}>
                    <MagneticButton
                      href={`tel:${phoneStr.replace(/\s/g, "")}`}
                      variant="ghost"
                      ariaLabel={`Call ${phoneStr}`}
                    >
                      <Phone className="h-4 w-4" />
                      Call {index > 0 ? `${index + 1}` : ''}
                    </MagneticButton>
                    <CopyButton value={phoneStr} label={index > 0 ? `phone ${index + 1}` : "phone"} />
                  </React.Fragment>
                );
              })}
              <MagneticButton
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                variant="ghost"
                ariaLabel="Open LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </MagneticButton>
            </div>
          </div>
        </TiltCard>
      </div>

      <footer className="mt-10 border-t border-white/10 pt-6 relative overflow-hidden">
        {/* OASIS-themed footer gradient */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 via-purple-400/40 via-fuchsia-400/30 to-transparent" />
        
        {/* Subtle background glow */}
        <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent opacity-50" />
        
        {/* Scanline effect */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(56,189,248,0.1) 2px, rgba(56,189,248,0.1) 4px)",
          }}
        />
        
               <div className="relative z-10 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm">
                 <div className="text-white/70">
                   © {new Date().getFullYear()} <span className="font-semibold text-white">{profile.name}</span>
                   <span className="ml-2 text-cyan-300/70 font-medium">• Welcome to the OASIS</span>
                   <span className="ml-2 text-white/30 text-xs italic">(Discover the hidden keys)</span>
                 </div>
                 <div className="text-white/50 flex items-center gap-1">
                   <span>Built with</span>
                   <span className="text-cyan-300/70 font-medium">Next</span>
                   <span className="text-white/40">•</span>
                   <span className="text-purple-300/70 font-medium">Tailwind</span>
                   <span className="text-white/40">•</span>
                   <span className="text-green-300/70 font-medium">Framer Motion</span>
                   <span className="ml-2 text-white/20 text-xs">• Alt+Click headings • Type "OASIS"</span>
                 </div>
               </div>
      </footer>
    </motion.section>
  );
}
