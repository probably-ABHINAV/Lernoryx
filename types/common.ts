/**
 * Common types used across the application.
 */

/** Standard API response wrapper. */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/** Paginated response. */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

/** Sort direction. */
export type SortDirection = "asc" | "desc";

/** Query parameters for listing endpoints. */
export interface ListParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: SortDirection;
  search?: string;
}

/** Date range filter. */
export interface DateRange {
  from: string; // ISO date
  to: string;   // ISO date
}
