interface PaginationCamelCase {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage?: number;
  nextPage?: number;
}

export type Pagination = PaginationCamelCase;

export type Meta = { pagination: Pagination };

export type Filter = Record<string, string | number | boolean>;

export interface ApiResponseList<T> {
  data: T[];
  meta: Meta;
  success: boolean;
  status: number;
  timestamp: string;
}

export interface ApiResponse<T> {
  data: T;
  meta?: Meta;
  success: boolean;
  status: number;
  timestamp: string;
}

export interface ApiResponseError {
  path: string;
  status: number;
  success: boolean;
  error: string;
  message: string;
  timestamp: string;
}

export type ApiResponseUnion<T> = ApiResponse<T> | ApiResponseError;
export type ApiResponseListUnion<T> = ApiResponseList<T> | ApiResponseError;
