export type ContentStatus = "draft" | "published";

export interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  readTime: string;
  status: ContentStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  date: string;
}

export interface PostInput {
  id?: number;
  slug?: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  readTime: string;
  status: ContentStatus;
  publishedAt?: string | null;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteInput {
  id?: string;
  title: string;
  content: string;
}

export interface Media {
  id: number;
  originalName: string;
  savedName: string;
  relativePath: string;
  url: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

export type MediaInput = Omit<Media, "id" | "uploadedAt"> & {
  uploadedAt?: string;
};
