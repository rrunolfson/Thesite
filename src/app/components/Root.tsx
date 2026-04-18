import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { NetworkBackground } from "./NetworkBackground";
import { useScrollReveal } from "../hooks/useScrollReveal";

type WebMcpTool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (input: Record<string, unknown>) => Promise<Record<string, unknown>>;
};

type WebMcpContext = {
  tools: WebMcpTool[];
};

type ModelContextNavigator = Navigator & {
  modelContext?: {
    provideContext?: (context: WebMcpContext) => void | Promise<void>;
  };
};

export function Root() {
  const location = useLocation();
  useScrollReveal();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Set favicon
  useEffect(() => {
    const setFavicon = () => {
      // Remove existing favicon links
      const existingLinks = document.querySelectorAll("link[rel*='icon']");
      existingLinks.forEach(link => link.remove());

      // Add new favicon
      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/png';
      link.href = '/favicon.png';
      document.head.appendChild(link);

      // Also set the document title
      document.title = 'Last Mile';
    };

    setFavicon();
  }, []);

  useEffect(() => {
    const modelContext = (navigator as ModelContextNavigator).modelContext;

    if (!modelContext?.provideContext) {
      return;
    }

    const baseUrl = window.location.origin;
    const tools: WebMcpTool[] = [
      {
        name: "open_integrations_catalog",
        description: "Open the Last Mile integrations catalog and return its canonical URLs.",
        inputSchema: {
          type: "object",
          additionalProperties: false,
          properties: {},
        },
        execute: async () => {
          const url = `${baseUrl}/integrations`;
          window.location.assign(url);

          return {
            ok: true,
            url,
            dataUrl: `${baseUrl}/integrations.json`,
          };
        },
      },
      {
        name: "open_contact_page",
        description: "Open the contact page for sales and partnership outreach.",
        inputSchema: {
          type: "object",
          additionalProperties: false,
          properties: {},
        },
        execute: async () => {
          const url = `${baseUrl}/contact`;
          window.location.assign(url);

          return {
            ok: true,
            url,
          };
        },
      },
      {
        name: "open_signal_2_action",
        description: "Open the Signal 2 Action podcast page and expose the podcast feed URL.",
        inputSchema: {
          type: "object",
          additionalProperties: false,
          properties: {},
        },
        execute: async () => {
          const url = `${baseUrl}/signal-2-action`;
          window.location.assign(url);

          return {
            ok: true,
            url,
            feedUrl: `${baseUrl}/podcast-feed.xml`,
          };
        },
      },
    ];

    void modelContext.provideContext({ tools });
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