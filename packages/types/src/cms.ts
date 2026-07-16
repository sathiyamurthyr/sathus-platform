// Sathus Platform CMS Domain Types

export type UserRole = 'SuperAdmin' | 'Editor' | 'Writer';
export type UserStatus = 'Active' | 'Suspended' | 'Pending';

export interface User {
  id: string; // BIGINT serialized as string in JSON
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  sessionToken: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}

export type PostStatus = 'Draft' | 'Published' | 'Archived';
export type PostCategory = 'Blog' | 'Doc' | 'Learning' | 'LabNote';

export interface Post {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  status: PostStatus;
  category: PostCategory;
  authorId: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductStatus = 'Ideation' | 'Beta' | 'Active' | 'Deprecated';
export type ProductCategory = 'CoreProduct' | 'LabExperiment' | 'SathusX';

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  description: string;
  version?: string;
  status: ProductStatus;
  category: ProductCategory;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  targetTable: string;
  targetId?: string;
  changes: Record<string, unknown>;
  createdAt: Date;
}
