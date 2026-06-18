export interface Profile {
  name: string;
  eyebrow: string;
  headline: string;
  tagline: string;
  bio: string;
  location: string;
  avatarUrl: string;
  resumeUrl: string;
}

export interface Socials {
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  detail: string;
}

export interface SiteContent {
  profile: Profile;
  socials: Socials;
  skills: SkillGroup[];
  experience: Experience[];
  education: Education[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
  imageUrl?: string;
  featured?: boolean;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  imageUrl?: string;
}
