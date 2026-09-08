// api core types and contracts

export type ApiError = {
  status: number;
  code?: string;
  message: string;
  fieldErrors?: Record<string, string[]>;
  details?: unknown;
};

export type QueryParamValue = string | number | boolean | null | undefined;

export type QueryParams =
  | Record<string, QueryParamValue | QueryParamValue[]>
  | URLSearchParams;

export type RequestOptions = Omit<RequestInit, "body"> & {
  baseUrl?: string;
  params?: QueryParams;
  json?: unknown;
  body?: BodyInit | null;
  skipAuthRefresh?: boolean;
};

export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
};

export type PaginatedData<T> = {
  items: T[];
  pagination: PaginationMeta;
};

export type ApiSuccessResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export type ApiResponse<T> = ApiSuccessResponse<T>;

export type ApiPaginatedResponse<T> = ApiSuccessResponse<PaginatedData<T>>;
