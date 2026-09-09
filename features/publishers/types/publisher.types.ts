// Publisher domain types and contracts matching backend /api/v1/publishers

export type Publisher = {
  _id: string;
  name: string;
  nameBn?: string;
  slug: string;
  legacyId?: string;
  originCountry?: string;
  image?: string;
  logo?: string;
  isImage?: string | number;
  roleId?: string;
  userId?: string;
  status?: string;
  email?: string;
  phone?: string;
  address?: string;
  description?: string;
  established?: string;
  publications?: string | number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type PublisherPaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PublishersResponse = {
  success: boolean;
  message: string;
  data: Publisher[];
  meta?: PublisherPaginationMeta;
};

export type SinglePublisherResponse = {
  success: boolean;
  message: string;
  data: Publisher;
};

export type GetPublishersParams = {
  page?: number;
  limit?: number;
  search?: string;
  letter?: string;
  isActive?: boolean;
  sort?: string;
};
