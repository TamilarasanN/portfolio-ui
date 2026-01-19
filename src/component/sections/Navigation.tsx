"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Menu, Linkedin, ExternalLink } from "lucide-react";
import { MagneticButton } from "../interactive/MagneticButton";
import { MobileMenu } from "../interactive/MobileMenu";
import { ProfileCardModal } from "../interactive/ProfileCardModal";
import { cn } from "../utils";

interface NavigationProps {
  activeSection: string;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  setActiveSection?: (section: string) => void;
  profile: {
    name: string;
    title: string;
    status: string;
    linkedin: string;
    resumeUrl: string;
    photoUrl?: string;
  };
}

export function Navigation({ activeSection, menuOpen, setMenuOpen, setActiveSection, profile }: NavigationProps) {
  const reduce = useReducedMotion();
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      // Update active section immediately
      if (setActiveSection) {
        setActiveSection(sectionId);
      }
      
      // Update URL hash to match the section
      window.history.pushState(null, "", `#${sectionId}`);
      
      // Smooth scroll to the section with proper offset
      const headerOffset = 100;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <ProfileCardModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        profile={{ name: profile.name, title: profile.title, photoUrl: profile.photoUrl }}
      />
      <MobileMenu 
        open={menuOpen} 
        onClose={() => setMenuOpen(false)} 
        profile={profile}
        onProfileClick={() => setProfileModalOpen(true)}
      />

      <div className="sticky top-0 z-40 border-b border-white/10 bg-[#070712]/75 backdrop-blur relative overflow-hidden">
        {/* OASIS-themed gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-purple-400/5 to-fuchsia-400/5 opacity-50" />
        {/* Subtle scanline effect */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(56,189,248,0.1) 2px, rgba(56,189,248,0.1) 4px)",
          }}
        />
        <div className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2 md:gap-3">
            {/* Mobile: Hamburger menu on left */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="inline-flex items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-2 text-cyan-300 hover:bg-cyan-400/10 hover:border-cyan-400/30 transition cursor-pointer md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* Desktop: Profile section */}
            <a href="#top" className="hidden md:flex items-center gap-3" aria-label="Go to top">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setProfileModalOpen(true);
                }}
                className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
                aria-label="View profile"
              >
                {profile.photoUrl ? (
                  <div className="relative h-10 w-10 overflow-hidden rounded-xl border-2 border-white/20 bg-zinc-950/40 transition-all hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                    <Image
                      src={profile.photoUrl}
                      alt={`${profile.name} profile picture`}
                      fill
                      className="object-cover"
                      priority
                      unoptimized={true}
                      sizes="40px"
                    />
                  </div>
                ) : (
                  <div className="relative h-9 w-9 rounded-2xl border border-white/10 bg-white/5 transition-all hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                    <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_35%_30%,rgba(56,189,248,0.35),transparent_55%)]" />
                  </div>
                )}
              </button>
              <div>
                <div className="text-sm font-semibold leading-tight text-white">{profile.name}</div>
                <div className="text-xs text-cyan-300/70 font-medium">{profile.status}</div>
              </div>
            </a>
          </div>

          <div className="relative hidden items-center gap-1 md:flex">
            {[
              ["Featured", "#featured-projects", "featured-projects"],
              ["Projects", "#projects", "projects"],
              ["Experience", "#experience", "experience"],
              ["Skills", "#skills", "skills"],
              ["How I Work", "#how", "how"],
              ["Theme", "#theme", "theme"],
              ["Contact", "#contact", "contact"],
            ].map(([label, href, id]) => {
              const isActive = activeSection === id;
              return (
                <a
                  key={id}
                  href={href}
                  onClick={(e) => handleNavClick(e, id)}
                  className={cn(
                    "relative rounded-xl px-3 py-2 text-sm transition cursor-pointer",
                    isActive ? "text-white" : "text-white/75 hover:text-white"
                  )}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-xl border border-cyan-400/30 bg-gradient-to-r from-cyan-400/10 via-purple-400/10 to-fuchsia-400/10"
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 28 }}
                    >
                      {/* Glow effect for active nav item */}
                      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-transparent opacity-50 blur-sm" />
                      
                      {/* Holographic scan line on active item */}
                      {!reduce && (
                        <motion.span
                          className="absolute inset-0 rounded-xl opacity-30"
                          animate={{
                            background: [
                              "linear-gradient(to bottom, transparent 0%, rgba(56,189,248,0.4) 50%, transparent 100%)",
                              "linear-gradient(to bottom, transparent 100%, rgba(168,85,247,0.4) 50%, transparent 0%)",
                              "linear-gradient(to bottom, transparent 0%, rgba(56,189,248,0.4) 50%, transparent 100%)",
                            ],
                          }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                      )}
                    </motion.span>
                  ) : null}
                  {label}
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <MagneticButton
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              variant="ghost"
              className="hidden sm:inline-flex"
              ariaLabel="Open LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
              <span className="hidden sm:inline">LinkedIn</span>
            </MagneticButton>

            <MagneticButton
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              variant="neon"
              ariaLabel="Open resume"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">Resume</span>
            </MagneticButton>
          </div>
        </div>
      </div>
    </>
  );
}
