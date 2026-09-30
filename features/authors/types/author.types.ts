// Author domain types and contracts matching backend /api/v1/authors

export type Author = {
  _id: string;
  name: string;
  nameBn?: string;
  slug: string;
  bio?: string;
  photo?: string;
  birthDate?: string;
  deathDate?: string;
  isActive?: boolean;
  isDel?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateAuthorInput = {
  name: string;
  nameBn?: string;
  bio?: string;
  photo?: string;
  birthDate?: string;
  deathDate?: string;
  isActive?: boolean;
};

export type AuthorPaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
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

export type CreateAuthorResponse = {
  success: boolean;
  message: string;
  data: Author;
};

// Partial author update payload matching PATCH /api/v1/authors/:id
export type UpdateAuthorInput = {
  name?: string;
  nameBn?: string;
  bio?: string;
  photo?: string;
  birthDate?: string;
  deathDate?: string;
  isActive?: boolean;
};

// Author update response matching backend standard API envelope
export type UpdateAuthorResponse = {
  success: boolean;
  message: string;
  data: Author;
};

// Author soft delete response matching DELETE /api/v1/authors/:id
export type DeleteAuthorResponse = {
  success: boolean;
  message: string;
  data?: Author;
};

export type GetAuthorsParams = {
  page?: number;
  limit?: number;
  search?: string;
  letter?: string;
  isActive?: boolean;
  sortBy?: "name" | "birthDate" | "createdAt" | string;
  sortOrder?: "asc" | "desc" | "asce" | string;
  order?: string;
  sort?: string;
  asce?: boolean | string;
  shuffle?: boolean | string;
  homepage?: boolean | string;
};
