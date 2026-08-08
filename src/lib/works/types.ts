export interface Work {
  id: string;
  title: string;
  summary: string;
  cover: string;
  tags: string[];
  category?: string;
  github?: string;
  demo?: string;
  doc?: string;
  content: string;
  gallery?: string[];
  featured: boolean;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}

export interface WorkInput {
  id?: string;
  title: string;
  summary: string;
  cover: string;
  tags: string[];
  category?: string;
  github?: string;
  demo?: string;
  doc?: string;
  content: string;
  gallery?: string[];
  featured: boolean;
  status: "draft" | "published";
}
