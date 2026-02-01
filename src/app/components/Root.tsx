import { Outlet } from "react-router";
import { useEffect } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { NetworkBackground } from "./NetworkBackground";
import { useScrollReveal } from "../hooks/useScrollReveal";

export function Root() {
  useScrollReveal();

  // Set favicon
  useEffect(() => {
    const setFavicon = () => {
      // Remove existing favicon links
      const existingLinks = document.querySelectorAll("link[rel*='icon']");
      existingLinks.forEach(link => link.remove());

      // Add new favicon
      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/svg+xml';
      link.href = '/favicon.svg';
      document.head.appendChild(link);

      // Also set the document title
      document.title = 'Last Mile Inc. - OT Intelligence Solutions';
    };

    setFavicon();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      <Navbar />
      <NetworkBackground />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}