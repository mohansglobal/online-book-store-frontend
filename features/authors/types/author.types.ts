// Author domain types and contracts matching backend /api/v1/authors

export type Author = {
  _id: string;
  name: string;
  nameBn?: string;
  slug: string;
  bio?: string;
  photo?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthorPaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type AuthorsResponse = {
  success: boolean;
  message: string;
  data: Author[];
  meta?: AuthorPaginationMeta;
};

export type SingleAuthorResponse = {
  success: boolean;
  message: string;
  data: Author;
};

export type GetAuthorsParams = {
  page?: number;
  limit?: number;
  search?: string;
  letter?: string;
  isActive?: boolean;
  sort?: string;
};
