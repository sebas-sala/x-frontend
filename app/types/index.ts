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

export interface PaginatedResult<T> {
  data: T[];
  meta: Meta;
}
