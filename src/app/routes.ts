import type { ComponentType } from "react";
import { createBrowserRouter, redirect } from "react-router";
import { Root } from "./components/Root";

function lazyPage<T extends Record<string, unknown>>(
  loader: () => Promise<T>,
  exportName: keyof T,
) {
  return async () => {
    const module = await loader();
    const Component = module[exportName];

    if (typeof Component !== "function") {
      throw new Error(`Route export "${String(exportName)}" is not a component.`);
    }

    return { Component: Component as ComponentType };
  };
}

function redirectTo(path: string) {
  return () => redirect(path);
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, lazy: lazyPage(() => import("./pages/HomePage"), "HomePage") },
      { path: "platform", lazy: lazyPage(() => import("./pages/PlatformOverviewPage"), "PlatformOverviewPage") },
      { path: "infinit-signal", lazy: lazyPage(() => import("./pages/InfinitSignalPage"), "InfinitSignalPage") },
      { path: "infinit-flow", lazy: lazyPage(() => import("./pages/InfinitFlowPage"), "InfinitFlowPage") },
      { path: "infinit-control", lazy: lazyPage(() => import("./pages/InfinitControlPage"), "InfinitControlPage") },
      { path: "singularity", lazy: lazyPage(() => import("./pages/SSOMPage"), "SSOMPage") },
      { path: "ssom", loader: redirectTo("/singularity") },
      { path: "solutions", loader: redirectTo("/platform") },
      { path: "integrations", lazy: lazyPage(() => import("./pages/OurIntegrationsPage"), "OurIntegrationsPage") },
      {
        path: "integrations/:vendorSlug/:productSlug",
        lazy: lazyPage(() => import("./pages/IntegrationDetailPage"), "IntegrationDetailPage"),
      },
      { path: "about", lazy: lazyPage(() => import("./pages/AboutPage"), "AboutPage") },
      { path: "company", loader: redirectTo("/about") },
      { path: "company/newsroom", lazy: lazyPage(() => import("./pages/NewsroomPage"), "NewsroomPage") },
      {
        path: "company/newsroom/:slug",
        lazy: lazyPage(() => import("./pages/PressReleaseDetailPage"), "PressReleaseDetailPage"),
      },
      { path: "careers", loader: redirectTo("/about") },
      { path: "contact", lazy: lazyPage(() => import("./pages/ContactPage"), "ContactPage") },
      { path: "design-partner", loader: redirectTo("/contact") },
      { path: "signal-to-action", lazy: lazyPage(() => import("./pages/Signal2ActionPage"), "Signal2ActionPage") },
      { path: "signal-2-action", loader: redirectTo("/signal-to-action") },
      { path: "*", lazy: lazyPage(() => import("./pages/NotFound"), "NotFound") },
    ],
  },
]);
