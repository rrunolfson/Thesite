import type { ComponentType } from "react";
import { createBrowserRouter, redirect } from "react-router";
import { Root } from "./components/Root";
import { RouteLoading } from "./components/RouteLoading";

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
    HydrateFallback: RouteLoading,
    children: [
      { index: true, lazy: lazyPage(() => import("./pages/HomePage"), "HomePage") },
      { path: "platform", lazy: lazyPage(() => import("./pages/PlatformOverviewPage"), "PlatformOverviewPage") },
      { path: "data-center-cooling", lazy: lazyPage(() => import("./pages/DataCenterCoolingPage"), "DataCenterCoolingPage") },
      { path: "infinit-signal", lazy: lazyPage(() => import("./pages/InfinitSignalPage"), "InfinitSignalPage") },
      { path: "infinit-flow", lazy: lazyPage(() => import("./pages/InfinitFlowPage"), "InfinitFlowPage") },
      { path: "infinit-control", lazy: lazyPage(() => import("./pages/InfinitControlPage"), "InfinitControlPage") },
      { path: "singularity", lazy: lazyPage(() => import("./pages/SSOMPage"), "SSOMPage") },
      { path: "ssom", loader: redirectTo("/singularity") },
      { path: "solutions", loader: redirectTo("/platform") },
      { path: "ecosystem", lazy: lazyPage(() => import("./pages/EcosystemPage"), "EcosystemPage") },
      { path: "integrations", loader: redirectTo("/ecosystem") },
      {
        path: "integrations/:vendorSlug/:productSlug",
        lazy: lazyPage(() => import("./pages/IntegrationDetailPage"), "IntegrationDetailPage"),
      },
      { path: "about", lazy: lazyPage(() => import("./pages/AboutPage"), "AboutPage") },
      { path: "company", loader: redirectTo("/about") },
      { path: "company/newsroom", lazy: lazyPage(() => import("./pages/NewsroomPage"), "NewsroomPage") },
      { path: "resources", lazy: lazyPage(() => import("./pages/ResourcesPage"), "ResourcesPage") },
      {
        path: "company/newsroom/:slug",
        lazy: lazyPage(() => import("./pages/PressReleaseDetailPage"), "PressReleaseDetailPage"),
      },
      { path: "careers", loader: redirectTo("/about") },
      { path: "contact", lazy: lazyPage(() => import("./pages/ContactPage"), "ContactPage") },
      { path: "design-partner", loader: redirectTo("/contact?intent=design-partnership") },
      { path: "privacy", lazy: lazyPage(() => import("./pages/LegalPage"), "PrivacyPage") },
      { path: "terms", lazy: lazyPage(() => import("./pages/LegalPage"), "TermsPage") },
      { path: "signal-to-action", lazy: lazyPage(() => import("./pages/Signal2ActionPage"), "Signal2ActionPage") },
      { path: "signal-2-action", loader: redirectTo("/signal-to-action") },
      { path: "*", lazy: lazyPage(() => import("./pages/NotFound"), "NotFound") },
    ],
  },
]);
