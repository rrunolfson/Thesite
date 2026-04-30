import { generatedPressReleases } from "./newsroom.generated";

export interface PressRelease {
  slug: string;
  title: string;
  date: string;
  summary: string;
  seoDescription: string;
  content: string;
}

export const pressReleases: PressRelease[] = generatedPressReleases;

export const pressReleasesByNewest = [...pressReleases].sort((left, right) =>
  right.date.localeCompare(left.date),
);

export const pressReleaseYears = Array.from(
  new Set(pressReleasesByNewest.map((release) => release.date.slice(0, 4))),
);

export function getPressReleaseBySlug(slug: string) {
  return pressReleases.find((release) => release.slug === slug);
}