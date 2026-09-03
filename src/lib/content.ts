import "server-only";

import { createReader } from "@keystatic/core/reader";
import type {
  Achievements,
  Contact,
  Education,
  Hero,
  Projects,
  Publication,
  SiteLabels,
  Social,
  TestScore,
  Work,
} from "@/types/contents.types";
import type { Section } from "@/types/sections.types";
import keystaticConfig from "../../keystatic.config";

/**
 * Readers are cheap, so build one per call: the live preview points at a
 * throwaway directory holding Keystatic's unsaved draft files, and a shared
 * reader would serve stale content between roots.
 */
function readerFor(root: string) {
  return createReader(root, keystaticConfig);
}

export type SiteContent = {
  meta: { title: string; description: string };
  sections: Section[];
  labels: SiteLabels;
  formspreeId: string;
  showcase: { achievementCount: number; projectCount: number };
  hero: Hero;
  social: Social;
  contact: Contact;
  workExperience: Work[];
  education: Education[];
  publications: Publication[];
  testScores: TestScore[];
  achievements: Achievements[];
  projects: Projects[];
};

/** A missing content file is a build-breaking mistake, not something to paper over. */
function required<T>(value: T | null, name: string): T {
  if (value === null) {
    throw new Error(
      `Missing content for "${name}". Expected a file under content/ — run \`npm run cms\` and save it once.`,
    );
  }
  return value;
}

/**
 * Order a collection by an explicit list of slugs from content/ordering.yaml.
 * Entries absent from that list still render, appended at the end, so creating
 * an entry in the CMS never makes it silently vanish from the site.
 */
function applyOrder<T>(
  entries: readonly { slug: string; entry: T }[],
  order: readonly (string | null)[],
): T[] {
  const rank = new Map<string, number>();
  order.forEach((slug, i) => {
    if (slug !== null && !rank.has(slug)) rank.set(slug, i);
  });
  return [...entries]
    .sort(
      (a, b) =>
        (rank.get(a.slug) ?? Number.MAX_SAFE_INTEGER) -
        (rank.get(b.slug) ?? Number.MAX_SAFE_INTEGER),
    )
    .map((e) => e.entry);
}

export async function getSiteContent(
  root: string = process.cwd(),
): Promise<SiteContent> {
  const reader = readerFor(root);
  const [
    site,
    person,
    experience,
    education,
    publications,
    testScores,
    ordering,
    achievementEntries,
    projectEntries,
  ] = await Promise.all([
    reader.singletons.site.read(),
    reader.singletons.person.read(),
    reader.singletons.experience.read(),
    reader.singletons.education.read(),
    reader.singletons.publications.read(),
    reader.singletons.testScores.read(),
    reader.singletons.ordering.read(),
    reader.collections.achievements.all(),
    reader.collections.projects.all(),
  ]);

  const s = required(site, "site");
  const p = required(person, "person");
  const order = required(ordering, "ordering");

  // Resolve every markdown body up front: the result crosses into client
  // components, so nothing may still be an un-awaited thunk.
  const achievements: { slug: string; entry: Achievements }[] =
    await Promise.all(
      achievementEntries.map(async ({ slug, entry }) => ({
        slug,
        entry: {
          title: entry.title,
          date: entry.date,
          content: await entry.content(),
          images: entry.images.map((i) => ({ src: i.image, alt: i.alt })),
        },
      })),
    );

  const projects: { slug: string; entry: Projects }[] = await Promise.all(
    projectEntries.map(async ({ slug, entry }) => ({
      slug,
      entry: {
        title: entry.title,
        description: await entry.description(),
        poster: entry.poster ?? undefined,
        technologies: entry.technologies.map((t) => ({
          name: t.name,
          url: t.url ?? "",
        })),
        links: entry.links.map((l) => ({ label: l.label, url: l.url ?? "" })),
      },
    })),
  );

  return {
    meta: { title: s.title, description: s.description },
    sections: s.sections
      .filter((sec) => sec.enabled)
      .map((sec) => ({
        id: `${sec.id}_section`,
        key: sec.id,
        label: sec.navLabel,
        heading: sec.heading,
        href: `/#${sec.id}_section`,
      })),
    labels: { ...s.labels },
    formspreeId: s.formspreeId,
    showcase: {
      achievementCount: s.showcase.achievementCount ?? 2,
      projectCount: s.showcase.projectCount ?? 3,
    },
    hero: {
      title: p.heroTitle,
      description: p.heroDescription,
      avatar: {
        src: p.avatar ?? "",
        alt: `${p.firstname} ${p.lastname}`.trim(),
        width: p.avatarWidth ?? undefined,
        height: p.avatarHeight ?? undefined,
      },
      cvLink: p.cv ?? "",
    },
    social: p.social.map((x) => ({
      name: x.name,
      icon: x.icon,
      link: x.link ?? "",
    })),
    contact: {
      email: p.email,
      phone: p.phone,
      timezone: p.timezone,
      social: p.social.map((x) => ({
        name: x.name,
        icon: x.icon,
        link: x.link ?? "",
      })),
      whatsapp: { ...p.whatsapp },
    },
    workExperience: required(experience, "experience").items.map((w) => ({
      ...w,
      companyLink: w.companyLink ?? "",
      bullets: [...w.bullets],
    })),
    education: required(education, "education").items.map((e) => ({
      ...e,
      institutionLink: e.institutionLink ?? "",
      achievements: [...e.achievements],
    })),
    publications: required(publications, "publications").items.map((x) => ({
      ...x,
      authors: [...x.authors],
    })),
    testScores: required(testScores, "testScores").items.map((t) => ({
      name: t.name,
      logo: t.logo ?? "",
      scores: t.scores.map((sc) => ({ label: sc.label, value: sc.value })),
    })),
    achievements: applyOrder(achievements, order.achievements),
    projects: applyOrder(projects, order.projects),
  };
}

/** Just the SEO fields, for generateMetadata. */
export async function getSiteMeta() {
  const reader = readerFor(process.cwd());
  const s = required(await reader.singletons.site.read(), "site");
  return { title: s.title, description: s.description };
}
