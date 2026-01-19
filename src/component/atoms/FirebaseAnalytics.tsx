"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { analytics } from "@/lib/firebase";
import { logEvent } from "firebase/analytics";

export function FirebaseAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Only track page views if analytics is available and window is defined
    if (typeof window === "undefined" || !analytics) return;

    try {
      // Track page view
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      
      logEvent(analytics, "page_view", {
        page_path: url,
        page_title: document.title,
        page_location: window.location.href,
      });
    } catch (error) {
      // Silently fail if analytics is not ready
      console.error("Firebase Analytics error:", error);
    }
  }, [pathname, searchParams]);

  return null; // This component doesn't render anything
}
