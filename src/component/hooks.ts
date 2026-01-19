import { useEffect, useState } from "react";

export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

export function useScrollSpy(sectionIds: string[], rootMargin = "-35% 0px -55% 0px", enabled = true) {
  const [active, setActive] = useState(sectionIds[0] ?? "top");

  useEffect(() => {
    if (!enabled) return;
    
    const els = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;
        // pick the one with highest intersectionRatio
        visible.sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));
        const newActive = (visible[0].target as HTMLElement).id;
        setActive(newActive);
      },
      { root: null, threshold: [0.1, 0.2, 0.35, 0.5, 0.75], rootMargin }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [sectionIds, rootMargin, enabled]);

  return active;
}
