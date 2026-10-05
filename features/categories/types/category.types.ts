// Category domain types and contracts matching backend /api/v1/categories

export type Category = {
  _id: string;
  name: string;
  nameBn?: string;
  slug: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  bookCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type CategoryPaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type CategoriesResponse = {
  success: boolean;
  message: string;
  data: Category[];
  meta?: CategoryPaginationMeta;
};

export type SingleCategoryResponse = {
  success: boolean;
  message: string;
  data: Category;
};

export type GetCategoriesParams = {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  hasBooks?: boolean;
  sort?: string;
  sortBy?: "name" | "createdAt";
  sortOrder?: "asc" | "desc";
};

export type UpdateCategoryInput = {
  name?: string;
  nameBn?: string;
  slug?: string;
  description?: string;
  image?: string | File | null;
  isActive?: boolean;
};

