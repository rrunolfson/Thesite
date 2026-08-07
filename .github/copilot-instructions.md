# Last Mile Website Copilot Instructions

## Scope
- This repository is the marketing website for Last Mile.
- Prioritize clarity, consistency, and production readiness over experimentation.
- Keep changes small, deliberate, and directly tied to the requested outcome.

## Source Of Truth
- The public site structure is defined by `src/app/routes.ts`.
- `Navbar.tsx`, `Footer.tsx`, page SEO metadata, and route availability must stay aligned.
- Do not leave substantive page components in `src/app/pages/` without either wiring them into the router or intentionally removing them.
- Do not add placeholder navigation items or dead links.

## Routing And Performance
- Prefer route-level lazy loading for page modules.
- When adding a new public page, update all of the following together:
  - `src/app/routes.ts`
  - `src/app/components/Navbar.tsx` if the page should be discoverable from the main nav
  - `src/app/components/Footer.tsx` if the page belongs in footer navigation
  - page-level SEO metadata
- Avoid increasing the initial bundle unnecessarily. If a change adds a new page or heavy UI, keep the main entry lean.

## SEO And Content Quality
- Every public page must include the shared `SEO` component with a correct title, description, and canonical path.
- Keep titles, headings, CTA labels, email addresses, and visible link text internally consistent.
- Do not leave mismatches between displayed contact details and `mailto:` or external URLs.
- Do not introduce lorem ipsum, placeholder copy, fake metrics, or “coming soon” content unless the user explicitly asks for it.

## UI And Styling
- Preserve the existing visual language unless the user requests a redesign.
- Prefer existing components and patterns in `src/app/components/` and `src/app/components/ui/`.
- Keep layouts responsive by default.
- Avoid one-off visual hacks when a shared component or reusable pattern is the better fix.

### Last Mile Color Constitution
- This is a non-negotiable, repository-wide design constraint. Apply it to every page, component, diagram, illustration, generated image, and future redesign unless the user explicitly approves a replacement palette.
- The visual reference is `public/images/Theme Colors.png`. The implementation source of truth is the `:root` token block in `src/styles/last-mile-system.css`.
- Use the approved pale-blue, steel, and neutral panel palette:
  - Surface: `#FFFFFF` (`--lm-surface`)
  - Ink: `#263244` (`--lm-ink` / `--lm-deep`), primarily for text and fine details
  - Body copy: `#58687A` (`--lm-copy`)
  - Canvas: `#F1F3F6` (`--lm-canvas`)
  - Panel wash: `#E7EDF3` (`--lm-wash`)
  - Primary blue: `#4C86C6` (`--lm-blue` / `--lm-cta`)
  - Blue-grey: `#5E8FAF` (`--lm-teal`; the legacy token name does not indicate a green hue)
  - Pale blue: `#8BB4CF` (`--lm-mint`; the legacy token name does not indicate a green hue)
  - Steel: `#A8BCCB` (`--lm-steel`)
  - Dark blue: `#315F91` (`--lm-blue-dark`), reserved for emphasis and interaction states
- Build pages as white panels/cards on the very light grey canvas. Use subtle blue-grey borders and restrained shadows rather than large colored section fills.
- Do not introduce green, sage, mint-green, neon, yellow-green, or ServiceNow-like hues. Do not use black or near-black backgrounds, and do not use the ink color as a broad page or section background.
- Do not create page-local substitute palettes or hard-code near-duplicate colors when an approved `--lm-*` token is suitable. If a new semantic color is genuinely needed, derive it from this palette and add it centrally to `src/styles/last-mile-system.css`.
- Keep diagrams and image assets visually consistent with the same palette. Preserve transparency where required and avoid gradients that drift into green.
- Before completing visual work, inspect new or changed color values and verify that no unapproved green or dark-background treatment was introduced.

## Forms And Integrations
- Treat marketing forms as production paths.
- Do not change submission endpoints, payload keys, or tracking behavior without checking the current integration logic first.
- If a form field model changes, verify the UI, validation, and outbound payload all stay in sync.

## Validation
- After meaningful frontend changes, run `npm run build`.
- Do not claim a task is complete if the build is broken.
- If you restore or add routes, verify navigation paths and page imports are still valid.

## Git Hygiene
- Keep the working set focused. Avoid unrelated edits while solving a task.
- If the repo already contains unrelated changes, do not overwrite them unless the user explicitly asks.
- Before declaring the site “clean,” check for dead routes, orphaned pages, broken nav links, and missing SEO.

## Communication
- Be direct.
- Call out risks, inconsistencies, or missing requirements clearly.
- If something cannot be made git-clean without a commit, say that explicitly.
