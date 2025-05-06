
export type Role = "admin" | "team";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  nmls?: string;
  brandVoice: string;
  role: Role;
  createdAt: Date;
}

export interface MasterPrompt {
  id: string;
  name: string;
  content: string;
  version: string;
  updatedAt: Date;
  history: {
    version: string;
    content: string;
    updatedAt: Date;
  }[];
}

export type ContentCategory = "Market Trends" | "Finance" | "Real Estate" | "Technology" | "Other";

export interface ContentArticle {
  id: string;
  date: Date;
  title: string;
  brief: string;
  content: string;
  category: ContentCategory;
  createdBy: string;
  updatedAt: Date;
  published: boolean;
}
