import qs from "qs";

export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Strapi Content Types
export interface StrapiProfile {
  name: string;
  title: string;
  location: string;
  status: string; // Job availability status (mapped from jobStatus)
  jobStatus?: string; // Job availability status from Strapi
  email: string;
  phone: string | string[]; // Phone can be a single string or array of phone numbers
  linkedin: string;
  resumeUrl: string;
  photoUrl?: string; // Profile picture URL
}

export interface StrapiProject {
  id: string;
  name: string;
  summary: string;
  tags: string[];
  stack: string[];
  highlights: string[];
  impact: Array<{ label: string; value: string }>;
  metrics?: Array<{ label: string; value: string }>;
  ownership?: string[];
  proof?: string[];
  links?: Array<{ label: string; href: string }>;
}

export interface StrapiSkillCategory {
  name: string;
  items: string[];
  icon?: string;
}

export interface StrapiWorkExperience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  summary: string;
  achievements: string[];
  stack: string[];
  tags: string[];
}

export interface StrapiHowIWork {
  title: string;
  body: string;
  icon?: string;
}

class StrapiClient {
  private baseUrl: string;
  private apiToken?: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || process.env.STRAPI_URL || "";
    this.apiToken = process.env.STRAPI_API_TOKEN;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (this.apiToken) {
      headers["Authorization"] = `Bearer ${this.apiToken}`;
    }

