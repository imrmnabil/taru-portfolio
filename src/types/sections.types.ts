/** One entry of the sticky nav, derived from `sections` in content/site.yaml. */
export type Section = {
  /** DOM anchor id, always `${key}_section`. */
  id: string;
  /** Stable key from the CMS select field: intro, work, education, … */
  key: string;
  /** Text shown in the nav. */
  label: string;
  /** Text shown as the section's on-page heading. Empty for the intro. */
  heading: string;
  href: string;
};
