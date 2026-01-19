import type { Metadata } from "next";
import PortfolioInteractive from "@/component/PortfolioInteractive";
import { getPortfolioData } from "@/lib/data";

// Dynamic metadata generation
export async function generateMetadata(): Promise<Metadata> {
  const data = await getPortfolioData();
  const profile = data.profile;

  const SITE = {
    name: profile.name,
    title: `${profile.name} — ${profile.title}`,
    description:
      "Senior engineer (9+ years) building scalable, secure, high-performance web & mobile experiences with React, Next.js, TypeScript, and React Native.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com",
    ogImage: "/og.jpg",
  };

  return {
    metadataBase: new URL(SITE.url),
    title: SITE.title,
    description: SITE.description,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      url: "/",
      title: SITE.title,
      description: SITE.description,
      siteName: SITE.name,
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE.title,
      description: SITE.description,
      images: [SITE.ogImage],
    },
    robots: { index: true, follow: true },
  };
}

export default async function Page() {
  const data = await getPortfolioData();
  const profile = data.profile;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    address: { "@type": "PostalAddress", addressLocality: profile.location.split(",")[0], addressCountry: profile.location.split(",")[1]?.trim() || "AE" },
    email: `mailto:${profile.email}`,
    telephone: profile.phone,
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com",
    sameAs: [profile.linkedin],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PortfolioInteractive
        profile={data.profile}
        projects={data.projects}
        skills={data.skills}
        workExperiences={data.workExperiences}
        howIWork={data.howIWork}
      />
    </>
  );
}