    return headers;
  }

  private async fetchFromStrapi<T>(
    endpoint: string,
    query?: Record<string, any>
  ): Promise<StrapiResponse<T[] | T> | null> {
    if (!this.baseUrl) {
      // Return null when not configured instead of throwing
      // This allows graceful fallback to static data
      return null;
    }

    const queryString = query ? `?${qs.stringify(query, { encodeValuesOnly: true })}` : "";
    const url = `${this.baseUrl}/api${endpoint}${queryString}`;

    try {
      const response = await fetch(url, {
        headers: this.getHeaders(),
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      });

      if (!response.ok) {
        throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching from Strapi: ${endpoint}`, error);
      // Return null on error to allow fallback
      return null;
    }
  }

  async getProfile(): Promise<StrapiProfile | null> {
    try {
      const response = await this.fetchFromStrapi<StrapiProfile>("/profile?populate=*");
      
      if (!response || !response.data) {
        return null;
      }
      
      // Strapi v5 returns data directly, not wrapped in attributes
      const data = response.data;
      let profile: any;
      
      if (Array.isArray(data)) {
        // If array, get first item
        profile = data[0];
      } else {
        // If single object, return directly (Strapi v5 format)
        profile = data;
      }
      
      // Extract photo URL from Strapi media field
      // Handle multiple Strapi formats:
      // 1. Direct photo object with url (Strapi v5 format shown by user)
      // 2. photo.data array or object (populated format)
      // 3. photo.data.attributes.url (Strapi v4 format)
      let photoUrl: string | undefined;
      if (profile.photo) {
        // Check if photo has direct url property (Strapi v5 direct format)
        if (profile.photo.url && !profile.photo.data) {
          photoUrl = profile.photo.url;
        } 
        // Check if photo has data property (populated format)
        else if (profile.photo.data) {
          const photoData = Array.isArray(profile.photo.data) 
            ? profile.photo.data[0] 
            : profile.photo.data;
          
          // Try multiple formats
          photoUrl = photoData?.attributes?.url || photoData?.url;
        }
        // Fallback: check if url exists in photo directly
        else if (profile.photo.url) {
          photoUrl = profile.photo.url;
        }
      } else if (profile.photoUrl) {
        // Already extracted
        photoUrl = profile.photoUrl;
      }

      // If photoUrl is relative, make it absolute using baseUrl
      if (photoUrl && !photoUrl.startsWith('http')) {
        photoUrl = `${this.baseUrl}${photoUrl}`;
      }
      
      // Normalize phone to array format
      // Handle different phone formats: string, array, comma-separated string
      let phone: string | string[] = profile.phone || "";
      if (typeof phone === "string") {
        // Check if it's comma-separated or contains multiple phone numbers
        const phones = phone.split(/[,;|\n]/).map(p => p.trim()).filter(p => p.length > 0);
        if (phones.length > 1) {
          phone = phones; // Convert to array if multiple phones found
        }
      } else if (!Array.isArray(phone)) {
        phone = [String(phone)];
      }
      
      // Map jobStatus to status for backward compatibility
      // Use jobStatus from API response, fallback to status if jobStatus doesn't exist
      const mappedProfile: StrapiProfile = {
        ...profile,
        status: profile.jobStatus || profile.status || "",
        photoUrl: photoUrl,
        phone: phone,
      };

      return mappedProfile;
    } catch (error) {
      console.error("[Profile] Error fetching profile:", error);
      return null;
    }
  }

  async getProjects(): Promise<StrapiProject[]> {
    try {
      const response = await this.fetchFromStrapi<Omit<StrapiProject, "id">>("/projects?populate=*", {
        sort: ["createdAt:desc"],
      });

      if (!response || !response.data) {
        return [];
      }

      if (Array.isArray(response.data)) {
        // Strapi v5 returns data directly, not wrapped in attributes
        // Deduplicate by documentId or id
        const seen = new Set<string>();
        return response.data
          .map((item: any) => ({
            id: item.id?.toString() || item.documentId || String(Math.random()),
            name: item.name,
            summary: item.summary,
            tags: Array.isArray(item.tags) ? item.tags : [],
            stack: Array.isArray(item.stack) ? item.stack : [],
            highlights: Array.isArray(item.highlights) ? item.highlights : [],
            impact: Array.isArray(item.impact) ? item.impact : [],
            metrics: Array.isArray(item.metrics) ? item.metrics : undefined,
            ownership: Array.isArray(item.ownership) ? item.ownership : undefined,
            proof: Array.isArray(item.proof) ? item.proof : undefined,
            links: Array.isArray(item.links) ? item.links : [],
          }))
          .filter((item: any) => {
            if (seen.has(item.id)) return false;
            seen.add(item.id);
            return true;
          });
      }

      return [];
    } catch (error) {
      console.error("Error fetching projects:", error);
      return [];
    }
  }

  async getSkills(): Promise<Record<string, StrapiSkillCategory>> {
    try {
      const response = await this.fetchFromStrapi<StrapiSkillCategory>("/skill-categories?populate=*");

      if (!response || !response.data) {
        return {};
      }

      if (Array.isArray(response.data)) {
        // Strapi v5 returns data directly, not wrapped in attributes
        const skills: Record<string, StrapiSkillCategory> = {};
        response.data.forEach((item: any) => {
          skills[item.name] = {
            name: item.name,
            items: item.items || [],
            icon: item.icon,
          };
        });
        return skills;
      }

      return {};
    } catch (error) {
      console.error("Error fetching skills:", error);
      return {};
    }
  }

  async getWorkExperiences(): Promise<StrapiWorkExperience[]> {
    try {
      const response = await this.fetchFromStrapi<StrapiWorkExperience>("/work-experiences?populate=*", {
        sort: ["startDate:desc"],
      });

      if (!response || !response.data) {
        return [];
      }

      if (Array.isArray(response.data)) {
        // Strapi v5 returns data directly, not wrapped in attributes
        // Deduplicate by title+company+location (content-based), keeping the first occurrence
        const seen = new Set<string>();
        const result = response.data
          .map((item: any) => {
            const id = item.id?.toString() || item.documentId || undefined;
            return {
              id,
              title: item.title,
              company: item.company,
              location: item.location,
              startDate: item.startDate,
              endDate: item.endDate,
              summary: item.summary,
              achievements: item.achievements || [],
              stack: item.stack || [],
              tags: item.tags || [],
            };
          })
          .filter((item: any) => {
            // Deduplicate based on content (title+company+location), not ID
            // This ensures we only keep unique work experiences even if they have different IDs
            const key = `${item.title}-${item.company}-${item.location || ''}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
        
        return result;
      }

      return [];
    } catch (error) {
      console.error("Error fetching work experiences:", error);
      return [];
    }
  }

  async getHowIWork(): Promise<StrapiHowIWork[]> {
    try {
      const response = await this.fetchFromStrapi<StrapiHowIWork>("/how-i-works?populate=*", {
        sort: ["createdAt:asc"],
      });

      if (!response || !response.data) {
        return [];
      }

      if (Array.isArray(response.data)) {
        // Strapi v5 returns data directly, not wrapped in attributes
        // Deduplicate by title + icon combination
        const seen = new Set<string>();
        return response.data
          .map((item: any) => ({
            title: item.title,
            body: item.body,
            icon: item.icon,
          }))
          .filter((item: any) => {
            const key = `${item.title}-${item.icon}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
      }

      return [];
    } catch (error) {
      console.error("Error fetching how I work:", error);
      return [];
    }
  }
}

export const strapi = new StrapiClient();
