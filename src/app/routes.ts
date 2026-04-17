import type { ComponentType } from "react";
import { createBrowserRouter } from "react-router";
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

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, lazy: lazyPage(() => import("./pages/HomePage"), "HomePage") },
      { path: "solutions", lazy: lazyPage(() => import("./pages/SolutionsPage"), "SolutionsPage") },
      { path: "integrations", lazy: lazyPage(() => import("./pages/OurIntegrationsPage"), "OurIntegrationsPage") },
      {
        path: "integrations/:vendorSlug/:productSlug",
        lazy: lazyPage(() => import("./pages/IntegrationDetailPage"), "IntegrationDetailPage"),
      },
      { path: "industries", lazy: lazyPage(() => import("./pages/IndustriesPage"), "IndustriesPage") },
      { path: "use-cases", lazy: lazyPage(() => import("./pages/UseCasesPage"), "UseCasesPage") },
      { path: "customers", lazy: lazyPage(() => import("./pages/CustomersPage"), "CustomersPage") },
      { path: "partners", lazy: lazyPage(() => import("./pages/PartnersPage"), "PartnersPage") },
      { path: "partners/delivery", lazy: lazyPage(() => import("./pages/SIPartnershipsPage"), "SIPartnershipsPage") },
      { path: "partners/oem", lazy: lazyPage(() => import("./pages/OEMPartnershipsPage"), "OEMPartnershipsPage") },
      { path: "resources", lazy: lazyPage(() => import("./pages/ResourcesPage"), "ResourcesPage") },
      { path: "company", lazy: lazyPage(() => import("./pages/CompanyPage"), "CompanyPage") },
      { path: "about", lazy: lazyPage(() => import("./pages/AboutPage"), "AboutPage") },
      { path: "trust", lazy: lazyPage(() => import("./pages/TrustCenterPage"), "TrustCenterPage") },
      { path: "careers", lazy: lazyPage(() => import("./pages/CareersPage"), "CareersPage") },
      { path: "contact", lazy: lazyPage(() => import("./pages/ContactPage"), "ContactPage") },
      { path: "oem-portal", lazy: lazyPage(() => import("./pages/OEMPortalPage"), "OEMPortalPage") },
      { path: "signal-2-action", lazy: lazyPage(() => import("./pages/Signal2ActionPage"), "Signal2ActionPage") },
      { path: "*", lazy: lazyPage(() => import("./pages/NotFound"), "NotFound") },
    ],
  },
]);