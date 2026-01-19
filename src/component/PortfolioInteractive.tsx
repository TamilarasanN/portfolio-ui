"use client";

import React, { useState, useMemo } from "react";
import { Navigation } from "./sections/Navigation";
import { Hero } from "./sections/Hero";
import { FeaturedProjects } from "./sections/FeaturedProjects";
import { Projects } from "./sections/Projects";
import { WorkExperienceSection } from "./sections/WorkExperience";
import { Skills } from "./sections/Skills";
import { HowIWork } from "./sections/HowIWork";
import { Contact } from "./sections/Contact";
import { ThemeValidation } from "./sections/ThemeValidation";
import { ParzivalNPC } from "./interactive/ParzivalNPC";
import { useScrollSpy } from "./hooks";

interface PortfolioData {
  profile: {
    name: string;
    title: string;
    location: string;
    status: string;
    email: string;
    phone: string | string[]; // Phone can be a single string or array
    linkedin: string;
    resumeUrl: string;
    photoUrl?: string;
  };
  projects: any[];
  skills: Record<string, any>;
  workExperiences: any[];
  howIWork: any[];
}

interface PortfolioInteractiveProps {
  profile: PortfolioData["profile"];
  projects: PortfolioData["projects"];
  skills: PortfolioData["skills"];
  workExperiences: PortfolioData["workExperiences"];
  howIWork: PortfolioData["howIWork"];
}

export default function PortfolioInteractive({
  profile,
  projects,
  skills,
  workExperiences,
  howIWork,
}: PortfolioInteractiveProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [isManualNavigation, setIsManualNavigation] = useState(false);
  const [lockedSection, setLockedSection] = useState<string | null>(null);

  // Filter featured projects (FAHR, DT360, etc.) - projects with IDs: fahr, bayanati, or names containing "FAHR" or "DT360"
  const featuredProjects = useMemo(() => {
    const filtered = projects.filter((p: any) => {
      const id = p.id?.toLowerCase() || "";
      const name = p.name?.toLowerCase() || "";
      return id === "fahr" || 
             id === "bayanati" || 
             id === "dt360" ||
             name.includes("fahr") || 
             name.includes("dt360") ||
             name.includes("bayanati");
    });

    // Sort to put FAHR first
    return filtered.sort((a: any, b: any) => {
      const aId = a.id?.toLowerCase() || "";
      const bId = b.id?.toLowerCase() || "";
      const aName = a.name?.toLowerCase() || "";
      const bName = b.name?.toLowerCase() || "";
      
      const aIsFahr = aId === "fahr" || aName.includes("fahr");
      const bIsFahr = bId === "fahr" || bName.includes("fahr");
      
      if (aIsFahr && !bIsFahr) return -1;
      if (!aIsFahr && bIsFahr) return 1;
      return 0;
    });
  }, [projects]);

  // Conditionally include featured-projects only if there are featured projects
  const scrollSpySections = useMemo(() => {
    const sections = ["projects", "experience", "skills", "how", "theme", "contact"];
    if (featuredProjects.length > 0) {
      sections.unshift("featured-projects");
    }
    return sections;
  }, [featuredProjects.length]);
  
  const scrollActiveSection = useScrollSpy(scrollSpySections, "-35% 0px -55% 0px", !isManualNavigation);
  
  // Update active section based on scroll spy when not manually navigating
  // NEVER allow scroll spy to override a locked section
  React.useEffect(() => {
    // If there's a locked section, NEVER update from scroll spy
    if (lockedSection) {
      // Keep active section as locked section
      setActiveSection(lockedSection);
      return;
    }
    
    // Only update if not manually navigating
    if (!isManualNavigation && scrollActiveSection) {
      setActiveSection(scrollActiveSection);
    }
  }, [scrollActiveSection, isManualNavigation, lockedSection]);

  // Unlock section when scroll spy confirms we're at the locked section
  React.useEffect(() => {
    if (lockedSection && scrollActiveSection === lockedSection && !isManualNavigation) {
      // Wait a bit to ensure it's stable before unlocking
      const unlockTimer = setTimeout(() => {
        setLockedSection((current) => {
          // Only unlock if scroll spy still matches
          if (current === lockedSection && scrollActiveSection === lockedSection) {
            return null;
          }
          return current;
        });
      }, 1500);
      return () => clearTimeout(unlockTimer);
    }
  }, [scrollActiveSection, lockedSection, isManualNavigation]);

  // Initialize active section from URL hash on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash && scrollSpySections.includes(hash)) {
        setActiveSection(hash);
        setIsManualNavigation(true);
        // Re-enable scroll spy after a delay
        setTimeout(() => {
          setIsManualNavigation(false);
        }, 3000);
      }
    }
  }, []); // Only run on mount

  // Handle manual section selection
  const handleSetActiveSection = React.useCallback((section: string) => {
    // Set active section immediately and lock it
    setActiveSection(section);
    setLockedSection(section);
    // Disable scroll spy completely
    setIsManualNavigation(true);
  }, []);

  // Filter out featured projects from regular projects list
  const regularProjects = useMemo(() => {
    const featuredIds = featuredProjects.map((p: any) => p.id?.toLowerCase());
    return projects.filter((p: any) => !featuredIds.includes(p.id?.toLowerCase()));
  }, [projects, featuredProjects]);

  return (
    <div className="min-h-screen bg-transparent text-white">
      
      <Navigation 
        activeSection={activeSection}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        setActiveSection={handleSetActiveSection}
        profile={profile}
      />

      <Hero profile={profile} />

      <main className="mx-auto max-w-6xl px-4 pb-16">
        {featuredProjects.length > 0 && <FeaturedProjects projects={featuredProjects} />}
        <Projects projects={regularProjects} />
        <WorkExperienceSection experiences={workExperiences} />
        <Skills skills={skills} />
        <HowIWork items={howIWork} />
        <ThemeValidation />
        <Contact profile={profile} />
      </main>

      {/* Floating Parzival NPC */}
      <ParzivalNPC />
    </div>
  );
}
