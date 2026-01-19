// Helper functions for Firebase Analytics
import { analytics } from "./firebase";
import { logEvent, EventParams } from "firebase/analytics";

/**
 * Log a custom analytics event
 * @param eventName - Name of the event to log
 * @param eventParams - Optional event parameters
 */
export function trackEvent(eventName: string, eventParams?: EventParams) {
  if (typeof window === "undefined" || !analytics) {
    return;
  }

  try {
    logEvent(analytics, eventName, eventParams);
  } catch (error) {
    console.error("Analytics tracking error:", error);
  }
}

/**
 * Track button clicks
 */
export function trackButtonClick(buttonName: string, location?: string) {
  trackEvent("button_click", {
    button_name: buttonName,
    location: location || window.location.pathname,
  });
}

/**
 * Track link clicks
 */
export function trackLinkClick(linkUrl: string, linkText?: string) {
  trackEvent("link_click", {
    link_url: linkUrl,
    link_text: linkText,
    location: window.location.pathname,
  });
}

/**
 * Track section views (for portfolio sections)
 */
export function trackSectionView(sectionName: string) {
  trackEvent("section_view", {
    section_name: sectionName,
    page_path: window.location.pathname,
  });
}

/**
 * Track modal opens
 */
export function trackModalOpen(modalName: string) {
  trackEvent("modal_open", {
    modal_name: modalName,
    page_path: window.location.pathname,
  });
}
