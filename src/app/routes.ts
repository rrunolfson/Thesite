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
      { path: "solutions", loader: redirectTo("/integrations") },
      { path: "integrations", lazy: lazyPage(() => import("./pages/OurIntegrationsPage"), "OurIntegrationsPage") },
      {
        path: "integrations/:vendorSlug/:productSlug",
        lazy: lazyPage(() => import("./pages/IntegrationDetailPage"), "IntegrationDetailPage"),
      },
      { path: "company", lazy: lazyPage(() => import("./pages/CompanyPage"), "CompanyPage") },
      { path: "careers", lazy: lazyPage(() => import("./pages/CareersPage"), "CareersPage") },
      { path: "about", loader: redirectTo("/company") },
      { path: "contact", lazy: lazyPage(() => import("./pages/ContactPage"), "ContactPage") },
      { path: "signal-2-action", lazy: lazyPage(() => import("./pages/Signal2ActionPage"), "Signal2ActionPage") },
      { path: "*", lazy: lazyPage(() => import("./pages/NotFound"), "NotFound") },
    ],
  },
]);