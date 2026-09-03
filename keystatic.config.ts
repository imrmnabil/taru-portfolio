import { collection, config, fields, singleton } from "@keystatic/core";

// Keys of `iconLibrary` in src/resources/icons.ts. Kept as a literal list so the
// Admin UI can offer them as a dropdown; Icon.tsx warns and renders nothing for
// anything outside it.
const socialIcons = [
  "linkedin",
  "github",
  "facebook",
  "scholar",
  "researchgate",
  "x",
  "twitter",
  "threads",
  "discord",
  "pinterest",
  "whatsapp",
  "reddit",
  "telegram",
  "email",
  "globe",
  "openLink",
  "document",
] as const;

// Anchor ids the page markup and SlideTabs nav are keyed on. `intro` is the hero
// and has no heading of its own.
const sectionIds = [
  "intro",
  "work",
  "education",
  "publications",
  "projects",
  "achievements",
  "contact",
] as const;

const url = (label: string) =>
  fields.url({ label, description: "Include https://" });

export default config({
  storage: { kind: "local" },
  ui: {
    brand: { name: "Portfolio" },
    navigation: {
      Site: ["site", "person"],
      Sections: ["experience", "education", "publications", "testScores"],
      Showcase: ["achievements", "projects", "ordering"],
    },
  },
  singletons: {
    site: singleton({
      label: "Site settings",
      path: "content/site",
      format: { data: "yaml" },
      previewUrl: "/",
      schema: {
        title: fields.text({ label: "Browser tab title" }),
        description: fields.text({
          label: "SEO description",
          multiline: true,
        }),
        sections: fields.array(
          fields.object({
            id: fields.select({
              label: "Section",
              options: sectionIds.map((v) => ({ label: v, value: v })),
              defaultValue: "work",
            }),
            navLabel: fields.text({ label: "Nav label" }),
            heading: fields.text({
              label: "Heading shown on the page",
              description: "Left blank for the intro, which has no heading.",
            }),
            enabled: fields.checkbox({ label: "Show", defaultValue: true }),
          }),
          {
            label: "Sections",
            description: "Drag to reorder the nav and the page.",
            itemLabel: (props) => props.fields.navLabel.value || "Section",
          },
        ),
        showcase: fields.object(
          {
            achievementCount: fields.integer({
              label: "Achievements in the showcase carousel",
              defaultValue: 2,
              validation: { min: 0 },
            }),
            projectCount: fields.integer({
              label: "Projects in the showcase carousel",
              defaultValue: 3,
              validation: { min: 0 },
            }),
          },
          { label: "Homepage showcase" },
        ),
        labels: fields.object(
          {
            downloadCv: fields.text({ label: "CV button" }),
            showcaseAchievements: fields.text({
              label: "Showcase achievements button",
            }),
            showcaseProjects: fields.text({
              label: "Showcase projects button",
            }),
            reachOut: fields.text({ label: "Contact form heading" }),
            testScores: fields.text({ label: "Test scores heading" }),
          },
          { label: "Button & sub-heading labels" },
        ),
        formspreeId: fields.text({
          label: "Formspree form ID",
          description: "The ID from your Formspree endpoint URL.",
        }),
      },
    }),

    person: singleton({
      label: "Profile & contact",
      path: "content/person",
      format: { data: "yaml" },
      previewUrl: "/#intro_section",
      schema: {
        firstname: fields.text({ label: "First name" }),
        lastname: fields.text({ label: "Last name" }),
        role: fields.text({ label: "Role" }),
        location: fields.text({ label: "Location" }),
        heroTitle: fields.text({ label: "Hero heading" }),
        heroDescription: fields.text({
          label: "Hero paragraph",
          multiline: true,
        }),
        avatar: fields.image({
          label: "Avatar",
          directory: "public/images",
          publicPath: "/images",
        }),
        avatarWidth: fields.integer({
          label: "Avatar width",
          defaultValue: 200,
        }),
        avatarHeight: fields.integer({
          label: "Avatar height",
          defaultValue: 200,
        }),
        cv: fields.file({
          label: "CV",
          directory: "public/pdfs",
          publicPath: "/pdfs",
        }),
        email: fields.text({ label: "Email" }),
        phone: fields.text({ label: "Phone" }),
        timezone: fields.text({
          label: "Timezone",
          description: "IANA name, e.g. Asia/Dhaka. Drives the live clock.",
        }),
        whatsapp: fields.object(
          {
            link: fields.text({ label: "WhatsApp link" }),
            number: fields.text({ label: "WhatsApp number" }),
          },
          { label: "WhatsApp" },
        ),
        social: fields.array(
          fields.object({
            name: fields.text({ label: "Name" }),
            icon: fields.select({
              label: "Icon",
              options: socialIcons.map((v) => ({ label: v, value: v })),
              defaultValue: "linkedin",
            }),
            link: url("Link"),
          }),
          {
            label: "Social links",
            description: "Drag to reorder.",
            itemLabel: (props) => props.fields.name.value || "Link",
          },
        ),
      },
    }),

    experience: singleton({
      label: "Experience",
      path: "content/experience",
      format: { data: "yaml" },
      previewUrl: "/#work_section",
      schema: {
        items: fields.array(
          fields.object({
            position: fields.text({ label: "Position" }),
            company: fields.text({ label: "Company" }),
            companyLink: url("Company link"),
            startDate: fields.text({ label: "Start date" }),
            endDate: fields.text({
              label: "End date",
              description: 'Free text. "Present" for a current role.',
            }),
            location: fields.text({ label: "Location" }),
            type: fields.select({
              label: "Type",
              options: [
                { label: "Full-time", value: "Full-time" },
                { label: "Part-time", value: "Part-time" },
                { label: "Contract", value: "Contract" },
                { label: "Internship", value: "Internship" },
                { label: "Freelance", value: "Freelance" },
              ],
              defaultValue: "Full-time",
            }),
            description: fields.text({
              label: "Description",
              multiline: true,
            }),
            bullets: fields.array(fields.text({ label: "Bullet" }), {
              label: "Bullets",
              itemLabel: (props) => props.value || "Bullet",
            }),
          }),
          {
            label: "Roles",
            description: "Drag to reorder.",
            itemLabel: (props) =>
              [props.fields.position.value, props.fields.company.value]
                .filter(Boolean)
                .join(" — ") || "Role",
          },
        ),
      },
    }),

    education: singleton({
      label: "Education",
      path: "content/education",
      format: { data: "yaml" },
      previewUrl: "/#education_section",
      schema: {
        items: fields.array(
          fields.object({
            degree: fields.text({ label: "Degree" }),
            institution: fields.text({ label: "Institution" }),
            institutionLink: url("Institution link"),
            startDate: fields.text({ label: "Start year" }),
            endDate: fields.text({ label: "End year" }),
            location: fields.text({ label: "Location" }),
            grade: fields.text({ label: "Grade" }),
            achievements: fields.array(fields.text({ label: "Achievement" }), {
              label: "Achievements",
              itemLabel: (props) => props.value || "Achievement",
            }),
          }),
          {
            label: "Qualifications",
            description: "Drag to reorder.",
            itemLabel: (props) =>
              props.fields.institution.value || "Qualification",
          },
        ),
      },
    }),

    publications: singleton({
      label: "Publications",
      path: "content/publications",
      format: { data: "yaml" },
      previewUrl: "/#publications_section",
      schema: {
        items: fields.array(
          fields.object({
            title: fields.text({ label: "Title", multiline: true }),
            nb: fields.text({
              label: "Note",
              description: 'e.g. "Thesis Submitted"',
            }),
            authors: fields.array(fields.text({ label: "Author" }), {
              label: "Authors",
              itemLabel: (props) => props.value || "Author",
            }),
            journalOrConference: fields.text({
              label: "Journal or conference",
              multiline: true,
            }),
            date: fields.text({ label: "Date" }),
            link: fields.text({ label: "Link" }),
            summary: fields.text({ label: "Abstract", multiline: true }),
          }),
          {
            label: "Papers",
            description: "Drag to reorder.",
            itemLabel: (props) => props.fields.title.value || "Paper",
          },
        ),
      },
    }),

    testScores: singleton({
      label: "Test scores",
      path: "content/test-scores",
      format: { data: "yaml" },
      previewUrl: "/#achievements_section",
      schema: {
        items: fields.array(
          fields.object({
            name: fields.text({ label: "Test name" }),
            logo: fields.image({
              label: "Logo",
              directory: "public/images",
              publicPath: "/images",
            }),
            scores: fields.array(
              fields.object({
                label: fields.text({ label: "Label" }),
                value: fields.text({ label: "Value" }),
              }),
              {
                label: "Scores",
                itemLabel: (props) =>
                  [props.fields.label.value, props.fields.value.value]
                    .filter(Boolean)
                    .join(": ") || "Score",
              },
            ),
          }),
          {
            label: "Tests",
            description: "Drag to reorder.",
            itemLabel: (props) => props.fields.name.value || "Test",
          },
        ),
      },
    }),

    ordering: singleton({
      label: "Display order",
      path: "content/ordering",
      format: { data: "yaml" },
      previewUrl: "/",
      schema: {
        achievements: fields.array(
          fields.relationship({
            label: "Achievement",
            collection: "achievements",
          }),
          {
            label: "Achievement order",
            description:
              "Drag to reorder. The first few also fill the homepage carousel. Anything left out still shows, at the end.",
            itemLabel: (props) => props.value || "Achievement",
          },
        ),
        projects: fields.array(
          fields.relationship({ label: "Project", collection: "projects" }),
          {
            label: "Project order",
            description:
              "Drag to reorder. The first few also fill the homepage carousel.",
            itemLabel: (props) => props.value || "Project",
          },
        ),
      },
    }),
  },

  collections: {
    achievements: collection({
      label: "Achievements",
      path: "content/achievements/*",
      slugField: "title",
      format: { contentField: "content" },
      entryLayout: "content",
      previewUrl: "/#achievements_section",
      columns: ["title", "date"],
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        date: fields.text({ label: "Date" }),
        images: fields.array(
          fields.object({
            image: fields.image({
              label: "Image",
              directory: "public/images/achievements",
              publicPath: "/images/achievements",
              validation: { isRequired: true },
            }),
            alt: fields.text({ label: "Alt text" }),
          }),
          {
            label: "Images",
            description:
              "Drag to reorder. The first one is used on the homepage card.",
            itemLabel: (props) => props.fields.alt.value || "Image",
          },
        ),
        content: fields.mdx({ label: "Description", extension: "md" }),
      },
    }),

    projects: collection({
      label: "Projects",
      path: "content/projects/*",
      slugField: "title",
      format: { contentField: "description" },
      entryLayout: "content",
      previewUrl: "/#projects_section",
      columns: ["title"],
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        poster: fields.image({
          label: "Poster",
          directory: "public/images/projects",
          publicPath: "/images/projects",
        }),
        technologies: fields.array(
          fields.object({
            name: fields.text({ label: "Name" }),
            url: url("Link"),
          }),
          {
            label: "Technologies",
            description: "Drag to reorder.",
            itemLabel: (props) => props.fields.name.value || "Technology",
          },
        ),
        links: fields.array(
          fields.object({
            label: fields.text({ label: "Label" }),
            url: url("URL"),
          }),
          {
            label: "Links",
            itemLabel: (props) => props.fields.label.value || "Link",
          },
        ),
        description: fields.mdx({ label: "Description", extension: "md" }),
      },
    }),
  },
});
