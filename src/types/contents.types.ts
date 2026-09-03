export type Avatar = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

export type Technology = {
  name: string;
  url: string;
};

export type Link = {
  label: string;
  url: string;
};

export type Social = Array<{
  name: string;
  icon: string;
  link: string;
}>;

export type Work = {
  position: string;
  company: string;
  companyLink?: string;
  startDate: string;
  endDate?: string;
  description?: string;
  bullets?: string[];
  location?: string;
  type?: "Full-time" | "Part-time" | "Contract" | "Internship" | "Freelance";
};

export type Education = {
  degree: string;
  institution: string;
  institutionLink: string;
  startDate: string;
  endDate: string;
  location: string;
  grade: string;
  achievements: string[];
};

export type Publication = {
  title: string;
  nb?: string;
  authors: string[];
  journalOrConference: string;
  date: string;
  link?: string;
  summary?: string;
};

export type Achievements = {
  title: string;
  date: string;
  /** Markdown, rendered with react-markdown. */
  content?: string;
  images?: Avatar[];
};

export type Projects = {
  title: string;
  /** Markdown, rendered with react-markdown. */
  description: string;
  links?: Link[];
  poster?: string;
  technologies: Technology[];
};

export type TestScore = {
  name: string;
  logo: string;
  scores: Array<{ label: string; value: string }>;
};

export type Hero = {
  title: string;
  description: string;
  avatar: Avatar;
  cvLink: string;
};

export type Contact = {
  email: string;
  phone: string;
  timezone: string;
  social: Social;
  whatsapp?: { link: string; number: string };
};

export type SiteLabels = {
  downloadCv: string;
  showcaseAchievements: string;
  showcaseProjects: string;
  reachOut: string;
  testScores: string;
};
