import { useEffect } from "react";
import { useLocation } from "react-router";

export function useScrollReveal() {
  const location = useLocation();

  useEffect(() => {
    // Add class to enable scroll reveal after initial mount
    const timer = setTimeout(() => {
      document.body.classList.add('scroll-reveal-active');
    }, 100);

    const revealOnScroll = () => {
      const revealElements = document.querySelectorAll(".reveal");
      const windowHeight = window.innerHeight;
      const elementVisible = 150;

      revealElements.forEach((reveal) => {
        const elementTop = reveal.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
          reveal.classList.add("visible");
        }
      });
    };

    // Run immediately
    revealOnScroll();
    
    // Run after a short delay to catch any delayed renders
    const revealTimer = setTimeout(revealOnScroll, 150);

    window.addEventListener("scroll", revealOnScroll);
    window.addEventListener("resize", revealOnScroll);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(revealTimer);
      window.removeEventListener("scroll", revealOnScroll);
      window.removeEventListener("resize", revealOnScroll);
    };
  }, [location.pathname]); // Re-run when route changes
}