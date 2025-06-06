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
  password?: string;
}

export interface MasterPrompt {
  id: string;
  name: string;
  content: string;
  type: string;
  version: string;
  updatedAt: Date;
  history: PromptHistoryItem[];
}

export interface PromptHistoryItem {
  version: string;
  content: string;
  updatedAt: Date;
}

export type ContentCategory = "Market Trends" | "Finance" | "Real Estate" | "Technology" | "Other";

export interface ContentArticle {
  id: string;
  title: string;
  brief: string;
  content: string;
  category: string;
  date: Date;
  createdBy: string;
  updatedAt: Date;
  status: 'draft' | 'published';
}
