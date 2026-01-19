import { strapi } from "./strapi";
import {
  Code2,
  Smartphone,
  Server,
  Wrench,
  Layers,
  ShieldCheck,
  Rocket,
} from "lucide-react";

// Icon mapping for skills
const iconMap: Record<string, any> = {
  Code2,
  Smartphone,
  Server,
  Wrench,
  Layers,
  ShieldCheck,
  Rocket,
};

// Note: Icon transformation happens on client side since we can't serialize functions
// This function just ensures items array exists
function transformStrapiSkills(strapiSkills: Record<string, any>) {
  const transformed: Record<string, any> = {};
  
  Object.entries(strapiSkills).forEach(([key, skill]) => {
    transformed[key] = {
      iconName: skill.icon || key,
      items: skill.items || [],
    };
  });

  return transformed;
}

// Client-side icon mapping function
// Handles case-insensitive lookup and variations
export function getIconByName(name: string) {
  if (!name || typeof name !== 'string') return Code2;
  
  // Try exact match first
  if (iconMap[name]) return iconMap[name];
  
  // Try case-insensitive match
  const lowerName = name.toLowerCase();
  const found = Object.keys(iconMap).find(key => key.toLowerCase() === lowerName);
  if (found) return iconMap[found];
  
  // Default fallback
  return Code2;
}

export async function getPortfolioData() {
  try {
    // Try to fetch from Strapi
    const [profile, projects, skills, experiences, howIWork] = await Promise.all([
      strapi.getProfile(),
      strapi.getProjects(),
      strapi.getSkills(),
      strapi.getWorkExperiences(),
      strapi.getHowIWork(),
    ]);

      // Format dates from Strapi (ISO format like "2021-01-01") to year only for work experiences
      const formatDate = (dateStr: string | undefined): string | undefined => {
        if (!dateStr) return undefined;
        // If already just a year (4 digits), return as is
        if (/^\d{4}$/.test(dateStr)) return dateStr;
        // If ISO date format, extract year
        try {
          const date = new Date(dateStr);
          return date.getFullYear().toString();
        } catch {
          return dateStr; // Return original if parsing fails
        }
      };

      const formattedExperiences = experiences.map(exp => ({
        ...exp,
        startDate: formatDate(exp.startDate) || exp.startDate,
        endDate: formatDate(exp.endDate),
      }));

      // Deduplicate howIWork items by title + icon combination
      const seenHowIWork = new Set<string>();
      const deduplicatedHowIWork = howIWork
        .map(item => ({ ...item, iconName: item.icon }))
        .filter(item => {
          const key = `${item.title}-${item.iconName || item.icon}`;
          if (seenHowIWork.has(key)) return false;
          seenHowIWork.add(key);
          return true;
        })
        // Sort to put "Foundations first" at the beginning
        .sort((a, b) => {
          const aIsFoundations = a.title?.toLowerCase().includes("foundation") || false;
          const bIsFoundations = b.title?.toLowerCase().includes("foundation") || false;
          if (aIsFoundations && !bIsFoundations) return -1;
          if (!aIsFoundations && bIsFoundations) return 1;
          return 0; // Keep original order for others
        });

      return {
        profile: profile || {
          name: "",
          title: "",
          location: "",
          status: "",
          email: "",
          phone: "",
          linkedin: "",
          resumeUrl: "",
          photoUrl: "",
        },
        projects: projects,
        skills: transformStrapiSkills(skills),
        workExperiences: formattedExperiences,
        howIWork: deduplicatedHowIWork.length > 0 ? deduplicatedHowIWork : [
          {
            title: "Foundations first",
            iconName: "Layers",
            body: "Simple architectures that scale: boundaries, reusable components, and maintainable state patterns.",
          },
          {
            title: "Security + reliability",
            iconName: "ShieldCheck",
            body: "Secure UI flows, careful error handling, predictable state to reduce production risk.",
          },
          {
            title: "Performance mindset",
            iconName: "Rocket",
            body: "Optimize rendering + data fetching; measure impact; avoid premature complexity.",
          },
        ],
      };
  } catch (error) {
    console.error("Error fetching from Strapi:", error);
    
    // Return empty/default data structure
    return {
      profile: {
        name: "",
        title: "",
        location: "",
        status: "",
        email: "",
        phone: "",
        linkedin: "",
        resumeUrl: "",
        photoUrl: "",
      },
      projects: [],
      skills: {},
      workExperiences: [],
      howIWork: [
        {
          title: "Foundations first",
          iconName: "Layers",
          body: "Simple architectures that scale: boundaries, reusable components, and maintainable state patterns.",
        },
        {
          title: "Security + reliability",
          iconName: "ShieldCheck",
          body: "Secure UI flows, careful error handling, predictable state to reduce production risk.",
        },
        {
          title: "Performance mindset",
          iconName: "Rocket",
          body: "Optimize rendering + data fetching; measure impact; avoid premature complexity.",
        },
      ],
    };
  }
}
