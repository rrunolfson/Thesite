import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { HomePage } from "./pages/HomePage";
import { IndustriesPage } from "./pages/IndustriesPage";
import { PartnersPage } from "./pages/PartnersPage";
import { CompanyPage } from "./pages/CompanyPage";
import { ContactPage } from "./pages/ContactPage";
import { CareersPage } from "./pages/CareersPage";
import { OEMPortalPage } from "./pages/OEMPortalPage";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: "industries", Component: IndustriesPage },
      { path: "partners", Component: PartnersPage },
      { path: "company", Component: CompanyPage },
      { path: "contact", Component: ContactPage },
      { path: "careers", Component: CareersPage },
      { path: "oem-portal", Component: OEMPortalPage },
      { path: "*", Component: NotFound },
    ],
  },
]);