import { useEffect } from "react";

/** Adds `.in-view` to every `.reveal` element once it scrolls into view. */
export function useRevealOnScroll() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("in-view");
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
